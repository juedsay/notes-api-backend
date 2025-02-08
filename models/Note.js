const { Schema, model } = require("mongoose");

const noteSchema = new Schema({
    content: String,
    date: Date,
    important: Boolean,
  });
  
  noteSchema.set("toJSON", {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id;
      delete returnedObject._id;
      delete returnedObject.__v;
    },
  });

  const Note = model("Note", noteSchema);

  // const note = new Note({
  //   content: "Mongo DB first Note",
  //   date: new Date(),
  //   important: true,
  // });
  
//   note.save()
//     .then((result) => {
//       console.log(result);
//       mongoose.connection.close();
//     })
//     .catch((error) => {
//       console.log(error);
//     });
  
  module.exports = Note;