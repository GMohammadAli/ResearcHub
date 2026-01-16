# document data and instance-specific logic
from config.MongoClient import getDatabase
from typing import Dict, Any
from bson import ObjectId

# Connect to DB
dbConnection = getDatabase()
# Collection reference
documentCollection = dbConnection["documents"]


class Document:
    def __init__(self, docId):
        self.docId = docId
        self.data = self.fetchDocument()

    def fetchDocument(self):
        document = documentCollection.find_one({"_id": ObjectId(self.docId)})
        if not document:
            raise ValueError(f"Document with ID {self.docId} not found")
        return document

    @property
    def name(self) -> str:
        return self.data.get("name", "")

    @property
    def content(self) -> list[str]:
        """Return extracted text chunks"""
        return self.data.get("content", [])

    @property
    def meta(self) -> Dict[str, Any]:
        """Returns metaData about the document"""
        return self.data.get("meta", {})

    @property
    def contentWithMetadata(self) -> list[object]:
        """Return stored chunked document data"""
        return self.data.get("contentWithMetadata", [])

    def update(self, updateObject: dict):
        """Update the document in MongoDB and refresh local data."""
        documentCollection.update_one(
            {"_id": ObjectId(self.docId)}, {"$set": updateObject}
        )
        # refresh local data after update
        self.data = self.fetchDocument()
