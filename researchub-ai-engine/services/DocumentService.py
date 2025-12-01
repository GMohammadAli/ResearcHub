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
