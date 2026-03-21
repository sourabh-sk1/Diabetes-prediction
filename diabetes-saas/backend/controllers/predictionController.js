const Prediction = require('../models/Prediction');
const User = require('../models/User');
const { predictDiabetes } = require('../utils/mlProxy');

// @desc    Create prediction
// @route   POST /api/predictions
// @access  Private
const createPrediction = async (req, res) => {
  try {
    const userId = req.user.id;
    const inputData = req.body;

    // Validate input data
    const requiredFields = ['pregnancies', 'glucose', 'bloodPressure', 'skinThickness', 'insulin', 'bmi', 'pedigree', 'age'];
    for (const field of requiredFields) {
      if (typeof inputData[field] !== 'number' || inputData[field] < 0) {
        return res.status(400).json({
          success: false,
          error: `Invalid ${field}: must be non-negative number`
        });
      }
    }

    // Call ML service
    const mlResult = await predictDiabetes(inputData);

    // Create prediction record
    const prediction = await Prediction.create({
      user: userId,
      inputData,
      prediction: mlResult.prediction,
      probability: parseFloat(mlResult.probability),
      riskLevel: mlResult.risk_level
    });

    // Increment user prediction count
    await User.findByIdAndUpdate(userId, { $inc: { totalPredictions: 1 } });

    // Populate user for response
    const populatedPrediction = await Prediction.findById(prediction._id).populate('user', 'name email avatar');

    res.status(201).json({
      success: true,
      data: populatedPrediction
    });
  } catch (error) {
    console.error('Create prediction error:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get user predictions
// @route   GET /api/predictions
// @access  Private
const getPredictions = async (req, res) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const riskLevel = req.query.riskLevel;
    const skip = (page - 1) * limit;

    let query = { user: userId };
    if (riskLevel) query.riskLevel = riskLevel;

    const predictions = await Prediction.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('user', 'name email');

    const total = await Prediction.countDocuments(query);

    res.json({
      success: true,
      count: predictions.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: predictions
    });
  } catch (error) {
    console.error('Get predictions error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error fetching predictions'
    });
  }
};

// @desc    Get dashboard stats
// @route   GET /api/predictions/stats
// @access  Private
const getStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const totalPredictions = await Prediction.countDocuments({ user: userId });
    const recent = await Prediction.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('user', 'name');
    
    const riskDistribution = await Prediction.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: '$riskLevel',
          count: { $sum: 1 },
          avgProbability: { $avg: '$probability' }
        }
      }
    ]);

    res.json({
      success: true,
      stats: {
        totalPredictions,
        riskDistribution: riskDistribution.map(item => ({
          name: item._id,
          count: item.count,
          avgProbability: item.avgProbability.toFixed(1)
        })),
        recent
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error fetching stats'
    });
  }
};

// @desc    Delete prediction
// @route   DELETE /api/predictions/:id
// @access  Private
const deletePrediction = async (req, res) => {
  try {
    const userId = req.user.id;
    const predictionId = req.params.id;

    const prediction = await Prediction.findOneAndDelete({
      _id: predictionId,
      user: userId
    });

    if (!prediction) {
      return res.status(404).json({
        success: false,
        error: 'Prediction not found'
      });
    }

    res.json({
      success: true,
      message: 'Prediction deleted successfully'
    });
  } catch (error) {
    console.error('Delete prediction error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error deleting prediction'
    });
  }
};

module.exports = {
  createPrediction,
  getPredictions,
  getStats,
  deletePrediction
};

