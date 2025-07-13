# 🎉 Event Management Frontend (Vite + React)

#### A modern frontend application for an Event Management System, built with Vite and React, supporting authentication, role-based dashboards, event creation/editing, user registration, admin approvals, and RTL (Arabic) support with full translation (i18n).

## 🔗 Live Link / Demo

https://event-management-front-ten.vercel.app

## 🧰 Tech Stack

- React (via Vite)

- React Router DOM

- React Context API (for Auth & Global State)

- React Toastify (Notifications)

- i18next (Translation support)

- TailwindCSS (Styling)

- Axios (API integration)

- Lazy Loading via React.lazy and Suspense

- Protected Routes (Private, Guest, Admin)

- RTL + LTR layout toggle support

## 🚀 Getting Started

### For running this application on your local machine

- You must have node js and npm installed on your local machine visit the below link to download the node js

https://nodejs.org/en/download

to check it if its is installed properly run this command

# Verify the Node.js version:
```
node -v

```

# Verify npm version:
```
npm -v

```


- Clone the repository

```
git clone https://github.com/yadavritik467/event-management-front.git

cd event-management-front

```

- Install dependencies

```
npm install
```

- Setup environment variables
  Create a .env file in the root with the following variables:

```
VITE_API_URL=http://localhost:5000/api

```

- start the APP

```
npm run dev

```
