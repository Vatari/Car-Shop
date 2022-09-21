const {
  model,
  Schema,
  Types: { ObjectId },
} = require("mongoose");

const itemSchema = new Schema({
  brand: { type: String, required: [true, "Field brand is required"] },
  model: { type: String, required: true },

  description: {
    type: String,
    required: true,
    minlength: [8, "Description must be at least 8 characters"],
  },
  year: {
    type: Number,
    required: true,
    min: [1950, "Year must be between 1950 and 2050"],
    max: [2050, "Year must be between 1950 and 2050"],
  },
  imageUrl: { type: String, required: true },
  price: { type: Number, required: true },
  phone: { type: String, required: true },
  owner: { type: ObjectId, ref: "User" },
});

const Item = model("Item", itemSchema);

module.exports = Item;
