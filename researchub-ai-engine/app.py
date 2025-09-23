from flask import Flask
from routes.DocumentRoutes import documentBlueprint
from dotenv import load_dotenv

# in built python library to interact with operating system
import os

# Loads dotenv file into os.environ
load_dotenv()

AI_ENGINE_PORT = int(os.getenv("AI_ENGINE_PORT", 8000))


def createApp():
    app = Flask(__name__)

    # Registering the document blueprint
    app.register_blueprint(documentBlueprint, url_prefix="/summarize")

    return app


# Factory Function to start the Flask app and register blueprints for routes
app = createApp()


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=AI_ENGINE_PORT, debug=True)
