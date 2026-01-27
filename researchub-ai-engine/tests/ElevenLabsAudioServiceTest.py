# ADAM_VOICE_ID = "pNInz6obpgDQGcFmaJgB"
# ALICE_VOICE_ID = "Xb7hH8MSUJpSbSDYk0k2"
import os
from dotenv import load_dotenv
from elevenlabs.client import ElevenLabs
from moviepy import AudioFileClip

load_dotenv()

VOICE_ID = "Xb7hH8MSUJpSbSDYk0k2"
ELEVEN_LABS_API_KEY = os.getenv("ELEVEN_LABS_API_KEY")

client = ElevenLabs(api_key=ELEVEN_LABS_API_KEY)

TEMP_FILE = "temp.mp3"
OUTPUT_FILE = "output.mp3"

# 🔹 Generate audio (generator)
audio_generator = client.text_to_speech.convert(
    text="The first move is what sets everything in motion.",
    voice_id=VOICE_ID,
    model_id="eleven_multilingual_v2",
    output_format="mp3_44100_128",
)

# 🔹 Save generator → file
with open(TEMP_FILE, "wb") as f:
    for chunk in audio_generator:
        f.write(chunk)

# 🔹 Load with MoviePy
audio_clip = AudioFileClip(TEMP_FILE)

# 🔹 Save final audio
audio_clip.write_audiofile(OUTPUT_FILE, logger=None)

# 🔹 Cleanup
audio_clip.close()
os.remove(TEMP_FILE)

print("✅ Audio saved as", OUTPUT_FILE)

# Dropped due to Free Tier limitations
