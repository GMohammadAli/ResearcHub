from google import genai
from google.genai import types
from dotenv import load_dotenv
from pathlib import Path
import os
import time

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent
PDF_PATH = BASE_DIR / "sampleFiles" / "Advantages-Of-File-Search-Over-RAG.pdf"

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=GEMINI_API_KEY)


def upload_file(file_path: str):
    print("📤 Uploading file...")

    uploaded_file = client.files.upload(file=file_path)

    print(f"✅ File uploaded: {uploaded_file.name}")
    return uploaded_file


def create_store_and_upload(store_name: str, local_file_path: str):
    print("📦 Creating File Search Store...")

    store = client.file_search_stores.create(config={"display_name": store_name})

    print(f"✅ Store created: {store.name}")

    operation = client.file_search_stores.upload_to_file_search_store(
        file=local_file_path,  # ✅ LOCAL PATH, not uploaded_file.name
        file_search_store_name=store.name,
        config={
            "display_name": Path(local_file_path).name,
            "mime_type": "application/pdf",
        },
    )

    print("⏳ Waiting for indexing to complete...")
    while not operation.done:
        time.sleep(3)
        # print(f"operation {operation}")
        operation = client.operations.get(operation)

    print("✅ File indexed and ready")
    return store


def query_store(store_name: str, question: str):
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=question,
        config=types.GenerateContentConfig(
            tools=[
                types.Tool(
                    file_search=types.FileSearch(file_search_store_names=[store_name])
                )
            ]
        ),
    )
    return response.text


# ========= USAGE =========

uploaded = upload_file(str(PDF_PATH))
store = create_store_and_upload("ResearcHub-Store", str(PDF_PATH))

answer = query_store(store.name, "Give me a 2-3 line summary of the document.")

print("\n✅ AI Answer:\n", answer)
