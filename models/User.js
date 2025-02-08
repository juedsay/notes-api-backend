const { Schema, model } = require("mongoose");
const handleDuplicateError = require("../middleware/handleDuplicateError");

const userSchema = new Schema({
  username: {
    type: String,
    unique: true, // Ensures that the field is always unique
    required: true,
  },
  name: String,
  passwordHash: String,
  notes: [
    {
      type: Schema.Types.ObjectId,
      ref: "Note",
    },
  ],
});

// Middleware for handling duplicate key errors imported
userSchema.post("save", handleDuplicateError);

userSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.passwordHash;
  },
});

const User = model("User", userSchema);

module.exports = User;

module.exports = User;
