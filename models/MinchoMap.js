const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
  name: String,
  price: Number
})

const minchomapSchema = new mongoose.Schema({
  // id, 매장이름, 전화번호, 주소, 좌표(x,y), 오픈시간, 닫는시간, 메뉴 
  id: { type: Number, required: true },
  storeName: { type: String, required: true },
  tel: { type: String },
  address: { type: String, required: true },
  coordinate: {
    x: { type: number, required: true },
    y: { type: number, required: true }
  },
  openHour: { type: Number },
  closeHour: { type: Number },
  menu: [menuSchema]
});

module.exports = mongoose.model('minchomaps', minchomapSchema);
