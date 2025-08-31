from flask import Flask, request, jsonify
from transformers import pipeline, BartTokenizer
from MongoClient import getDatabase
from bson import ObjectId
from tests.Summary import getDummySummary

app = Flask(__name__)

# Load summarization pipeline
# Use "facebook/bart-large-cnn" model for BART summarization
bart_summarizer = pipeline("summarization", model="facebook/bart-large-cnn")


@app.route("/summarize/<docId>", methods=["GET"])
def summarize(docId):
    if True:
        finalSummary = getDummySummary()
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

    extractedText = extractText(docId)
    # extractedText = extractedText.strip()
    if not extractedText:
        return jsonify({"error": "Document not found", "success": false}), 404

    finalSummary = summarizeDocument(extractedText)
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


def extractText(docId):
    dbConnection = getDatabase()
    documentCollection = dbConnection["documents"]

    try:
        document = documentCollection.find_one({"_id": ObjectId(docId)})
        if document is None:
            print("Document not found")
            return None

        content = document.get("content")
        # if isinstance(content, list):
        #     fullText = "".join(content)
        #     # print("Full text", fullText)
        #     return fullText
        # else:
        #     # print("content", content)
        #     return content
        if content is None:
            return ""
        return content
    except Exception as e:
        print(f"Error while fetching document with Id: {docId}: {e}")
        return None


def summarizeDocument(extractedText):
    # Map-Reduce Summarization Method
    summaries = []
    print(extractedText)
    for chunk in extractedText:
        print(chunk)
        # Summarize each chunk
        summary = bart_summarizer(
            chunk, max_length=150, min_length=30, do_sample=False
        )[0]["summary_text"]
        summaries.append(summary)
    print(summaries)

    try:
        final_summary = bart_summarizer(
            " ".join(summaries), max_length=200, min_length=50, do_sample=False
        )[0]["summary_text"]
    except Exception as e:
        print("Summarization error:", str(e))
        return jsonify({"error": str(e)})
    # Summarize the combined summaries
    print("BART Summary:", finalSummary)
    return finalSummary


def chunkText(text, chunk_size=500):
    words = text.split()
    chunks = []

    for i in range(0, len(words), chunk_size):
        chunk = " ".join(words[i : i + chunk_size])
        chunks.append(chunk.strip())

    return [c for c in chunks if c]


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


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)
