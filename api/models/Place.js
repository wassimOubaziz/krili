const mongoose = require("mongoose");

const placeSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.ObjectId,
    ref: "user",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  photos: [{ type: String }],
  description: {
    type: String,
    required: true,
  },
  perks: [{ type: String }],
  extraInfo: {
    type: String,
  },
  maxGuests: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ["cars", "bicycles", "trips", "houses"],
  },
  rental: {
    type: Boolean,
    default: false,
  },
  selling: {
    type: Boolean,
    default: false,
  },
  religion: {
    type: String,
    enum: ["islamic", "others"],
  },
});

const Place = mongoose.model("Place", placeSchema);

module.exports = Place;
