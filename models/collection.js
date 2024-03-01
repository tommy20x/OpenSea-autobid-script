const mongoose = require('mongoose')

const CollectionSchema = new mongoose.Schema(
  {
    name: String,
    banner_image_url: String,
    slug: {
      type: String,
      unique: true,
    },
  },
  { timestamps: true }
);

mongoose.model("Collection", CollectionSchema);
