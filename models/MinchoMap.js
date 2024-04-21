const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
  name: String,
  price: Number
})

const minchomapSchema = new mongoose.Schema({
  // id, 매장이름, 전화번호, 주소, 좌표(x,y), 오픈시간, 닫는시간, 메뉴 
  email: {type: String, required: true },
  nickname: {type: String, required: true },
  id: { type: Number, required: true },
  storeName: { type: String, required: true },
  tel: { type: String || null },
  address: { type: String, required: true },
  coordinate: {
    x: { type: Number, required: true },
    y: { type: Number, required: true }
  },
  openHour: { type: Number || null },
  closeHour: { type: Number || null },
  menu: [menuSchema],
  state : { type: Boolean }
});

module.exports = mongoose.model('minchomaps', minchomapSchema);
