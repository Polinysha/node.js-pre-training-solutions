# Use Node.js 24 Alpine as base image (small and efficient)
FROM node:24-alpine

# Set working directory inside container
WORKDIR /app

# Copy package.json and package-lock.json (if exists)
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy application code
COPY . .

# Expose port 3000
EXPOSE 3000

# Define command to run the application
CMD ["node", "app.js"]
