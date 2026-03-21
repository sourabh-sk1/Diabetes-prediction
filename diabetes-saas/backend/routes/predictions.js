const express = require('express');
const { protect } = require('../middleware/auth');
const {
  createPrediction,
  getPredictions,
  getStats,
  deletePrediction
} = require('../controllers/predictionController');

const router = express.Router({ mergeParams: true });

// All routes require auth
router.use(protect);

router.route('/').post(createPrediction).get(getPredictions);
router.route('/stats').get(getStats);
router.route('/:id').delete(deletePrediction);

module.exports = router;

