<template>
  <h2>
    <img src="/img/logo.png" />
    <span :class="channelName ? 'isChannel' : ''">
      <span>KMRS</span>
      <em v-if="channelName">{{ channelName }}</em></span>
  </h2>
</template>
<script>
import { mapState } from 'vuex'
export default {
  name: '',
  computed: mapState(['channelName'])
}
</script>
<style scoped lang="scss">
h2 {
  float: left;
  width: 165px;
  height: 48px;
  img {
    float: left;
    margin: 12px 10px 0 0;
    display: inline-block;
    width: 28px;
    height: auto;
  }
  > span {
    float: left;
    margin-top: 12px;
    height: 25px;
    line-height: 25px;
    text-align: left;
    display: flex;
    flex-direction: column;
    span {
      flex: 1;
      font-size: 18px;
      font-weight: 600;
      color: rgba(255, 255, 255, 1);
    }
    em {
      flex: 1;
      width: 100%;
      line-height: 23px;
      font-size: 14px;
      font-weight: 600;
      font-style: normal;
      color: rgba(255, 255, 255, 1);
    }
  }
  > span.isChannel {
    margin-top: 0;
    height: auto;
  }
}
</style>
