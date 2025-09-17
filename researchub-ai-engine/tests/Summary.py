from transformers import pipeline
import google.generativeai as genai
from dotenv import load_dotenv

##Loads the .env file into os.environ
load_dotenv()

## os helps python interact with operating system
import os

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
# Configure API key
genai.configure(api_key=GEMINI_API_KEY)

# Create model instance
model = genai.GenerativeModel("gemini-1.5-flash")


summarizer = pipeline("summarization", model="facebook/bart-large-cnn")


# Only certain functions are exposed rest all (not mentioned down here) are private
__all__ = ["getSummary", "summarizeDocument"]


def getDummySummary():
    ARTICLE = """ New York (CNN)When Liana Barrientos was 23 years old, she got married in Westchester County, New York.
    A year later, she got married again in Westchester County, but to a different man and without divorcing her first husband.
    Only 18 days after that marriage, she got hitched yet again. Then, Barrientos declared "I do" five more times, sometimes only within two weeks of each other.
    In 2010, she married once more, this time in the Bronx. In an application for a marriage license, she stated it was her "first and only" marriage.
    Barrientos, now 39, is facing two criminal counts of "offering a false instrument for filing in the first degree," referring to her false statements on the
    2010 marriage license application, according to court documents.
    Prosecutors said the marriages were part of an immigration scam.
    On Friday, she pleaded not guilty at State Supreme Court in the Bronx, according to her attorney, Christopher Wright, who declined to comment further.
    After leaving court, Barrientos was arrested and charged with theft of service and criminal trespass for allegedly sneaking into the New York subway through an emergency exit, said Detective
    Annette Markowski, a police spokeswoman. In total, Barrientos has been married 10 times, with nine of her marriages occurring between 1999 and 2002.
    All occurred either in Westchester County, Long Island, New Jersey or the Bronx. She is believed to still be married to four men, and at one time, she was married to eight men at once, prosecutors say.
    Prosecutors said the immigration scam involved some of her husbands, who filed for permanent residence status shortly after the marriages.
    Any divorces happened only after such filings were approved. It was unclear whether any of the men will be prosecuted.
    The case was referred to the Bronx District Attorney\'s Office by Immigration and Customs Enforcement and the Department of Homeland Security\'s
    Investigation Division. Seven of the men are from so-called "red-flagged" countries, including Egypt, Turkey, Georgia, Pakistan and Mali.
    Her eighth husband, Rashid Rajput, was deported in 2006 to his native Pakistan after an investigation by the Joint Terrorism Task Force.
    If convicted, Barrientos faces up to four years in prison.  Her next court appearance is scheduled for May 18.
    """
    summary = summarizer(ARTICLE, max_length=130, min_length=30, do_sample=False)
    print(summary)
    return summary[0]["summary_text"]


def getSummary(input):
    try:
        summary = summarizer(input, max_length=130, min_length=30, do_sample=False)[0][
            "summary_text"
        ]
        return summary
    except Exception as error:
        print("Error while summarizing the userInput", input[:200], flush=True)
        print(f"error {error}", flush=True)
        return None


def summarizeDocument(extractedText, chunk_size=1000):
    """
    Summarizes a document using a map-reduce style method.
    Splits text into smaller sub-chunks of `chunk_size` characters.

    Args:
        extractedText (list of str): List of text chunks.
        chunk_size (int): Maximum length of each sub-chunk.

    Returns:
        str: Final summary of the document.
    """
    summaries = []

    def split_text(text, size):
        """Split text into pieces of max `size` characters."""
        return [text[i : i + size] for i in range(0, len(text), size)]

    # Step 1: Summarize each sub-chunk
    for chunk in extractedText:
        sub_chunks = split_text(chunk.strip(), chunk_size)
        for sub_chunk in sub_chunks:
            try:
                summary = getSummary(sub_chunk)
                print(f"Summary found: {summary}", flush=True)
                summaries.append(summary)
            except Exception as e:
                print("Error summarizing sub-chunk:", str(e))
                continue

    # Step 2: Summarize the combined summaries
    try:
        summaries = summarize_in_batches(summaries)
        finalSummary = getSummary(" ".join(summaries))
    except Exception as e:
        print("Summarization error:", str(e), flush=True)
        return {"error": str(e)}

    print("BART Summary:", finalSummary, flush=True)
    return finalSummary


def summarize_in_batches(texts, batch_size=5):
    batch_summaries = []
    for i in range(0, len(texts), batch_size):
        batch_text = " ".join(texts[i : i + batch_size])
        batch_summary = getSummary(batch_text)
        batch_summaries.append(batch_summary)
    return batch_summaries


def getGeminiSummary(input):
    """Summarize input text using Gemini model."""
    prompt = f"Summarize the following text in 3-4 sentences:\n\n{input}"
    response = model.generate_content(prompt)
    return response.text


def getGeminiAnswer(question, context):
    response = model.generate_content([context, question])
    # print(response)
    return response.text
