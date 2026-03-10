import google.generativeai as genai
from dotenv import load_dotenv

# in-built python module, starting from python-3.2 and above it
from concurrent.futures import ThreadPoolExecutor, TimeoutError as FuturesTimeout

##Loads the .env file into os.environ
load_dotenv()

## os helps python interact with operating system
import os

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
REQUEST_TIMEOUT = int(os.getenv("REQUEST_TIMEOUT", 15))  # in seconds
# Configure api key
genai.configure(api_key=GEMINI_API_KEY)

# Create model instance
model = genai.GenerativeModel("gemini-2.5-flash")

summaryPrompt = "Summarize the following text in 3-4 sentences: \n\n "

defaultChunkPrompt = """Reference chunks as [CHUNK_0], [CHUNK_2], etc. 
IMPORTANT: Only reference chunks using the exact format [CHUNK_X] 
where X is an integer. Do not invent new chunks.
IMPORTANT: Try to answer user in 2-3 sentences."""
minCharactersPrompt = "IMPORTANT: Summary must be under 4,500 characters."
condensePrompt = """Given the conversation history and the follow-up question, 
rewrite the follow-up into a standalone question that captures all context.

<Chat History>
{chat_history}

<Follow Up>
{question}

<Standalone Question>"""


def getGeneratedContent(prompt):
    """Helper function to generate Gemini response with timeout handling."""
    try:
        with ThreadPoolExecutor(max_workers=1) as executor:
            future = executor.submit(model.generate_content, prompt)
            response = future.result(timeout=REQUEST_TIMEOUT)
            return response.text

    except FuturesTimeout:
        print(f"⏰ Timeout occurred while generating content for prompt: {prompt}...")
        return "Request to Gemini timed out. Please try again."

    except Exception as e:
        print(f"⚠️ Gemini API call failed: {e}")
        return f"Gemini service error: {str(e)}"


def getSummary(input: str) -> str:
    return getGeneratedContent(f"{summaryPrompt} {input}")


def getSummaryWithCitations(documentChunks) -> str:
    return getGeneratedContent(
        f"{summaryPrompt} {documentChunks} {defaultChunkPrompt} "
    )


def getAnswers(question: str, context: str) -> str:
    return getGeneratedContent([context, question])


def getAnswersWithCitations(question: str, documentChunks) -> str:
    return getGeneratedContent(f"{question} {documentChunks} {defaultChunkPrompt}")


def getFiveMinuteSummary(text: str, max_retries: int = 6) -> str:
    for _ in range(max_retries):
        summary = getGeneratedContent(f"{summaryPrompt}{text}\n{minCharactersPrompt}")
        if len(summary) <= 4500:
            return summary

    # TODO: add NLP for meaningful summary reduction
    return summary[:4500]

# https://developers.llamaindex.ai/python/examples/chat_engine/chat_engine_condense_question/
def condenseQuestion(question: str, history: list) -> str:
    formatted = "\n".join([f"{m['role']}: {m['content']}" for m in history])
    return getGeneratedContent(condensePrompt.format(
        chat_history=formatted, 
        question=question
    ))

def getAnswersWithHistory(question: str, documentChunks, history: list) -> str:
    standalone = condenseQuestion(question, history)
    return getAnswersWithCitations(standalone, documentChunks)
