# routes/DocumentRoutes.py
from flask import Blueprint
from controllers.DocumentController import (
    generateDocumentSummary,
    generateAnswers,
    generateTextSummary,
)

documentBlueprint = Blueprint("DocumentBlueprint", __name__)

documentBlueprint.route("/<docId>", methods=["GET"])(generateDocumentSummary)
documentBlueprint.route("/<docId>/qna", methods=["POST"])(generateAnswers)
documentBlueprint.route("/text", methods=["GET"])(generateTextSummary)
