FROM node:22-alpine

# Set working directory
WORKDIR /app

# Set environment variables menggunakan build-arg
ARG TOKEN
ENV TOKEN=${TOKEN}

ARG ORG
ENV ORG=${ORG}

ARG BUCKET
ENV BUCKET=${BUCKET}

ARG URL
ENV URL=${URL}

ARG ENDPOINT
ENV ENDPOINT=${ENDPOINT}

ARG API_AUTH
ENV API_AUTH=${API_AUTH}

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy seluruh file project
COPY . .

# Build project SvelteKit
RUN npm run build

# Jalankan aplikasi dari hasil build
CMD ["node", "build"]