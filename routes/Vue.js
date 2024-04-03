const vueRouter = require('express').Router();
const query = require('../lib/db');

vueRouter.get('/', async function (req, res) {
    const data = await query.queryExecute('SELECT * from data');
    res.send(data);
})

module.exports = vueRouter;