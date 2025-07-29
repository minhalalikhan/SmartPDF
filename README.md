# 📄 Smart PDF QA App

A full-stack application that lets users upload a PDF, processes it using OpenAI embeddings, stores vectors in Pinecone, and enables interactive question answering based on the content.

🌐 **Live App**: [https://smart-pdf-ebon.vercel.app/](https://smart-pdf-ebon.vercel.app/)

---

## ✨ Features

- ✅ Upload a single PDF
- ✅ Extract content using `pdfjs-dist`
- ✅ Generate embeddings via **OpenAI**
- ✅ Store and search embeddings in **Pinecone**
- ✅ Ask questions based on uploaded document
- ✅ Basic in-session chat history (non-persistent)

> 🛑 Authentication, persistent document storage, and support for multiple docs are intentionally **out of scope** for this assignment.

---

## 🛠️ Tech Stack

### Frontend

- [Vite](https://vitejs.dev/)
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)

### Backend

- [Express](https://expressjs.com/)
- [TypeScript](https://www.typescriptlang.org/)

### Other Tools

- [OpenAI API](https://platform.openai.com/) – for embeddings and chat completions
- [Pinecone](https://www.pinecone.io/) – vector database
- [`pdfjs-dist`](https://www.npmjs.com/package/pdfjs-dist) – PDF parsing

---

## 🔧 Setup Instructions

### 1. Requirements

- OpenAI API Key from [OpenAI Platform](https://platform.openai.com/account/api-keys)
- Pinecone API Key and project setup from [Pinecone Console](https://app.pinecone.io/)

---

### 2. Environment Variables

#### 🔒 Backend (`backend/.env`)

```env
OPENAI_API_KEY=your_openai_api_key
PINECONE_API_KEY=your_pinecone_api_key
PINECONE_INDEX=your_index_name
PINECONE_HOST=your_pinecone_index_host_url
```

---

### 3. Installation

#### Backend

```
npm install
```

#### Frontend

```
npm install
```

---

### 4. Run the app

#### Backend

```
npm run dev
```

#### Frontend

```
npm run dev
```
