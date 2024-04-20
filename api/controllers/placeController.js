const Place = require("../models/Place");
const cloudinary = require("cloudinary").v2;

// Adds a place in the DB
exports.addPlace = async (req, res) => {
  try {
    const userData = req.user;
    const {
      title,
      address,
      addedPhotos,
      description,
      perks,
      extraInfo,
      maxGuests,
      price,
      category,
      rental,
      selling,
      religion,
    } = req.body;

    const place = await Place.create({
      owner: userData.id,
      title,
      address,
      photos: addedPhotos,
      description,
      perks,
      extraInfo,
      maxGuests,
      price,
      category,
      rental,
      selling,
      religion,
    });

    res.status(200).json({
      message: "Place added successfully",
      place,
    });
  } catch (err) {
    res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
};

// Returns user specific places
exports.userPlaces = async (req, res) => {
  try {
    const userData = req.user;
    const userId = userData.id;
    const places = await Place.find({ owner: userId });
    res.status(200).json(places);
  } catch (err) {
    res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
};

// Updates a place
exports.updatePlace = async (req, res) => {
  try {
    const userData = req.user;
    const userId = userData.id;
    const {
      id,
      title,
      address,
      addedPhotos,
      description,
      perks,
      extraInfo,
      maxGuests,
      price,
      category,
      rental,
      selling,
      religion,
    } = req.body;

    console.log(req.body);

    const place = await Place.findById(id);

    if (!place) {
      return res.status(404).json({ message: "Place not found" });
    }

    if (userId !== place.owner.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    place.set({
      title,
      address,
      photos: addedPhotos,
      description,
      perks,
      extraInfo,
      maxGuests,
      price,
      category,
      rental,
      selling,
      religion,
    });

    await place.save();

    res.status(200).json({
      message: "Place updated successfully",
      place,
    });
  } catch (err) {
    res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
};

exports.deletePlace = async (req, res) => {
  try {
    const { id } = req.params;
    // Find the place by ID
    const place = await Place.findById(id);
    if (!place) {
      return res.status(404).json({ message: "Place not found" });
    }

    // Delete the associated images from Cloudinary
    for (const photoUrl of place.photos) {
      const publicId = photoUrl.split("/").pop().split(".")[0]; // Extract public ID from the URL
      await cloudinary.uploader.destroy(publicId);
    }

    // Delete the place from the database
    await Place.findByIdAndDelete(id);

    res.status(200).json({ message: "Place deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Returns all the places in DB
exports.getPlaces = async (req, res) => {
  try {
    const places = await Place.find();
    res.status(200).json({
      places,
    });
  } catch (err) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

// Returns single place, based on passed place id
exports.singlePlace = async (req, res) => {
  try {
    const { id } = req.params;
    const place = await Place.findById(id);
    if (!place) {
      return res.status(400).json({
        message: "Place not found",
      });
    }
    res.status(200).json({
      place,
    });
  } catch (err) {
    res.status(500).json({
      message: "Internal serever error",
    });
  }
};

// Search Places in the DB
exports.searchPlaces = async (req, res) => {
  try {
    const searchword = req.params.key;

    if (searchword === "") return res.status(200).json(await Place.find());

    const searchMatches = await Place.find({
      address: { $regex: searchword, $options: "i" },
    });

    res.status(200).json(searchMatches);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Internal serever error 1",
    });
  }
};
