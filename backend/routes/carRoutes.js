const express = require('express');
const {
  addCar,
  getUserCars,
  searchCars,
  getCarDetails,
  updateCar,
  deleteCar,
} = require('../controllers/carController');
const authMiddleware = require('../middlewares/authMiddleware.js');
const upload = require('../middlewares/multer');

const router = express.Router();

// Routes
router.post('/', authMiddleware, upload.array('images', 10), addCar); // Add a car
router.get('/', authMiddleware, getUserCars); // Get all cars for a user
router.get('/search', authMiddleware, searchCars); // Global search
router.get('/:id', authMiddleware, getCarDetails); // Get car details
router.put('/:id', authMiddleware, upload.array('images', 10), updateCar); //update car
router.delete('/:id', authMiddleware, deleteCar); // Delete a car


module.exports = router;
