<!--
    概念详情
-->
<template>
	<div class="conceptDetail" v-if='part === 3'>
		<div class='modelContainer'>
			<div class='modelLabelPart'>
				<span class='modelName'>数据查看</span>
				<div class='ctrlButtons'>
					<el-button v-auth='"meta:select:result:export"' type="primary" class='functionButton dd' size='mini' @click='jumpToRawData'><i class="el-icon-s-data funIcon"></i>原始数据导出</el-button>
					<el-button type="primary" class='functionButton' size='mini'  @click='jumpToFileList'><i class="el-icon-s-order funIcon" v-auth='"meta:select:result:downloaddata"'></i>下载报告</el-button>
					<el-button v-auth='"meta:select:result:downloadpicture"' type="primary" class='functionButton' size='mini'><i class="el-icon-picture funIcon" @click='exportPic'></i>图片导出</el-button>
				</div>
			</div>
			<div class='modelContent generalCaseCtrlBoard'>
				<!--如果是概念列表返回的多个专案，则结构为radio-->
				<template v-if='route.query.concept_ids'>
					<template v-if='case_list && case_list.list.length > 1'>
						<el-radio v-for='(item, index) in case_list.list'
							:key='index'
							v-model="case_name"
							:label='item.metaName'
							class='conceptName'
							@change='radioChange(item, index)'>
						</el-radio>
					</template>
					<!--特别的：如果是概念列表返回的1个专案-->
					<template v-if='case_list && case_list.list.length === 1'>
						<div class='conceptName'>{{case_list.list[0].metaName}}</div>
					</template>
				</template>
				<!--如果是单个专案-->
				<div class='conceptName' v-if='route.query.concept_case_id'>{{case_name}}</div>
				<div class='tips'>
					共{{current_concepts.length}}个概念：{{current_concepts.join('、')}}
				</div>
			</div>
		</div>
		<div class='modelContainer'>
			<div class='modelLabelPart'>
				<span class='modelName'>数据查看</span>
				<span class='aLink' @click='jumpToBI' v-auth='"meta:select:result:more"'>更多详情>></span>
			</div>
			<div class='modelContent generalCaseCtrlBoard' id='general_case_ctrl_board'>
				<div class='legendTips'>
					<span class='colorBlock colorBlock1'></span>本次测试概念数量<div class='generalNumTip'> {{general_type_num}}</div>
					<span class='colorBlock'></span><div class='generalAreaTip'>具有潜力概念区域</div>
				</div>
				<div class='scatterBox'>
					<chart :options="scatter_option" ref='scatterEecharts'/>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	/*---------------------导入echarts---------------------*/
	import scatterChart from '@/util/chartOptions/scatterChart'
	import chart from '@/components/Chart'
	/*---------------------导入商机导航接口API---------------------*/
	import KMRS_CASE_API from '../../../api/case_api.js'
	import screenImg from '@/util/screenImg'
	export default {
		data() {
			return {
				// 获取所有概念名
				concepts: [],
				// 当前专案的concept
				current_concepts: [],
				// 当前选择的专案名
				case_name: '',
				// 当前选择的专案id
				case_id: '',
				scatter_option: {},
				general_type_num: '',
				this_scatter_obj: '',
				// 返回的所有专案
				case_list: '',
				route: this.$route
			}
		},
		props: ['part'],
		components:{chart},
		mounted() {
			// 如果是概念详情
			if(this.$route.query.page_type === 'concept_detail') {
				// 如果是概念详情中的概念集合，则获取映射的专案
				if(this.$route.query.concept_ids) {
					console.log('触发路由变化：概念详情-多概念')
					this.getSomeCases(this.$route.query.concept_ids)
				}
				// 如果是概念详情中的单一专案，则获取对应的概念
				if(this.$route.query.concept_case_id) {
					console.log('触发路由变化：概念详情-单专案')
					this.case_id = this.$route.query.concept_case_id
					this.case_name = this.$route.query.concept_case_name
					this.getSingleCase(this.$route.query.concept_case_id, this.$route.query.concept_case_name)
				}
			}
		},
		methods: {
			/**
			 * @description 获取多个概念映射的多个专案
			 * @param { string } concept_ids 概念id
			 */
			getSomeCases(concept_ids) {
				// 获取概念数组，并获取总体数量
				this.concepts = concept_ids.split(',')
				this.general_type_num = this.concepts.length
				KMRS_CASE_API.get_some_cases({cptIds: concept_ids}).then(data => {
					this.case_list = data
					let scatter_data = []
					// 遍历每一个专案和下面的概念，形成散点数组
					this.case_list.list.forEach(item => {
						// 把每一个专案的概念组放入数组：二维数组
						scatter_data.push(item.list)
						item.list.forEach(perConcept=>{
							this.current_concepts.push(perConcept.name)
						})
					})
					this.scatter_option = scatterChart(scatter_data, this.case_list.cptAvgMeanBo.innovateMean, this.case_list.cptAvgMeanBo.likeMean)
					this.this_scatter_obj = this.$refs.scatterEecharts.$refs.thisChart
					// 如果只有一个专案，则默认赋予id和名（第一个）
					if(this.case_list.list.length === 1) {
						this.case_id = this.case_list.list[0].metaGuid
						this.case_name = this.case_list.list[0].metaName
						this.case_list.list[0].list.forEach(item=>{
							this.current_concepts.push(item.name)
						})
					}
				})
			},

			/**
			 * @description 获取单一专案
			 * @param { string } case_id 专案id
			 * @param { string } case_name 专案name
			 */
			getSingleCase(case_id, case_name) {
				KMRS_CASE_API.get_single_case({metaGuid: case_id, metaName: case_name}).then(data => {
					if(data) {
						// 得到单一专案的概念
						data.list[0].list.forEach(item=>{
							this.current_concepts.push(item.name)
						})
						this.general_type_num = this.current_concepts.length
						let scatter_data = []
						// 形成散点数组
						scatter_data.push(data.list[0].list)
						this.scatter_option = scatterChart(scatter_data, data.cptAvgMeanBo.innovateMean, data.cptAvgMeanBo.likeMean)
						this.this_scatter_obj = this.$refs.scatterEecharts.$refs.thisChart
					}
				})
			},

			/**
			 * @description 概念切换
			 * @param { object } item 当前专案
			 * @param { number } index 当前专案下标
			 */
			radioChange(item, index){
				this.case_id = item.metaGuid
				this.case_name = item.metaName
				// 先非高亮所有
				this.this_scatter_obj.dispatchAction(
					{
						type: 'downplay'
					}
				)
				// 高亮某个
				this.this_scatter_obj.dispatchAction(
					{
						type: 'highlight',
						seriesIndex: index
					}
				)
				this.current_concepts = []
				item.list.forEach(item=>{
					this.current_concepts.push(item.name)
				})
			},

			/**
			 * @description 跳转到导出BI详情
			 */
			jumpToRawData() {
				console.log()
				if(this.case_id) {
					this.$router.push('/export/raw-con-data-export?case_id=' + this.case_id + '&case_name=' + this.case_name)
				} else {
					this.$alert('请选择一个专案！', '提示：', {
						confirmButtonText: '确定'
					})
				}
			},

			/**
			 * @description 跳转到BI详情
			 * @param { string } data_type 子模块名
			 */
			jumpToBI() {
				this.$router.push('/export/concept-data-table?case_id=' + this.case_id)
			},

			/**
			 * @description 下载散点的echarts图片
			 */
			exportPic() {
				let loading = this.$loading({
					lock: true,
					text: 'Loading',
					spinner: 'el-icon-loading',
					background: 'rgba(0, 0, 0, 0.7)'
				})
				setTimeout(function(){
					screenImg('general_case_ctrl_board')
					loading.close()
				}, 100)
			},

			/**
			 * @description 跳转到下载报告页
			 */
			jumpToFileList() {
				this.$router.push('/word/word-list?tabValue=4')
			}
		},
	};
</script>

<style scoped lang="scss">
	.conceptDetail{
		width:1134px;
		margin:30px auto;
		border: 1px solid #E0E6ED;
		color:#333333;
		padding:18px;
		margin-bottom:20px;
		.modelContainer{
			margin-bottom:20px;
		}
		.modelLabelPart{
			display: flex;
			justify-content: space-between;
			.modelName{
				border-left: 5px solid #930CEA;
				line-height:18px;
				height: 18px;
				font-size:16px;
				font-weight: bold;
				padding-left:6px;
				letter-spacing: 1px;
			}
			.functionButton{
				background: #F8EDFF;
				border-radius: 4px;
				border: 1px solid #930CEA;
				color: #930CEA;
				margin-left:20px;
				.funIcon{
					padding-right:4px;
				}
			}
			.aLink{
				cursor:pointer;
				font-size:12px;
				color:#A0A0A0;
				margin-left:20px;
			}
		}
		.modelContent{
			width: 1095px;
			border: 1px solid #E0E6ED;
			margin-top:13px;
			padding:15px;
			.conceptName{
				display: block;
				height: 30px;
				line-height:30px;
				font-size: 13px;
				font-weight: bold;
			}
			.tips{
				// padding-left:24px;
				width:730px;
				line-height: 20px;
				font-size:12px;
				color:#A0A0A0;
			}
			.legendTips{
				width:320px;
				display: flex;
				align-items: center;
				.colorBlock{
					display: inline-block;
					width: 10px;
					height: 10px;
					background: #F5EAFF;
					border-radius: 2px;
					border: 1px solid #930CEA;
					vertical-align:middle;
					margin-right:6px;
				}
				.colorBlock1{
					width: 6px;
					height: 6px;
					background: #930CEA;
					border-radius: 50%;
				}
			}
			.generalNumTip, .generalAreaTip{
				display: inline-block;
				margin-right:22px;
				color:#333333;
			}
			.generalNumTip{
				font-size: 14px;
			}
			.generalAreaTip{
				font-size: 12px;
			}
			.scatterBox{
				width:980px;
				height:400px;
			}
		}
	}
</style>
