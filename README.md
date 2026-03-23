# Advance Backend API

An Express + MongoDB backend for user authentication, profile management, media upload, and channel-related user data.

This repo currently exposes user-focused APIs under a versioned REST namespace and uses JWT + HTTP-only cookies for session flow.

## Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Implemented Features](#implemented-features)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Run the Project](#run-the-project)
- [API Documentation](#api-documentation)
- [Authentication Flow](#authentication-flow)
- [Request and Response Notes](#request-and-response-notes)
- [Known Notes](#known-notes)
- [Future Extensions](#future-extensions)

## Tech Stack

- Runtime: Node.js
- Server: Express 5
- Database: MongoDB + Mongoose
- Auth: JSON Web Tokens (JWT)
- Password Hashing: bcrypt
- File Upload: multer
- Media Storage: Cloudinary
- Utilities: cookie-parser, cors, dotenv

## Project Structure

```
.
|- public/
|  |- temp/                     # Temporary local files before Cloudinary upload
|- src/
|  |- app.js                    # Express app config + route mounting
|  |- index.js                  # Entry point (env load, DB connect, server start)
|  |- constants.js              # Static constants (DB name)
|  |- controllers/
|  |  |- user.controller.js     # User auth/profile/channel handlers
|  |- db/
|  |  |- index.js               # MongoDB connection setup
|  |- middlewares/
|  |  |- auth.middleware.js     # JWT verification middleware
|  |  |- multer.middleware.js   # Multer storage config
|  |- models/
|  |  |- user.model.js          # User schema + model methods
|  |  |- video.model.js
|  |  |- playlist.model.js
|  |  |- subscription.model.js
|  |  |- tweet.model.js
|  |  |- comment.model.js
|  |  |- like.model.js
|  |- routes/
|  |  |- user.routes.js         # User route definitions
|  |- utils/
|     |- ApiError.js
|     |- ApiResponse.js
|     |- asyncHandler.js
|     |- cloudinary.js
|- package.json
|- README.md
```

## Implemented Features

- User registration with avatar and optional cover image upload
- User login and logout
- Access token refresh using refresh token
- Password change for authenticated user
- Authenticated current-user fetch
- Update account details
- Update avatar and cover image
- Channel profile fetch by username
- Watch history fetch

## Getting Started

### 1) Clone the repository

```bash
git clone https://github.com/Abhay-0103/Advance-Backend.git
cd Advance-Backend
```

### 2) Install dependencies

```bash
npm install
```

### 3) Create environment file

Create a `.env` file at the project root using the template below.

## Environment Variables

```env
PORT=8000
CORS_ORIGIN=http://localhost:5173

MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>

ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRES_IN=1d

REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRES=10d

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Notes:
- Database name is set in code as `advance-backend`.
- `CORS_ORIGIN` must match your frontend origin exactly.

## Run the Project

Development mode:

```bash
npm run dev
```

Configured script:

```json
"dev": "nodemon -r dotenv/config --experimental-json-modules src/index.js"
```

Server starts at:

```text
http://localhost:8000
```

## API Documentation

Base URL:

```text
/api/v1/users
```

### Public Endpoints

1. Register user
- Method: POST
- Path: `/register`
- Content-Type: multipart/form-data
- Fields:
	- `fullName` (string, required)
	- `email` (string, required)
	- `username` (string, required)
	- `password` (string, required)
	- `avatar` (file, required)
	- `coverImage` (file, optional)

2. Login user
- Method: POST
- Path: `/login`
- Content-Type: application/json
- Body (one of username/email plus password):

```json
{
	"email": "user@example.com",
	"password": "yourPassword"
}
```

3. Refresh access token
- Method: POST
- Path: `/refresh-token`
- Reads refresh token from cookie or request body.

### Protected Endpoints (Require Access Token)

1. Logout user
- Method: POST
- Path: `/logout`

2. Change password
- Method: POST
- Path: `/change-password`
- Body:

```json
{
	"oldPassword": "oldPassword",
	"newPassword": "newPassword"
}
```

3. Update account details
- Method: PATCH
- Path: `/update-account`
- Body:

```json
{
	"fullName": "Updated Name",
	"email": "updated@example.com"
}
```

4. Update avatar
- Method: PATCH
- Path: `/avatar`
- Content-Type: multipart/form-data
- Field: `avatar` (file)

5. Update cover image
- Method: PATCH
- Path: `/cover-image`
- Content-Type: multipart/form-data
- Field: `coverImage` (file)

6. Get current user
- Method: GET
- Path: `/current-user`

7. Get channel profile
- Method: GET
- Path: `/c/:username`

8. Get watch history
- Method: GET
- Path: `/history`

## Authentication Flow

1. User logs in with credentials.
2. Server issues access token + refresh token.
3. Tokens are set as HTTP-only cookies.
4. Protected routes validate access token through middleware.
5. Access token can be rotated using refresh token endpoint.

## Request and Response Notes

- API responses use a common structure through `ApiResponse`:

```json
{
	"statusCode": 200,
	"data": {},
	"message": "Success",
	"success": true
}
```

- Errors are thrown using `ApiError` in controllers and middleware.
- Files are uploaded locally to `public/temp` first, then moved to Cloudinary.

## Known Notes

- There is currently no global Express error-handler middleware shown in `app.js`.
- Authentication cookies are set with `secure: true`, which typically requires HTTPS in browser-based local development.
- Only `dev` script is currently defined in package scripts.

## Future Extensions

- Add global error-handling middleware for standardized error output
- Add validation layer (for example, Zod/Joi/express-validator)
- Add test setup (unit + integration)
- Add scripts for linting, formatting, and production start
- Expand API docs for video, playlist, likes, subscriptions, and comments as their routes are added
