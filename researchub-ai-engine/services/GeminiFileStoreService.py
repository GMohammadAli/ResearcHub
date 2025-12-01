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
from services.DocumentService import getDocumentMeta, setDocumentMeta

load_dotenv()

import os

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
USE_API_FILE_SEARCH = os.getenv("USE_API_FILE_SEARCH", True)

# Configure api key
genai.configure(api_key=GEMINI_API_KEY)

summaryPrompt = "Summarize the following text in 3-4 sentences: \n\n "


#################### GOOGLE API FILE SEARCH STORE ######################

#  Uses Gemini's File search store features that takes care of
#  chunking, embedding, vector stores, semantic search under the hood

TEMP_DIR = Path("temp_docs")
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

    operation = client.file_search_stores.upload_to_file_search_store(
        file=local_file_path,
        file_search_store_name=store.name,
        config={"display_name": Path(local_file_path).name, "mime_type": "text/plain"},
    )

    while not operation.done:
        time.sleep(2)
        operation = client.operations.get(operation)

    return store.name


def queryStore(store_name: str, question: str):
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=question,
        config=types.GenerateContentConfig(
            tools=[
                types.Tool.file_search(
                    file_search=types.FileSearch(file_search_store_name=[store_name])
                )
            ]
        ),
    )
    return response.text


def initializeSearchStoreAndGetSummary(input, documentId):
    print("📦 Using FILE SEARCH MODE")
    createdFilePath = createTempFileFromContext(input)

    storeName = createStoreAndUpload(
        "ResearcHub-Context-Store-{documentId}", createdFilePath
    )

    setDocumentMeta(
        documentId,
        {
            geminiFileStoreName: storeName,
            # store expires every 48 hours, gemini limit for non-indexed stores
            fileStoreExpiryDate: datetime.now() + timedelta(hours=48),
        },
    )

    return queryStore(storeName, summaryPrompt)


def getAnswersUsingStore(question, context, documentId):

    documentMeta = getDocumentMeta(documentId)
    storeName = documentMeta.geminiFileStoreName
    hasExpired = datetime.now() > documentMeta.fileStoreExpiryDate

    print(f"documentMeta extracted {documentMeta}")

    if storeName is None or hasExpired:
        print("📦 Store")
        createdFilePath = createTempFileFromContext(context)

        storeName = createStoreAndUpload(
            "ResearcHub-Context-Store-{documentId}", createdFilePath
        )

        setDocumentMeta(
            documentId,
            {
                geminiFileStoreName: storeName,
                # store expires every 48 hours, gemini limit for non-indexed stores
                fileStoreExpiryDate: datetime.now() + timedelta(hours=48),
            },
        )

    return queryStore(storeName, question)
