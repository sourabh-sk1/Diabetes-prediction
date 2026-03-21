# Run Diabetes AI App (with MongoDB)

## Status
- [x] MongoDB running (`brew services list | grep mongodb`)
- [ ] Dependencies installed (pip install running, wait for completion)
- [ ] Model trained (`python3 model/train_model.py`)
- [ ] App running (`python3 app/app.py`)

## Quick Start
1. Wait for pip install to complete in terminal
2. `source venv/bin/activate`
3. `python3 model/train_model.py` (generates model/*.pkl)
4. `python3 app/app.py`
5. Open http://127.0.0.1:5000

## Features
- Diabetes prediction ML model
- Predictions saved to MongoDB (`diabetes_db.predictions`)
- History API: http://127.0.0.1:5000/history

Progress: Waiting for pip install...
