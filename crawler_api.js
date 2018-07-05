const Renting = require('./models').Renting
const utils = require('./utils.js')

const BASE_URL = 'https://api.douban.com/v2/group'
const COUNTS_PER_LIST = 100

const axios = require('axios').create({
  baseURL: BASE_URL,
  headers: {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36'
  }
})

function limitRequest({method, url, config, rateLimit}) {
  return axios[method](url, config)
    .then(result => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(result)
        }, rateLimit)
      })
    })
}

async function batchRequest({method, url, limit, rateLimit}) {
  let start = 0

  let results = []
  for (; start < limit; start += COUNTS_PER_LIST) {
    const response = await limitRequest({
      method,
      url,
      rateLimit,
      config: {
        params: {
          start: start,
          count: COUNTS_PER_LIST
        }
      }
    })
    results = results.concat(response.data.topics)
  }

  return results
}


class crawler {
  constructor() {
    this.data= []
  }

  async queryNew() {
    const self = this
    self.data = await batchRequest({
      method: 'get',
      url: '/haizhuzufang/topics',
      limit: 1000
    })

    await Renting.create({
      date: Date.now(),
      data: self.data
    })

    return 'success'
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
          date: -1
        }
      })
    } catch (e) {
      console.log(e);
      throw e
    }

    const data = dbResult.data

    let result = []
    for (let i = 0, skipped = 0; i < data.length && result.length <= LIMIT; i++) {
      let item = data[i]
      const allPassed = utils.filterKeyword(item, FILTER)
      if (allPassed && skipped >= START) {
        result.push(item)
      } else if (allPassed) {
        skipped ++
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
