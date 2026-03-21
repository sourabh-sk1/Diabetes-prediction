const axios = require('axios');

const ML_API_URL = process.env.ML_API_URL || 'http://localhost:5000/predict';

const predictDiabetes = async (inputData) => {
  try {
    const response = await axios.post(ML_API_URL, inputData, {
      timeout: 10000,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });

    if (response.data.error) {
      throw new Error(response.data.error);
    }

    return response.data;
  } catch (error) {
    console.error('❌ ML Prediction error:', error.message);
    throw new Error('ML service unavailable. Please ensure Flask app is running on port 5000.');
  }
};

module.exports = { predictDiabetes };

