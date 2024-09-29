# Use the official Node.js image as base image
FROM node

# Set an argument for the image name (default is express-be)
ARG IMAGE_NAME=express-be

# Set environment variables
ENV DATABASE_URL="mongodb://localhost:27017/test"
ENV JWT_SECRET="secret"

# Install Yarn globally

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and yarn.lock to the working directory
COPY package.json yarn.lock ./

# Install app dependencies
RUN yarn install

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Define the command to run your app
CMD ["yarn", "start"]
