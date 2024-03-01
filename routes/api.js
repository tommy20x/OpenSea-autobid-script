const express = require('express')
const mongoose = require('mongoose');
const Collection = mongoose.model('Collection');
const Asset = mongoose.model('Asset');
const opensea = require('../services/opensea')
const router = express.Router();

router.get('/collections', async (req, res) => {
  let offset = 0, limit = 300;
  while (true) {
    const result = await opensea.collections(offset, limit);
    if (!result || result.length <= 0) {
      break;
    }

    const models = result.map((collect) => ({
      updateOne: {
        filter: {
          slug: collect.slug,
        },
        update: {
          $set: collect,
        },
        upsert: true
      }
    }))

    try {
      await Collection.bulkWrite(models);
    } catch (err) {
      console.error(err);
    }

    offset += result.length;
  }
  res.json({ success: true })
});

router.get('/collection/assets/update', async (req, res) => {
  let cursor = '';
  while (true) {
    const assets = await opensea.assets(req.query.slug, cursor);
    if (!assets || assets.length <= 0) {
      break;
    }

    const models = assets.map((asset) => ({
      updateOne: {
        filter: {
          assetId: asset.id,
        },
        update: {
          $set: asset,
        },
        upsert: true
      }
    }))

    try {
      await Asset.bulkWrite(models);
    } catch (err) {
      console.error(err);
    }

    cursor = assets.next;
    console.log('cursor', cursor)
  }
  
  res.json({ success: true, assets: result })
});

router.get('/collection/assets', async (req, res) => {
  const assets = await opensea.assets(req.query.slug);
  res.json({ success: true, assets })
});

router.get('/bid', async (req, res) => {
  const address = req.query.address;
  console.log("Bid.address=", address);
  const assets = await opensea.createBuyOrder({
    token_id: 2413,
    token_address: '0x2b841d4b7ca08d45cc3de814de08850dc3008c43',
    schema_name: 'ERC721',
  }, address, 0.001);
  console.log("~~~~~~~~~~~~~~~~~~~~~", assets);
  res.json({ success: true, assets })
});

module.exports = router;
