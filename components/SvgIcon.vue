<template>
  <span class="svgIcon">
    <component :is="name" :width="width" :height="height" />
  </span>
</template>

<script>
import IconFilter from '~/assets/images/svg/icon_filter.svg?inline'
import IconHot from '~/assets/images/svg/icon_hot.svg?inline'
import IconSearch from '~/assets/images/svg/icon_search.svg?inline'
import IconPosition from '~/assets/images/svg/icon_position.svg?inline'

export default {
  components: {
    IconFilter,
    IconHot,
    IconSearch,
    IconPosition
  },
  props: {
    name: {
      type: String,
      required: true
    },
    width: {
      type: Number,
      required: true
    },
    height: {
      type: Number,
      required: true
    }
  }
}
</script>
