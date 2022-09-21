const Item = require("../models/Item");

async function getAll(query) {
  if (query) {
    const userId = query.split("=")[1].slice(1, -1);
    const search = query.split("=")[0];
    const searchParams = query.split("=")[1];

    if (search == "year") {
      return Item.find({ year: searchParams });
    } else {
      return Item.find({ owner: userId });
    }
  }
  return Item.find({});
}

async function getByYear(query) {
  if (query) {
    const search = query.split("=")[1].slice(1, -1);
    return Item.find({ year: search });
  }
  return Item.find({});
}

function getById(id) {
  return Item.findById(id);
}

async function create(item) {
  const result = new Item(item);

  await result.save();
  return result;
}

async function update(id, item) {
  const existing = await Item.findById(id);

  existing.brand = item.brand;
  existing.model = item.model;
  existing.description = item.description;
  existing.year = item.year;
  existing.imageUrl = item.imageUrl;
  existing.price = item.price;
  existing.phone = item.phone;

  await existing.save();
  return existing;
}

async function deleteById(id) {
  await Item.findByIdAndDelete(id);
}

module.exports = {
  create,
  getAll,
  getById,
  update,
  deleteById,
  getByYear,
};
