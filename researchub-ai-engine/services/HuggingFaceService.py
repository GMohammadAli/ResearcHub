from sentence_transformers import SentenceTransformer
from .DocumentService import storeEmbeddings

# pretrained embedding model
embeddingModel = SentenceTransformer("all-MiniLM-L6-v2")


def getEmbeddingsForTokens(tokens):
    # Normalization ensures comparisons are fair and reflect meaning, not magnitude
    return embeddingModel.encode(tokens, normalize_embeddings=True)


def generateDocumentSummary(docId):
    embeddings = storeEmbeddings(docId)
    print("Embeddings {embeddings}")
