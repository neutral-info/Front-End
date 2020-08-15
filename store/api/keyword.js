export const actions = {
  getNews ({ commit }, option) {
    // option = {
    //   orderby:   <String>, Available values : pubdate, volume_now
    //   ordertype: <String>, Available values : DESC, ASC
    //   pageNo:    <Number>,
    //   pageSize:  <Number>,
    //   keywords:  <String>,
    //   volumeMin: <Number>,
    //   volumeMax: <Number>,
    //   powerMin:  <Number>,
    //   powerMax:  <Number>,
    //   positions: <String>,
    //   channel:   <String>,
    // }

    const {
      orderby,
      ordertype,
      pageNo,
      pageSize,
      keywords,
      volumeMin,
      volumeMax,
      powerMin,
      powerMax,
      positions,
      channel
    } = option

    const queryOption = {
      dataset: 'News',
      orderby: orderby || 'pubdate',
      ordertype: ordertype || 'DESC',
      pageNo: pageNo || 1,
      pageSize: pageSize || 5
    }

    if (!_.isNil(keywords)) {
      queryOption.keywords = keywords
    }

    if (!_.isNil(volumeMin)) {
      queryOption.volumeMin = volumeMin
    }

    if (!_.isNil(volumeMax)) {
      queryOption.volumeMax = volumeMax
    }

    if (!_.isNil(powerMin)) {
      queryOption.powerMin = powerMin
    }

    if (!_.isNil(powerMax)) {
      queryOption.powerMax = powerMax
    }

    if (!_.isNil(positions)) {
      queryOption.positions = positions
    }

    if (!_.isNil(channel)) {
      queryOption.channel = channel
    }

    const queryString = this.$helper.api.getQueryStringByOptions(queryOption)

    return this.$axios.get(`${process.env.API_URL}api/${process.env.API_VERSION}/keyword${queryString}`)
      .then(this.$helper.api.handleSuccess)
      .catch(this.$helper.api.handleError)
  }
}
