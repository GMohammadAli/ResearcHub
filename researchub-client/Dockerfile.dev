# 1. Base node v20 image
FROM node:20-alpine

# 2. Setting working directory in container
WORKDIR /src/usr/researchub-client

# 3. COPY package.json and package-lock.json first(for caching)
COPY package*.json ./

# 4. Install node dependencies
RUN npm install

# 5. Copy rest of the source code into the folder
COPY . .

# 6. Expose client port
EXPOSE 3000

# 7. Run the app
CMD ["npm","run","dev"]
