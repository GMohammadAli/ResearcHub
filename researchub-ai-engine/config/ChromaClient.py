from dotenv import load_dotenv

# chroma db client library import
import chromadb

load_dotenv()
import os

CHROMA_DB_PATH = os.getenv("CHROMA_DB_PATH", "./chroma_db")


def getChromaClient():
    """
    Creates a persistent ChromaDB client connected to the specified path.
    """
    client = chromadb.PersistentClient(path=CHROMA_DB_PATH)
    return client


if __name__ == "__main__":
    chromaDBClient = getChromaClient()
