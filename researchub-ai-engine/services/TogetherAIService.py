# Note, Together ai api tokens is not free tier anymore from August 2025 onwards
# https://support.together.ai/articles/1862638756-changes-to-free-tier-and-billing-july-2025
from together import Together
from dotenv import load_dotenv

load_dotenv()

import os

TOGETHER_AI_API_KEY = os.getenv("TOGETHER_AI_API_KEY")

client = Together(api_key=TOGETHER_AI_API_KEY)


def getEmbeddings(texts):
    response = client.embeddings.create(
        input=texts,
        model="togethercomputer/m2-bert-80M-8k-retrieval",
        # recommended in together ai docs
    )

    # returns arrays of embeddings (vector representations of tokens)
    return [data.embedding for data in response.data]
