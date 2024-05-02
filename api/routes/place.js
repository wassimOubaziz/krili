const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middlewares/user");

const {
  addPlace,
  getPlaces,
  updatePlace,
  deletePlace,
  singlePlace,
  addComment,
  deleteComment,
  userPlaces,
  searchPlaces,
  currentUser,
} = require("../controllers/placeController");

router.route("/").get(getPlaces);

// Protected routes (user must be logged in)
router.route("/add-places").post(isLoggedIn, addPlace);
router.route("/user-places").get(isLoggedIn, userPlaces);
router.route("/update-place").put(isLoggedIn, updatePlace);
router.route("/delete-place/:id").delete(isLoggedIn, deletePlace);

// Get the current user that logged in
router.route("/user").get(isLoggedIn, currentUser);

// add remove a comment to a place
router.route("/:id/comments").post(isLoggedIn, addComment);
router.route("/:id/comments/:commentId").delete(isLoggedIn, deleteComment);

// Not Protected routed but sequence should not be interfered with above routes
router.route("/:id").get(singlePlace);
router.route("/search/:key").get(searchPlaces);

module.exports = router;
