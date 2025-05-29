# Property-Listing-App

A backend API for a property listing platform, built with Node.js, Express, MongoDB, Redis, JWT authentication, Cloudinary for image storage, and Multer for file uploads.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
  - [Auth](#auth)
  - [Properties](#properties)
  - [Favourites](#favourites)
  - [Recommendations](#recommendations)
- [Caching](#caching)
- [Rate Limiting](#rate-limiting)
- [File Uploads](#file-uploads)
- [Error Handling](#error-handling)
- [Example Request/Response](#example-requestresponse)
- [Project Structure](#project-structure)
- [How to Run](#how-to-run)

---

## Tech Stack

- **Node.js** & **Express**: REST API server
- **MongoDB** & **Mongoose**: Database and ODM
- **Redis**: Caching for performance
- **JWT**: Authentication
- **Cloudinary**: Image storage and transformation
- **Multer**: File upload middleware
- **Helmet** & **CORS**: Security and cross-origin support

---

## Environment Variables

Copy `.env.example` to `.env` and fill in your credentials:

```env
PORT=3000
NODE_ENV=development
MONGODB_URI=
REDIS_URL=
JWT_SECRET=
JWT_EXPIRES_IN=7d
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

---

## API Endpoints

All endpoints are prefixed with `/api`.

### Auth

| Method | Endpoint           | Description                | Auth Required |
|--------|--------------------|----------------------------|--------------|
| POST   | `/auth/register`   | Register a new user        | No           |
| POST   | `/auth/login`      | Login and get JWT token    | No           |
| GET    | `/auth/profile`    | Get current user profile   | Yes          |
| GET    | `/auth/find-user`  | Find user by email         | Yes          |

### Properties

| Method | Endpoint                       | Description                                 | Auth Required | File Upload |
|--------|------------------------------- |---------------------------------------------|--------------|-------------|
| POST   | `/properties/import-excel`     | Import properties from Excel                | Yes          | Yes (.xlsx) |
| POST   | `/properties/`                 | Create a new property                       | Yes          | Yes (images)|
| GET    | `/properties/`                 | List/search properties                      | No           | No          |
| GET    | `/properties/my`               | List properties created by current user     | Yes          | No          |
| GET    | `/properties/:id`              | Get property details by ID                  | No           | No          |
| PUT    | `/properties/:id`              | Update property by ID                       | Yes          | Yes (images)|
| DELETE | `/properties/:id`              | Delete property by ID                       | Yes          | No          |

### Favourites

| Method | Endpoint                              | Description                                 | Auth Required |
|--------|---------------------------------------|---------------------------------------------|--------------|
| GET    | `/favourites/`                        | List user's favourite properties            | Yes          |
| POST   | `/favourites/:propertyId`             | Add property to favourites                  | Yes          |
| DELETE | `/favourites/:propertyId`             | Remove property from favourites             | Yes          |
| GET    | `/favourites/:propertyId/status`      | Check if property is in user's favourites   | Yes          |

### Recommendations

| Method | Endpoint                              | Description                                 | Auth Required |
|--------|---------------------------------------|---------------------------------------------|--------------|
| POST   | `/recommendations/`                   | Recommend a property to another user        | Yes          |
| GET    | `/recommendations/received`           | List recommendations received               | Yes          |
| GET    | `/recommendations/sent`               | List recommendations sent                   | Yes          |
| PATCH  | `/recommendations/:id/read`           | Mark recommendation as read                 | Yes          |
| DELETE | `/recommendations/:id`                | Delete a recommendation                     | Yes          |

---

## Caching

- Uses **Redis** for caching property lists, property details, and user favourites.
- Cache is invalidated on property or favourite changes.

---

## Rate Limiting

- All endpoints are protected by rate limiting.
- Configurable via environment variables.

---

## File Uploads

- **Multer** is used for handling file uploads.
- Property images and Excel files are uploaded in-memory and processed.
- Images are uploaded to **Cloudinary**.

---

## Error Handling

- All endpoints return JSON responses with `success`, `message`, and (optionally) `data`.
- Standard HTTP status codes are used.

---

## Example Request/Response

**Register**
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "isVerified": false
    },
    "token": "..."
  }
}
```

---

## Project Structure

- `src/controllers/` - Business logic for each resource
- `src/routes/` - API route definitions
- `src/models/` - Mongoose models
- `src/services/` - External integrations (cache, cloudinary, etc.)
- `src/middlewares/` - Express middlewares (auth, error, cache, etc.)

---

## How to Run

1. **Clone the repository**
   ```sh
   git clone <your-repo-url>
   cd <project-folder>
   ```

2. **Copy environment variables**
   ```sh
   cp .env.example .env
   # Then edit .env with your credentials
   ```

3. **Install dependencies**
   ```sh
   npm install
   ```

4. **Build the project**
   ```sh
   npm run build
   ```

5. **Start the server**
   ```sh
   npm start
   ```

6. **For development mode (auto-reload)**
   ```sh
   npm run dev
   ```

---

**Tech Used:** Node.js, Express, MongoDB, Redis, JWT, Cloudinary, Multer, Helmet, CORS

---

**Author:** Rishabh Kumrawat