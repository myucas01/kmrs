import Vue from 'vue'
import VueCurrencyFilter from 'vue-currency-filter'
Vue.use(VueCurrencyFilter,
    {
        symbol: '',
        thousandsSeparator: ',', // 千分位分隔符
        fractionCount: 2, // 保留小数位数
        fractionSeparator: '.', // 分数分隔符
        symbolPosition: '',
        symbolSpacing: true
    })
