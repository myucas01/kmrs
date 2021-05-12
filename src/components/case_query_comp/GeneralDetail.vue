<!--
    首页专案查询面板
-->
<template>
	<div class="generalDetail" v-if='part === 1'>
		<div class='boardTopTitle'>整体场次</div>
		<div class='optArea'>
			<!--过滤面板-->
			<div class='formFilter'>
				<!--首页echarts面板过滤表单：日历-->
				<el-date-picker
					class='echatsFilterDate'
					size='mini'
					v-model="general_date"
					type="monthrange"
					range-separator="至"
					start-placeholder="开始日期"
					end-placeholder="结束日期"
					format='yyyy-MM'
					value-format='yyyy-MM'
					@change='dateChange'
					clearable>
				</el-date-picker>
				<!--首页echarts面板过滤表单：产品测试/-->
				<el-select v-model="params.type" class='echatsFilterType' size='mini' placeholder="请选择">
					<el-option
						v-for="item in type_options"
						:key="item.value"
						:label="item.label"
						:value="item.value">
					</el-option>
				</el-select>
				<!--首页echarts面板过滤表单：地区-->
				<el-select v-model="params.regionName" class='echatsFilterArea' size='mini' placeholder="全国" clearable>
					<el-option
						v-for="item in area_options"
						:key="item.value"
						:label="item.label"
						:value="item.value">
					</el-option>
				</el-select>
				<el-button type="primary" class='submitEchFilButton' size='mini' @click='getEcharts'>查看</el-button>
			</div>
			<!--导出按钮-->
			<el-button v-auth='"meta:select:result:downloadpicture"' type="primary" class='exportEchartsPicButton' size='mini' @click='exportPic'><i class="el-icon-picture"></i>图片导出</el-button>
		</div>
		<div class='echartsBoard' id='echarts_board'>
			<div class='echartsContainer pieChartCon'>
				<div class='echartsLabel'><span class='point'></span>总场次数为 {{echarts_general_num}}</div>
				<div class='ehcartsBox'>
					<div class='parentAreaName'>{{current_area}}</div>
					<chart :options="pieOption" />
				</div>
			</div>
			<div class='echartsContainer mulLineChartCon'>
				<div class='echartsLabel'><span class='point'></span>各年总执行场次</div>
				<div class='ehcartsBox'>
					<chart :options="multiLineOption" />
				</div>
			</div>
		</div>
		
	</div>
</template>

<script>
	/*---------------------导入echarts组件，以及折线图和柱状图配置构造器---------------------*/
	import multiLineChart from '@/util/chartOptions/multiLineChart'
	import pieChart from '@/util/chartOptions/pieChart'
	import chart from '@/components/Chart'
	/*---------------------导入商机导航接口API---------------------*/
	import KMRS_CASE_API from '../../../api/case_api.js'
	import screenImg from '@/util/screenImg'
	export default {
		data() {
			return {
				// 开始结束时间-月
				general_date: '',
				// 请求参数
				params: {
					// 开始时间
					startDate:'',
					// 结束时间
					endDate :'',
					// 类型
					type :'',
					// 地理区域
					regionName :'',
				},
				current_area: '',
				type_options:[{
						value: '1',
						label: '产品测试'
					}, {
						value: '2',
						label: '概念筛选'
				}],
				area_options:[],
				// 各地区总和
				echarts_general_num: 0,
				// 饼图配置项
				pieOption:{},
				// 多折线图配置项
				multiLineOption:{}
			}
		},
		props: ['part'],

		components:{chart},
		mounted() {
			// 只有在首页才会触发总体数据
			if(!this.$route.query.page_type) {
				console.log('首页总体数据加载完成')
				// 初始化形参(日期初始化三年内数据)
				let date_obj = new Date()
				let year_end = date_obj.getFullYear()
				let mon_str = (date_obj.getMonth() + 1) > 9 ? (date_obj.getMonth() + 1) : '0' + (date_obj.getMonth() + 1)
				let year_start = date_obj.getFullYear() - 2
				this.params.startDate = year_start + '-' + mon_str
				this.params.endDate = year_end + '-' + mon_str
				this.general_date = [this.params.startDate, this.params.endDate]
				this.params.type = '1'
				this.params.regionName = ''
				// 调用接口，得echarts数据
				this.getEcharts()
				// 获取区域接口
				KMRS_CASE_API.get_area_list().then(data => {
					this.area_options = data.regionNames
					this.area_options.unshift({label: '全国', value:''})
				})
			}
		},
		methods: {
			/**
			 * @description 获取首页echarts
			 */
			getEcharts(){
				KMRS_CASE_API.get_general_echarts(this.params).then(data => {
					console.log('获取首页echarts数据', data)
					this.pieOption = pieChart(data.totalTimesBos)
					this.multiLineOption = multiLineChart(data.yearTotalTimesDataBos)
					this.current_area = this.params.regionName || '全国'
					this.echarts_general_num = 0
					data.totalTimesBos.forEach(item => {
						this.echarts_general_num += parseInt(item.value)
					});
				})
				// let pie_data = [
                //     {value: 1048, name: '搜索引擎'},
                //     {value: 735, name: '直接访问'},
                //     {value: 580, name: '邮件营销'},
                //     {value: 484, name: '联盟广告'},
                //     {value: 300, name: '视频广告'}
                // ]
				// this.pieOption = pieChart(pie_data)
				// let line_data = [
				// 	{name: '2020', data: ['', 182, 191, 234, 290, 330, 310, 301, 334, 390, 330, 320]},
				// 	{name: '2021', data: [1508, 232, 201, 154, 190, 330, 410, 150, 232, 201, 154, 190]}
				// ]
				// this.multiLineOption = multiLineChart(line_data)
				// console.log('this.multiLineOption', this.multiLineOption) 
			},

			/**
			 * @description 日期变化时
			 * @param { object } date_arr 参数
			 */
			dateChange(date_arr) {
				if(date_arr) {
					this.params.startDate = date_arr[0]
					this.params.endDate = date_arr[1]
				}
				else {
					this.params.startDate = ''
					this.params.endDate = ''
				}
			},
			exportPic() {
				let loading = this.$loading({
					lock: true,
					text: 'Loading',
					spinner: 'el-icon-loading',
					background: 'rgba(0, 0, 0, 0.7)'
				})
				setTimeout(function(){
					screenImg('echarts_board')
					loading.close()
				}, 100)
			}
		},
	};
</script>

<style scoped lang="scss">
	.generalDetail{
		margin-left:auto;
		margin-right:auto;
		width: 1134px;
		height: 475px;
		border: 1px solid #E0E6ED;
		margin-top:30px;
		.boardTopTitle{
			font-size: 17px;
			color:#333333;
			text-align: center;
			height:50px;
			line-height: 50px;
			border-bottom:1px solid #E0E6ED;
		}
		.optArea{
			padding:10px 20px;
			display: flex;
			justify-content: space-between;
			.formFilter{
				display: flex;
				align-items: center;
				.echatsFilterDate{
					margin-top:2px;
					width:220px;
				}
				.echatsFilterDate, .echatsFilterType, .echatsFilterArea{
					margin-right:10px;
					
				}
				.echatsFilterType, .echatsFilterArea{
					width:120px;
				}
				.submitEchFilButton{
					width:87px;
				}
			}
			.exportEchartsPicButton{
				background: #F8EDFF;
				border-radius: 4px;
				border: 1px solid #930CEA;
				color: #930CEA;
				.el-icon-picture{
					padding-right:4px;
				}
			}
		}
		.echartsBoard{
			padding:10px 20px;
			display: flex;
			justify-content: space-between;
			.echartsContainer{
				width:537px;
				height:333px;
				border:1px solid #E0E6ED;
				.echartsLabel{
					color:#333333;
					font-size:14px;
					font-weight: bold;
					margin-left:14px;
					margin-top:14px;
					.point{
						width: 9px;
						height: 9px;
						background: #930CEA;
						border-radius: 9px;
						display: inline-block;
						margin-right:4px;
					}
				}
				.ehcartsBox{
					width:100%;
					height:290px;
					position: relative;
					.parentAreaName{
						position: absolute;
						width:100%;
						height:20px;
						line-height: 20px;
						text-align: center;
						margin:auto;
						left:0;
						top:0;
						right:0;
						bottom:0;
						font-size:16px;
						color:#495060;
					}
				}
			}
		}
	}
</style>
