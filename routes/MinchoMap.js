const express = require('express');
const router = express.Router();
const MinchoMap = require('../models/MinchoMap');
const mongoose = require('mongoose');
const axios = require('axios');

router.route('/')
    .get(async (req, res) => {
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

router.route('/oauth/callback')
    .get(async (req, res) => {
        let query = req.query;
        console.log('code = ', req.query.code)
        console.log('id = ', process.env.CLIENT_ID)
        console.log('uri = ', process.env.REDIRECT_URI)

        if (!Object.prototype.hasOwnProperty.call(query, "code")) {
            return res.status(400).send("invalid_code");
        }

        const formData = new FormData();
        formData.append("grant_type", "authorization_code");
        formData.append("client_id", process.env.CLIENT_ID);
        formData.append("redirect_uri", process.env.REDIRECT_URI);
        formData.append("code", req.query.code);

        const config = {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
            }
        };

        axios.post("https://kauth.kakao.com/oauth/token",
            {
                grant_type: 'authorization_code',
                client_id: process.env.CLIENT_ID,
                code: req.query.code,
                redirect_uri: process.env.REDIRECT_URI
            }
            , config)
            .then(response => {
                console.log('----------응답 성공---------')
                console.log(response)
                console.log(response.data.access_token)
                // const tokenToJson = JSON.parse(response.body);
                // res.json(tokenToJson);
                // console.log(tokenToJson);
            })
            .catch(error => {
                console.log('------코드는 발급되었는데 오류남--------')
                console.log(error);
            });
    })


module.exports = router;
