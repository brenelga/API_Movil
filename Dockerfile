# Use an official Node.js runtime as a parent image
FROM node:20-slim

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install app dependencies
# We use 'npm ci' for a clean, deterministic install if package-lock is present
RUN npm ci --only=production

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Define environment variables (can be overridden at runtime)
ENV PORT=3000
ENV NODE_ENV=production

# Command to run the application
CMD [ "node", "index.js" ]
