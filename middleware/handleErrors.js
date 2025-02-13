const ERROR_HANDLERS = {
  CastError: (res) => res.status(400).send({ error: "id used is malformed" }),

  ValidateError: (res, { message }) => res.status(409).send({ error: message }),

  JsonWebToken: (res) =>
    res.status(401).json({ error: "Token missing or invalid" }),

  TokenExpired: (res) => res.status(401).json({ error: "Token expired" }),

  MongoServerError: (res, error) => {
    if (error.code === 11000) {
      return res.status(409).json({ error: "Username is already used" });
    }
    res.status(500).json({ error: "Database error" });
  },

  ValidationErrorMongo: (res, error) => {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: 'Validation failed: ' + error.message });
    }
    res.status(500).json({ error: "Database error" });
  },

  defaultError: (res, error) => {
    console.error(error.name);
    res.status(500).end();
  },
};

module.exports = (error, req, res, next) => {
  const handler = ERROR_HANDLERS[error.name] || ERROR_HANDLERS.defaultError;

  handler(res, error);
};
