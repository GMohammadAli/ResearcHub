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


def getSummary(input):
    return getGeneratedContent(
        f"Summarize the following text in 3-4 sentences: \n\n {input}"
    )


def getAnswers(question, context):
    return getGeneratedContent([context, question])
