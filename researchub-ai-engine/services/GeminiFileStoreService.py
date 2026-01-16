# Environment & config
from dotenv import load_dotenv

# Google Gemini
from google import genai
from google.genai import types

# File handling
from pathlib import Path

# Utilities
import time
import uuid

# Dates / expiry logic
from datetime import datetime, timedelta

# DocumentService
from services.DocumentService import getDocumentMeta, setDocumentMeta, extractText

load_dotenv()

import os

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

summaryPrompt = "Summarize the following text in 3-4 sentences: \n\n "


#################### GOOGLE API FILE SEARCH STORE ######################

#  Uses Gemini's File search store features that takes care of
#  chunking, embedding, vector stores, semantic search under the hood

# Reference -> https://www.analyticsvidhya.com/blog/2025/11/gemini-api-file-search/

# Free tier api is very slow and indexing takes time and asynchronous making it impossible to wait
# for it and then generate the summary so, when generating summary, whole context is passed
# for qna, file search is properly used

TEMP_DIR = Path("upload")
TEMP_DIR.mkdir(exist_ok=True)

client = genai.Client(api_key=GEMINI_API_KEY)


def createTempFileFromContext(context: str) -> str:
    print("📝 Creating temp file from context...")
    file_name = f"context_{uuid.uuid4().hex}.txt"
    file_path = TEMP_DIR / file_name

    with open(file_path, "w", encoding="utf-8") as f:
        f.write(context)

    return str(file_path)


def createStoreAndUpload(store_name: str, local_file_path: str):
    print("📦 Creating Gemini Store...")
    store = client.file_search_stores.create(config={"display_name": store_name})

    # store can be either an object or a string
    store_name_value = store.name if hasattr(store, "name") else store

    # print(f"store {store}")

    operation = client.file_search_stores.upload_to_file_search_store(
        file=local_file_path,
        file_search_store_name=store_name_value,
        config={"display_name": Path(local_file_path).name, "mime_type": "text/plain"},
    )

    # print(f"operation {operation}")

    # Wait for store upload
    while not operation.done:
        time.sleep(5)
        operation = client.operations.get(operation)

    print(f"store_name_value {store_name_value}")

    # Please note, file is just uploaded, indexing, chunking all these steps are pending
    return store_name_value


def queryStore(store_name: str, question: str, context: str = None):
    print("📦 Querying Gemini Store...")
    print(f"question {question} store_name {store_name} ")
    if context:
        print("⚡ Using RAW CONTEXT instead of store (store may not be ready)")
        prompt = f"{question}\n\nContext:\n{context}"
        try:
            response = client.models.generate_content(
                model="gemini-2.5-flash", contents=prompt
            )
            return response.text
        except Exception as e:
            print(f"❌ Error with direct context query: {e}")
            return None

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=question,
        config=types.GenerateContentConfig(
            tools=[
                # this is a internally managed RAG tool call
                types.Tool(
                    file_search=types.FileSearch(file_search_store_names=[store_name])
                )
            ]
        ),
    )
    return response.text


def initializeSearchStoreAndGetSummary(input, documentId):
    print("📦 Using FILE SEARCH MODE")
    contextText = input if isinstance(input, str) else "\n".join(input)
    createdFilePath = createTempFileFromContext(contextText)

    storeName = createStoreAndUpload(
        f"ResearcHub-Context-Store-{documentId}", createdFilePath
    )

    # print(f"storeName {storeName}")

    setDocumentMeta(
        documentId,
        {
            "geminiFileStoreName": storeName,
            # store expires every 48 hours, gemini limit for non-indexed stores
            "fileStoreExpiryDate": datetime.now() + timedelta(hours=48),
        },
    )

    # for summary, full context is passed as indexing is asynchronous
    return queryStore(storeName, summaryPrompt, input)


def getAnswersUsingStore(question, context, documentId):

    documentMeta = getDocumentMeta(documentId)

    # print(f"documentMeta extracted {documentMeta}")

    storeName = documentMeta.get("geminiFileStoreName")
    hasExpired = datetime.now() > documentMeta.get("fileStoreExpiryDate")

    if storeName is None or hasExpired:
        print("📦 Re-uploading file into search store")
        contextText = context if isinstance(context, str) else "\n".join(context)
        createdFilePath = createTempFileFromContext(contextText)

        storeName = createStoreAndUpload(
            f"ResearcHub-Context-Store-{documentId}", createdFilePath
        )

        setDocumentMeta(
            documentId,
            {
                "geminiFileStoreName": storeName,
                # store expires every 48 hours, gemini limit for non-indexed stores
                "fileStoreExpiryDate": datetime.now() + timedelta(hours=48),
            },
        )
        return queryStore(storeName, question, contextText)
    else:
        return queryStore(storeName, question)
