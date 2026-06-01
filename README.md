# Mi Notas — React Native Mobile App

A personal note-taking mobile app built with React Native (Expo) and a Node.js/MongoDB Atlas backend.

---

## Project Structure

```
note-app/
├── server.js              # Express API server
├── .env                   # Environment variables (MongoDB URI, JWT secret)
├── config/db.js           # MongoDB Atlas connection
├── models/                # Mongoose schemas (User, Note)
├── routes/                # API routes (auth, notes)
├── controllers/           # Auth logic (register, login)
├── middleware/auth.js     # JWT verification
└── mobile/                # React Native app (Expo)
    ├── App.js
    ├── app.json
    └── src/
        ├── context/       # AuthContext (login/register/logout state)
        ├── hooks/         # useNotes (custom hook for CRUD)
        ├── navigation/    # Stack navigator
        ├── screens/       # Login, Register, Notes, NoteEditor
        ├── services/      # Axios API client
        └── utils/         # AsyncStorage + SecureStore helpers
```

---

## How to Run

### 1. Start the backend
```bash
node server.js
```
Runs on `http://localhost:5000`

### 2. Start the mobile app
```bash
cd mobile
npx expo start --tunnel
```
Scan the QR code with **Expo Go** on your phone.

> **Important:** This app requires **Expo Go version 51**. Newer versions are not compatible.
> Download it from [expo.dev/go](https://expo.dev/go) and select SDK 51.

> Your phone and computer must be on the **same Wi-Fi network**.

---

## Features

- Register / Login with JWT authentication
- Create, edit, and delete notes
- Color-coded note cards
- Search notes by title or content
- Tag notes with your GPS location (expo-location)
- Attach photos from camera or library (expo-image-picker)

## Storage Used

| Data | Storage |
|------|---------|
| JWT token | `expo-secure-store` (encrypted) |
| User profile | `AsyncStorage` |
| Note photos | `AsyncStorage` (base64, local) |
| Notes & users | MongoDB Atlas (remote) |

## Default Test Account

| Field | Value |
|-------|-------|
| Email | `demo@minotas.com` |
| Password | `Demo1234` |
