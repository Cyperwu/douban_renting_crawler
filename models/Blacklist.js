const mongoose = require('mongoose')
var findOrCreate = require('mongoose-findorcreate')

const blacklistSchema = mongoose.Schema({
  key: String,
  value: String
})

blacklistSchema.plugin(findOrCreate)
const Blacklist = mongoose.model('Blacklist', blacklistSchema)

module.exports = Blacklist
