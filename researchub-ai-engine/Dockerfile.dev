# 1. Base Python Image
FROM python:3.11-slim

# 2. Setting working directory
WORKDIR /src/usr/researchub-ai-engine

# 3. Copy requirements.txt (for caching)
COPY requirements.txt .

# 4. Install python libraries, 
# check if we need to create a virtual environment here????
# not needed as each container already runs in an isolated environment
RUN pip install --no-cache-dir -r requirements.txt

# 5. Copy the source code 
COPY . .

# 6. EXPOSE the client port
EXPOSE 8000

# 7. Run the flask app
CMD ["python", "App.py"]



