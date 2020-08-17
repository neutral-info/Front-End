<template>
  <b-container>
    <div class="d-flex justify-content-end align-items-center mb-2 px-5">
      <div class="d-flex align-items-center search">
        <b-form-tags
          v-model="keywords"
          class="mr-2 search__input"
          placeholder="請輸入關鍵字"
          duplicate-tag-text="關鍵字已輸入過了"
          invalid-tag-text="請移除無效字元"
          :tag-validator="keywordValidator"
          remove-on-delete
          @input="getNewsList"
        >
          <template #add-button-text>
            <SearchIcon />
          </template>
        </b-form-tags>
        <b-dropdown
          lazy
          dropleft
          no-caret
          class="ml-2"
        >
          <template #button-content>
            <FilterIcon />
          </template>
          <template #default="{ hide }">
            <b-dropdown-form @submit.prevent="getNewsList(); hide();">
              <div>
                聲量
                <b-input v-model.number="volumeMin" type="number" />-<b-input v-model.number="volumeMax" type="number" />
              </div>
              <div>
                爆發力
                <b-input v-model.number="powerMin" type="number" />-<b-input v-model.number="powerMax" type="number" />
              </div>
              <div>
                立場
                <b-checkbox-group v-model="positions" :options="positionOption" buttons />
              </div>
              <div>
                管道
                <b-checkbox-group v-model="channels" :options="channelOption" buttons />
              </div>
              <b-button type="submit">
                送出
              </b-button>
            </b-dropdown-form>
          </template>
        </b-dropdown>
        <div>
          <HotIcon />
        </div>
      </div>
    </div>
    <b-table
      responsive
      show-empty
      :fields="fields"
      :items="news"
      :busy="!news"
      sort-desc
      sort-direction="desc"
      @sort-changed="sortChanged"
    >
      <template #table-busy>
        loading
      </template>
      <template #empty>
        no data
      </template>
    </b-table>
    <b-pagination
      v-model="page"
      :total-rows="total"
      :per-page="limit"
      @input="getNewsList"
    />
  </b-container>
</template>

<script>
import { mapActions } from 'vuex'
import FilterIcon from '~/assets/svg/filter.svg'
import HotIcon from '~/assets/svg/hot.svg'
import SearchIcon from '~/assets/svg/search.svg'

export default {
  components: {
    FilterIcon,
    HotIcon,
    SearchIcon
  },
  data () {
    return {
      total: 0,
      news: null,
      positionOption: null,
      channelOption: null,
      fields: [
        {
          key: 'keywords',
          label: '標籤',
          sortable: false
        },
        {
          key: 'position',
          label: '立場',
          sortable: false
        },
        {
          key: 'volume_now',
          label: '聲量',
          sortable: true
        },
        {
          key: 'power',
          label: '爆發力',
          sortable: false
        },
        {
          key: 'channels',
          label: '管道',
          sortable: false
        },
        {
          key: 'producer.desc',
          label: '發布者',
          sortable: false
        },
        {
          key: 'pubdate',
          label: '發文時間',
          sortable: true
        }
      ],
      keywords: [],
      volumeMin: '',
      volumeMax: '',
      powerMin: '',
      powerMax: '',
      positions: [],
      channels: [],
      orderby: '',
      ordertype: '',
      page: 1,
      limit: 20
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
      this.getItemsByType({
        itemtype: 'Channel'
      }).then((data) => {
        this.channelOption = !data.error ? data : []
      })
    },
    getPostionItems () {
      this.getItemsByType({
        itemtype: 'Position'
      }).then((data) => {
        this.positionOption = !data.error ? data : []
      })
    },
    getNewsList () {
      this.news = null
      const option = {
        pageNo: this.page,
        pageSize: this.limit,
        keywords: this.keywords.join(',') || null,
        orderby: this.orderby || null,
        ordertype: this.ordertype || null,
        positions: this.positions.join(',') || null,
        channel: this.channels.join(',') || null
      }
      if (_.isNumber(this.volumeMin)) {
        option.volumeMin = this.volumeMin
      }
      if (_.isNumber(this.volumeMax)) {
        option.volumeMax = this.volumeMax
      }
      if (_.isNumber(this.powerMin)) {
        option.powerMin = this.powerMin
      }
      if (_.isNumber(this.powerMax)) {
        option.powerMax = this.powerMax
      }
      this.getNews(option).then((data) => {
        this.news = !data.error ? data.News : []
        this.total = !data.error ? data.totalNews : 0
      })
    },
    keywordValidator (keyword) {
      return !keyword.includes(',')
    },
    sortChanged ({ sortBy, sortDesc }) {
      this.ordertype = sortDesc ? 'DESC' : 'ASC'
      this.orderby = sortBy
      this.getNewsList()
    }
  }
}
</script>

<style lang="scss" scoped>
  // .search {
  //   &__input {
  //     padding: 0;
  //     min-width: 280px;
  //     background: rgba(242, 201, 76, 0.15);
  //     border-radius: 5px;

  //     ::v-deep {
  //       input {
  //         height: 25px;
  //         font-size: 18px;
  //         line-height: 21px;
  //       }
  //     }
  //   }
  // }
</style>
