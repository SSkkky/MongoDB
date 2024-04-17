const express = require('express');
const router = express.Router();
const MinchoMap = require('../models/MinchoMap');
const MinchoMapUser = require('../models/MinchoMapUser');
const mongoose = require('mongoose');
const axios = require('axios');
const jwt = require('jsonwebtoken');

// 매장
router.route('/')
    .get(async (req, res) => {
        const data = await MinchoMap.find({});
        res.send(data);
        // console.log(data)
    })
    .post(async (req, res) => {
        const newItem = new MinchoMap(req.body);
        const savedItem = await newItem.save();
        res.send(savedItem);
    });

// 매장(디테일)
router.route('/:id')
    .get(async (req, res) => {
        // console.log(req.params)
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

// 유저 전체 리스트 조회, 추가
router.route('/user/list')
    .get(async (req, res) => {
        const data = await MinchoMapUser.find({});
        res.send(data);
    })
    .post(async (req, res) => {
        const newItem = new MinchoMapUser(req.body);
        const savedItem = await newItem.save();
        res.send(savedItem);
    });

// 유저 이메일 조회
router.route('/user/list/:email')
    .get(async (req, res) => {
        // console.log(req.params.email)
        const data = await MinchoMapUser.findOne({ email: req.params.email });
        res.send(data);
    })

// 카카오 로그인 콜백
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
                const resToken = response.data;
                console.log(response.data)
                console.log('----------엑세스 토큰 발행 성공---------')
                const accessToken = response.data.access_token;

                axios.post("https://kapi.kakao.com/v2/user/me", {}, {
                    headers: {
                        "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
                        "Authorization": `Bearer ${accessToken}`
                    }
                }).then(ress => {
                    console.log('---------------유저 데이터 가져오기 성공!')

                    const getData = async () => {
                        const userData = await axios.get(`http://localhost:5000/minchomap/user/list/${ress.data.kakao_account.email}`)
                        console.log('userData.data : ', userData.data)
                        if (!userData.data.email) {
                            // 회원 등록
                            console.log('회원을 등록합니다!!')
                            const userRoot = ress.data;
                            const newUserData = {
                                "id": userRoot.id,
                                "nickname": userRoot.kakao_account.profile.nickname,
                                "profile_image": userRoot.kakao_account.profile.profile_image,
                                "email": userRoot.kakao_account.email
                            };
                            axios.post('http://localhost:5000/minchomap/user/list', newUserData)
                            console.log('기존 고객입니당')
                        }

                        res.redirect(`http://localhost:3000`)
                    }
                    getData()



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


// jwt 토큰
router.route('/jwt')
    .post(async (req, res) => {
        const token = jwt.sign({ data: req.body }, 'secret', { expiresIn: '1h' });
        res.send(token);
    })

module.exports = router;
