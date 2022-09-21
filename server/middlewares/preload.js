const { getById } = require("../services/car");

module.exports = () => async (req, res, next) => {
  const id = req.params.id;

  try {
    const item = await getById(id).lean();
    item.ownerId = item.owner;
    res.locals.item = item;
    next();
  } catch (err) {
    res.status(404).send({ message: "Record not found" });
  }
};
