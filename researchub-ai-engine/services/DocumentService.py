# reusable document processing functions
from models.DocumentModel import Document
import re


def extractText(docId):
    try:
        document = Document(docId)
        # print(document)
        if document is None:
            print("Document not found")
            return None

        return document.content
    except Exception as e:
        print(f"Error while fetching document content with Id: {docId}: {e}")
        return None


def getDocumentMeta(docId):
    try:
        document = Document(docId)
        # print(document)
        if document is None:
            print("Document not found")
            return None

        return document.meta
    except Exception as e:
        print(f"Error while fetching document meta with Id: {docId}: {e}")
        return None


def setDocumentMeta(docId, docMetaObject):
    try:
        document = Document(docId)

        if document is None:
            print("Document not found")
            return None

        # metadata must be stored inside "meta" field
        document.update({"meta": docMetaObject})

        return document.meta

    except Exception as e:
        print(f"Error while setting document meta with Id {docId}: {e}")
        return None


def extractDataWithChunks(docId):
    try:
        document = Document(docId)
        # print(document)
        if document is None:
            print("Document not found")
            return None

        return document.contentWithMetadata
    except Exception as e:
        print(f"Error while fetching document's chunks with Id: {docId}: {e}")
        return None


def mapChunksFromText(responseText: str, chunkStore: list):
    try:
        # 1️⃣ Convert list → dict for O(1) lookup
        lookup = {item["chunkIndex"]: item for item in chunkStore}
        pattern = re.compile(r"\[(CHUNK_\d+(?:\s*,\s*CHUNK_\d+)*)\]")
        matches = pattern.findall(responseText)

        chunk_ids = set()

        for match in matches:
            ids = [part.strip() for part in match.split(",")]
            for cid in ids:
                match_id = re.match(r"CHUNK_(\d+)", cid)
                if match_id:
                    chunk_ids.add(int(match_id.group(1)))

        # print(chunk_ids)

        chunks = []

        for cid in sorted(chunk_ids):
            if cid in lookup:
                chunks.append(
                    {
                        "chunkIndex": cid,
                        "pages": chunkStore[cid]["pages"],
                        "text": chunkStore[cid]["text"],
                    }
                )

        return chunks

    except Exception as e:
        print(f"Error while mapping document's chunks with proper refs: {e}")
        return None


def getDocumentName(docId):
    try:
        document = Document(docId)
        # print(document)
        if document is None:
            print("Document not found")
            return None

        return document.name
    except Exception as e:
        print(f"Error while fetching document name with Id: {docId}: {e}")
        return None
