const { z } = require("zod");

exports.signupValidator = z.object({
  username: z
    .string()
    .min(8, "A username must have more than 8 letters")
    .max(16, "A username must have more than 16 letters"),
  email: z.string().email({ message: "Invalid email address" }),
  about: z.optional(
    z
      .string()
      .min(0, "A password must have more than 8 letters")
      .max(16, "A password must have more than 16 letters")
  ),
  password: z
    .string()
    .min(8, "A password must have more than 8 letters")
    .max(16, "A password must have more than 16 letters"),
  passwordConfirm: z
    .string()
    .min(8, "A password must have more than 8 letters")
    .max(16, "A password must have more than 16 letters"),
});

exports.signinValidator = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, "A password must have more than 8 letters")
    .max(16, "A password must have more than 16 letters"),
});
