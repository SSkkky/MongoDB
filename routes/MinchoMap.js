const express = require('express');
const router = express.Router();
const MinchoMap = require('../models/MinchoMap');
const mongoose = require('mongoose');


router.route('/')
    .get(async (req, res) => {
        console.log('get')
        const data = await MinchoMap.find({});
        res.send(data);
        console.log(data)
    })
    .post(async (req, res) => {
        const newItem = new MinchoMap(req.body);
        const savedItem = await newItem.save();
        res.send(savedItem);
    });

router.route('/:id')
    .get(async (req, res) => {
        console.log(req.params)
        const data = await MinchoMap.findById(req.params.id);
        res.send(data);
    })
    .delete(async (req, res) => {
        await MinchoMap.findByIdAndDelete(req.params.id);
        const updateData = await MinchoMap.find({});
        res.send(updateData);
    })
    .put(async (req, res) => {
        await MinchoMap.findByIdAndUpdate(req.params.id, req.body, { new: true });
        const updateData = await MinchoMap.find({});
        res.send(updateData);
    })


module.exports = router;
