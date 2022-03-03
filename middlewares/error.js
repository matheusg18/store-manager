module.exports = (err, _req, res, _next) => {
  if (err.isJoi) {
    const [status, message] = err.details[0].message.split('|');
    return res.status(+status).json({ message });
  }

  const statusByErrorName = { notFound: 404, conflict: 409, unprocessableEntity: 422 };

  res.status(statusByErrorName[err.name] || 500).json({ message: err.message });
};
