# Docker Setup Steps

---

1. Create network
```bash
docker network create researchub-network
```


2. Create mongo db image and run the container
```bash
docker pull mongo
docker run -p 27017:27017 --network researchub-network --name researchub-monogo-db mongo
```

3. Build server image and run the container 
```bash
cd ../researchub-server
docker build . -t researchub-server
docker run -p 5000:5000 --network resarchub-network --name researchub-server -v ./researchub-server:/src/usr/researchub-server  -d researchub-server
```

4. Build client app image and run the container
```bash
cd ../researchub-client
docker build . -t researchub-client
docker run -p 3000:3000 --network researchub-network --name researchub-client -v ./researchub-client:/src/usr/researchub-client  -d researchub-client
```

5. Build ai engine app image and run the container
```bash
cd ../researchub-ai-enigne
docker build . -t researchub-ai-engine
docker run -p 8000:8000 --network researchub-network --name researchub-ai-engine -v ./researchub-ai-engine:/src/usr/researchub-ai-engine  -d researchub-ai-engine
```


---

# Using Docker Compose 

```bash 
docker compose up --build
```