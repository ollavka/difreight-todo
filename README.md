# Todo List

This project is a simple Todo List application with separate UI and API folders. The instructions below will help you set up and run the project locally.

## Prerequisites

- Node.js version 20.6 or higher
- PostgreSQL database

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/ollavka/difreight-todo.git todo-list
cd todo-list
```

### 2. Setting Up the API

- Ensure you have Node.js version 20.6 or higher installed

```bash
node -v
```

- Navigate to the API Directory

```bash
cd api
```

- Create Environment File

Copy .env.example to .env and update the file with your PostgreSQL database connection details.

```bash
cp .env.example .env
```

- Install Dependencies

```bash
npm install
```

- Run Database Migrations

```bash
npm run migrate:init
```

- Start the Server

```bash
npm run dev
```

The server will be running at http://localhost:3333/ by default

### 3. Setting Up the UI

- Navigate to the UI Directory

```bash
cd ui
```

- Create Environment File

Copy .env.example to .env and update the file with the API URL (e.g., http://localhost:3333/).

```bash
cp .env.example .env
```

- Install Dependencies

```bash
npm install
```

- Start the Frontend

```bash
npm run dev
```

The UI will be running at http://localhost:5173/ by default
