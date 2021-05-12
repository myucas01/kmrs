<!--
    专案详情
-->
<template>
	<div class="caseDetail" v-if="part === 2">
		<!--总体数据-->
		<div class="modelContainer">
			<div class="modelLabelPart">
				<span class="modelName">数据查看</span>
			</div>
			<div class="modelContent generalCaseCtrlBoard">
				<span class="caseName">{{ case_name }}</span>
				<div class="ctrlButtons">
					<span v-auth='"meta:select:result:export"' class="functionButton" @click="jumpToRawData"><i class="el-icon-s-data funIcon"></i>原始数据导出</span>
					<a class="functionButton" :href="'/word/word-list?tabValue=5&metaName='+case_name"><i class="el-icon-s-order funIcon" v-auth='"meta:select:result:downloaddata"'></i>下载报告</a>
				</div>
			</div>
		</div>
		<!--整体喜好度-->
		<div class="modelContainer">
			<div class="modelLabelPart">
				<span class="modelName">整体喜好度</span>
				<div class="formPart">
					<span class="typeColorBlock othersBlock">{{preferenct_type[1]}}</span>
					<span class="typeColorBlock">{{preferenct_type[0]}}</span>
					<el-select
						v-model="math_type_value"
						placeholder="请选择"
						@change="getGeneralPreference"
						class="selectModel"
						size="mini"
					>
						<el-option
							v-for="item in math_type_options"
							:key="item.value"
							:label="item.label"
							:value="item.value"
						>
						</el-option>
					</el-select>
					<div class="functionButton" @click="exportPic('part_1')" v-auth='"meta:select:result:downloadpicture"'>
						<i class="el-icon-picture funIcon"></i>图片导出
					</div>
					<span class="aLink" @click="jumpToBI('preference')" v-auth='"meta:select:result:more"'>更多详情>></span>
				</div>
			</div>
			<div class="modelContent modelContent1" id="part_1">
				<div class="leftPartContainer">
					<chart :options="bar_x_chart_option" />
				</div>
				<div class="rightPartContainer">
					<chart :options="bar_y_chart_option" />
				</div>
			</div>
		</div>
		<!--整体数据库位置-->
		<div class="modelContainer">
			<div class="modelLabelPart">
				<span class="modelName">整体数据库位置</span>
				<div class="formPart">
					<!--喜好程度-->
					<el-select
						v-model="like_type_value"
						placeholder="请选择"
						class="selectModel"
						size="mini"
						@change="getGeneraldatabaseLocation"
					>
						<el-option
							v-for="item in like_type_options"
							:key="item.value"
							:label="item.label"
							:value="item.value"
						>
						</el-option>
					</el-select>
					<!--计算方式-->
					<el-select
						v-model="math_type_value_2"
						placeholder="请选择"
						class="selectModel"
						size="mini"
						@change="getGeneraldatabaseLocation"
					>
						<el-option
							v-for="item in math_type_options_2"
							:key="item.value"
							:label="item.label"
							:value="item.value"
						>
						</el-option>
					</el-select>
					<!--产品类型-->
					<el-select
						v-model="product_type_value"
						placeholder="请选择"
						class="selectModel"
						size="mini"
						@change="getGeneraldatabaseLocation"
					>
						<el-option
							v-for="item in product_type_options"
							:key="item.value"
							:label="item.label"
							:value="item.value"
						>
						</el-option>
					</el-select>
					<div class="functionButton" @click="exportPic('part_2')" v-auth='"meta:select:result:downloadpicture"'>
						<i class="el-icon-picture funIcon"></i>图片导出
					</div>
					<span class="aLink" @click="jumpToBI('dataLocation')" v-auth='"meta:select:result:more"'>更多详情>></span
					>
				</div>
			</div>
			<div class="modelContent">
				<div class="mapContainer" id="part_2">
					<div class='nationalPointer' :style='{top: top_num + "px"}'>
						<span class='nationalPointerNum'>{{ natinal_percent }}</span>
						<span class='triangle'></span>
					</div>
					<chart :options="map_chart_option" />
				</div>
				<div class="tableContent">
					<el-table
						width="80%"
						:data="table_data"
						:span-method="objectSpanMethod"
						border
						style="width: 100%; margin-top: 20px"
					>
						<el-table-column align="center" prop="area1" label="地区">
						</el-table-column>
						<el-table-column align="center" prop="num1" label="场次数">
						</el-table-column>
						<el-table-column align="center" prop="percent1" label="百分比">
						</el-table-column>

						<el-table-column align="center" prop="area2" label="地区">
						</el-table-column>
						<el-table-column align="center" prop="num2" label="场次数">
						</el-table-column>
						<el-table-column align="center" prop="percent2" label="地区百分比">
						</el-table-column>

						<el-table-column align="center" prop="area3" label="地区">
						</el-table-column>
						<el-table-column align="center" prop="num3" label="场次数">
						</el-table-column>
						<el-table-column align="center" prop="percent3" label="城市百分比">
						</el-table-column>
					</el-table>
				</div>
			</div>
		</div>
		<!--整体适合度-->
		<div class="modelContainer">
			<div class="modelLabelPart">
				<span class="modelName">整体适合度</span>
				<div class="formPart">
					<div class="functionButton" @click="exportPic('part_3')" v-auth='"meta:select:result:downloadpicture"'>
						<i class="el-icon-picture funIcon"></i>图片导出
					</div>
					<div class="formPart">
						<span class="aLink" @click="jumpToBI('fitness')" v-auth='"meta:select:result:more"'>更多详情>></span>
					</div>
				</div>
			</div>
			<div class="modelContent modelContent2" id="part_3">
				<div class="halfContainer">
					<chart :options="radar_option" />
				</div>
				<div class="halfContainer">
					<chart :options="bar_x_chart_option2" />
				</div>
			</div>
		</div>
		<!--整体对比偏好-->
		<div class="modelContainer">
			<div class="modelLabelPart">
				<span class="modelName">整体对比偏好</span>
				<div class="formPart">
					<div class="functionButton" @click="exportPic('part_4')" v-auth='"meta:select:result:downloadpicture"'>
						<i class="el-icon-picture funIcon"></i>图片导出
					</div>
					<div class="formPart">
						<span class="aLink" @click="jumpToBI('comparisonPreference')" v-auth='"meta:select:result:more"'>更多详情>></span
						>
					</div>
				</div>
			</div>
			<div class="modelContent modelContent3" id="part_4">
				<div class="stackedBarContainer generalStackedBarContainer">
					<chart :options="bar_x_stacked_general_chart_option" />
				</div>
				<div
					class="stackedBarContainer"
					:style="{ height: container_height + 'px' }"
				>
					<chart :options="bar_x_stacked_chart_option" />
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	/*---------------------导入echarts组件，以及折线图和柱状图配置构造器---------------------*/
	import barXChart from '@/util/chartOptions/barXChart'
	import barYChart from '@/util/chartOptions/barYChart'
	import radarChart from '@/util/chartOptions/radarChart'
	import barXChart2 from '@/util/chartOptions/barXChart2'
	import barXStackedChart from '@/util/chartOptions/barXStackedChart'
	import mapChart from '@/util/chartOptions/mapChart'
	import chart from '@/components/Chart'
	/*---------------------导入商机导航接口API---------------------*/
	import KMRS_CASE_API from '../../../api/case_api.js'
	import screenImg from '@/util/screenImg'

	export default {
		data() {
			return {
				// 方案id
				case_id: '',
				// 方案名
				case_name: '',
				/*--- 整体喜好度 ---*/
				preferenct_type:[],
				math_type_options: [
					{
						value: '1',
						label: 'mean'
					},
					{
						value: '2',
						label: 'top1'
					},
					{
						value: '3',
						label: 'top2'
					},
					{
						value: '5',
						label: 'bot1'
					},
					{
						value: '4',
						label: 'bot2'
					}
				],
				math_type_value: '1',

				/*--- 整体数据库位置 ---*/
				// 全国值在左侧bar上的相对位置 58px为100%，258为0%，高度差为200
				top_num:58,
				// 全国百分比
				natinal_percent:'--',
				like_type_options: [
					{
						value: '1',
						label: '整体喜好度'
					},
					{
						value: '2',
						label: '购买意愿'
					}
				],
				like_type_value: '1',
				math_type_options_2: [
					{
						value: '1',
						label: 'mean'
					},
					{
						value: '2',
						label: 'top1'
					},
					{
						value: '3',
						label: 'top2'
					},
					{
						value: '5',
						label: 'bot1'
					},
					{
						value: '4',
						label: 'bot2'
					}
				],
				math_type_value_2: '1',
				// 产品类型
				product_type_options: [],
				// 产品类型值
				product_type_value: '1',
				// 产品类型名
				product_type_name: '',
				// 中国地图配置
				map_chart_option: {},

				/*--- 整体适合度 ---*/
				// 雷达图配置项（适合度）
				radar_option: {},
				// 多维柱状图（正向指标）
				bar_x_chart_option2: {},

				// 横向柱状图配置项
				bar_x_chart_option: {},
				// 纵向柱状图配置项
				bar_y_chart_option: {},

				/*--- 整体对比偏好 ---*/
				// 堆叠柱状图（整体对比偏好）
				container_height: 260,
				bar_x_stacked_chart_option: {},
				bar_x_stacked_general_chart_option: {},

				table_data: [],
				table_tree_source: [
					{
						area: '全国',
						area_num: '455544',
						area_per: '55%',
						children: [
							{
								area: '中区',
								area_num: '55544',
								area_per: '55%',
								children: [
									{
										area: '上海2',
										area_num: '144',
										area_per: '43%',
										children: []
									}
								]
							},
							{
								area: '南区',
								area_num: '455544',
								area_per: '55%',
								children: [
									{
										area: '上海',
										area_num: '144',
										area_per: '43%',
										children: []
									},
									{
										area: '南京',
										area_num: '966',
										area_per: '155%',
										rowspan: 0,
										children: []
									}
								]
							},
							{
								area: '北区',
								area_num: '455544',
								area_per: '55%',
								rowspan: 2,
								children: [
									{
										area: '天津',
										area_num: '44',
										area_per: '5%',
										rowspan: 4,
										children: []
									},
									{
										area: '北京',
										area_num: '532',
										area_per: '45%',
										rowspan: 4,
										children: []
									}
								]
							}
						]
					}
				],
				table_source_obj: {
					area_1: '',
					num_1: '',
					percent_1: '',
					area_2: '',
					num_2: '',
					percent_2: '',
					area_3: '',
					num_4: '',
					percent_4: '',
					all_rowspan: 1,
					area_rowspan: 1
				},
				current_value: '',
				current_value_rowspan_num: 0
			}
		},
		props: ['part'],
		components: { chart },
		mounted() {
			this.initAll()
		},
		methods: {
			/**
			 * @description 初始化所有
			 */
			initAll() {
				// 获取caseId
				if (this.$route.query.page_type === 'case_detail' && this.$route.query.case_id) {
					console.log('专案详情初始化完毕')
					this.case_id = this.$route.query.case_id
					this.case_name = this.$route.query.case_name
					/*--- 整体喜好度 ---*/
					this.getGeneralPreference()

					/*--- 整体数据库位置, 获取产品类别 ---*/
					KMRS_CASE_API.get_case_type({
						metaGuid: this.case_id
					}).then((data) => {
						this.product_type_options = data.typeCodeAndNameBos
						this.getGeneraldatabaseLocation()
					})

					/*--- 整体适合度 ---*/
					this.getFitness()

					/*--- 整体对比偏好 ---*/
					this.getContrastPreference()
				}
			},
			/**
			 * @description 获取整体喜好度
			 */
			getGeneralPreference() {
				KMRS_CASE_API.get_case_preference_charts({
					metaGuid: this.case_id,
					type: this.math_type_value
				}).then((data) => {
					if (data.left) {
						this.preferenct_type = data.left.names
						this.bar_x_chart_option = barXChart(
							data.left.names,
							data.left.data,
							this.math_type_value !== '1' ? true : false
						)
					}
					if (data.right) {
						this.bar_y_chart_option = barYChart(
							data.right.names,
							data.right.series,
							this.math_type_value !== '1' ? true : false
						)
					}
				})
			},

			/**
			 * @description 获取整体数据库位置
			 */
			getGeneraldatabaseLocation() {
				this.product_type_options.forEach((item) => {
					if (item.value === this.product_type_value) {
						this.product_type_name = item.label
					}
				})
				KMRS_CASE_API.get_case_databaseLocation_charts({
					metaGuid: this.case_id,
					mean: this.math_type_value_2,
					option: this.like_type_value,
					type: this.product_type_value,
					typeName: this.product_type_name
				}).then((data) => {
					if (data) {
						this.map_chart_option = mapChart(data.list)
						this.natinal_percent = data.table[0].areaPer
						this.top_num = 58 + (100 - parseFloat(this.natinal_percent))*2
						this.transformTree(data.table)
					}
				})
			},

			/**
			 * @description 合并单元格
			 */
			objectSpanMethod({ row, rowIndex, columnIndex }) {
				if (columnIndex === 0 || columnIndex === 1 || columnIndex === 2) {
					// 因为第1/2/3列特别，只能是全国，所以只需判断第一行即可
					if (rowIndex === 0) {
						return {
							rowspan: row.c1_rowspan,
							colspan: 1
						}
					} else {
						return {
							rowspan: 0,
							colspan: 0
						}
					}
				}
				// 第4/5/6列为多行合并，如果c2_rowspan存在（>0）则合并
				if (columnIndex === 3 || columnIndex === 4 || columnIndex === 5) {
					if (row.c2_rowspan) {
						return {
							rowspan: row.c2_rowspan,
							colspan: 1
						}
					} else {
						return {
							rowspan: 0,
							colspan: 0
						}
					}
				}
			},

			/**
			 * @description 将组织树转化为table
			 * @param { object } tree 组织树
			 */
			transformTree(tree) {
				this.table_data = []
				// 定义一个所有最大所有行变量，用来给全国rowspan用
				let c1_rowspan = 0
				// 遍历所有树
				for (let i = 0, len = tree.length; i < len; i++) {
					// 区级别
					for (let j = 0, len2 = tree[i].children.length; j < len2; j++) {
						// 市级别
						for (
							let k = 0, len3 = tree[i].children[j].children.length;
							k < len3;
							k++
						) {
							// 定义每一行对象
							let table_row_obj = {}
							table_row_obj.c2_rowspan = tree[i].children[j].children.length
							table_row_obj.area1 = tree[i].area
							table_row_obj.num1 = tree[i].areaNum
							table_row_obj.percent1 = tree[i].areaPer

							table_row_obj.area2 = tree[i].children[j].area
							table_row_obj.num2 = tree[i].children[j].areaNum
							table_row_obj.percent2 = tree[i].children[j].areaPer

							table_row_obj.area3 = tree[i].children[j].children[k].area
							table_row_obj.num3 = tree[i].children[j].children[k].areaNum
							table_row_obj.percent3 = tree[i].children[j].children[k].areaPer
							// 累计增加最大行数
							c1_rowspan++
							// 将行对象塞入数组
							this.table_data.push({
								area1: tree[i].area,
								num1: tree[i].areaNum,
								percent1: tree[i].areaPer,
								area2: tree[i].children[j].area,
								num2: tree[i].children[j].areaNum,
								percent2: tree[i].children[j].areaPer,
								area3: tree[i].children[j].children[k].area,
								num3: tree[i].children[j].children[k].areaNum,
								percent3: tree[i].children[j].children[k].areaPer,
								// 这里最为重要，只判断 市 级别第一行父级（区）含有的子节点
								c2_rowspan: k === 0 ? tree[i].children[j].children.length : 0
							})
						}
					}
				}
				this.table_data[0].c1_rowspan = c1_rowspan
			},

			/**
			 * @description 获取适合度
			 */
			getFitness() {
				KMRS_CASE_API.get_case_fitness_charts({
					metaGuid: this.case_id
				}).then((data) => {
					if (data.left) {
						// 初始化雷达图数据
						this.radar_option = radarChart(
							data.left.names,
							data.left.indicator,
							data.left.data
						)
					}
					if (data.right) {
						// 初始正向指标
						this.bar_x_chart_option2 = barXChart2(
							data.right.names,
							data.right.type,
							data.right.series
						)
					}
				})
			},

			/**
			 * @description 获取对比偏好
			 */
			getContrastPreference() {
				KMRS_CASE_API.get_case_contrastPreference_charts({
					metaGuid: this.case_id
				}).then((data) => {
					// 对全国数据特殊处理
					this.bar_x_stacked_general_chart_option = barXStackedChart(
						data.legend,
						['整体'],
						data.generalData,
						true
					)
					// 一般城市
					if (data.citys) {
						this.container_height = data.citys.length * 40
						this.bar_x_stacked_chart_option = barXStackedChart(
							data.legend,
							data.citys,
							data.data,
							false
						)
					}
				})
			},

			/**
			 * @description 下载各个模块的echarts图片
			 * @param { string } part_name 模块名
			 */
			exportPic(part_name) {
				let loading = this.$loading({
					lock: true,
					text: 'Loading',
					spinner: 'el-icon-loading',
					background: 'rgba(0, 0, 0, 0.7)'
				})
				setTimeout(function(){
					screenImg(part_name)
					loading.close()
				}, 100)
			},

			/**
			 * @description 跳转到BI详情
			 * @param { string } data_type 子模块名
			 */
			jumpToBI(data_type) {
				this.$router.push(
					'/export/original-data-table?case_id=' +
						this.case_id +
						'&data_type=' +
						data_type +
						'&case_name=' +
						this.case_name
				)
			},

			/**
			 * @description 跳转到导出BI详情
			 */
			jumpToRawData() {
				this.$router.push(
					'/export/raw-data-export?case_id=' +
						this.case_id +
						'&case_name=' +
						this.case_name
				)
			}
		}
	}
</script>

<style scoped lang="scss">
	.caseDetail {
		width: 1134px;
		margin: 30px auto;
		border: 1px solid #e0e6ed;
		color: #333333;
		padding: 18px;
		margin-bottom: 20px;
		.modelContainer {
			margin-bottom: 20px;
		}
		.modelLabelPart {
			display: flex;
			justify-content: space-between;
			align-items: center;
			.formPart {
				display: flex;
				align-items: center;
			}
			.modelName {
				border-left: 5px solid #930cea;
				line-height: 18px;
				height: 18px;
				font-size: 16px;
				font-weight: bold;
				padding-left: 6px;
				letter-spacing: 1px;
			}
			.typeColorBlock {
				line-height: 12px;
				border-left: 12px solid #866ced;
				height: 12px;
				font-size: 12px;
				padding-left: 6px;
				margin-left: 40px;
			}
			.othersBlock {
				border-left: 12px solid #fab8ff;
			}
			.selectModel {
				margin-left: 20px;
			}
			.aLink {
				font-size: 12px;
				color: #a0a0a0;
				margin-left: 20px;
				cursor: pointer;
			}
		}
		.modelContent {
			width: 1095px;
			border: 1px solid #e0e6ed;
			margin-top: 13px;
			.leftPartContainer {
				width: 350px;
				height: 200px;
			}
			.rightPartContainer {
				width: 600px;
				height: 268px;
			}
			.halfContainer {
				width: 50%;
				height: 400px;
			}
			.mapTable {
				width: 80%;
			}
			.tableContent {
				width: 1050px;
				margin-left: auto;
				margin-right: auto;
				margin-bottom: 10px;
			}
		}
		.modelContent1,
		.modelContent2,
		.modelContent3 {
			display: flex;
			justify-content: space-around;
			align-items: center;
		}
		.modelContent2 {
			height: 430px;
		}
		.modelContent3 {
			flex-direction: column;
		}
		.stackedBarContainer {
			width: 500px;
			height: 80px;
			border: 1px solid #e0e6ed;
			margin-bottom: 20px;
		}
		.generalStackedBarContainer {
			border: 0;
		}
		.mapContainer {
			position: relative;
			width: 100%;
			height: 380px;
			.nationalPointer{
				position: absolute;
				top:58px;
				right:880px;
				font-size:14px;
				font-weight: bold;
				.nationalPointerNum{
					background-color: #FFEA6C;
					vertical-align: middle;
					padding:2px;
				}
				.triangle{
					vertical-align: middle;
					display: inline-block;
					width: 0;
					height: 0;
					border-top: 10px solid transparent;
					border-right: 10px solid transparent;
					border-bottom: 10px solid transparent;
					border-left: 10px solid #FFEA6C;
					
				}
			}
		}
		.generalCaseCtrlBoard {
			display: flex;
			justify-content: space-between;
			align-items: center;
			height: 63px;
			padding: 15px;
			font-size: 13px;
			font-weight: bold;
		}
		.functionButton {
			display: inline-block;
			cursor: pointer;
			width: 116px;
			height: 26px;
			line-height: 26px;
			background: #f8edff;
			border-radius: 4px;
			border: 1px solid #930cea;
			color: #930cea;
			margin-left: 20px;
			text-align: center;
			.funIcon {
				padding-right: 4px;
			}
		}
	}
</style>
