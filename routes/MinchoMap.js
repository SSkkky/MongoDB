const express = require('express');
const router = express.Router();
const MinchoMap = require('../models/MinchoMap');
const MinchoMapUser = require('../models/MinchoMapUser');
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

router.route('/user/list/:id')
    .get(async (req, res) => {
        const data = await MinchoMapUser.findById(req.params.id);
        res.send(data);
    })
    .post(async (req, res) => {
        const newItem = new MinchoMapUser(req.body);
        const savedItem = await newItem.save();
        res.send(savedItem);
    });

router.route('/oauth/callback')
    .get(async (req, res) => {
        let query = req.query;
        console.log('code = ', req.query.code)
        console.log('id = ', process.env.CLIENT_ID)
        console.log('uri = ', process.env.REDIRECT_URI)

        if (!Object.prototype.hasOwnProperty.call(query, "code")) {
            return res.status(400).send("인가 코드가 없습니다");
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
                console.log('----------엑세스 토큰 발행 성공---------')
                const accessToken = response.data.access_token;

                axios.post("https://kapi.kakao.com/v2/user/me", {}, {
                    headers: {
                        "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
                        "Authorization": `Bearer ${accessToken}`
                    }
                }).then(ress => {
                    console.log('---------------유저 데이터 가져오기 성공!')
                    
                    const getData = async()=>{
                         const userData = await axios.get(`https://mongodb-plum.vercel.app/minchomap/user/list/${ress.data.id}`)

                        if(userData.length < 1){ console.log('신규 고객입니다.') }else{ console.log(userData) }
                    }

                    
                    
                    getData()
                    
                    // res.redirect(`http://localhost:3000/oauth?properties=${ress.data.properties}&id=${ress.data.id}&connected_at=${ress.data.connected_at}`)
                }).catch(error => {
                    console.log('---------엑세스 토큰은 발급되었는데 오류나용 -------')
                    console.log(error)
                })
            })
            .catch(error => {
                console.log('------코드는 발급되었는데 오류남--------')
                console.log(error);
            });
    })


module.exports = router;
