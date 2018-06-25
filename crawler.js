const Crawler = require('crawler')
const Renting = require('./models.js').Renting


class crawler {
  constructor(options = {}) {
    this._crawler = new Crawler({
      rateLimit: options.rateLimit || 1000,
      preRequest: function(options, done) {
        options.headers['User-Agent'] = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36'
        done()
      },
      callback: function (err, res, done) {
        if(err){
          console.log(err);
        }else{
          done()
        }
      }
    })

    this.data= []
  }

  async queryNew() {
    const self = this
    let crawlingResults = self.data = []

    return new Promise((resolve, reject) => {
      function callback(err, res, done) {
        if(err){
          console.log(err)
          reject(err)
        }else{
          var $ = res.$
          $('td[class=title]').each(function (idx, element) {
            const a = $(element).children('a')
            const userProfileElem = $(element).next().children('a')
            const userName = userProfileElem.text()
            const profileHref = userProfileElem.attr('href')
            const userId = profileHref.slice(
              profileHref.indexOf('people') + 7,
              profileHref.length - 1
            )
            crawlingResults.push({
              title: a.attr('title'),
              href: a.attr('href'),
              userId: userId,
              userName: userName
            })

          })
          done()
        }
      }

      let uris = []
      for (let i = 0; i <= 25; i += 25) {
        uris.push({
          uri: `https://www.douban.com/group/haizhuzufang/discussion?start=${i}`,
          callback: callback
        })
      }

      self._crawler.queue(uris)

      self._crawler.on('drain', function() {
        Renting.create({
          date: Date.now(),
          data: self.data
        }, () => {
          resolve(self.data)
        })
      })
    })
  }

  async list(options = {}) {
    const LIMIT = options.limit || 15
    const START = options.start || 0
    const FILTER = options.filter || []
    // const self = this
    let dbResult = []
    try {
      dbResult = await Renting.findOne({}, {}, {
        sort: {
          date: 1
        }
      })
    } catch (e) {
      console.log(e);
      throw e
    }

    const data = dbResult.data

    let result = []
    for (let i = START; i < data.length && result.length <= LIMIT; i++) {
      const allPassed = FILTER.every(item => data[i].title.indexOf(item) !== -1)

      if (allPassed) {
        result.push(data[i])
      }
    }

    return Promise.resolve(
      {
        start: START,
        limit: LIMIT,
        max: data.length,
        date: dbResult.date,
        data: result
      })
  }

  getAll() {
    return this.data
  }
}

module.exports = crawler
