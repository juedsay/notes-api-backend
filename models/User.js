const { Schema, model } = require("mongoose");
// const handleErrors = require("../middleware/handleErrors");

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    lowercase: true,
    validate: {
      validator: function (v) {
        return (
          !/\s/.test(v) && // No permite espacios
          !/[&=_'<>+,-]/.test(v) && // No permite caracteres especiales prohibidos
          !/\.\./.test(v) // No permite dos puntos seguidos
        );
      },
      message:
        "Username cannot contain spaces or special characters (&, =, _, ', -, <, >, +, ,, .., tildes).",
    },
  },
  email: {
    type: String,
    required: false,
    unique: true,  // Asegura que el email sea único
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, "Invalid email format"], // Validación del formato del email
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
// userSchema.post("save", handleDuplicateError);

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.__v;

    delete returnedObject.passwordHash;
  },
});

const User = model("User", userSchema);

module.exports = User;