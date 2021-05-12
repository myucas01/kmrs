<!--
    搜索通用表单
	问题：1、（专案）有些字段还没确定字段名和值。2、城市和区域还没有数据。3、
-->
<template>
	<div class="searchBox">
		<!--输入key区域-->
		<section class="inputKeyBox" :class="{ focused: is_show_filter_board }">
			<i class="el-icon-search icon-search"></i>
			<el-input
				v-model="key_str"
				class="keyInput"
				placeholder="搜索专案"
				@focus="switchFilterBoard(true)"
				@keyup.enter.native="searchKey"
			></el-input>
			<div class="searchButton" @click="searchKey">搜索</div>
		</section>
		<!--详细检索、结果列表区域-->
		<section class="detailSearchBox" v-show="is_show_filter_board">
			<!--检索类别切换-->
			<div class="searchTypeTabs">
				<span
					v-auth='"meta:select:list:product"'
					class="perSearchType"
					:class="{ perSearchTypeActive: current_query_type === 'productType' }"
					@click="switchQueryType('productType')"
					>产品测试</span
				>
				<span
					v-auth='"meta:select:list:concept"'
					class="perSearchType"
					:class="{ perSearchTypeActive: current_query_type === 'conceptType' }"
					@click="switchQueryType('conceptType')"
					>概念筛选</span
				>
			</div>
			<!--产品测试-->
			<div
				class="resultArea productResultArea"
				v-show="current_query_type === 'productType'"
				v-auth='"meta:select:list:product"'
			>
				<!--产品测试模块结果-->
				<div class="inputResultModel productInputResultModel">
					<!--概览结果-->
					<div class="leftPart">
						<div class="generalResultMesage">
							<span class="resultNum"
								>共{{ product_result_num }}条搜索结果</span
							>
							<span class="checkboxType">单选</span>
						</div>
						<div class="resultList productResultList">
							<div
								class="perResult"
								v-for="(item, index) in product_result_list"
								:key="index"
								:class="{ perResultActive: index === current_pro_index }"
								@click="selectThisProduct(item, index)"
							>
								<div class="resultText" :title='item.metaName'>{{ item.metaName }}</div>
								<i class="el-icon-check radioChecked"></i>
							</div>
						</div>
					</div>
					<!--筛选条件-->
					<div class="rightPart" @click="closeInputNameList">
						<div class="inputList">
							<div
								class="perInput"
								v-for="(item, index) in product_attrs_arr"
								:key="index"
							>
								<div class="inputLabel" v-show="item.is_show">
									{{ item.input_label }}
									<i
										class="el-icon-error iconDelInputButton"
										@click="delThisAttr(item, index)"
									></i>
								</div>
								<el-date-picker
									v-show="item.input_type === 'date_month' && item.is_show"
									class="baseInputCss"
									size="mini"
									v-model="item.value"
									type="daterange"
									value-format="yyyy-MM-dd"
									format="yyyy-MM-dd"
									range-separator="至"
									start-placeholder="开始日期"
									end-placeholder="结束日期"
									@change="changeInputInit(item.input_label)"
								>
								</el-date-picker>
								<el-select
									v-show="item.input_type === 'select' && item.is_show"
									class="baseInputCss"
									size="mini"
									v-model="item.value"
									placeholder="全部"
									:multiple="item.is_multiple"
									:filterable="item.is_filter"
									clearable
									@change="changeInputInit(item.input_label)"
								>
									<el-option
										v-for="(per_option, key) in item.options"
										:key="key"
										:label="per_option.label"
										:value="per_option.value"
									>
									</el-option>
								</el-select>
							</div>
						</div>
						<!--筛选字段-->
						<div class="addNewInputArea">
							<div class="addNewInputButton" @click.stop="switchShowInputNameList">
								<i class="el-icon-circle-plus icon-add-new-input"></i>
								添加筛选条件
							</div>
							<div
								class="inputNameList"
								:class="{ inputNameListActive: is_show_input_name_list }"
							>
								<div
									v-for="(item, index) in product_attrs_arr"
									@click="selectThisAttr(item)"
									class="perAttr"
									:class="{ perAttrActive: item.is_show }"
									:key="index"
								>
									{{ item.attr_name }}
								</div>
							</div>
						</div>
					</div>
				</div>
				<!--概念筛选结果-->
				<!-- <div class='inputModel'></div> -->
				<div class="submitButtons">
					<div class="perButton cancelButton" @click="switchFilterBoard(false)">
						取消
					</div>
					<div
						class="perButton submitButton"
						@click="submitBoardForm(false, 'product')"
					>
						确定
					</div>
				</div>
			</div>
			<!--概念筛选-->
			<div
				class="resultArea conceptResultArea"
				v-show="current_query_type === 'conceptType'"
				v-auth='"meta:select:list:concept"'
			>
				<!--产品测试模块结果-->
				<div class="inputResultModel productInputResultModel">
					<!--概览结果-->
					<div class="leftPart">
						<div class="generalResultMesage">
							<span class="resultNum" v-if="s_type === '1'">共{{ concept_result_num }}条搜索结果</span>
							<span class="resultNum" v-if="s_type === '0'">共{{ concept_case_num }}条搜索结果</span>
							<div class="sGroup">
								<el-radio
									class="sRadio"
									v-model="s_type"
									label="0"
									@change="sTypeChange"
									>专案</el-radio
								>
								<el-radio
									class="sRadio"
									v-model="s_type"
									label="1"
									@change="sTypeChange"
									>概念</el-radio
								>
								<span class="checkboxType">{{
									s_type === '0' ? '单选' : '可多选'
								}}</span>
							</div>
						</div>
						<div class="resultList conceptResultList">
							<!--概念-->
							<template v-if="s_type === '1'">
								<div
									class="perConceptResult"
									v-for="(item, index) in concept_result_list"
									:key="index"
									:class="{ perResultActive: item.isChecked }"
									@click="selectSomeConcept(item)"
									:title='item.cptName'
								>
									{{ item.cptName }}
								</div>
							</template>
							<!--专案-->
							<template v-if="s_type === '0'">
								<div
									class="perResult"
									v-for="(item, index) in concept_case_list"
									:key="index"
									:class="{ perResultActive: index === current_con_case_index }"
									@click="selectThisConceptCase(item, index)"
								>
									<div class="resultText" :title='item.cptName'>{{ item.cptName }}</div>
									<i class="el-icon-check radioChecked"></i>
								</div>
							</template>
						</div>
					</div>
					<!--筛选条件-->
					<div class="rightPart">
						<div class="inputList">
							<div
								class="perInput"
								v-for="(item, index) in concept_attrs_arr"
								:key="index"
							>
								<div class="inputLabel" v-show="item.is_show">
									{{ item.input_label }}
								</div>
								<el-date-picker
									v-if="item.input_type === 'date_month' && item.is_show"
									class="baseInputCss"
									size="mini"
									v-model="item.value"
									type="daterange"
									value-format="yyyy-MM-dd"
									format="yyyy-MM-dd"
									range-separator="至"
									start-placeholder="开始日期"
									end-placeholder="结束日期"
									@change="changeConceptInputInit(item.input_label)"
								>
								</el-date-picker>
								<el-cascader
									class="baseInputCss"
									v-if="item.input_type === 'select2' && item.is_show"
									size="mini"
									v-model="item.value"
									filterable
									:options="item.options"
									:props="{ multiple: true, children: 'child' }"
									placeholder="请选择"
									collapse-tags
									clearable
									@change="changeConceptInputInit(item.input_label)"
								>
								</el-cascader>
								<el-select
									v-if="item.input_type === 'select' && item.is_show"
									class="baseInputCss"
									size="mini"
									v-model="item.value"
									filterable
									:multiple="item.is_multiple"
									placeholder="请选择"
									clearable
									@change="changeConceptInputInit(item.input_label)"
								>
									<el-option
										v-for="(item, key) in item.options"
										:key="key"
										:label="item.label"
										:value="item.value"
									>
									</el-option>
								</el-select>
							</div>
						</div>
					</div>
				</div>
				<!--概念筛选结果-->
				<!-- <div class='inputModel'></div> -->
				<div class="submitButtons">
					<div class="perButton cancelButton" @click="switchFilterBoard(false)">
						取消
					</div>
					<div
						class="perButton submitButton"
						@click="submitBoardForm(false, 'concept')"
					>
						确定
					</div>
				</div>
			</div>
		</section>
	</div>
</template>

<script>
	/*---------------------导入商机导航接口API---------------------*/
	import KMRS_CASE_API from '../../../api/case_api.js'
	export default {
		data() {
			return {
				// 搜索专案的关键字
				key_str: '',
				// 是否显示专案详细过滤面板
				is_show_filter_board: false,
				// 产品测试查询总数值
				product_result_num: 0,
				// 概念筛选查询总-概念-数值
				concept_result_num: 0,
				// 概念筛选查询总-专案-数值
				concept_case_num: 0,

				// 产品测试过滤属性列表
				product_attrs_arr: [
					{
						input_type: 'date_month',
						input_label: '时间选择',
						attr_name: '时间日期',
						is_multiple: true,
						is_show: true,
						value: []
					},
					{
						input_type: 'select',
						input_label: '品类',
						attr_name: '品类（可多选）',
						is_multiple: true,
						is_filter: true,
						is_show: true,
						options: [],
						value: []
					},
					{
						input_type: 'select',
						input_label: '口味',
						attr_name: '口味（可多选）',
						is_multiple: true,
						is_filter: true,
						is_show: true,
						options: [{ label: '1', value: 1 }],
						value: []
					},
					{
						input_type: 'select',
						input_label: '城市',
						attr_name: '城市（可多选）',
						is_multiple: true,
						is_filter: true,
						is_show: true,
						options: [],
						value: []
					},
					{
						input_type: 'select',
						input_label: '区域',
						attr_name: '区域（可多选）',
						is_multiple: true,
						is_filter: true,
						is_show: false,
						options: [],
						value: []
					},
					{
						input_type: 'select',
						input_label: '酸度',
						attr_name: '酸度',
						is_multiple: false,
						is_show: false,
						options: [
							{
								value: '酸',
								label: '酸'
							},
							{
								value: '不酸',
								label: '不酸'
							}
						],
						value: ''
					},
					{
						input_type: 'select',
						input_label: '辣度',
						attr_name: '辣度',
						is_multiple: false,
						is_show: false,
						options: [
							{
								value: '辣',
								label: '辣'
							},
							{
								value: '不辣',
								label: '不辣'
							}
						],
						value: ''
					},
					{
						input_type: 'select',
						input_label: '甜度',
						attr_name: '甜度',
						is_multiple: false,
						is_show: false,
						options: [],
						value: ''
					},
					{
						input_type: 'select',
						input_label: '年龄段',
						attr_name: '年龄段',
						is_multiple: false,
						is_filter: true,
						is_show: false,
						options: [],
						value: ''
					},
					{
						input_type: 'select',
						input_label: '性别',
						attr_name: '性别',
						is_multiple: false,
						is_show: false,
						options: [
							{
								value: '女',
								label: '女'
							},
							{
								value: '男',
								label: '男'
							}
						],
						value: ''
					}
				],
				// 产品列表
				product_result_list: [],
				// 当前选中专案的序号
				current_pro_index: '',
				// 当前选中专案的name
				current_pro_name: '',
				// 当前选中专案的id
				current_pro_id: '',
				// 是否显示属性选择面板
				is_show_input_name_list: false,
				// 专案提交参数
				case_params: {
					// 关键字
					metaName: '',
					// 开始时间
					beginDate: '',
					// 结束时间
					endDate: '',
					// 口味
					taste: [],
					// 品类
					category: [],
					// 城市
					city: [],
					// 区域
					region: [],
					// 酸度
					sourTaste: '',
					// 辣度
					hotTaste: '',
					// 甜度
					sweetTaste: '',
					// 年龄段
					age: '',
					// 性别
					sex: ''
				},

				// 概念列表
				concept_result_list: [],
				// 概念列表-专案子类列表
				concept_case_list: [],
				// 选中的概念-专案下标
				current_con_case_index: '',
				// 选中的概念-专案id
				current_con_case_id: '',
				// 选中的概念-专案name
				current_con_case_name: '',
				// 概念筛选过滤属性列表
				concept_attrs_arr: [
					{
						input_type: 'date_month',
						input_label: '时间选择',
						attr_name: '时间日期',
						is_multiple: true,
						is_show: true,
						value: []
					},
					{
						input_type: 'select2',
						input_label: '品类',
						attr_name: '品类（可多选）',
						is_multiple: true,
						is_show: true,
						options: [],
						value: []
					},
					{
						input_type: 'select',
						input_label: '城市',
						attr_name: '城市（可多选）',
						is_multiple: true,
						is_show: true,
						options: [],
						value: []
					}
				],
				// 当前筛选面板
				current_query_type: 'productType',
				// 概念筛选面板小类
				s_type: '0',
				// 专案提交参数
				concept_params: {
					// 0：专案，1：概念
					type: '0',
					// 过滤字段
					cptName: '',
					// 开始时间
					beginDate: '',
					// 结束时间
					endDate: '',
					// 品类
					cptCategory: [],
					// 城市
					city: []
				},
				// 当前项目类别
				project_type: ''
			}
		},
		watch: {
			$route(to, from) {
				// 如果在首页和详情互相跳转则清空所选[因为目前这几个页面都是同一路由，且用keep-alive来缓存]
				if((from.query.page_type === 'case_detail' && to.query.page_type === 'concept_detail')
				|| (from.query.page_type === 'concept_detail' && to.query.page_type === 'case_detail')
				|| (from.query.page_type === 'concept_detail' && to.fullPath === '/index')
				|| (from.query.page_type === 'case_detail' && to.fullPath === '/index')
				|| (from.fullPath === '/index' && to.query.page_type === 'concept_detail')
				|| (from.fullPath === '/index' && to.query.page_type === 'concept_detail')) {
					// 专案
					this.key_str = ''
					this.is_show_filter_board = false
					this.is_show_input_name_list = false
					this.product_attrs_arr[0].value = []
					this.product_attrs_arr[1].value = []
					this.product_attrs_arr[2].value = []
					this.product_attrs_arr[3].value = []
					this.product_attrs_arr[4].value = []
					this.product_attrs_arr[5].value = ''
					this.product_attrs_arr[6].value = ''
					this.product_attrs_arr[7].value = ''
					this.product_attrs_arr[8].value = ''
					// 概念
					this.concept_attrs_arr[0].value = []
					this.concept_attrs_arr[1].value = []
					this.concept_attrs_arr[2].value = []
					this.s_type = '0'

					// 初始化专案和概念
					this.initCaseList({
						// 关键字
						metaName: '',
						// 开始时间
						beginDate: '',
						// 结束时间
						endDate: '',
						// 口味
						taste: [],
						// 品类
						category: [],
						// 城市
						city: [],
						// 区域
						region: [],
						// 酸度
						sourTaste: '',
						// 辣度
						hotTaste: '',
						// 甜度
						sweetTaste: '',
						// 年龄段
						age: '',
						// 性别
						sex: ''
					})
					this.initConceptList({
						// 0：专案，1：概念
						type: '0',
						// 过滤字段
						cptName: '',
						// 开始时间
						beginDate: '',
						// 结束时间
						endDate: '',
						// 品类
						cptCategory: [],
						// 城市
						city: []
					})
				}
			}
		},
		mounted() {
			// 获取当前项目是km || ky
			this.project_type = this.getCookie('customerType')
			if(this.project_type === 'km'){
				// 删除甜度
				this.product_attrs_arr.splice(7, 1)
			} else {
				// 删除辣度
				this.product_attrs_arr.splice(6, 1)
			}
			/*-------------------  产品测试   -------------------*/
			// 初始化方案列表
			this.initCaseList(this.case_params)
			// 初始化品类列表
			KMRS_CASE_API.get_category_list().then((data) => {
				this.product_attrs_arr[1].options = data.records
			})
			// 初始化口味列表
			KMRS_CASE_API.get_taste_list().then((data) => {
				this.product_attrs_arr[2].options = data.records
			})
			if(this.project_type === 'ky'){
				// 初始化甜度列表
				KMRS_CASE_API.get_sweet_list().then((data) => {
					this.product_attrs_arr[6].options = data.records
				})
			}
			// 初始化区域列表
			KMRS_CASE_API.get_search_box_area_list().then((data) => {
				this.product_attrs_arr[4].options = data.records
				// 再调用第一个区域的所有城市
				this.getAreaToCity()
			})
			// 初始化年龄区间
			KMRS_CASE_API.get_age_stage().then((data) => {
				this.product_attrs_arr[7].options = data.records
			})
			/*-------------------  概念筛选   -------------------*/
			// 初始化城市
			KMRS_CASE_API.get_search_box_area_to_city_list().then((data) => {
				if(data) {
					this.concept_attrs_arr[2].options = data.records
				}
			})
			// 初始化品类
			KMRS_CASE_API.get_concepts_category_list().then((data) => {
				if(data) {
					this.concept_attrs_arr[1].options = data
				}
			})
			// 初始化概念列表
			this.initConceptList(this.concept_params)
		},
		methods: {
			/**
			 * @description 获取对应字段的cookie值
			 * @param { string } name cookie的名字
			 */
			getCookie(name){
				// 获取cookie字符串 => 数组
				let cookie_str = document.cookie
				let cookie_arr = cookie_str.split("; ")
				//遍历匹配
				for ( let i = 0; i < cookie_arr.length; i++) {
					let cookie = cookie_arr[i].split("=");
					if (cookie[0] === name){
						return cookie[1];
					}
				}
				return "";
			},
			/**
			 * @description 检索关键词回调
			 */
			searchKey() {
				this.initCaseList(this.case_params)
				this.initConceptList(this.concept_params)
			},
			/**
			 * @description 获取专案列表
			 * @param { objcet } params 专案参数
			 */
			initCaseList(params) {
				// 获取当前关键词，并初始化专案列表
				params.metaName = this.key_str
				KMRS_CASE_API.get_case_list(params).then((data) => {
					if (data && data.length > 0) {
						this.product_result_num = data.length
						this.product_result_list = data
					} else {
						this.product_result_num = 0
						this.product_result_list = []
					}
				})
			},

			/**
			 * @description change字段后获取专案列表
			 * @param { string } input_label 某表单名
			 */
			changeInputInit(input_label) {
				// 获取当前关键词
				this.case_params.metaName = this.key_str
				// 当前选中的专案的序号
				this.current_pro_index = ''
				// 当前选中专案的id
				this.current_pro_id = ''
				switch (input_label) {
					case '时间选择': {
						if(this.product_attrs_arr[0].value) {
							this.case_params.beginDate = this.product_attrs_arr[0].value[0]
								? this.product_attrs_arr[0].value[0]
								: ''
							this.case_params.endDate = this.product_attrs_arr[0].value[1]
								? this.product_attrs_arr[0].value[1]
								: ''
						} else {
							this.case_params.beginDate = ''
							this.case_params.endDate = ''
							this.product_attrs_arr[0].value = []
						}
						
						break
					}
					case '品类': {
						this.case_params.category = this.product_attrs_arr[1].value
						// 初始化口味列表
						this.product_attrs_arr[2].value = []
						this.case_params.taste = []
						KMRS_CASE_API.get_taste_list({typeGroupName:this.case_params.category.join()}).then((data) => {
							this.product_attrs_arr[2].options = data.records
						})
						break
					}
					case '口味': {
						this.case_params.taste = this.product_attrs_arr[2].value
						break
					}
					case '城市': {
						this.case_params.city = this.product_attrs_arr[3].value
						break
					}
					case '区域': {
						// 更改请求参数
						this.case_params.region = this.product_attrs_arr[4].value
						// 清空city请求参数
						this.case_params.city = []
						// 初始化city表单值
						this.product_attrs_arr[3].value = []
						this.getAreaToCity(this.product_attrs_arr[4].value.join(','))
						break
					}
					case '酸度': {
						this.case_params.sourTaste = this.product_attrs_arr[5].value
						break
					}
					// 康面才有
					case '辣度': {
						this.case_params.hotTaste = this.product_attrs_arr[6].value
						break
					}
					// 康饮才有
					case '甜度': {
						this.case_params.sweetTaste = this.product_attrs_arr[6].value
						break
					}
					case '年龄段': {
						this.case_params.age = this.product_attrs_arr[7].value
						break
					}
					case '性别': {
						this.case_params.sex = this.product_attrs_arr[8].value
						break
					}
				}
				this.initCaseList(this.case_params)
			},

			/**
			 * @description 获取区域映射的城市
			 * @param { string } area_name 区域名
			 */
			getAreaToCity(area_name) {
				// 如果传递了区域名，则调用区域对应的城市
				if (area_name) {
					KMRS_CASE_API.get_search_box_area_to_city_list({
						region: area_name
					}).then((data) => {
						this.product_attrs_arr[3].options = data.records
					})
				} else {
					KMRS_CASE_API.get_search_box_area_to_city_list().then((data) => {
						this.product_attrs_arr[3].options = data.records
					})
				}
			},

			/**
			 * @description 获取概念列表
			 * @param { object } params 概念参数
			 */
			initConceptList(params) {
				// 初始化参数
				params.cptName = this.key_str
				// 获取概念=>专案
				params.type = '0'
				// ？是否可以合并为一个接口
				KMRS_CASE_API.get_concept_list(params).then(data => {
					if(data && data.length > 0) {
						// 清空已经选择的专案、id
						this.current_con_case_index = ''
						this.current_con_case_id = ''
						// 重新初始化
						this.concept_case_list = data
						this.concept_case_num = data.length
					} else {
						this.concept_case_num = 0
						this.concept_case_list = []
					}
				})
				// 获取概念=>概念
				let copy_params = JSON.parse(JSON.stringify(params))
				copy_params.type = '1'
				KMRS_CASE_API.get_concept_list(copy_params).then(data => {
					if(data && data.length > 0) {
						// 重新初始化
						this.concept_result_list = data
						this.concept_result_num = data.length
					} else {
						this.concept_result_num = 0
						this.concept_result_list = []
					}
				})
			},

			changeConceptInputInit(input_label) {
				// 获取当前关键词
				this.case_params.cptName = this.key_str
				// 选中的概念-专案下标
				this.current_con_case_index = ''
				// 选中的概念-专案id
				this.current_con_case_id = ''
				// 选中的概念-专案name
				this.current_con_case_name = ''
				switch (input_label) {
					case '时间选择': {
						console.log(this.concept_attrs_arr[0].value)
						if(this.concept_attrs_arr[0].value) {
							this.concept_params.beginDate = this.concept_attrs_arr[0].value[0]
								? this.concept_attrs_arr[0].value[0]
								: ''
							this.concept_params.endDate = this.concept_attrs_arr[0].value[1]
								? this.concept_attrs_arr[0].value[1]
								: ''
						} else {
							this.concept_params.beginDate = ''
							this.concept_params.endDate = ''
							this.concept_attrs_arr[0].value = []
						}
						break
					}
					case '品类': {
						console.log('品类变化：', this.concept_attrs_arr[1].value)
						this.concept_params.cptCategory = this.concept_attrs_arr[1].value
						break
					}
					case '城市': {
						this.concept_params.city = this.concept_attrs_arr[2].value
						break
					}
				}
				this.initConceptList(this.concept_params)
			},

			/**
			 * @description 选中某个产品
			 * @param { object } item 当下这个产品
			 * @param { number } index 当下这个产品index
			 */
			selectThisProduct(item, index) {
				this.current_pro_index = index
				this.current_pro_id = item.metaGuid
				this.current_pro_name = item.metaName
			},

			/**
			 * @description 选中若干概念
			 * @param { object } item 当下这个概念
			 */
			selectSomeConcept(item) {
				item.isChecked = !item.isChecked
			},

			/**
			 * @description 是否显示详细过滤面板
			 * @param {boolean} is_show_filter_board 显示与否boolean值
			 */
			switchFilterBoard(is_show_filter_board) {
				this.is_show_filter_board = is_show_filter_board
			},

			/**
			 * @description 提交选中的方案/概念，跳转到详情
			 * @param {boolean} is_show_filter_board 显示与否boolean值
			 * @param {string} board_type 当前面板类型
			 */
			submitBoardForm(is_show_filter_board, board_type) {
				// 如果是专案面板
				if (board_type === 'product') {
					// 如果当前选中专案的id为空则禁止提交，并返回
					if (this.current_pro_id === '') {
						this.$alert('请选择一个专案！', '提示', {
							confirmButtonText: '确定'
						})
						return
					} else {
						this.is_show_filter_board = is_show_filter_board
						// 跳转专案详情 this.current_pro_id   this.metaName
						this.$router.push({
							path: 'index',
							query: {
								page_type: 'case_detail',
								case_id: this.current_pro_id,
								case_name: this.current_pro_name
							}
						})
						this.current_pro_index = ''
						this.current_pro_id = ''
						this.current_pro_name = ''
					}
				} else {
					// 概念-概念子模块
					if (this.s_type === '1') {
						let ids_arr = []
						let names_arr = []
						for (let i = 0, len = this.concept_result_list.length; i < len; i++) {
							if (this.concept_result_list[i].isChecked) {
								ids_arr.push(this.concept_result_list[i].cptId)
								names_arr.push(this.concept_result_list[i].cptName)
							}
						}
						// 如果当前选中概念的id为空则禁止提交，并返回
						if (ids_arr.length === 0) {
							this.$alert('提示！', '请至少选择一个概念！', {
								confirmButtonText: '确定',
							})
							return
						} else {
							// 跳转到概念详情
							this.$router.push({
								path: 'index',
								query: {
									page_type: 'concept_detail',
									concept_ids: ids_arr.join(','),
									concept_names: names_arr.join(',')
								}
							})
						}
					} else {
						// 概念-专案子模块
						// 如果当前选中专案的id为空则禁止提交，并返回
						if (this.current_con_case_id === '') {
							this.$alert('请选择一个专案！', '提示', {
								confirmButtonText: '确定'
							})
							return
						} else {
							this.is_show_filter_board = is_show_filter_board
							// 跳转到概念详情
							this.$router.replace({
								path: 'index',
								query: {
									page_type: 'concept_detail',
									concept_case_id: this.current_con_case_id,
									concept_case_name: this.current_con_case_name
								}
							})
							this.current_con_case_index = ''
							this.current_con_case_id = ''
							this.current_con_case_name = ''
						}
					}
				}
			},

			/**
			 * @description 切换产品测试 || 概念筛选
			 * @param {string} type_name 某过滤面板名字
			 */
			switchQueryType(type_name) {
				this.current_query_type = type_name
			},

			/**
			 * @description 是否显示字段面板
			 */
			switchShowInputNameList() {
				this.is_show_input_name_list = !this.is_show_input_name_list
			},
			closeInputNameList() {
				this.is_show_input_name_list = false
			},

			/**
			 * @description 勾选某个字段
			 */
			selectThisAttr(item) {
				if (!item.is_show) {
					item.is_show = !item.is_show
				}
			},

			/**
			 * @description 删除某个字段过滤器，并清空此中内容
			 * @param { object } item 某个过滤字段对象
			 */
			delThisAttr(item) {
				item.is_show = false
				switch (item.input_label) {
					case '时间选择': {
						item.value = []
						this.case_params.beginDate = ''
						this.case_params.endDate = ''
						break
					}
					case '口味': {
						item.value = []
						this.case_params.taste = []
						break
					}
					case '品类': {
						item.value = []
						this.case_params.category = []
						// 初始化口味
						this.product_attrs_arr[2].value = []
						this.case_params.taste = []
						KMRS_CASE_API.get_taste_list({typeGroupName: ''}).then((data) => {
							this.product_attrs_arr[2].options = data.records
						})
						break
					}
					case '城市': {
						item.value = []
						this.case_params.city = []
						break
					}
					case '区域': {
						item.value = []
						this.case_params.region = []
						break
					}
					case '酸度': {
						item.value = ''
						this.case_params.sourTaste = ''
						break
					}
					case '辣度': {
						item.value = ''
						this.case_params.hotTaste = ''
						break
					}
					case '甜度': {
						item.value = ''
						this.case_params.sweetTaste = ''
						break
					}
					case '年龄段': {
						item.value = ''
						this.case_params.age = ''
						break
					}
					case '性别': {
						item.value = ''
						this.case_params.sex = ''
						break
					}
				}
				this.initCaseList(this.case_params)
			},

			/**
			 * @description 切换概念小类
			 */
			sTypeChange() {
				this.concept_params.type = this.s_type
			},
			/**
			 * @description 选中某个概念中的专案
			 * @param { object } item 当下这个专案
			 * @param { number } index 当下这个专案index
			 */
			selectThisConceptCase(item, index) {
				this.current_con_case_index = index
				this.current_con_case_id = item.cptId
				this.current_con_case_name = item.cptName
			}
		}
	}
</script>

<style scoped lang="scss">
	.searchBox {
		font-size: 14px;
		position: relative;
		z-index: 1;
		width: 730px;
		margin-left: auto;
		margin-right: auto;
		.inputKeyBox {
			width: 630px;
			height: 40px;
			margin-left: auto;
			margin-right: auto;
			line-height: 40px;
			border-radius: 20px;
			border: 1px solid #b7b7b7;
			display: flex;
			transition: all 0.3s;
			.icon-search {
				padding-top: 8px;
				padding-left: 10px;
				font-size: 24px;
				font-weight: bold;
				color: #b7b7b7;
				transition: all 0.3s;
			}
			.keyInput {
				width: 504px;
			}
			.searchButton {
				cursor: pointer;
				width: 90px;
				height: 39px;
				background: #930cea;
				border-radius: 0px 20px 20px 0px;
				text-align: center;
				color: #ffffff;
			}
		}
		.focused {
			border: 1px solid #930cea;
			.icon-search {
				color: #930cea;
			}
		}
		.detailSearchBox {
			position: absolute;
			z-index: 1;
			top: 50px;
			margin-left: auto;
			margin-right: auto;
			width: 724px;
			height: 450px;
			background: #f6f6f6;
			box-shadow: 0px 0px 5px 3px rgba(0, 0, 0, 0.06);
			border: 1px solid #e8e8e8;
			.searchTypeTabs {
				height: 40px;
				font-size: 13px;
				background-color: #ffffff;
				color: #333333;
				.perSearchType {
					cursor: pointer;
					display: inline-block;
					text-align: center;
					margin-top: 16px;
					padding-bottom: 4px;
					margin-left: 10px;
					width: 64px;
					border-bottom: 3px solid #ffffff;
				}
				.perSearchTypeActive {
					border-bottom: 3px solid #930cea;
				}
			}
			// 通用结果面板区域，包括产品+概念
			.resultArea {
				.inputResultModel {
					display: flex;
					width: 100%;
					justify-content: space-between;
					margin-top: 10px;
					padding-left: 10px;
					padding-right: 10px;
					.leftPart {
						width: 450px;
						background-color: #ffffff;
						.generalResultMesage {
							height: 32px;
							line-height: 32px;
							border-bottom: 1px solid #e0e6ed;
							color: #565656;
							display: flex;
							justify-content: space-between;
							.sRadio {
								font-size: 12px;
								margin-right: 15px;
								.el-radio__label {
									font-size: 12px;
									margin-left: 4px;
								}
							}
							.resultNum {
								margin-left: 16px;
							}
							.checkboxType {
								font-size: 10px;
								color: #a4a4a4;
								margin-right: 16px;
							}
						}
						.resultList {
							height: 316px;
							overflow-y: auto;
							padding: 10px 16px 10px 10px;
							color: #333333;
							font-size: 12px;
							cursor: pointer;
							.perResult {
								display: flex;
								justify-content: space-between;
								margin-top: 10px;
								.resultText {
									width: 332px;
									overflow: hidden;
									text-overflow: ellipsis;
									white-space: nowrap;
								}
								.radioChecked {
									opacity: 0;
									font-size: 18px;
								}
							}
							.perConceptResult {
								margin-top: 4px;
								width: 120px;
								margin-left: 12px;
								overflow: hidden;
								text-overflow: ellipsis;
								white-space: nowrap;
								margin-bottom: 6px;
							}
							.perResultActive {
								color: #930cea;
								.radioChecked {
									opacity: 1;
								}
							}
						}
						.conceptResultList {
							display: flex;
							flex-wrap: wrap;
							align-content: flex-start;
						}
					}
					.rightPart {
						background-color: #ffffff;

						.inputList {
							width: 244px;
							height: 316px;
							overflow-y: auto;
							.perInput {
								margin-top: 10px;
								.inputLabel {
									width: 200px;
									font-size: 12px;
									margin-left: 12px;
									margin-bottom: 6px;
									.iconDelInputButton {
										color: #b2b2b2;
										cursor: pointer;
										display: none;
										font-size: 14px;
									}
								}
								.inputLabel:hover {
									.iconDelInputButton {
										display: inline;
									}
								}
								.baseInputCss {
									width: 210px;
									margin-left: 12px;
								}
							}
						}
						.addNewInputArea {
							color: #930cea;
							margin-left: 12px;
							margin-top: 5px;
							margin-bottom: 5px;
							position: relative;
							.addNewInputButton {
								display: inline-block;
								cursor: pointer;
							}
							.inputNameList {
								display: none;
								position: absolute;
								z-index: 1;
								font-size: 12px;
								top: -258px;
								left: 0;
								width: 137px;
								height: 258px;
								overflow-y: auto;
								background: #ffffff;
								box-shadow: 0px 0px 5px 3px rgba(0, 0, 0, 0.06);
								border: 1px solid #e8e8e8;
								color: #333333;
								.perAttr {
									padding: 4px 0px 4px 14px;
									cursor: pointer;
									margin-bottom: 4px;
									margin-top: 4px;
								}
								.perAttr:hover {
									background-color: #f5f7fa;
								}
								.perAttrActive {
									color: #c3c3c3;
									cursor: not-allowed;
								}
							}
							.inputNameListActive {
								display: block;
							}
						}
					}
				}
				// 提交按钮组，取消+确定
				.submitButtons {
					display: flex;
					justify-content: center;
					margin-top: 10px;
					.perButton {
						width: 87px;
						height: 30px;
						line-height: 30px;
						text-align: center;
						border-radius: 4px;
						border: 1px solid #b8b8b8;
						color: #6d7278;
						font-size: 12px;
						cursor: pointer;
					}
					.submitButton {
						background: #930cea;
						border: 1px solid #930cea;
						margin-left: 20px;
						color: #ffffff;
					}
				}
			}
		}
		.detailSearchBoxHide {
			display: none;
		}
	}
</style>

<style lang="scss">
	.searchBox {
		.keyInput {
			.el-input__inner {
				border: 0;
				height: 32px;
				line-height: 32px;
			}
		}
		.sRadio {
			.el-radio__label {
				font-size: 12px;
				margin-left: 4px;
				padding-left: 4px;
			}
		}
	}
</style>
