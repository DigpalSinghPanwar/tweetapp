const mongoose = require("mongoose");

const tweetSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: [true, "a tweet must have an schema"],
      minLength: [1, "a tweet must have atleast a letter."],
      maxLength: [280, "a tweet cannot exceed 280 characters."],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    likes: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
    replies: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        comment: {
          type: String,
          required: [true, "a tweet must have an comment"],
          minLength: [1, "a tweet must have atleast a letter."],
          maxLength: [280, "a tweet cannot exceed 280 characters."],
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
  {
    timestamps: true,
  }
);

const Tweet = mongoose.model("Tweet", tweetSchema);
module.exports = Tweet;
