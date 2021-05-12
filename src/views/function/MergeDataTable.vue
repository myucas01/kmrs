<template>
	<div class="merge-data-table">
		<div class="merge-content">
			<div class="table-tip">
				<div class="tip">
					<span class="tip-l"></span><span class="tip-t">合并导出</span><span class="tip-r">数据查询结果</span>
				</div>
				<div class="button">
					<el-button plain @click="BIButton" v-auth= "'merge:export:bi'"><img src="../../assets/img/exportBI.png"/>  BI 分析</el-button>
					<el-button plain @click="DownData" v-auth= "'merge:export:download'" v-loading="downLoading"><img src="../../assets/img/exportDown.png"/>  下载数据</el-button>
				</div>
			</div>
			<div class="table-data">
				<el-table ref="table" border :header-cell-style="{ background: '#F4F4F4FF' }" :data="exportListData" maxHeight="700px">
					<el-table-column v-for="(item, index) in exportTitleData" :key="index" :label="item.name" width="150px" align="center">
						<template slot="header">
							<el-tooltip effect="dark" :content="item.questionGName + item.questionName" placement="top">
								<div class="headerName" v-if="item.questionGName">{{item.questionGName}}{{item.questionName}}</div>
								<div class="headerName" v-else>{{item.questionName}}</div>
							</el-tooltip>
						</template>
						<template slot-scope="scope">
							<span>{{scope.row[item.colName]}}</span>
						</template>
					</el-table-column>
				</el-table>
			</div>
			<el-dialog title="BI操作" :visible.sync="visiblebBI">
				<BITABLE ref="bitable" :MetaGuids="projectIds" :Questions="subjectIds" :type="1"></BITABLE>
			</el-dialog>
		</div>
	</div>
</template>

<script>
	import BITABLE from '../BI/biTable.vue'
	export default {
		name: 'MergeDataTable',
		components: { BITABLE },
		data() {
			return {
				downLoading: false,
				subjectIds: '',
				projectIds: '',
				pageNum: 1,
				pageSize: 10,
				pages: 0,
				visiblebBI: false,
				exportTitleData: [],
				exportListData: []
			}
		},
		mounted() {
			this.tableScroll()
		},
		created() {
			this.subjectIds = this.$route.query.subjectIds
			this.projectIds = this.$route.query.projectIds
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
					MetaGuids: this.projectIds,
					Questions: this.subjectIds,
					pageNum: this.pageNum,
					pageSize: this.pageSize
				}
				let url = '/api/BI/list1'
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
				element.setAttribute('href', `/api/BI/exportBI?MetaGuids=${this.projectIds}&Questions=${this.subjectIds}`)
				element.setAttribute('download',name)
				element.style.display = 'none'
				document.body.appendChild(element)
				element.click()
				document.body.removeChild(element)
				console.log('下载数据', `/api/BI/exportBI?MetaGuids=${this.projectIds}&Questions=${this.subjectIds}`)
				this.downLoading = false
			}
		},
		beforeRouteEnter(to, from, next) {
			next(vm => {
				vm.$store.commit('addTabs', {
					title: '合并导出-数据查询',
					link: decodeURIComponent(vm.$route.fullPath),
					on: true,
					needCatch: true,
					isPathNameCheck: true
				})
			})
		},
	}
</script>

<style lang="scss" scoped>
	.merge-data-table {
		height: 100%;
		width: 100%;
		overflow: auto;
		.merge-content {
			width: 1180px;
			background: #FFFFFF;
			box-shadow: 0px 0px 13px 0px rgba(0, 0, 0, 0.1);
			margin: 0 auto;
			margin-top: 50px;
			padding: 20px;
			.table-tip {
				overflow: hidden;
				.tip {
					float: left;
					position: relative;
					line-height: 30px;
					.tip-l {
						width: 5px;
						background: #930CEA;
						display: inline-block;
						height: 18px;
						top: 5px;
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
			// 	.el-table {
			// 		height: 100%;
			// 	}
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
