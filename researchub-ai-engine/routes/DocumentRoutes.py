# routes/DocumentRoutes.py
from flask import Blueprint
from controllers.DocumentController import (
    generateDocumentSummary,
    generateAnswers,
    generateTextSummary,
    getServerHealth,
    generateAudioOverview,
)

documentBlueprint = Blueprint("DocumentBlueprint", __name__)

documentBlueprint.route("/health", methods=["GET"])(getServerHealth)
documentBlueprint.route("/<docId>", methods=["GET"])(generateDocumentSummary)
documentBlueprint.route("/<docId>/qna", methods=["POST"])(generateAnswers)
documentBlueprint.route("/<docId>/generate-audio", methods=["POST"])(
    generateAudioOverview
)
documentBlueprint.route("/text", methods=["GET"])(generateTextSummary)
