import moment from 'moment';
export function demoFilters (url) {
  return url;
}

/**
 * @description 定义过滤器 目的：将数值123456 || '123456' => 123,456
 * @param {number} num 数字
 */
export function numFormat (num) {
  if (typeof num === 'undefined' || num === null) {
    return '-';
  } else {
    let res = num.toString ().replace (/\d+/, n => {
      // 先提取整数部分
      return n.replace (/(\d)(?=(\d{3})+$)/g, $1 => {
        return $1 + ',';
      });
    });
    return res;
  }
}

/**
 * @description 将小数转化成百分比并添加百分号%，保留位数(默认2位)
 * @param {number} num 数字
 */
export function numToPercent (num) {
  if (typeof num === 'undefined' || num === null) {
    return '-';
  } else {
    let res = (parseFloat (num) * 100).toFixed (2);
    return `${res}%`;
  }
}

/**
 * 时间格式化
 * @param input  string/number   当前时间
 * @param type   时间格式
 */

export function dateFormat (input, type) {
  if (!input) {
    return null;
  }
  return moment (input).format (type);
}

/**
 * @description 将空数据转换成 “-” 显示
 * @param data
 */
export function isEmptyOrNull(data) {
  if (data === '' || typeof data === 'undefined' || data === null) {
    return '-';
  } else {
    return data;
  }
}
