/**
 * KMRS 专案查询所有api
 * 注意：因为前端用代理，需要在api地址前边加 /api
 */
import Vue from 'vue'


const KMRS_CASE_API = {
    /*-----------------------------------------------首页----------------------------------------------------*/
    /**
     * @description 获取首页专案列表
     * @param { object } params_obj
     */
     get_case_list: (params_obj) => {
        console.log('base_api2', Vue.prototype.$fetch)
        return Vue.prototype.$fetch.post('/api/meta/list', params_obj).then(res => {
            console.log('列表：', res)
            if (res && res.errorCode === 0 && res.resultBody) {
                return res.resultBody
            } else {
                console.error(' KMRS 总览专案列表 Error！')
                return ''
            }
        })
    },

    /**
     * @description 获取首页概念列表
     * @param { object } params_obj
     */
     get_concept_list: (params_obj) => {
        return Vue.prototype.$fetch.post('/api/meta/cptList', params_obj).then(res => {
            if (res && res.errorCode === 0 && res.resultBody) {
                return res.resultBody
            } else {
                console.error(' KMRS 总览概念列表 Error！')
                return ''
            }
        })
    },

    /**
     * @description 获取首页口味列表
     * @param { object } params_obj
     */
     get_taste_list: (params_obj) => {
        return Vue.prototype.$fetch.get('/api/common/taste', params_obj).then(res => {
            if (res && res.errorCode === 0 && res.resultBody) {
                return res.resultBody
            } else {
                console.error(' KMRS 总览 口味列表 Error！')
                return ''
            }
        })
    },

    /**
     * @description 获取首页专案-品类列表
     * @param { object } params_obj
     */
     get_category_list: () => {
        return Vue.prototype.$fetch.get('/api/common/category').then(res => {
            if (res && res.errorCode === 0 && res.resultBody) {
                return res.resultBody
            } else {
                console.error(' KMRS 总览 专案-品类列表 Error！')
                return ''
            }
        })
    },

    /**
     * @description 获取首页专案-甜度列表
     * @param { object } params_obj
     */
     get_sweet_list: () => {
        return Vue.prototype.$fetch.get('/api/common/sweet').then(res => {
            if (res && res.errorCode === 0 && res.resultBody) {
                return res.resultBody
            } else {
                console.error(' KMRS 总览 专案-甜度列表 Error！')
                return ''
            }
        })
    },

    /**
     * @description 获取首页概念-品类列表
     * @param { object } params_obj
     */
     get_concepts_category_list: () => {
        return Vue.prototype.$fetch.get('/api/common/cptCategory').then(res => {
            if (res && res.errorCode === 0 && res.resultBody) {
                return res.resultBody
            } else {
                console.error(' KMRS 总览 概念-品类列表 Error！')
                return ''
            }
        })
    },

    /**
     * @description 获取首页searchbox地区字段列表
     * @param { object } params_obj
     */
     get_search_box_area_list: () => {
        return Vue.prototype.$fetch.get('/api/common/region').then(res => {
            if (res && res.errorCode === 0 && res.resultBody) {
                return res.resultBody
            } else {
                console.error(' KMRS 过滤-区域列表 Error！')
                return ''
            }
        })
    },

     /**
     * @description 获取首页searchbox地区对应城市字段列表
     * @param { object } params_obj
     */
      get_search_box_area_to_city_list: (params_obj) => {
        return Vue.prototype.$fetch.get('/api/common/city', params_obj).then(res => {
            if (res && res.errorCode === 0 && res.resultBody) {
                return res.resultBody
            } else {
                console.error(' KMRS 过滤-城市列表 Error！')
                return ''
            }
        })
    },

    /**
     * @description 获取首页地区列表
     * @param { object } params_obj
     */
     get_area_list: () => {
        return Vue.prototype.$fetch.get('/api/project/get/queryProperties').then(res => {
            if (res && res.errorCode === 0 && res.resultBody) {
                return res.resultBody
            } else {
                console.error(' KMRS 首页-地区列表 Error！')
                return ''
            }
        })
    },

    /**
     * @description 获取首页总体echarts
     * @param { object } params_obj
     */
    get_general_echarts: (params_obj) => {
        return Vue.prototype.$fetch.get('/api/project/get/index', params_obj).then(res => {
            if (res && res.errorCode === 0 && res.resultBody) {
                return res.resultBody
            } else {
                console.error(' KMRS 首页-echarts Error！')
                return ''
            }
        })
    },

    /**
     * @description 获取首页年龄区间
     * @param { object } params_obj
     */
    get_age_stage() {
        return Vue.prototype.$fetch.get('/api/common/age').then(res => {
            if (res && res.errorCode === 0 && res.resultBody) {
                return res.resultBody
            } else {
                console.error(' KMRS 首页-年龄区间 Error！')
                return ''
            }
        })
    },




    /*-----------------------------------------------专案详情----------------------------------------------------*/
    /**
     * @description 获取专案详情-产品类别
     * @param { object } params_obj
     */
     get_case_type: (params_obj) => {
        return Vue.prototype.$fetch.get('/api/project/get/typeCodeAndName', params_obj).then(res => {
            if (res && res.errorCode === 0 && res.resultBody) {
                return res.resultBody
            } else {
                console.error(' KMRS 产品类别 Error！')
                return ''
            }
        })
    },

    /**
     * @description 获取专案详情-整体喜好度
     * @param { object } params_obj
     */
     get_case_preference_charts: (params_obj) => {
        return Vue.prototype.$fetch.get('/api/project/get/preference', params_obj).then(res => {
            if (res && res.errorCode === 0 && res.resultBody) {
                return res.resultBody
            } else {
                console.error(' KMRS 整体喜好度 Error！')
                return ''
            }
        })
    },

    /**
     * @description 获取专案详情-整体数据库位置
     * @param { object } params_obj
     */
     get_case_databaseLocation_charts: (params_obj) => {
        return Vue.prototype.$fetch.get('/api/project/get/databaseLocation', params_obj).then(res => {
            if (res && res.errorCode === 0 && res.resultBody) {
                return res.resultBody
            } else {
                console.error(' KMRS 整体数据库位置 Error！')
                return ''
            }
        })
    },

    /**
     * @description 获取专案详情-整体适合度
     * @param { object } params_obj
     */
     get_case_fitness_charts: (params_obj) => {
        return Vue.prototype.$fetch.get('/api/project/get/fitness', params_obj).then(res => {
            if (res && res.errorCode === 0 && res.resultBody) {
                return res.resultBody
            } else {
                console.error(' KMRS 整体适合度 Error！')
                return ''
            }
        })
    },

    /**
     * @description 获取专案详情-整体对比偏好
     * @param { object } params_obj
     */
     get_case_contrastPreference_charts: (params_obj) => {
        return Vue.prototype.$fetch.get('/api/project/get/contrastPreference', params_obj).then(res => {
            if (res && res.errorCode === 0 && res.resultBody) {
                return res.resultBody
            } else {
                console.error(' KMRS 整体对比偏好 Error！')
                return ''
            }
        })
    },

    /*-----------------------------------------------概念详情----------------------------------------------------*/
    /**
     * @description 获取专案详情-整体对比偏好
     * @param { object } params_obj
     */
     get_concepts_2_cases: (params_obj) => {
        return Vue.prototype.$fetch.get('/api/project/get/contrastPreference', params_obj).then(res => {
            if (res && res.errorCode === 0 && res.resultBody) {
                return res.resultBody
            } else {
                console.error(' KMRS 概念2专案列表 Error！')
                return ''
            }
        })
    },
    /**
     * @description 获取专案详情-多专案
     * @param { object } params_obj
     */
    get_some_cases: (params_obj)=> {
        return Vue.prototype.$fetch.get('/api/project/get/manyConceptScreening', params_obj).then(res => {
            if (res && res.errorCode === 0 && res.resultBody) {
                return res.resultBody
            } else {
                console.error(' KMRS 多专案 Error！')
                return ''
            }
        })
    },

    /**
     * @description 获取专案详情-单专案
     * @param { object } params_obj
     */
     get_single_case: (params_obj)=> {
        return Vue.prototype.$fetch.get('/api/project/get/oneConceptScreening', params_obj).then(res => {
            if (res && res.errorCode === 0 && res.resultBody) {
                return res.resultBody
            } else {
                console.error(' KMRS 单专案 Error！')
                return ''
            }
        })
    }
}

export default KMRS_CASE_API