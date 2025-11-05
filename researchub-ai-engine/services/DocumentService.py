# reusable document processing functions
from models.DocumentModel import Document
from .HuggingFaceService import getEmbeddingsForTokens
from models.EmbeddingsModel import getOrCreateEmbeddingsCollection


def extractText(docId):
    try:
        document = Document(docId)
        print(document)
        if document is None:
            print("Document not found")
            return None

        return document.content
    except Exception as e:
        print(f"Error while fetching document with Id: {docId}: {e}")
        return None


def storeEmbeddings(docId):
    # extract raw document text
    documentContent = extractText(docId)
    # create vector embeddings
    embeddings = getEmbeddingsForTokens(documentContent)
    # connect to chroma db collection
    embeddingCollection = getOrCreateEmbeddingsCollection()

    # Adding embeddings to collection
    embeddingCollection.add(
        ids=[f"doc{i}" for i in range(len(documentContent))],
        documents=documentContent,
        embeddings=embeddings.tolist(),  # Chroma expects Python lists
    )
