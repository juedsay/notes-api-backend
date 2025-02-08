// Middleware for handling duplicate key errors
module.exports = function handleDuplicateError(error, doc, next) {
  if (error.name === "MongoServerError" && error.code === 11000) {
    next(new Error("El nombre de usuario ya está en uso."));
  } else {
    next(error);
  }
};
