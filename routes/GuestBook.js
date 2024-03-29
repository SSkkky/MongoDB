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
    const data = await GuestBook.findById(req.params.id);
    res.send(data);
  })
  .put(async (req, res) => {
    res.send(req.body)
    // await GuestBook.findByIdAndUpdate(req.params.id, req.body, { new: true });
    // const updateData = await GuestBook.find({});
    // res.send(updateData);
  })
  .delete(async (req, res) => {
    
    await GuestBook.findOneAndDelete({"_id" : req.params.id});
    const updateData = await GuestBook.find({});
    res.send(updateData);
  });

module.exports = router;
