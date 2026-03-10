# session data and instance-specific logic
from config.MongoClient import getDatabase
from typing import Dict, Any, List, Optional
from bson import ObjectId
from enum import Enum
from datetime import datetime

# Connect to DB
dbConnection = getDatabase()
# Collection reference
sessionCollection = dbConnection["chat_sessions"]


class MessageRole(str, Enum):
    USER = "user"
    AGENT = "agent"


class IsActive(str, Enum):
    Y = "Y"
    N = "N"


class Session:
    def __init__(self, sessionId: str):
        self.sessionId = sessionId
        self.data = self.fetchSession()

    def fetchSession(self) -> dict:
        session = sessionCollection.find_one({"_id": ObjectId(self.sessionId)})
        if not session:
            raise ValueError(f"Session with ID {self.sessionId} not found")
        return session

    # ── Identity ─────────────────────────────────────────────────────────────

    @property
    def userId(self) -> ObjectId:
        return self.data.get("userId")

    @property
    def docId(self) -> ObjectId:
        return self.data.get("docId")

    @property
    def title(self) -> str:
        return self.data.get("title", "")

    # ── Message access ────────────────────────────────────────────────────────

    @property
    def messages(self) -> List[Dict[str, Any]]:
        """Return the full message history."""
        return self.data.get("messages", [])

    @property
    def messageCount(self) -> int:
        return self.data.get("messageCount", 0)

    def lastNMessages(self, n: int = 10) -> List[Dict[str, Any]]:
        """Return the last N messages — use this when feeding history to LLM."""
        return self.messages[-n:]


    # ── Factory ───
    @staticmethod
    def getByDocId(docId: str) -> List["Session"]:
        """Return all active sessions for a given document, newest first."""
        sessions = sessionCollection.find(
            {"docId": ObjectId(docId), "isActive": IsActive.Y},
            sort=[("createdAt", -1)],
        )
        return [Session(str(s["_id"])) for s in sessions]
