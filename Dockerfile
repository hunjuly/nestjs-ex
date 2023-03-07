# Base image
FROM node:14

# Create and set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Expose the port the application listens on
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start:prod"]
