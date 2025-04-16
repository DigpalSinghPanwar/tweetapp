const { z } = require("zod");

exports.createTweetValidator = z.object({
  description: z
    .string()
    .min(1, "a tweet must have atleast a letter.")
    .max(280, "a tweet cannot exceed 280 characters."),
});
