<template>
  <b-container class="my-4">
    <div class="searchForm">
      <div
        :class="{
          'invisible': searchType === 'news'
        }"
      >
        Hot
      </div>
      <div class="d-flex align-items-center">
        <b-form-tags
          v-model="keywords"
          class="searchForm__input"
          placeholder="請輸入關鍵字"
          duplicate-tag-text="關鍵字已輸入過了"
          invalid-tag-text="請移除無效字元"
          :tag-validator="keywordValidator"
          remove-on-delete
          @input="getResults({ searchType: 'news'})"
        >
          <template #add-button-text>
            <SearchIcon />
          </template>
        </b-form-tags>
        <b-dropdown
          :disabled="!results"
          lazy
          dropleft
          no-caret
          class="searchForm__news-filter"
        >
          <template #button-content>
            <FilterIcon />
          </template>
          <b-dropdown-form @submit.prevent="getResults({ searchType: 'news'})">
            <div class="d-flex align-items-center">
              聲量
              <b-input v-model.number="volumeMin" type="number" />
              -
              <b-input v-model.number="volumeMax" type="number" />
            </div>
            <div class="d-flex align-items-center">
              爆發力
              <b-input v-model.number="powerMin" type="number" />
              -
              <b-input v-model.number="powerMax" type="number" />
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
        </b-dropdown>
        <div>
          <HotIcon />
        </div>
      </div>
    </div>
    <b-table
      fixed
      responsive
      show-empty
      :fields="fields"
      :items="results"
      :busy="!results"
      sort-desc
      sort-direction="desc"
      @sort-changed="getResults"
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
      @input="getResults"
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
      results: null,
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
      limit: 20,
      searchType: 'news'
    }
  },
  computed: {
    api () {
      switch (this.searchType) {
        case 'news':
          return 'getResultsWithNews'
      }
      return 'getResultsWithHotNews'
    }
  },
  mounted () {
    this.getChannelItems()
    this.getPostionItems()
    this[this.api]()
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
    getResultsWithNews () {
      this.results = null
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
        this.results = !data.error ? data.News : []
        this.total = !data.error ? data.totalNews : 0
      })
    },
    getResults ({ sortBy, sortDesc = true, searchType }) {
      this.ordertype = sortDesc ? 'DESC' : 'ASC'
      this.orderby = sortBy
      if (searchType) {
        this.searchType = searchType
      }
      return this[this.api]()
    },
    keywordValidator (keyword) {
      return !keyword.includes(',')
    }
  }
}
</script>

<style lang="scss" scoped>
  .searchForm {
    display: flex;
    align-items: center;
    justify-content: space-between;
    max-width: 950px;
    margin: 0 auto 9px auto;

    &__input {
      margin-right: 5px;
      background-color: rgba(242, 201, 76, 0.15);
      padding: 3px 10px;
      min-width: 280px;

      ::v-deep {
        .b-form-tags-list {
          margin: 0 0 -5px 0 !important;

          .b-form-tag {
            margin: 0 10px 5px 0;
            background-color: #2F80ED;
            border: 1px solid #BCD5F5;
            border-radius: 5px;
          }

          .b-form-tags-input,
          .b-form-tags-button {
            margin: 0 0 5px 0 !important;
          }

          .b-form-tags-button {
            padding: 0;
            border: none;
            display: flex;
            align-items: center;

            &:hover,
            &:focus,
            &:active,
            &:active:focus {
              background: none;
              outline: none;
              box-shadow: none;
            }
          }
        }
      }
    }

    &__news-filter {
      margin-right: 8px;

      ::v-deep {
        .dropdown-toggle {
          padding: 0;
          border: none;
          background-color: transparent;

          &:active,
          &:focus {
            background-color: transparent;
            outline: none;
            box-shadow: none;
          }
        }
      }

      &.show {
        ::v-deep {
          .dropdown-toggle {
            background-color: transparent;

            &:focus,
            &:active {
              background-color: transparent;
              outline: none;
              box-shadow: none;
            }
          }
        }
      }
    }
  }
</style>
