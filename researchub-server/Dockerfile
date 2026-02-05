# 1. Base Image
FROM node:20.11.1-slim

# 2. Working directory
WORKDIR /src/usr/researchub-server

# 3. Copy package.json and package-lock.json first(for caching)
COPY package*.json ./

# 4. Install node dependencies
RUN npm install

# 5. Copy all the source code
COPY . .

# 6. Build the app (IMPORTANT: compile here)
RUN npm run build

# 7. Expose the server port
EXPOSE 5000

# 8. Run the app
CMD ["npm","run","prod"]
