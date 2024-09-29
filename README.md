# Backend: Express + TypeScript Boilerplate
This is a boilerplate project for building an Express.js application using TypeScript, with several utilities and configurations to streamline development.
## Features
- Express: Web framework for building REST APIs.
- TypeScript: Static typing for JavaScript.
- Mongoose: MongoDB object modeling for Node.js.
- ESLint: Linting utility with Airbnb base configuration.
- Prettier: Code formatting to maintain consistency.
- Joi: Data validation for request bodies.
- JWT: Token-based authentication.
- Nodemon: Auto-restarts for development.
- Winston: Logging utility.
- Swagger UI: API documentation.
## Prerequisites - Ensure the following tools are installed on your machine:
- Node.js (v14 or higher)
- npm or Yarn
- MongoDB (running locally or accessible remotely)
## Getting Started 
1. Clone the Repository
```
git clone https://github.com/linhprovip2002/express-boilerplate.git
cd express-boilerplate

```
2. Install Dependencies
Run the following command to install all dependencies:
```
npm install

```
or, if using Yarn:

```
 yarn install

```
3. Configure Environment Variables
Copy the .env.example file to .env:
```
cp .env.example .env
```
4. Run the Application

``` 
npm run start:nodemon

```
5. Linting & Formatting

To check for linting issues:

```
npm run lint
```
To fix linting issues automatically:

```
npm run lint:fix

```
To format your code using Prettier:

```
npm run format
```

## Project Structure
```
├── src                 # Source code
│   ├── modules         # Business logic and related features
│   │   ├── ...   
│   ├── system          # Helper utilities and configurations
│   │   ├── builders    # Construct objects like configurations, responses, etc. 
│   │   ├── config      # Application-wide configurations (e.g., database, API)
│   │   ├── database    # Database connection setup and utilities (e.g., Mongoose) 
│   │   ├── exceptions  # Custom error handling and exception classes
│   │   ├── factories   # Factory functions or patterns to create objects 
│   │   ├── logging     # Winston logger setup and configurations
│   │   ├── middleware  # Express middleware (e.g., for authentication, validation)
│   │   ├── model       # General data models and interfaces 
│   │   ├── swagger     # API documentation setup using Swagger 
│   └── index.ts        # Application entry point
├── dist                # Compiled JavaScript output (after build)
├── .env.example        # Example environment variables
├── .eslintrc.json      # ESLint configuration
├── .prettierrc         # Prettier configuration
├── tsconfig.json       # TypeScript configuration
└── README.md       

```
## API Documentation

API documentation is available at /api-docs when the server is running, powered by Swagger UI.