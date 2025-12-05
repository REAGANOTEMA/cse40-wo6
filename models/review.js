const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    name: {
      type: String,
      required: [true, "Reviewer name is required"],
      trim: true,
    },

    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, "Rating is required"],
    },

    comment: {
      type: String,
      required: [true, "Comment is required"],
    },

    createdBy: {
      type: String,
      default: "Reagan Otema",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Review", reviewSchema);
