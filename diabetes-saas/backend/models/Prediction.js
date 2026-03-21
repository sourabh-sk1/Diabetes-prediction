const mongoose = require('mongoose');

const predictionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  inputData: {
    pregnancies: {
      type: Number,
      required: true,
      min: 0
    },
    glucose: {
      type: Number,
      required: true,
      min: 0
    },
    bloodPressure: {
      type: Number,
      required: true,
      min: 0
    },
    skinThickness: {
      type: Number,
      required: true,
      min: 0
    },
    insulin: {
      type: Number,
      required: true,
      min: 0
    },
    bmi: {
      type: Number,
      required: true,
      min: 0
    },
    pedigree: {
      type: Number,
      required: true,
      min: 0
    },
    age: {
      type: Number,
      required: true,
      min: 0
    }
  },
  prediction: {
    type: String,
    enum: ['Diabetes', 'No Diabetes'],
    required: true
  },
  probability: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  riskLevel: {
    type: String,
    enum: ['Low Risk', 'Moderate Risk', 'High Risk'],
    required: true
  }
}, {
  timestamps: true
});

// Index for efficient queries
predictionSchema.index({ user: 1, createdAt: -1 });
predictionSchema.index({ user: 1, riskLevel: 1 });

module.exports = mongoose.model('Prediction', predictionSchema);

