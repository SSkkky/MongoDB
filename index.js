const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

const guestbookRouter = require('./routes/GuestBook');
const minchomapRouter = require('./routes/MinchoMap');


// MongoDB 연결
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB에 성공적으로 연결되었습니다.'))
  .catch(err => console.error(err));



// 라우트
app.use('/GuestBook', guestbookRouter);
app.use('/minchomap', minchomapRouter);



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`서버가 ${PORT}번 포트에서 실행 중입니다.`));
