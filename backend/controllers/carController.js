const Car = require('../models/Car');
const mongoose = require('mongoose');
const cloudinary = require('../config/cloudinary');

// Add a Car
const addCar = async (req, res) => {
  try {
    const { title, description, tags } = req.body;

    // Extract image URLs from uploaded files
    const images = req.files.map((file) => file.path);

    const newCar = new Car({
      title,
      description,
      tags,
      images,
      user: req.user.userId, // Retrieved from middleware
    });

    await newCar.save();
    res.status(201).json({ message: 'Car added successfully', car: newCar });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get All Cars for a User
const getUserCars = async (req, res) => {
  try {
    const cars = await Car.find({ user: req.user.userId });
    res.status(200).json(cars);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Global Search
const searchCars = async (req, res) => {
  const { keyword } = req.query;
  const userId = req.user.id; // Extract user from auth middleware

  try {
    const cars = await Car.find({
      userId, // Only fetch cars belonging to the logged-in user
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
        { "tags.car_type": { $regex: keyword, $options: "i" } },
        { "tags.company": { $regex: keyword, $options: "i" } },
        { "tags.dealer": { $regex: keyword, $options: "i" } },
      ],
    });
    res.json(cars);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get Car Details
const getCarDetails = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }
    res.status(200).json(car);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Update a Car
const updateCar = async (req, res) => {

  try {
    const { id } = req.params;
    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid car ID' });
      }
    const { title, description, tags, removeImages } = req.body;

    // Find the car by ID and ensure the logged-in user owns it
    const car = await Car.findById(id);
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }
    if (car.user.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Unauthorized to update this car' });
    }

    // Update text fields (title, description, tags)
    if (title) car.title = title;
    if (description) car.description = description;
    if (tags) car.tags = tags;

    // Remove images if specified
    if (removeImages) {
      const imagesToRemove = Array.isArray(removeImages) ? removeImages : [removeImages];
      car.images = car.images.filter((image) => !imagesToRemove.includes(image));
    }

    // Add new images from uploaded files
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((file) => file.path);
      if (car.images.length + newImages.length > 10) {
        return res
          .status(400)
          .json({ message: 'You can have a maximum of 10 images per car' });
      }
      car.images = car.images.concat(newImages);
    }

    await car.save();
    res.status(200).json({ message: 'Car updated successfully', car });
    } catch (err) {
    console.error('Error during update:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Delete a Car
const deleteCar = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate the ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid car ID' });
    }

    // Find the car
    const car = await Car.findById(id);
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    // Check ownership
    if (car.user.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Unauthorized to delete this car' });
    }

    // Delete associated images from Cloudinary
    const deleteImagePromises = car.images.map((image) => {
      const publicId = image.split('/').pop().split('.')[0]; // Extract public ID
      return cloudinary.uploader.destroy(`car_management_app/${publicId}`);
    });
    await Promise.all(deleteImagePromises);

    // Delete the car
    await car.deleteOne();

    res.status(200).json({ message: 'Car deleted successfully' });
  } catch (err) {
    console.error('Error during deletion:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { addCar, getUserCars, searchCars, getCarDetails, updateCar, deleteCar };