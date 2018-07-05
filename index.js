const Vopal = require('./interface.js')
const Blacklist = require('./models').Blacklist

Blacklist.find()
  .then(result => {
    const vopal = new Vopal()
    vopal.addBlackList(result)
  })
