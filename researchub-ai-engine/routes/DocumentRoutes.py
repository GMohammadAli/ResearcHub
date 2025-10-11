# routes/DocumentRoutes.py
from flask import Blueprint
from controllers.DocumentController import (
    generateDocumentSummary as generateDocumentSummary_GEMINI,
    generateAnswers as generateAnswers_GEMINI,
    generateTextSummary as generateTextSummary_GEMINI,
    generateDocumentSummary_HF,
    generateAnswers_HF,
    generateTextSummary_HF,
)
from dotenv import load_dotenv

load_dotenv()
import os

ACTIVE_LLM_BACKEND = os.getenv("ACTIVE_LLM_BACKEND")

documentBlueprint = Blueprint("DocumentBlueprint", __name__)


# Route handlers
def routeGenerateSummaryCall(docId):
    match ACTIVE_LLM_BACKEND:
        case "hugging-face":
            return generateDocumentSummary_HF(docId)
        case "gemini":
            return generateDocumentSummary_GEMINI(docId)
        case _:
            return generateDocumentSummary_GEMINI(docId)


def routeGenerateAnswersCall(docId):
    match ACTIVE_LLM_BACKEND:
        case "hugging-face":
            return generateAnswers_HF(docId)
        case "gemini":
            return generateAnswers_GEMINI(docId)
        case _:
            return generateAnswers_GEMINI(docId)


def routeGenerateTextSummaryCall():
    match ACTIVE_LLM_BACKEND:
        case "hugging-face":
            return generateTextSummary_HF()
        case "gemini":
            return generateTextSummary_GEMINI()
        case _:
            return generateTextSummary_GEMINI()


# Register routes
documentBlueprint.route("/<docId>", methods=["GET"])(routeGenerateSummaryCall)
documentBlueprint.route("/<docId>/qna", methods=["POST"])(routeGenerateAnswersCall)
documentBlueprint.route("/text", methods=["GET"])(routeGenerateTextSummaryCall)
