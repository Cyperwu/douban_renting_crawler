const Renting = require('./Renting.js')
const Blacklist = require('./Blacklist.js')

const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/douban-crawler')

module.exports = {
  Renting: Renting,
  Blacklist: Blacklist
}
