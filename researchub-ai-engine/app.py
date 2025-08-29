from flask import Flask, request, jsonify
from transformers import pipeline

app = Flask(__name__)

# Load summarization pipeline
summarizer = pipeline("summarization")


@app.route("/summarize", methods=["POST"])
def summarize():
    data = request.get_json()
    text = data.get("text", "")
    if not text:
        return jsonify({"error": "No text provided!"}), 400

    summary = summarizer(text, max_length=500, min_length=30, do_sample=False)
    return jsonify(summary)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)
