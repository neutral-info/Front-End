<template>
  <div class="container">
    <!-- <b-table :items="news">
      dasd
    </b-table> -->
    <json-viewer
      :value="news"
      :expand-depth="2"
      copyable
      boxed
      sort
    />
    <json-viewer
      :value="positionOption"
      :expand-depth="2"
      copyable
      boxed
      sort
    />
    <json-viewer
      :value="channelOption"
      :expand-depth="2"
      copyable
      boxed
      sort
    />
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  data () {
    return {
      page: 1,
      limit: 10,
      total: 0,
      news: null,
      positionOption: null,
      channelOption: null
    }
  },
  mounted () {
    this.getChannelItems()
    this.getPostionItems()
    this.getNewsList()
  },
  methods: {
    ...mapActions('api/keyword', ['getNews']),
    ...mapActions('api/item', ['getItemsByType']),
    getChannelItems () {
      return this.getItemsByType({
        itemtype: 'Channel'
      }).then((data) => {
        this.channelOption = !data.error ? data : []
      })
    },
    getPostionItems () {
      return this.getItemsByType({
        itemtype: 'Position'
      }).then((data) => {
        this.positionOption = !data.error ? data : []
      })
    },
    getNewsList () {
      return this.getNews({
        pageNo: this.page,
        pageSize: this.limit
      }).then((data) => {
        this.news = !data.error ? data.News : []
        this.total = !data.error ? data.totalNews : 0
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
