# Nova AI - Node.js Express Backend (TypeScript)

Node.js, Express.js এবং **TypeScript** দিয়ে তৈরি Nova AI-এর অফিসিয়াল ব্যাকএন্ড সার্ভিস।

---

## 🚀 Features

- **TypeScript** দিয়ে ফুল টাইপ-সেফ কোডবেস।
- **Express.js API** দ্রুত ও হালকা রেসপন্সের জন্য।
- **Google Gemini API** (`@google/generative-ai`) ইন্টিগ্রেশন।
- **Fallback / Demo Mode**: API Key ছাড়াই সরাসরি টেস্ট করার সুবিধা।
- **CORS Support** যাতে Flutter Web, Android, iOS বা ডেস্কটপ থেকে সরাসরি কানেক্ট করা যায়।
- **Multi-turn Chat History** সাপোর্ট।
- **Hot-Reloading** (`tsx watch`) দিয়ে আল্ট্রা-ফাস্ট ডেভেলপমেন্ট।

---

## 📁 প্রজেক্ট স্ট্রাকচার

```
backend/
├── src/
│   ├── controllers/
│   │   └── chatController.ts   # চ্যাট লজিক ও Gemini API কল (Type-safe)
│   ├── routes/
│   │   └── chatRoutes.ts       # চ্যাট রাউটিং
│   ├── types/
│   │   └── chat.ts             # রিকোয়েস্ট ও রেসপন্স টাইপ ইন্টারফেস
│   └── server.ts               # Express মেইন সার্ভার ফাইল
├── .env                        # Environment variables (API Key, Port)
├── .env.example                # Env ফাইল টেমপ্লেট
├── package.json                # ডিপেন্ডেন্সি ও স্ক্রিপ্ট
├── tsconfig.json               # TypeScript কনফিগারেশন
└── README.md                   # ডকুমেন্টেশন
```

---

## 🛠️ কিভাবে চালু করবেন (How to Run)

### ১. ব্যাকএন্ড ফোল্ডারে প্রবেশ করুন:
```bash
cd backend
```

### ২. ডিপেন্ডেন্সি ইনস্টল (যদি আগে না করা থাকে):
```bash
npm install
```

### ৩. `.env` ফাইলে Gemini API Key বসান:
Google AI Studio থেকে ফ্রি API Key সংগ্রহ করতে পারেন:
👉 [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)

`backend/.env` ফাইলটি খুলুন এবং আপনার কি পেস্ট করুন:
```env
PORT=5000
GEMINI_API_KEY=AIzaSy...your_actual_key_here
GEMINI_MODEL=gemini-1.5-flash
```

*(API Key না বসালেও ব্যাকএন্ড বন্ধ হবে না, ডেমো মোডে চলবে)*

### ৪. ডেভেলপমেন্ট সার্ভার চালু করুন (Hot Reload সহ):
```bash
npm run dev
```

### ৫. প্রডাকশন বিল্ড এবং রান:
```bash
# TypeScript কম্পাইল করতে:
npm run build

# বিল্ড করা JS রান করতে:
npm start
```

সার্ভারটি চালু হবে: `http://localhost:5000`

---

## 📡 API Endpoints

### ১. হেলথ চেক
- **URL**: `GET /api/health`
- **Response**:
```json
{
  "status": "ok",
  "uptime": 12.4,
  "timestamp": "2026-10-26T11:00:00.000Z"
}
```

### ২. চ্যাট এন্ডপয়েন্ট
- **URL**: `POST /api/chat`
- **Headers**: `Content-Type: application/json`
- **Body**:
```json
{
  "message": "What is Flutter?",
  "history": [
    { "text": "Hello", "isUser": true },
    { "text": "Hi! How can I help you?", "isUser": false }
  ]
}
```
- **Response**:
```json
{
  "success": true,
  "reply": "Flutter is an open-source UI software development kit...",
  "timestamp": "2026-10-26T11:00:02.000Z"
}
```

---

## 📱 Flutter অ্যাপের সাথে কানেকশন

Flutter অ্যাপে [`lib/services/api_service.dart`](file:///Users/rafi/App%20Workfolder/nova_ai/lib/services/api_service.dart) ফাইলটি স্বয়ংক্রিয়ভাবে প্ল্যাটফর্ম অনুযায়ী সঠিক URL হ্যান্ডেল করে:
- **Android Emulator**: `http://10.0.2.2:5000/api/chat`
- **iOS Simulator / Web / Desktop**: `http://localhost:5000/api/chat`
