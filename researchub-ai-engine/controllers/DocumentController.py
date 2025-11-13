# orchestrate requests & call models/services
from flask import request, jsonify
from services.DocumentService import extractText
from services.GeminiService import getSummary, getAnswers


def getServerHealth():
    return jsonify({"serverIsLive": True}), 200


def generateDocumentSummary(docId):
    try:
        print("Tried extracting text")
        extractedText = extractText(docId)
        if not extractedText:
            return jsonify({"error": "Document not found", "success": false}), 404

        print("Size of extractedText is", len(extractedText))
        finalSummary = getSummary(extractedText)
        # print(finalSummary)
        return (
            jsonify(
                {
                    "summary": finalSummary,
                    "message": "Summarized using Bart",
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

        print("Tried extracting text")
        extractedText = extractText(docId)
        if not extractedText:
            return jsonify({"error": "Document not found", "success": false}), 404

        print("Size of extractedText is", len(extractedText))

        extractedText = " ".join(extractedText)

        answer = getAnswers(question, extractedText)

        return (
            jsonify(
                {
                    "docId": docId,
                    "question": question,
                    "answer": answer,
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
                    docId: docId,
                    question: question,
                    success: False,
                    error: "Internal Server Error",
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
