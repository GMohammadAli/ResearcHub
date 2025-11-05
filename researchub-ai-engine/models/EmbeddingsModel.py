# chroma db collection embeddings are extracted here
from config.ChromaClient import getChromaClient

chromaDBConnection = getChromaClient()


def getOrCreateEmbeddingsCollection():
    embeddingsCollection = chromaDbConnection.get_or_create_collection(
        name="embedded-docs"
    )

    return embeddingsCollection
