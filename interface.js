const vorpal = require('vorpal')()
const commonFilters = require('./commonFilters.js')
const Crawler = require('./crawler_api.js')
const Blacklist = require('./models').Blacklist

const crawler = new Crawler()

let currentPage = 0
let currentFilter = {}
const ZZFilter = {
  nin: [commonFilters.HZ, commonFilters.M, commonFilters.QZ, commonFilters.X],
  in: [commonFilters.ZZ]
}

const HZFilter = {
  in: [commonFilters.HZ]
}

let currentResult = {}

vorpal
  .command('ZZ', '整租')
  .action(async function() {
    currentFilter = ZZFilter
    this.log(await crawler.list({
      filter: currentFilter
    }))
  })

vorpal
  .command('HZ', '合租')
  .action(async function() {
    currentFilter = HZFilter
    this.log(await crawler.list({
      filter: currentFilter
    }))

    return true
  })

vorpal
  .command('n', '下一页')
  .action(async function() {
    currentPage++
    let result = await crawler.list({
      filter: currentFilter,
      start: currentPage * 15
    })

    currentResult = result.data
    this.log(`当前页：${currentPage}`)
    for (let index in currentResult) {
      this.log(`${index}: `, currentResult[index].title)
      this.log('   ', currentResult[index].href)
    }

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
  .action(async function(args) {
    const index = args.index
    if (!currentResult[index]) {
      return 'done'
    }
    let id = currentResult[index].id
    await Blacklist.findOrCreate({
      key: 'id',
      value: id
    })
    return true
  })


vorpal
  .delimiter('myapp$')
  .show();
