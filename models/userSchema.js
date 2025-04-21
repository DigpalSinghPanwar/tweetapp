const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "A user must have an username"],
      minLength: [8, "A username must have more than 8 letters"],
      maxLength: [16, "A username must have less than 16 letters"],
      unique: [true, "A username must be unique"],
    },
    about: {
      type: String,
      minLength: [0, "about must have atleast a letter."],
      maxLength: [150, "a tweet cannot exceed 150 characters."],
    },
    email: {
      type: String,
      required: [true, "A user must have an email"],
      unique: [true, "A email must be unique"],
      lowercase: true,
    },
    role: {
      type: String,
      enum: ["user", "admin", "super-admin"],
      default: "user",
    },
    password: {
      type: String,
      minLength: [8, "A password must contain 8 characters"],
      maxLength: [16, "A username must have less than 16 letters"],
      select: false,
    },
    passwordConfirm: {
      type: String,
      minLength: [8, "A password must contain 8 characters"],
      maxLength: [16, "A username must have less than 16 letters"],
      select: false,
      validate: {
        validator: function (el) {
          return el === this.password;
        },
        message: "Passwords are not the same",
      },
    },
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined;
  next();
});

userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model("User", userSchema);
module.exports = User;
