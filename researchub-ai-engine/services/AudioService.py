# audio service related functions
from config.GoogleTextToSpeechClient import initializeTTSClient
from google.cloud import texttospeech
import cloudinary.uploader
from datetime import datetime
import os
import json
from dotenv import load_dotenv

load_dotenv()

creds_json = os.getenv("GOOGLE_APPLICATION_CREDENTIALS_JSON", {})

# Configure Cloudinary
cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_UPLOAD_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET"),
)


# Returns generated audio from the text provided
def google_tts(
    text: str,
    voiceName: str = "en-US-Standard-D",
):
    if creds_json:
        creds_path = "/google-creds.json"
        with open(creds_path, "w") as f:
            f.write(creds_json)

        os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = creds_path

    client = texttospeech.TextToSpeechClient()

    # print("Client initialized")

    synthesisInput = texttospeech.SynthesisInput(text=text)

    voice = texttospeech.VoiceSelectionParams(language_code="en-US", name=voiceName)

    audioConfig = texttospeech.AudioConfig(
        audio_encoding=texttospeech.AudioEncoding.MP3
    )

    response = client.synthesize_speech(
        input=synthesisInput, voice=voice, audio_config=audioConfig
    )

    print("Audio Generated successfully ")
    return response.audio_content


def uploadGeneratedAudioOnCloudinary(audioContent, documentName: str) -> str:
    audio_id = f"{documentName}_{datetime.now().strftime('%Y%m%d_%H%M%S')}"

    result = cloudinary.uploader.upload(
        audioContent,
        resource_type="video",
        folder="tts-audio",
        public_id=audio_id,
        format="mp3",
    )

    print(f"Audio uploaded successfully!")
    print(f"URL: {result['secure_url']}")

    return result["secure_url"]


def generateAndUploadAudioOverview(summary: str, documentName: str) -> str:
    """
    Convert text to speech and upload to Cloudinary

    Args:
        text: Text to convert

    Returns:
        str: Cloudinary URL of audio file
    """
    try:
        audioContent = google_tts(summary)
        secureUrl = uploadGeneratedAudioOnCloudinary(audioContent, documentName)
        return secureUrl

    except Exception as e:
        print(f"Error while generating and uploading Audio : {e}")
        return None
