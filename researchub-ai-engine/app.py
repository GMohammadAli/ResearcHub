from flask import Flask, request, jsonify
from transformers import pipeline, BartTokenizer
from MongoClient import getDatabase
from bson import ObjectId
from tests.Summary import (
    getDummySummary,
    getSummary,
    summarizeDocument,
    getGeminiSummary,
)

app = Flask(__name__)


# Issue this api is failing for larger documents, check summarize document method
# check these 2 errors

# 1] Your max_length is set to 130, but your input_length is only 71.
# Since this is a summarization task, where outputs shorter than the input are typically wanted,
# you might consider decreasing max_length manually, e.g. summarizer('...', max_length=35)

# 2] Error while fetching text summary :index out of range in self (IMP. failing cause) -> added 1000 chunk size


@app.route("/summarize/<docId>", methods=["GET"])
def summarize(docId):
    try:
        print("Tried extracting text", flush=True)
        extractedText = extractText(docId)
        if not extractedText:
            return jsonify({"error": "Document not found", "success": false}), 404

        print("Size of extractedText is", len(extractedText), flush=True)
        finalSummary = getGeminiSummary(extractedText)
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


def extractText(docId):
    dbConnection = getDatabase()
    documentCollection = dbConnection["documents"]

    try:
        document = documentCollection.find_one({"_id": ObjectId(docId)})
        if document is None:
            print("Document not found", flush=True)
            return None

        content = document.get("content")
        # print(f"content found is {content}")
        if content is None:
            return ""
        return content
    except Exception as e:
        print(f"Error while fetching document with Id: {docId}: {e}")
        return None


# def summarizeDocument(extractedText):
#     # Map-Reduce Summarization Method
#     summaries = []
#     for chunk in extractedText:
#         # print(chunk)
#         # Summarize each chunk
#         summary = getSummary(chunk.strip())
#         print(f"Summray found {summary}")
#         summaries.append(summary)
#     # print(summaries)

#     try:
#         finalSummary = getSummary(" ".join(summaries))
#     except Exception as e:
#         print("Summarization error:", str(e))
#         return jsonify({"error": str(e)})
#     # Summarize the combined summaries
#     print("BART Summary:", finalSummary)
#     return finalSummary


@app.route("/summarize/<docId>/", methods=["POST"])
def getAnswer(docId):
    # Get question from query string OR request body
    question = request.args.get("question") or request.json.get("question")

    if not question:
        return jsonify({"error": "No question provided", "success": false}), 400

    # Dummy logic: just echo back docId + question
    return jsonify(
        {
            "docId": docId,
            "question": question,
            "answer": f"Dummy answer for document {docId} and question '{question}'.",
            "success": True,
        }
    )


@app.route("/summarize/text", methods=["GET"])
def summarizeText():
    try:
        userInput = request.args.get("userInput")
        if not userInput:
            return jsonify({"error": "Missing userInput parameter"}), 400

        summary = getSummary(userInput)
        return (
            jsonify(
                {
                    "summary": summary,
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


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)
