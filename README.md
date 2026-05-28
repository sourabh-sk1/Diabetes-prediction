# Diabetes Prediction Repository

## Repository Overview
This repository contains two related diabetes prediction projects:

- `diabetes_ai_app`: A Python Flask application that trains a machine learning model, serves a prediction interface, and stores prediction history in MongoDB.
- `diabetes-saas`: A SaaS-style implementation with a Node.js backend and a React frontend for authentication, data collection, and prediction workflows.

The repository also includes sample diabetes data files used for training and validation.

## Contents

- `diabetes.csv`: A diabetes dataset with patient diagnostic measurements.
- `diabetes_ai_app/`: A standalone Python application for training and serving a prediction model.
- `diabetes-saas/`: A full-stack implementation built with Express, React, MongoDB, and authentication.

## Key Features

- Trains a diabetes prediction model using structured medical data.
- Scales input features and persists prediction history.
- Delivers a browser-based interface for submitting patient data.
- Supports data persistence using MongoDB.
- Includes a separate SaaS-style codebase for API and frontend workflows.

## `diabetes_ai_app` Summary

The Flask application in `diabetes_ai_app` implements the following behavior:

- Formats input fields for 8 diabetes-related features.
- Applies preprocessing to measurement inputs.
- Uses a trained classification model to predict diabetes risk.
- Returns probability and risk-level details.
- Stores prediction records in `diabetes_db.predictions` when MongoDB is available.

## `diabetes-saas` Summary

The `diabetes-saas` folder contains two projects:

- `backend/`: An Express API supporting user authentication, prediction record management, and integration with MongoDB.
- `frontend/`: A React application built with Tailwind CSS that communicates with the backend services.

## Prerequisites

- Python 3.10+ for `diabetes_ai_app`
- Node.js 18+ and npm for `diabetes-saas`
- MongoDB running on `mongodb://localhost:27017`

## Python App: Setup and Run

1. Navigate into the application directory:

   ```bash
   cd diabetes_ai_app
   ```

2. Create and activate a virtual environment:

   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```

3. Install Python dependencies:

   ```bash
   pip install --upgrade pip
   pip install -r requirements.txt
   ```

4. Train the model and generate artifacts:

   ```bash
   python3 model/train_model.py
   ```

5. Start the Flask application:

   ```bash
   python3 app/app.py
   ```

6. Open the app in a browser:

   ```text
   http://127.0.0.1:5000
   ```

## Node.js SaaS App: Setup and Run

### Backend

1. Change to the backend directory:

   ```bash
   cd diabetes-saas/backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the backend service:

   ```bash
   npm run dev
   ```

### Frontend

1. Change to the frontend directory:

   ```bash
   cd diabetes-saas/frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the frontend development server:

   ```bash
   npm start
   ```

## Application Architecture

### `diabetes_ai_app`

- `app/app.py`: Flask application logic for routing, prediction, and MongoDB persistence.
- `model/train_model.py`: Data preprocessing, model training, evaluation, and serialization.
- `data/diabetes.csv`: Input dataset for model training.
- `static/` and `templates/`: Frontend assets for the Flask UI.

### `diabetes-saas`

- `backend/`: API, route handling, authentication, and database access.
- `frontend/`: React-based user interface, styling, and API integration.

## Troubleshooting

- If training fails because `scikit-learn` is compiling, ensure build tools are installed on your system.
- If the Flask app cannot load the model, run `python3 model/train_model.py` first.
- If MongoDB is not available, predictions still work locally, but persistence and history retrieval will be disabled.
- Confirm MongoDB is running with:

  ```bash
  mongosh --eval "db.runCommand({ ping: 1 })"
  ```

## Notes

- The Flask application uses a saved model and scaler stored as `model/diabetes_model.pkl` and `model/scaler.pkl`.
- The dataset preprocessing replaces invalid zero values for clinical measurements with feature means.
- The SaaS implementation is separate from the Flask app and is intended as a full-stack prototype.
