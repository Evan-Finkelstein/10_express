// eslint-disable-next-line no-unused-vars
module.exports = (err, req, res, next) => {
  const status = err.status || 404;

  res.status(status);

  console.log(err);

  res.send({
    message: err.message,
    status
  });
};
