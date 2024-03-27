const express = require('express');
const router = express.Router();
const GuestBook = require('../models/GuestBook');


router.route('/')
  .get(async (req, res) => {
    console.log('get')
    const data = await GuestBook.find({});
    res.send(data);
    console.log(data)
  })
  .post(async (req, res) => {
    const newItem = new GuestBook(req.body);
    const savedItem = await newItem.save();
    res.send(savedItem);
  });


router.route('/:id')
  .get(async (req, res) => {
    const data = await BucketList.findById(req.params.id);
    res.send(data);
  })
  .put(async (req, res) => {
    const updatedItem = await BucketList.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.send(updatedItem);
  })
  .delete(async (req, res) => {
    await BucketList.findByIdAndRemove(req.params.id);
    res.send({ message: 'Item removed' });
  });

module.exports = router;
