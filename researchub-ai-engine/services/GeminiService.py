import google.generativeai as genai
from dotenv import load_dotenv

##Loads the .env file into os.environ
load_dotenv()

## os helps python interact with operating system
import os

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
# Configure api key
genai.configure(api_key=GEMINI_API_KEY)

# Create model instance
model = genai.GenerativeModel("gemini-1.5-flash")


def getSummary(input):
    prompt = f"Summarize the following text in 3-4 sentences: \n\n {input}"
    response = model.generate_content(prompt)
    return response.text


def getAnswers(question, context):
    response = model.generate_content([context, question])
    return response.text
