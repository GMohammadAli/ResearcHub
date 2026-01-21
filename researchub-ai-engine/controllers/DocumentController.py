# orchestrate requests & call models/services
from flask import request, jsonify
from services.DocumentService import (
    extractText,
    getDocumentMeta,
    extractDataWithChunks,
    mapChunksFromText,
    getDocumentName,
)
from services.GeminiService import (
    getSummary,
    getAnswers,
    getSummaryWithCitations,
    getAnswersWithCitations,
)
from dotenv import load_dotenv

# Gemini File Store services
from services.GeminiFileStoreService import (
    initializeSearchStoreAndGetSummary,
    getAnswersUsingStore,
)

load_dotenv()

import os

USE_GEMINI_FILE_SEARCH = os.getenv("USE_GEMINI_FILE_SEARCH", False)


def getServerHealth():
    return jsonify({"serverIsLive": True}), 200


def generateDocumentSummary(docId):
    try:
        # print("Tried extracting text")
        documentName = getDocumentName(docId)
        extractedText = extractText(docId)
        documentChunks = extractDataWithChunks(docId)
        if not extractedText or not documentChunks:
            return (
                jsonify({"error": "Document not found", "success": false}),
                404,
            )
        # print("Size of extractedText is", len(extractedText))

        if USE_GEMINI_FILE_SEARCH:
            finalSummary = initializeSearchStoreAndGetSummary(extractedText, docId)
        else:
            finalSummary = getSummaryWithCitations(documentChunks)
            chunkRefs = mapChunksFromText(finalSummary, documentChunks)

        # print(finalSummary)
        return (
            jsonify(
                {
                    "summary": finalSummary,
                    "citations": chunkRefs or [],
                    "documentName": documentName,
                    "message": "Summarized using GEMINI",
                    "success": True,
                }
            ),
            200,
        )
    except Exception as e:
        print(f"Error while fetching text summary :{e}")
        return (
            jsonify(
                {
                    "summary": None,
                    "message": "Internal Server Error",
                    "success": False,
                }
            ),
            500,
        )


def generateAnswers(docId):
    # Get question from query string OR request body
    question = request.args.get("question") or request.json.get("question")
    try:
        if not question:
            return jsonify({"error": "No question provided", "success": false}), 400

        # print("Tried extracting text")
        extractedText = extractText(docId)
        documentChunks = extractDataWithChunks(docId)
        if not extractedText:
            return jsonify({"error": "Document not found", "success": false}), 404

        # print("Size of extractedText is", len(extractedText))

        extractedText = " ".join(extractedText)

        if USE_GEMINI_FILE_SEARCH:
            answer = getAnswersUsingStore(question, extractedText, docId)
        else:
            answer = getAnswersWithCitations(question, documentChunks)
            chunkRefs = mapChunksFromText(answer, documentChunks)

        return (
            jsonify(
                {
                    "docId": docId,
                    "question": question,
                    "answer": answer,
                    "citations": chunkRefs or [],
                    "success": True,
                },
            ),
            200,
        )
    except Exception as e:
        print(f"Error while answering to questions for document with id {docId}: {e}")
        return (
            jsonify(
                {
                    "docId": docId,
                    "question": question,
                    "success": False,
                    "error": "Internal Server Error",
                },
            ),
            500,
        )


def generateTextSummary():
    try:
        userInput = request.args.get("userInput")
        if not userInput:
            return (
                jsonify({"error": "Missing userInput parameter", success: False}),
                400,
            )

        summary = getSummary(userInput)
        return (
            jsonify(
                {
                    "summary": summary,
                    "message": "Summarized using GEMINI",
                    "success": True,
                }
            ),
            200,
        )
    except Exception as e:
        print(f"Error while fetching text summary :{e}")
        return (
            jsonify(
                {
                    "summary": None,
                    "message": "Internal Server Error",
                    "success": False,
                }
            ),
            500,
        )
