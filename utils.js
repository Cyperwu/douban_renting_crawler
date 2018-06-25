function isKeywordInString(title, filter) {
  return filter.some(mainFilter => { // 第一层数组：由关键词集合组成的数组
    return mainFilter.some(keyWord => { // 第二层数组: 由关键词组成的数组
      if (Array.isArray(keyWord)) { // 第三层: 关键词或者是两个必须同时出现的关键词组成的数组
        return keyWord.every(subKeyWord => {
          return title.indexOf(subKeyWord) !== -1
        })
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
  filterKeyword(title, filters) {
    const isNotPass = filters.nin ? isKeywordInString(title, filters.nin) : false
    const isPass = filters.in ? isKeywordInString(title, filters.in) : true

    return isPass && !(isNotPass)
  }
}
