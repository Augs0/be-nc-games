const allEndpoints = require('../endpoints.json');

const getEndpoints = async (req, res, next) => {
  try {
    const allEndpoint = await allEndpoints;
    res.status(200).send(allEndpoint);
  } catch (error) {
    next(error);
  }
};

module.exports = { getEndpoints };
