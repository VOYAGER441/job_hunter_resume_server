# Job Hunter Resume Builder API

Node.js/Express backend for generating ATS-friendly resume PDFs from resume data stored in MongoDB. The API loads a resume record, asks Mistral to turn it into strict HTML, and renders the result to a PDF with Puppeteer.

## Features

- MongoDB-backed resume storage
- Mistral-powered HTML resume generation
- PDF output served as a download
- Centralized logging and error handling
- CORS and JSON request parsing

## Requirements

- Node.js
- npm
- MongoDB
- Mistral API key

## Installation

```bash
git clone <repository_url>
cd job_hunter_resume_server
npm install
```

## Configuration

Create a `.env` file in the project root:

```env
PORT=5050
NODE_ENV=dev
MONGODB_URI=mongodb://localhost:27017/job_hunter
MISTRAL_API_KEY=your_mistral_api_key
MISTRAL_MODEL_NAME=mistral-small-latest
LOG_LEVEL=info
LOG_OUTPUT=console
LOG_FILE_PATH=logs/app.log
```

## Scripts

```bash
npm run dev
npm run build
npm start
```

`dev` and `start` both launch the app through `nodemon` with `ts-node` and `dotenv/config`; `build` compiles TypeScript with `tsc`.

## API

### `GET /`

Returns a simple health-style message:

```text
Hello World From Job Hunter API
```

### `GET /v2/generate/:resumeId`

Generates a PDF for the resume document with the given MongoDB ObjectId.

- **Response type:** `application/pdf`
- **Download name:** `resume.pdf`
- **Source collection:** `resumes`

## Resume data shape

The generator expects resume documents with fields like:

- `name`
- `phNumber`
- `emailId`
- `portfolioLink`
- `linkedinLink`
- `githubLink`
- `summary`
- `skills`
- `projectName`
- `education`
- `experience`

## Project structure

```text
src/
├── controllers/
├── database/
├── environment/
├── error/
├── interface/
├── middleware/
├── models/
├── routes/
├── services/
├── utils/
└── app.ts
```
