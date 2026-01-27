from google.cloud import texttospeech
from dotenv import load_dotenv

load_dotenv()

# Cheapest
# en-US-Standard-C -> output.mp3
# en-US-Standard-D --- use D for now
# en-GB-Standard-A

import os
import json

creds_json = os.getenv("GOOGLE_APPLICATION_CREDENTIALS_JSON")

if creds_json:
    creds_path = "/google-creds.json"
    with open(creds_path, "w") as f:
        f.write(creds_json)

    os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = creds_path

# ≈ 4,200 characters only to be requested for speech conversion


def google_tts(
    text: str,
    output_file: str = "output-Summary.mp3",
    voice_name: str = "en-US-Standard-D",
):
    client = texttospeech.TextToSpeechClient()

    synthesis_input = texttospeech.SynthesisInput(text=text)

    voice = texttospeech.VoiceSelectionParams(language_code="en-US", name=voice_name)

    audio_config = texttospeech.AudioConfig(
        audio_encoding=texttospeech.AudioEncoding.MP3
    )

    response = client.synthesize_speech(
        input=synthesis_input, voice=voice, audio_config=audio_config
    )

    with open(output_file, "wb") as out:
        out.write(response.audio_content)

    print("✅ Audio saved to", output_file)


# TEST
google_tts(
    "This document emphasizes the critical need for accurate multi-page chunking in PDF processing for AI systems, as chunks often span multiple pages requiring page ranges instead of single page numbers for citations. The recommended implementation involves three steps: extracting page boundary metadata (character positions), creating chunks with desired size and overlap, and then mapping each chunk's character range to all overlapping pages. This precise page range mapping is essential for generating accurate and verifiable citations, improving AI response quality, building user trust, and ensuring compliance with professional standards. Thorough testing with diverse documents and robust error handling are also crucial for a production-ready document intelligence system."
)
