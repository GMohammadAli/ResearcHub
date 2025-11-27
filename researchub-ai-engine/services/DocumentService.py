# reusable document processing functions
from models.DocumentModel import Document


def extractText(docId):
    try:
        document = Document(docId)
        # print(document)
        if document is None:
            print("Document not found")
            return None

        return document.content
    except Exception as e:
        print(f"Error while fetching document with Id: {docId}: {e}")
        return None
