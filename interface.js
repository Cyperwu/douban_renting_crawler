const Vorpal = require('vorpal')
const commonFilters = require('./commonFilters.js')
const Crawler = require('./crawler_api.js')
const Blacklist = require('./models').Blacklist
const utils = require('./utils.js')

const crawler = new Crawler()

class Interface {
  constructor() {
    const self = this

    self.currentPage = 0
    self.currentFilter = {}
    self.blackList = []
    self.ZZFilter = {
      nin: [self.blackList, commonFilters.HZ, commonFilters.M, commonFilters.QZ, commonFilters.X],
      in: [commonFilters.ZZ]
    }
    self.HZFilter = {
      nin: [self.blackList],
      in: [commonFilters.HZ]
    }
    self.currentResult = []

    let vorpal = self.Vorpal = new Vorpal()

    vorpal
      .command('ZZ', '整租')
      .action(async function() {
        self.currentFilter = self.ZZFilter
        self.currentPage = 0
        let result = await crawler.list({
          filter: self.currentFilter
        })

        self.currentResult = result.data
        utils.logList(self.currentPage, result.data)
      })

    vorpal
      .command('HZ', '合租')
      .action(async function() {
        self.currentPage = 0
        self.currentFilter = self.HZFilter
        let result = await crawler.list({
          filter: self.currentFilter
        })

        self.currentResult = result.data
        utils.logList(self.currentPage, result.data)

        return true
      })

    vorpal
      .command('n', '下一页')
      .action(async function() {
        self.currentPage++
        let result = await crawler.list({
          filter: self.currentFilter,
          start: self.currentPage * 15
        })

        self.currentResult = result.data
        utils.logList(self.currentPage, self.currentResult)

        return true
      })

    vorpal
      .command('b', '上一页')
      .action(async function() {
        self.currentPage--
        let result = await crawler.list({
          filter: self.currentFilter,
          start: self.currentPage * 15
        })

        self.currentResult = result.data
        utils.logList(self.currentPage, self.currentResult)

        return true
      })

    vorpal
      .command('getNew', '爬取新的结果')
      .action(async function() {
        await crawler.queryNew()
        this.log('done')
      })

    vorpal
      .command('blackList [index]', '黑名单')
      .alias('bl')
      .action(async function(args) {
        const index = args.index
        if (!self.currentResult[index]) {
          console.log(self.currentResult);
          console.log('no currentResult: ', index)
          return 'done'
        }
        let id = self.currentResult[index].id
        const blackList = await Blacklist.findOrCreate({
          key: 'id',
          value: id
        })
        self.addBlackList(blackList.doc)
        this.log('blackListed id ' + id)
        return true
      })

    vorpal.command('t', 'show blacklist')
      .action(async () => {
        console.log(this.blackList)
        return
      })


    vorpal
      .delimiter('crawler$')
      .show();
  }

  addBlackList(arr) {
    const bl = this.blackList
    if(Array.isArray(arr)) {
      bl.push(...arr)
    } else {
      bl.push(arr)
    }
  }
}

module.exports = Interface

