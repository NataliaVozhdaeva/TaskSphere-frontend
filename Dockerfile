# Development stage with Node.js
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Expose port 5173
EXPOSE 5173

# Bind to all interfaces (required for Docker)
ENV HOST=0.0.0.0

# API URL will be set by docker-compose
# Default fallback for local development
ENV REACT_APP_API_URL=${REACT_APP_API_URL:-http://localhost:8000/api}

# Start development server
CMD ["npm", "start"]

