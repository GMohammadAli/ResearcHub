from gtts import gTTS
import os
from moviepy import AudioFileClip

text = "The first move is what sets everything in motion."
tts = gTTS(text=text, lang="en", slow=False, tld="com")
tempFileName = "temp.mp3"
tts.save(tempFileName)

# Load and speed up
audio = AudioFileClip(tempFileName)
faster_audio = audio.with_effects([("speedx", 1.25)])

# Save
faster_audio.write_audiofile(filename, logger=None)

# Cleanup
audio.close()
faster_audio.close()
os.remove(tempFileName)
