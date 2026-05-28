# Diabetes AI Application

## Project Summary
This application is a Python Flask-based diabetes prediction system. It trains a machine learning model on clinical data, provides a web interface for input, and stores prediction history in MongoDB.

## Features

- Prediction of diabetes risk using 8 clinical features.
- Web interface for submitting patient data.
- Probability-based risk assessment.
- MongoDB persistence for prediction records.
- Prediction history endpoint.

## Prerequisites

- Python 3.10 or later.
- MongoDB running on `mongodb://localhost:27017`.
- Recommended system packages for Python dependency installation.

## Installation

1. Change to the application directory:

   ```bash
   cd diabetes_ai_app
   ```

2. Create a virtual environment:

   ```bash
   python3 -m venv venv
   ```

3. Activate the environment:

   ```bash
   source venv/bin/activate
   ```

4. Install the required packages:

   ```bash
   pip install --upgrade pip
   pip install -r requirements.txt
   ```

## Model Training

Train the machine learning model and generate the serialized artifacts required by the application:

```bash
python3 model/train_model.py
```

This script performs the following tasks:

- Loads `data/diabetes.csv`.
- Replaces invalid zero values for clinical measurements with feature means.
- Applies mean imputation for any remaining missing values.
- Splits the dataset into training and test sets.
- Standardizes feature values using `StandardScaler`.
- Trains both `LogisticRegression` and `RandomForestClassifier`.
- Selects the model with the highest test accuracy.
- Saves the selected model to `model/diabetes_model.pkl`.
- Saves the feature scaler to `model/scaler.pkl`.
- Optionally generates a feature importance plot for the random forest model.

## Running the Application

Start the Flask application after training the model:

```bash
python3 app/app.py
```

Then open the browser at:

```text
http://127.0.0.1:5000
```

## Application Endpoints

- `GET /` : Serves the application user interface.
- `POST /predict` : Accepts form data, performs prediction, and returns JSON with prediction results.
- `GET /history` : Returns the 20 most recent prediction records from MongoDB.

## Data Input Fields

The prediction form uses the following input fields:

- `pregnancies`
- `glucose`
- `blood_pressure`
- `skin_thickness`
- `insulin`
- `bmi`
- `pedigree`
- `age`

## MongoDB Persistence

Prediction records are stored in MongoDB when a connection is available. The application uses the database `diabetes_db` and the collection `predictions`.

Each stored record includes:

- Timestamp
- Input feature values
- Predicted class (`Diabetes` or `No Diabetes`)
- Prediction probability
- Risk level

## Troubleshooting

- If the application cannot load the model, confirm that `model/train_model.py` completed successfully and that `model/diabetes_model.pkl` and `model/scaler.pkl` exist.
- If MongoDB is unavailable, the application will continue to serve predictions but will not store history.
- If `scikit-learn` takes time to install, ensure your environment has the required build tools.
- Verify MongoDB availability with:

  ```bash
  mongosh --eval "db.runCommand({ ping: 1 })"
  ```

## Project Structure

- `app/app.py` : Flask routes, prediction logic, and persistence.
- `model/train_model.py` : Data preprocessing, training, evaluation, and model serialization.
- `data/diabetes.csv` : Training dataset.
- `static/` : JavaScript and CSS assets.
- `templates/` : HTML templates for the user interface.
- `model/` : Generated model and scaler files.
