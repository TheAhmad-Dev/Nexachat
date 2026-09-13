# Nexachat 💬

### WhatsApp-Inspired Real-Time Chat Application

Nexachat is a full-stack real-time chat application inspired by modern messaging platforms such as WhatsApp. It is designed to provide users with a smooth and interactive messaging experience through a React Native mobile frontend and a Node.js backend.

## 🚀 Features

- 🔐 User Registration & Login
- 👤 User Authentication with JWT
- 💬 Real-Time Messaging
- 🟢 Online/User Presence Handling
- 🔔 Notification Support
- 👥 User-to-User Conversations
- 📱 Cross-Platform Mobile Application
- ⚡ Real-Time Communication using Socket.IO
- 🗄️ MongoDB Database
- 🎨 Modern and Responsive UI

## 🛠️ Technologies Used

### Frontend

- React Native
- Expo
- TypeScript
- Expo Router
- Axios
- Socket.IO Client
- AsyncStorage

### Backend

- Node.js
- Express.js
- TypeScript
- MongoDB
- Mongoose
- JWT Authentication
- Socket.IO
- CORS
- dotenv

## 📁 Project Structure

```text
Nexachat/
│
├── App_Backend/
│   ├── config/
│   ├── controls/
│   ├── middleware/
│   ├── routes/
│   ├── socket/
│   ├── utils/
│   ├── index.ts
│   ├── package.json
│   └── tsconfig.json
│
├── Frontend/
│   └── Nexachat/
│       ├── app/
│       │   ├── (auth)/
│       │   └── (main)/
│       ├── assets/
│       ├── components/
│       ├── constants/
│       ├── context/
│       ├── hooks/
│       ├── services/
│       ├── socket/
│       └── utils/
│
└── .gitignore
