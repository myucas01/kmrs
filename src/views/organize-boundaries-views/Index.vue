<template>
  <div class="ob-index">
    <h2>组织边界</h2>
    <Map />
  </div>
</template>

<script>
import Map from '@/components/Map.vue'
export default {
  name: 'Index',
  components: {
    Map,
  },
  title() {
    return '组织边界'
  },
  data() {
    return {}
  },
  created() { },
  mounted() { },
  methods: {},
}
</script>

<style scoped lang="scss">
.ob-index {
  display: flex;
  width: 100%;
  h2 {
    position: absolute;
    z-index: 10000;
    text-align: center;
    width: 100%;
  }
  > div {
    flex: 1;
    width: 100%;
  }
}
</style>
