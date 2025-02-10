const ERROR_HANDLERS = {
  'CastError': res => res.status(400).send({ error: 'id used is malformed'}),
  'ValidateError': (res, error) => res.status(400).send({ error: error.message }),
  'JsonWebToken': res => res.status(401).json({ error: 'Token missing or invalid' }),
  'TokenExpired': res => res.status(401).json({ error: 'Token expired' }),
  'defaultError': (res, error) => {
    console.error(error.name)
    res.status(500).end()
  }
};


module.exports = (error, req, res, next) => {
  const handler = ERROR_HANDLERS[error.name] || ERROR_HANDLERS.defaultError

  handler(res, error)
};
