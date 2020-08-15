export default (ctx, inject) => {
  const helper = {
    api: {
      handleSuccess (res) {
        if (res.status !== 200) {
          throw res
        }
        return res.data.data
      },
      handleError (error) {
        return { error: true, ...error }
      },
      getQueryStringByOptions (options) {
        return `?${Object.keys(options)
          .map(key => `${key}=${options[key]}`)
          .join('&')}`
      }
    }
  }
  ctx.$helper = helper
  inject('helper', helper)
}
