import os
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from flask import Flask, render_template, request, jsonify, send_from_directory
import pickle
import numpy as np
from datetime import datetime
import pymongo

# Add project root to path for templates/static
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

app = Flask(__name__, template_folder=os.path.join(PROJECT_ROOT, 'templates'), 
            static_folder=os.path.join(PROJECT_ROOT, 'static'), 
            static_url_path='')

# Load the trained model and scaler
model_path = os.path.join(PROJECT_ROOT, 'model', 'diabetes_model.pkl')
scaler_path = os.path.join(PROJECT_ROOT, 'model', 'scaler.pkl')

try:
    with open(model_path, 'rb') as f:
        model = pickle.load(f)
    with open(scaler_path, 'rb') as f:
        scaler = pickle.load(f)
    print("Model and scaler loaded successfully from project root.")
    
    # MongoDB connection
    try:
        client = pymongo.MongoClient("mongodb://localhost:27017/")
        client.admin.command('ping')
        db = client["diabetes_db"]
        predictions_collection = db["predictions"]
        print("MongoDB connected successfully.")
    except Exception as e:
        print(f"WARNING: MongoDB connection failed: {e}. Continuing without DB.")
        client = None
        db = None
        predictions_collection = None

except FileNotFoundError:
    print("ERROR: Please run 'python model/train_model.py' first to generate model files.")
    model = None
    scaler = None
    client = None
    db = None
    predictions_collection = None

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    if model is None or scaler is None:
        return jsonify({'error': 'Model not trained. Run python model/train_model.py first.'}), 500

    try:
        # Get form data
        data = [
            float(request.form['pregnancies']),
            float(request.form['glucose']),
            float(request.form['blood_pressure']),
            float(request.form['skin_thickness']),
            float(request.form['insulin']),
            float(request.form['bmi']),
            float(request.form['pedigree']),
            float(request.form['age'])
        ]
        
        # Convert to numpy array and scale
        input_array = np.array(data).reshape(1, -1)
        input_scaled = scaler.transform(input_array)
        
        # Predict
        prediction = model.predict(input_scaled)[0]
        probability = model.predict_proba(input_scaled)[0][1] * 100  # Probability of diabetes (class 1)
        
        # Determine risk level
        if probability < 40:
            risk_level = 'Low Risk'
            color = 'green'
        elif probability < 70:
            risk_level = 'Moderate Risk'
            color = 'orange'
        else:
            risk_level = 'High Risk'
            color = 'red'
        
        result = {
            'prediction': 'Diabetes' if prediction == 1 else 'No Diabetes',
            'probability': f"{probability:.1f}%",
            'risk_level': risk_level,
            'color': color,
            'bar_width': min(probability, 100)
        }
        
        # Store in MongoDB if available
        if predictions_collection is not None:
            try:
                prediction_record = {
                    "timestamp": datetime.now(),
                    "input_data": {
                        "pregnancies": data[0],
                        "glucose": data[1],
                        "blood_pressure": data[2],
                        "skin_thickness": data[3],
                        "insulin": data[4],
                        "bmi": data[5],
                        "pedigree": data[6],
                        "age": data[7]
                    },
                    "prediction": result['prediction'],
                    "probability": float(probability),
                    "risk_level": risk_level
                }
                predictions_collection.insert_one(prediction_record)
                print("Prediction saved to MongoDB.")
            except Exception as db_err:
                print(f"DB save error: {db_err}")
        
        return jsonify(result)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/history')
def history():
    if predictions_collection is None:
        return jsonify({'error': 'MongoDB not available'}), 500
    try:
        recent_predictions = list(predictions_collection.find().sort("timestamp", -1).limit(20))
        for pred in recent_predictions:
            pred['_id'] = str(pred['_id'])
        return jsonify(recent_predictions)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='127.0.0.1', port=5000)

