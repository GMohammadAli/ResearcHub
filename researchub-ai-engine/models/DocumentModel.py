# document data and instance-specific logic
from config.MongoClient import getDatabase
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
