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
            <svg-icon name="IconSearch" :width="16" :height="16" />
          </template>
        </b-form-tags>
        <b-popover
          v-if="$refs.filterBtn && results"
          :target="$refs.filterBtn"
          triggers="hover click"
          placement="leftbottom"
          custom-class="newsFilter"
        >
          <template v-slot:title>
            篩選
          </template>
          <b-form class="newsFilter__form" @submit.prevent="getResults({ searchType: 'news'})">
            <div class="newsFilter__volume">
              <span class="newsFilter__volume-label">
                聲量
              </span>
              <b-input v-model.number="volumeMin" class="newsFilter__input" type="number" autocomplete="off" />
              <span class="mx-1">
                -
              </span>
              <b-input v-model.number="volumeMax" class="newsFilter__input" type="number" autocomplete="off" />
            </div>
            <div class="newsFilter__power">
              <span class="newsFilter__power-label">
                爆發力
              </span>
              <b-input v-model.number="powerMin" class="newsFilter__input" type="number" autocomplete="off" />
              <span class="mx-1">
                -
              </span>
              <b-input v-model.number="powerMax" class="newsFilter__input" type="number" autocomplete="off" />
            </div>
            <div class="newsFilter__position">
              立場
              <b-checkbox-group v-model="positions" :options="positionOption" buttons />
            </div>
            <div class="newsFilter__channel">
              管道
              <b-checkbox-group v-model="channels" :options="channelOption" buttons />
            </div>
            <b-button type="submit" class="newsFilter__send-btn">
              送出
            </b-button>
          </b-form>
        </b-popover>
        <div class="searchForm__news-filter">
          <svg-icon ref="filterBtn" name="IconFilter" :width="16" :height="16" />
        </div>
        <svg-icon name="IconHot" :width="14" :height="18" />
      </div>
    </div>
    <perfect-scrollbar>
      <b-table
        show-empty
        no-sort-reset
        no-local-sorting
        :fields="fields"
        :items="results"
        :busy="!results"
        sort-direction="desc"
        :sort-desc.sync="orderDesc"
        :sort-by.sync="orderby"
        table-class="searchResultTable"
        @sort-changed="getResults"
      >
        <template #table-busy>
          <div class="text-center text-dark my-5">
            <b-spinner />
          </div>
        </template>
        <template #empty>
          <div class="h4 text-center my-5">
            目前沒有找到相關的資料
          </div>
        </template>
        <template #cell(keywords)="{ item }">
          <span v-for="(keyword, index) in item.keywords" :key="keyword + index" class="searchResultTable__keyword">
            {{ keyword }}
          </span>
          <b-button v-b-toggle="item.id" class="searchResultTable__title" variant="none">
            <v-clamp autoresize :max-lines="1">
              {{ item.title }}
            </v-clamp>
            <font-awesome-icon
              v-if="collapseMounted"
              class="ml-2"
              :icon="['fas'].concat($refs[`collapse-${item.id}-text`].show ? ['angle-up'] : ['angle-down'])"
            />
          </b-button>
          <b-collapse :id="item.id" :ref="`collapse-${item.id}-text`" @hook:mounted="collapseMounted = true">
            <v-clamp class="searchResultTable__text" autoresize :max-lines="3">
              {{ item.text }}
            </v-clamp>
          </b-collapse>
        </template>
        <template #cell(position)="{ item }">
          <div class="d-flex align-items-baseline justify-content-center text-nowrap">
            <div class="d-flex flex-column">
              <span v-for="position in item.position" :key="position.party + position.trend">
                {{ position.party }}
              </span>
            </div>
            <svg-icon name="IconPosition" :width="16" :height="13" />
          </div>
        </template>
        <template #cell(pubdate)="{ item }">
          {{ $dayjs(item.pubdate).format('YYYY/MM/DD') }}
        </template>
      </b-table>
    </perfect-scrollbar>
    <b-pagination
      v-model="page"
      class="my-5"
      align="center"
      :limit="7"
      :total-rows="total"
      :per-page="limit"
      @input="getResults"
    />
  </b-container>
</template>

<script>
import { mapActions } from 'vuex'

export default {
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
          sortable: false,
          class: ['searchResultTable__border', 'searchResultTable__keywords'],
          thClass: ['text-nowrap', 'font-weight-normal', 'py-0'],
          tdClass: ['align-middle', 'py-2'],
          stickyColumn: true
        },
        {
          key: 'position',
          label: '立場',
          sortable: false,
          class: ['text-center', 'searchResultTable__border'],
          thClass: ['text-nowrap', 'font-weight-normal', 'py-0'],
          tdClass: ['align-middle', 'py-2']
        },
        {
          key: 'volume_now',
          label: '聲量',
          sortable: true,
          class: ['text-center', 'searchResultTable__border'],
          thClass: ['text-nowrap', 'font-weight-normal', 'py-0'],
          tdClass: ['align-middle', 'py-2']
        },
        {
          key: 'power',
          label: '爆發力',
          sortable: false,
          class: ['text-center', 'searchResultTable__border'],
          thClass: ['text-nowrap', 'font-weight-normal', 'py-0'],
          tdClass: ['align-middle', 'py-2']
        },
        {
          key: 'channels',
          label: '發布管道',
          sortable: false,
          class: ['text-center', 'searchResultTable__border'],
          thClass: ['text-nowrap', 'font-weight-normal', 'py-0'],
          tdClass: ['align-middle', 'py-2']
        },
        {
          key: 'producer.desc',
          label: '發布者',
          sortable: false,
          class: ['text-center', 'searchResultTable__border'],
          thClass: ['text-nowrap', 'font-weight-normal', 'py-0'],
          tdClass: ['align-middle', 'py-2']
        },
        {
          key: 'pubdate',
          label: '發文時間',
          sortable: true,
          class: ['text-center', 'searchResultTable__border'],
          thClass: ['text-nowrap', 'font-weight-normal', 'py-0'],
          tdClass: ['align-middle', 'py-2']
        }
      ],
      keywords: [],
      volumeMin: '',
      volumeMax: '',
      powerMin: '',
      powerMax: '',
      positions: [],
      channels: [],
      orderby: 'pubdate',
      orderDesc: true,
      page: 1,
      limit: 20,
      searchType: 'news',
      collapseMounted: false
    }
  },
  computed: {
    currentListAPI () {
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
    this[this.currentListAPI]()
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
        orderby: this.orderby,
        ordertype: this.orderDesc ? 'DESC' : 'ASC',
        positions: this.positions.join(',') || null,
        channel: this.channels.join(',') || null,
        volumeMin: _.isNumber(this.volumeMin) ? this.volumeMin : null,
        volumeMax: _.isNumber(this.volumeMax) ? this.volumeMax : null,
        powerMin: _.isNumber(this.powerMin) ? this.powerMin : null,
        powerMax: _.isNumber(this.powerMax) ? this.powerMax : null
      }
      this.getNews(option).then((data) => {
        this.results = !data.error ? data.News : []
        this.total = !data.error ? data.totalNews : 0
      })
    },
    async getResults ({ searchType }) {
      if (searchType) {
        this.searchType = searchType
      }
      await this.$nextTick()
      this[this.currentListAPI]()
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
    max-width: 1000px;
    margin: 0 auto 9px auto;

    &__input {
      margin-right: 5px;
      background-color: rgba(242, 201, 76, 0.15);
      padding: 3px 10px;
      min-width: 200px;

      @include media-breakpoint-up(md) {
        min-width: 280px;
      }

      ::v-deep {
        .b-form-tags-list {
          margin: 0 0 -5px 0 !important;
          font-size: 14px;

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
      margin-right: 5px;
      cursor: pointer;
    }
  }

  .searchResultTable {
    background-color: rgba(47, 128, 237, 0.15);
    $searchResultTable: &;

    ::v-deep {
      #{$searchResultTable}__keywords {
        background-color: white;
        min-width: 260px;
        position: sticky;
        left: 0;

        @include media-breakpoint-up(md) {
          width: 50%;
          min-width: auto;
        }
      }

      #{$searchResultTable}__border {
        border: 1px solid #BCD5F5;
      }
    }

    &__keyword {
      color: #070915;
      background: #2F80ED;
      border-radius: 5px;
      padding: 0 3px;
      margin: 0 5px 5px 0;
      display: inline-block;
    }

    &__title {
      width: 100%;
      padding: 0;
      border: none;
      background-color: transparent;
      color: #2F80ED;
      text-decoration: underline;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    &__text {
      color: black;
      margin-top: 6px;
      font-size: 14px;
      max-height: 63px;
    }
  }

  .newsFilter {
    ::v-deep {
      .popover-header {
        text-align: center;
        background-color: transparent;
        border-color: #BCD5F5;
        padding: 2px;
      }

      .popover-body {
        padding: 0;
        color: black;
      }
    }

    &__volume,
    &__power {
      display: flex;
      align-items: center;
      padding: 0 9px;

      &-label {
        font-size: 16px;
        margin-right: 4px;
      }
    }

    &__volume {
      margin-bottom: 5px;
      padding-top: 6px;
    }

    &__power {
      padding-bottom: 6px;
      border-bottom: 1px solid #BCD5F5;
    }

    &__input {
      width: 56px;
      height: 22px;
      border: 1px solid #BCD5F5;
      border-radius: 5px;
      padding: 0;
      text-align: center;
      font-size: 14px;

      &::-webkit-outer-spin-button,
      &::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }

      &[type=number] {
        -moz-appearance: textfield;
      }

      &:focus {
        box-shadow: none;
      }
    }

    &__position,
    &__channel {
      border-bottom: 1px solid #BCD5F5;
      padding: 6px 9px;

      ::v-deep {
        .btn-group-toggle {
          flex-wrap: wrap;
          margin-bottom: -3px;
        }

        label.btn:not(.dropdown-toggle) {
          background-color: transparent;
          border: 1px solid #BCD5F5;
          border-radius: 5px;
          font-size: 14px;
          color: black;
          padding: 0 3px;
          margin: 0 3px 3px 0;
          flex-grow: unset;

          &.active {
            color: black;
            background-color: #2F80ED;
          }

          &.focus {
            box-shadow: none;
          }
        }
      }
    }

    &__send-btn {
      padding: 0 3px;
      background-color: transparent;
      border: 2px solid #BCD5F5;
      border-radius: 5px;
      margin: 5px auto;
      display: block;
      color: black;

      &:hover {
        opacity: .8;
      }

      &:focus,
      &:active,
      &:focus:active:not(.disabled) {
        background-color: transparent;
        border-color: #BCD5F5;
        box-shadow: none;
        color: black;
      }
    }
  }
</style>
