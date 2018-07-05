function isKeywordInString(item, filter) {
  const title = item.title

  return filter.some(mainFilter => { // 第一层数组：由关键词集合组成的数组
    return mainFilter.some(keyWord => { // 第二层数组: 由关键词组成的数组
      if (Array.isArray(keyWord)) { // 第三层: 关键词或者是两个必须同时出现的关键词组成的数组
        return keyWord.every(subKeyWord => {
          return title.indexOf(subKeyWord) !== -1
        })
      } else if (typeof keyWord === 'object'){
        return item[keyWord.key].indexOf(keyWord.value) !== -1
      } else {
        return title.indexOf(keyWord) !== -1
      }
    })
  })
}

module.exports = {
  // filters: {
  //   nin: <array[<array>[<string>|<array>[<string>]]]>
  //   in: <array[<array>[<string>|<array>[<string>]]]>
  // }
  filterKeyword(item, filters) {
    const isNotPass = filters.nin ? isKeywordInString(item, filters.nin) : false
    const isPass = filters.in ? isKeywordInString(item, filters.in) : true

    return isPass && !(isNotPass)
  },
  logList(currentPage, currentResult) {
    console.log(`当前页：${currentPage+1}`)
    for (let index in currentResult) {
      console.log(`${index}: `, currentResult[index].title)
      console.log('   ', currentResult[index].alt)
    }
  }
}
