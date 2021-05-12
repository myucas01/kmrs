<template>
	<div class="raw-data-table">
		<div class="raw-content">
			<div class="table-tip">
				<div class="tip">
					<span class="tip-l"></span><span class="tip-t">原数据导出</span><span class="tip-r">概念筛选专案</span>
				</div>
				<div class="operation">
					<div class="title">{{ case_name }}</div>
					<div class="button">
						<el-button plain @click="BIButton" v-auth= "'meta:select:result:exportbi'"><img src="../../assets/img/exportBI.png" />  BI 分析</el-button>
						<el-button plain @click="DownData" v-loading="downLoading" v-auth= "'meta:select:result:exportdownload'"><img src="../../assets/img/exportDown.png"/>  下载数据</el-button>
					</div>
				</div>
			</div>
			<div class="table-data">
				<el-table ref="table" border :header-cell-style="{ background: '#F4F4F4FF' }" :data="exportListData" maxHeight="600px">
					<el-table-column v-for="(item, index) in exportTitleData" :key="index" width="150px" align="center">
						<template slot="header">
							<el-tooltip effect="dark" :content="item.questionSName" placement="top">
								<div class="headerName">{{item.questionSName}}</div>
							</el-tooltip>
						</template>
						<template slot-scope="scope">
							<span>{{scope.row[item.colName]}}</span>
						</template>
					</el-table-column>
				</el-table>
			</div>
			<el-dialog title="BI操作" :visible.sync="visiblebBI">
				<BITABLE ref="bitable" :MetaGuids="case_id" :Questions="subjectIds" :type="2"></BITABLE>
			</el-dialog>
		</div>
	</div>
</template>

<script>
	import BITABLE from '../BI/biTable.vue'
	export default {
		name: 'RawDataTable',
		components: { BITABLE },
		data() {
			return {
				downLoading: false,
				case_id: '',
				case_name: '',
				pageNum: 1,
				pageSize: 50,
				pages: 0,
				subjectIds: '',
				visiblebBI: false,
				exportListData: [],
				exportTitleData: [],
			}
		},
		beforeRouteEnter(to, from, next) {
			next(vm => {
				vm.$store.commit('addTabs', {
					title: '原始数据导出',
					link: decodeURIComponent(vm.$route.fullPath),
					on: true,
					needCatch: true,
					isPathNameCheck: true
				})
			})
		},
		mounted() {
			this.tableScroll()
		},
		created() {
			this.case_id = this.$route.query.case_id
			this.case_name = this.$route.query.case_name
			this.subjectIds = this.$route.query.subjectId
			this.getData()
		},
		methods: {
			tableScroll() {
				this.table = this.$refs.table.bodyWrapper
				this.table.addEventListener('scroll', () => {
					let scrollTop = this.table.scrollTop
					let clientHeight = this.table.clientHeight 
					let scrollHeight = this.table.scrollHeight
					if (scrollTop > 0 && scrollTop == (scrollHeight - clientHeight)) {
						if (this.pageNum < this.pages) {
							this.pageNum ++
							this.getData()
						}
					}
				})
			},
			async getData() {
				let params = {
					CptGuids: this.case_id,
					Questions: this.subjectIds,
					pageNum: this.pageNum,
					pageSize: this.pageSize
				}
				let url = '/api/BI/cptBIList1'
				await this.$fetch.get(url, params).then((res) => {
					if (res.errorCode == 0) {
						this.exportTitleData = res.resultBody.data[0]
						let data = res.resultBody.data[1]
						for (var i = 0; i < data.length; i ++) {
							this.exportListData.push(data[i])
						}
						this.pages = res.resultBody.pages
					}
				})
			},
			BIButton() {
				this.visiblebBI = true
				setTimeout(() => {
					this.$refs.bitable.getdata()
				}, 100)
				console.log('BI分析')
			},
			DownData() {
				this.downLoading = true
				const element = document.createElement('a')
				element.setAttribute('href', `/api/BI/exportCptBI?CptGuids=${this.case_id}&Questions=${this.subjectIds}`)
				element.setAttribute('download',name)
				element.style.display = 'none'
				document.body.appendChild(element)
				element.click()
				document.body.removeChild(element)
				console.log('下载数据', `/api/BI/exportCptBI?CptGuids=${this.case_id}&Questions=${this.subjectIds}`)
				this.downLoading = false
			}
		}
	}
</script>

<style lang="scss" scoped>
	.raw-data-table {
		height: 100%;
		width: 100%;
		overflow: auto;
		.raw-content {
			width: 1180px;
			background: #FFFFFF;
			box-shadow: 0px 0px 13px 0px rgba(0, 0, 0, 0.1);
			margin: auto;
			margin-top: 50px;
			padding: 20px;
			.table-tip {
				.tip {
					position: relative;
					.tip-l {
						width: 5px;
						background: #930CEA;
						display: inline-block;
						height: 22px;
						position: absolute;
					}
					.tip-t {
						font-size: 16px;
						font-weight: 600;
						color: #333333;
						margin: 0 12px;
					}
					.tip-r {
						font-weight: 400;
						color: #6D7278;
						font-size: 12px;
					}
				}
				.operation {
					margin-top: 13px;
					height: 63px;
					line-height: 63px;
					border: 1px solid #E0E6ED;
					padding: 0px 15px;
					.title {
						float: left;
						color: #333333;
						font-size: 13px;
						font-weight: 600;
					}
					.button {
						float: right;
						.el-button {
							width: 96px;
							padding: 8px 30px;
							position: relative;
							background: #FBEBFE;
							border-radius: 4px;
							border: 1px solid #930CEA;
							color: #930CEA;
							font-weight: 600;
							font-size: 12px;
							img {
								position: absolute;
								left: 10px;
								top: 7px;
							}
						}
					}
				}
			}
			.table-data {
				.el-table {
					::v-deep th {
						padding: 0;
					}
					::v-deep td {
						padding: 0;
					}
				}
				margin-top: 15px;
			// 	::v-deep .el-table__body-wrapper {
			// 		height: calc(100% - 75px);
			// 		overflow-y: auto;
			// 		width: 1178px;
			// 	}
			// 	::v-deep .el-table__header-wrapper {
			// 		width: 1170px;
			// 	}
				.headerName {
					text-overflow: -o-ellipsis-lastline;
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-line-clamp: 2;
					line-clamp: 2;
					-webkit-box-orient: vertical;
				}
			}
			::v-deep .el-dialog {
				width: 70%;
				overflow: auto;
				height: 90%;
				margin-top: 20px!important;
			}
			::v-deep .el-dialog__body {
				height: 70%!important;
			}
		}
	}
</style>
