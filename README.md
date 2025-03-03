# 🚀 PIM Backend API Documentation

## 📌 Introduction
PIM Backend is a NestJS-based API that provides **authentication, user management, and vehicle management**. This documentation covers available endpoints, request structures, and response formats.

- **Tech Stack**: NestJS, MongoDB, Mongoose, JWT Authentication
- **Base URL**: `http://localhost:3000`
- **Swagger Docs**: [`http://localhost:3000/api-docs`](http://localhost:3000/api-docs)

---

## 🛠 **Setup & Installation**
### 1️⃣ Install dependencies
```sh
npm install
```
### 2️⃣ Set up environment variables (`.env`)
Create a `.env` file in the project root with:
```
PORT=3000
MONGO_URI=mongodb://localhost:27017/pim
JWT_SECRET=your_secret_key
```
### 3️⃣ Run the server
```sh
npm run start
```
Now the API will be available at `http://localhost:3000`.

---

## 🔐 **Authentication API**
### 🔹 `POST /auth/register`
**Registers a new user.**
#### 📝 Request Body:
```json
{
  "email": "johndoe@example.com",
  "username": "JohnDoe",
  "password": "StrongPass@123",
  "cin": "12345678"
}
```
#### ✅ Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5..."
}
```
---
### 🔹 `POST /auth/login`
**Logs in a user and returns a token.**
#### 📝 Request Body:
```json
{
  "email": "johndoe@example.com",
  "password": "StrongPass@123"
}
```
#### ✅ Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5..."
}
```
---
### 🔹 `POST /auth/logout`
**Logs out a user (requires authentication).**
#### 🔐 Headers:
```
Authorization: Bearer <JWT_TOKEN>
```
#### ✅ Response:
```json
{
  "message": "Successfully logged out"
}
```
---
## 👤 **User API**
### 🔹 `GET /users`
**Retrieves all registered users.**
#### 🔐 Headers:
```
Authorization: Bearer <JWT_TOKEN>
```
#### ✅ Response:
```json
[
  {
    "id": "60d21b4667d0d8992e610c85",
    "email": "johndoe@example.com",
    "username": "JohnDoe"
  }
]
```
---
### 🔹 `PATCH /users/:id`
**Updates a user's profile.**
#### 🔐 Headers:
```
Authorization: Bearer <JWT_TOKEN>
```
#### 📝 Request Body:
```json
{
  "username": "NewJohnDoe",
  "email": "newemail@example.com"
}
```
#### ✅ Response:
```json
{
  "message": "User updated successfully"
}
```
---
## 🚗 **Vehicle API**
### 🔹 `POST /vehicules`
**Creates a new vehicle (requires authentication).**
#### 🔐 Headers:
```
Authorization: Bearer <JWT_TOKEN>
```
#### 📝 Request Body:
```json
{
  "plateNumber": "123ABC",
  "plateSerie": "TUN",
  "brand": "Toyota",
  "carModel": "Corolla",
  "year": 2022,
  "color": "Red",
  "vin": "1HGCM82633A123456",
  "owner": "60d21b4667d0d8992e610c85"
}
```
#### ✅ Response:
```json
{
  "message": "Vehicle created successfully"
}
```
---
### 🔹 `GET /vehicules`
**Retrieves all vehicles.**
#### ✅ Response:
```json
[
  {
    "plateNumber": "123ABC",
    "brand": "Toyota",
    "carModel": "Corolla",
    "year": 2022,
    "owner": {
      "id": "60d21b4667d0d8992e610c85",
      "username": "JohnDoe"
    }
  }
]
```
---
### 🔹 `PUT /vehicules/:id`
**Updates a vehicle's details.**
#### 🔐 Headers:
```
Authorization: Bearer <JWT_TOKEN>
```
#### 📝 Request Body:
```json
{
  "color": "Blue"
}
```
#### ✅ Response:
```json
{
  "message": "Vehicle updated successfully"
}
```
---
### 🔹 `DELETE /vehicules/:id`
**Deletes a vehicle.**
#### 🔐 Headers:
```
Authorization: Bearer <JWT_TOKEN>
```
#### ✅ Response:
```json
{
  "message": "Vehicle deleted successfully"
}
```
---

## 🔍 **Error Handling**
| Status Code | Meaning |
|-------------|---------|
| `400 Bad Request` | Invalid data format |
| `401 Unauthorized` | Missing or invalid authentication token |
| `403 Forbidden` | Access denied |
| `404 Not Found` | Requested resource not found |
| `500 Internal Server Error` | Unexpected server error |

---

## 📌 **Useful Links**
- **Swagger Docs:** [`http://localhost:3000/api-docs`](http://localhost:3000/api-docs)
- **Git Repository:** [GitHub Repo](https://https://github.com/khalilmanai/pim_backend)

🚀 **Developed using NestJS & MongoDB.**

