<template>
	<div class="record-data-main">
		<div class="record-content">
			<div class="table-tip">
				<div class="tip">
					<span class="tip-l"></span><span class="tip-t">操作日志</span><span class="tip-r">系统操作日志详情</span>
				</div>
				<div class="operation">
					<div class="input" v-auth= "'log:operate:select'">
						<span class="field">操作人：</span>
						<el-select v-model="form.operation" filterable placeholder="请输入用户名" clearable>
							<el-option v-for="(item, index) in userList" :key="index" :label="item.userName" :value="item.id"></el-option>
						</el-select>
						<span class="field">操作时间：</span>
						<el-date-picker placeholder="请选择" type="date" value-format="yyyy-MM-dd" v-model="form.begin" :picker-options="pickerOptions"></el-date-picker>
						至
						<el-date-picker placeholder="请选择" type="date" value-format="yyyy-MM-dd" v-model="form.end" :picker-options="pickerOptions"></el-date-picker>
						<span class="field">IP地址：</span>
						<el-input placeholder="请输入IP地址" clearable v-model="form.ip"></el-input>
					</div>
					<div class="button">
						<el-button type="primary" @click="recordList(1)" v-auth= "'log:operate:select'">查找</el-button>
						<el-button @click="downFile" v-auth= "'log:operate:download'"><img src="../../assets/img/record-export.png"/> 导出日志</el-button>
					</div>
				</div>
			</div>
			<div class="table-data">
				<el-table :header-cell-style="{ background: '#F4F4F4FF', color: '#333333' }" :data="recordData">
					<el-table-column label="操作日期" prop="occurrenceTime" show-overflow-tooltip></el-table-column>
					<el-table-column label="操作人" prop="userName" show-overflow-tooltip></el-table-column>
					<el-table-column label="IP地址" prop="ipAddress" show-overflow-tooltip></el-table-column>
					<el-table-column label="操作" show-overflow-tooltip>
						<template slot-scope="scope">
							<span>{{ scope.row.eventType | showStatus }}</span>
						</template>
					</el-table-column>
					<el-table-column label="操作描述" prop="opContent" show-overflow-tooltip></el-table-column>
					<el-table-column label="操作结果" prop="opResult" show-overflow-tooltip align="center">
						<template slot-scope="scope">
							<span class="success" v-if="scope.row.opResult == '成功'">{{ scope.row.opResult }}</span>
							<span class="error" v-if="scope.row.opResult == '失败'">{{ scope.row.opResult }}</span>
						</template>
					</el-table-column>
				</el-table>
			</div>
			<div class="pagination">
				<div class="tip">此页{{ recordData.length }}条/共 {{ page.total }} 条</div>
				<div class="page">
					<el-pagination background @current-change="handleCurrentChange" layout="prev, pager, next" :current-page="page.pageNum" :page-size="page.pageSize" :total="page.total"></el-pagination>
				</div>
			</div>
<!-- 			<div class="filedInfoTips">
				<div style="display: inline-block;" @mouseover="tipHidden = true" @mouseout="tipHidden = false">
					<i class="el-icon-info">注释说明</i>
				</div>
			</div> -->
			<i class="triangle-down" v-show="tipHidden"></i>
			<el-table class="tipTable" border v-show="tipHidden" :data="tipData" max-height="550px">
				<el-table-column prop="name" label="指标名称" width="130px" align="center"></el-table-column>
				<el-table-column prop="module" label="模块" width="130px"></el-table-column>
				<el-table-column prop="tip" label="注释说明" width="250px"></el-table-column>
			</el-table>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'RecordIndex',
		data() {
			return {
				pickerOptions: {
					disabledDate(v) {
						return v.getTime() > new Date().getTime() - 86400000;
					}
				},
				form: {
					operation: '',
					begin: '',
					end: '',
					ip: ''
				},
				page: {
					pageNum: 1,
					pageSize: 20,
					total: 0
				},
				userList: [],
				recordData: [],
				tipData: [],
				tipHidden: false
			}
		},
		filters: {
			showStatus(value) {
				let status = [
					{ code: 1, name: '登录状态' },
					{ code: 2, name: '退出状态' },
					{ code: 3, name: '下载报告' },
					{ code: 4, name: '数据查询' },
					{ code: 5, name: '专案查询' },
					{ code: 6, name: '文档下载' },
					{ code: 7, name: '文档删除' },
					{ code: 8, name: '合并导出' },
					{ code: 9, name: '下载原始数据' },
				]
				let data = status.find(e => e.code == value)
				return data.name
			}
		},
		created() {
			this.recordUsers()
			this.recordList(1)
			this.getTipData()
		},
		methods: {
			// 获取操作人集合
			recordUsers() {
				let url = '/api/kmrs/opt/query/user'
				this.$fetch.get(url).then(res => {
					if (res.errorCode == 0) {
						this.userList = res.resultBody
					}
				})
			},
			// 获取操作日志列表
			recordList(page) {
				let url = '/api/kmrs/opt/operation/list'
				this.page.pageNum = page
				let params = {
					userId: this.form.operation,
					startTime: this.form.begin ? this.form.begin : '',
					endTime: this.form.end ? this.form.end : '',
					ipAddress: this.form.ip,
					pageNum: this.page.pageNum,
					pageSize: this.page.pageSize
				}
				this.$fetch.get(url, params).then(res => {
					if (res.errorCode == 0) {
						this.recordData = res.resultBody.records
						this.page.total = res.resultBody.total
					}
				})
			},
			handleCurrentChange(val) {
				this.page.pageNum = val
				this.recordList(this.page.pageNum)
			},
			downFile() {
				const element = document.createElement('a')
				element.setAttribute('href', `/api/kmrs/opt/export?startTime=${this.form.begin}&endTime=${this.form.end}&ipAddress=${this.form.ip}&userId=${this.form.operation}`)
				element.setAttribute('download',name)
				element.style.display = 'none'
				document.body.appendChild(element)
				element.click()
				document.body.removeChild(element)
			},
			// tip数据
			getTipData() {
				this.tipData = [
					{
						name: '所属人数',
						module: '系统',
						tip: '该业代所下有效的工作人数'
					},
					{
						name: '访问人数',
						module: '系统',
						tip: '每天使用账号访问系统的人数'
					},
					{
						name: '异常操作',
						module: '系统',
						tip: '操作系统时遇到系统报错或者异常操作的次数统计'
					},
					{
						name: '边界设置',
						module: '组织边界',
						tip: '设置过组织边界，且设置完成的操作'
					},
					{
						name: '组织边界调整',
						module: '组织边界',
						tip: '操作过“组织边界调整”的操作'
					},
					{
						name: '上传修改门店',
						module: '售点盘点',
						tip: '上传或者修改门店的操作'
					},
					{
						name: '推送门店',
						module: '售点盘点',
						tip: '操作过推送门店操作'
					},
					{
						name: '明细门店下载',
						module: '售点盘点',
						tip: '门店明细中，点击操作下载'
					},
					{
						name: '计划提交审批',
						module: '划区建线',
						tip: '对选定拜访计划提交审批操作'
					},
					{
						name: '审批通过',
						module: '划区建线',
						tip: '已提交“选定拜访计划”的审批，审批通过的计划，计数'
					},
					{
						name: '审批失败',
						module: '划区建线',
						tip: '已提交“选定拜访计划”的审批，审批失败的计划，计数'
					},
					{
						name: '下载选定拜访计划',
						module: '划区建线',
						tip: '对选定的拜访计划操作下载'
					},
					{
						name: '添加计划',
						module: '划区建线',
						tip: '业代所下操作“添加计划”操作的次数'
					},
					{
						name: '区域调整',
						module: '划区建线',
						tip: '进行区域调整操作，并完成保存'
					},
					{
						name: '路线调整',
						module: '划区建线',
						tip: '启用并完成路线调整功能'
					},
					{
						name: '还原片区',
						module: '划区建线',
						tip: '启用并完成还原片区功能'
					},
					{
						name: '服务日对调',
						module: '划区建线',
						tip: '开启服务日对调操作，并有操作点位服务日的调整'
					},
					{
						name: '生成路线',
						module: '划区建线',
						tip: '点击“生成路线”按钮，并成功生成路线'
					}
				]
			}
		},
		beforeRouteEnter(to, from, next) {
			next(vm => {
				vm.$store.commit('addTabs', {
					title: '操作日志',
					link: decodeURIComponent(vm.$route.fullPath),
					on: true,
					needCatch: true,
					isPathNameCheck: false
				})
			})
		},
	}
</script>

<style lang="scss" scoped>
	.record-data-main {
		height: 100%;
		width: 100%;

		.record-content {
			position: relative;
			height: 90%;
			width: 1180px;
			background: #FFFFFF;
			box-shadow: 0px 0px 13px 0px rgba(0, 0, 0, 0.1);
			margin: auto;
			margin-top: 50px;
			padding: 20px;

			.table-tip {
				overflow: hidden;

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
					padding: 15px 0px;

					.input {
						float: left;
						color: #333333;
						font-weight: 400;
						font-size: 12px;

						.field {
							&:not(:first-child) {
								margin-left: 31px;
							}
						}

						.el-input,
						.el-date-edito,
						.el-select {
							width: 160px;
						}

						::v-deep .el-input__inner {
							height: 32px;
							line-height: 32px;
						}

						::v-deep .el-input__icon {
							line-height: 32px;
						}
					}

					.button {
						float: right;

						.el-button {
							width: 96px;
							padding: 8px 30px;
							position: relative;
							border-radius: 4px;
							font-weight: 600;
							font-size: 12px;

							&:last-child {
								margin-left: 35px;
								background: #FBEBFE;
								border: 1px solid #930CEA;
								color: #930CEA;
							}

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
				height: calc(90% - 100px);
				margin-top: 20px;

				.el-table {
					height: 100%;
				}

				::v-deep .el-table__body-wrapper {
					height: calc(100% - 50px);
					overflow-y: auto;
					width: 1178px;
				}

				::v-deep .el-table__header-wrapper {
					width: 1170px;
				}

				.success {
					color: #1FD13FFF;
					font-weight: 600;
					font-size: 14px;
				}

				.error {
					color: #FA6400FF;
					font-weight: 600;
					font-size: 14px;
				}
			}

			.pagination {
				margin-top: 15px;
				height: 40px;
				line-height: 40px;
				overflow: hidden;

				.tip {
					float: left;
					color: #495060;
					font-weight: 400;
					font-size: 12px;
				}

				.page {
					float: right;
				}
			}
			
			// .filedInfoTips {
			// 	text-align: right;
			// 	i {
			// 		cursor: pointer;
			// 		padding: 3px;
			// 		border: 1px solid #9e9e9e;
			// 	}
			// 	.el-icon-info:before {
			// 		display: inline-block;
			// 		height: 20px;
			// 		line-height: 20px;
			// 	}
			// }
			
			.triangle-down {
				z-index: 10;
				position: absolute;
				width: 0;
				height: 0;
				bottom: 70px;
				right: 55px;
				border-left: 25px solid transparent;
				border-right: 25px solid transparent;
				border-top: 50px solid #303133;
			}
			
			.tipTable {
				z-index: 10;
				bottom: 85px;
				right: 55px;
				position: absolute;
				width: 515px;
				border: 1px solid #ffffff;
				border-radius: 5px;
				::v-deep th {
					background-color: #303133;
					color: #FFFFFF;
					padding: 0;
				}
				::v-deep tr {
					background-color: #303133;
					color: #FFFFFF;
					&:hover {
						td {
							background-color: #303133;
							color: #FFFFFF;
						}
					}
				}
				::v-deep td {
					padding: 0;
				}
			}
		}
	}
</style>
