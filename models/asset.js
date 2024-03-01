const mongoose = require('mongoose')

const AssetSchema = new mongoose.Schema(
  {
    assetId: {
      type: Number,
      unique: true,
    },
    name: String,
    description: String,
    asset_contract: {
      address: String,
      name: String,
      owner: Number,
      schema_name: String,
      symbol: String,
    },
    token_id: String,
  },
  { timestamps: true }
);

mongoose.model("Asset", AssetSchema);
