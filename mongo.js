const mongoose = require("mongoose");

const {MONGO_DB_URI, MONGO_DB_URI_TEST, NODE_ENV} = process.env
const connectionString = NODE_ENV === 'test' ? MONGO_DB_URI_TEST : MONGO_DB_URI

// Conexion a la base de datos
mongoose
  .connect(connectionString)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log("Error connecting to MongoDB:", error.message);
  });

  process.on('uncaughtException', () => {
    mongoose.connection.disconnect()
  });