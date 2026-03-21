# Diabetes AI App with MongoDB

## Features
- ML model predicts diabetes risk from 8 features
- Web UI for predictions
- Predictions persisted to MongoDB (`diabetes_db.predictions`)
- History API endpoint

## Quick Start
1. MongoDB running (yes: mongodb-community@7.0)
2. `cd diabetes_ai_app`
3. `python3 -m venv venv`
4. `source venv/bin/activate`
5. `pip install --upgrade pip`
6. `pip install -r requirements.txt` (wait, compiling sklearn)
7. `python3 model/train_model.py`
8. `python3 app/app.py`
9. Open http://127.0.0.1:5000

## Endpoints
- GET / - Web UI
- POST /predict - Submit form data, returns JSON
- GET /history - Last 20 predictions from MongoDB

## Troubleshooting
- sklearn compile slow? `brew install libomp`
- Model missing? Run training script
- MongoDB: `mongosh diabetes_db` to view data
