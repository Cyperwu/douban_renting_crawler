const mongoose = require('mongoose')

const rentingSchema = mongoose.Schema({
  date: {type: Date, default: Date.now},
  data: mongoose.Schema.Types.Mixed
})

const Renting = mongoose.model('Renting', rentingSchema)

module.exports = Renting
