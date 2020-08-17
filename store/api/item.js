export const actions = {
  getItemsByType ({ commit }, option) {
    // option = {
    //   itemtype:   <String>, Available values : Position, Channel
    // }

    const { itemtype } = option

    const queryOption = {
      itemtype: itemtype || 'Position'
    }

    const queryString = this.$helper.api.getQueryStringByOptions(queryOption)

    return this.$axios.get(`${process.env.API_URL}/api/${process.env.API_VERSION}/item${queryString}`)
      .then(this.$helper.api.handleSuccess)
      .catch(this.$helper.api.handleError)
  }
}
