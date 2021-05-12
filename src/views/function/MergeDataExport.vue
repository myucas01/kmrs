<template>
	<div class="merge-data-main">
		<div class="merge-content">
			<div class="merge-tip"><span class="tip-l"></span><span class="tip-t">合并导出</span><span class="tip-r">选择设置专案导出数据</span></div>
			<div class="merge-title"><img src="../../assets/img/merge-one.png" />请添加需要导出的专案</div>
			<div class="merge-project">
				<div class="left proItem">
					<div class="title">未添加专案({{ projectLeftList.length }})</div>
					<div class="operation">
						<div class="input">
							<el-checkbox @change="setProjectChecked" v-model="projectLeftChecked"></el-checkbox>
							<el-input placeholder="请输入关键字" v-model="projectName" clearable></el-input>
							<el-button @click="getProjectList">搜索</el-button>
						</div>
						<!-- <div class="no-data" v-if="projectList.length == 0">暂无数据</div> -->
						<!-- v-infinite-scroll="getProjectList" infinite-scroll-disabled="projectScrollLeft" infinite-scroll-distance="0" -->
						<div class="data">
							<div v-for="(item, index) in projectList" :key="index">
								<div class="item" :title="item.metaName" v-if="item.show">
									<el-checkbox v-model="item.checked" @change="projectChange(0)"></el-checkbox>
									<span>{{ item.metaName }}</span>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="opera proItem">
					<img src="../../assets/img/merge-right.png" class="imgN" v-if="projectLeftList.length == 0" />
					<img src="../../assets/img/merge-right.png" v-else @click="projectShuttle('del')" />
					<img src="../../assets/img/merge-left.png" class="imgN" v-if="projectRightList.length == 0" />
					<img src="../../assets/img/merge-left.png" v-else @click="projectShuttle('add')" />
				</div>
				<div class="right proItem">
					<div class="title">已添加专案({{ projectRightList.length }})</div>
					<div class="operation">
						<div class="all">
							<el-checkbox @change="setProjectMergeChecked" v-model="projectRightChecked"></el-checkbox><span>全选</span>
						</div>
						<div class="no-data" v-if="projectMergeList.length == 0">暂无数据</div>
						<div class="data" v-else>
							<div v-for="(item, index) in projectMergeList" :key="index">
								<div class="item" :title="item.metaName">
									<el-checkbox v-model="item.checked" @change="projectMergeChange"></el-checkbox>
									<span>{{ item.metaName }}</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="merge-line"></div>
			<div class="merge-title"><img src="../../assets/img/merge-two.png" />请添加需要导出的专案题目</div>
			<div class="merge-subject">
				<div class="left proItem">
					<div class="title">未添加专案题目</div>
					<div class="operation">
						<div class="input">
							<el-checkbox v-model="subjectLeftChecked" @change="setSubjectChecked"></el-checkbox>
							<el-input placeholder="请输入关键字" v-model="subjectName" clearable></el-input>
							<el-button @click="getSubjectList">搜索</el-button>
						</div>
						<!-- <div class="no-data" v-if="subjectList.length == 0">暂无数据</div> -->
						<!-- v-infinite-scroll="getSubjectList" infinite-scroll-disabled="subjectScrollLeft" infinite-scroll-distance="0" -->
						<div class="data">
							<div v-for="(item, index) in subjectList" :key="index">
								<div class="item" :title="item.questionSName" v-if="item.show">
									<el-checkbox v-model="item.checked" @change="subjectChange(0)"></el-checkbox>
									<span>{{ item.questionSName }}</span>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="opera proItem">
					<img src="../../assets/img/merge-right.png" class="imgN" v-if="subjectLeftList.length == 0" />
					<img src="../../assets/img/merge-right.png" v-else @click="subjectShuttle('del')" />
					<img src="../../assets/img/merge-left.png" class="imgN" v-if="subjectRightList.length == 0" />
					<img src="../../assets/img/merge-left.png" v-else @click="subjectShuttle('add')" />
				</div>
				<div class="right proItem">
					<div class="title">已添加专案题目</div>
					<div class="operation">
						<div class="all">
							<el-checkbox v-model="subjectRightChecked" @change="setSubjectMergeChecked"></el-checkbox><span>全选</span>
						</div>
						<div class="no-data" v-if="subjectMergeList.length == 0">暂无数据</div>
						<div class="data" v-else>
							<div v-for="(item, index) in subjectMergeList" :key="index">
								<div class="item" :title="item.questionSName">
									<el-checkbox v-model="item.checked" @change="subjectMergeChange"></el-checkbox>
									<span>{{ item.questionSName }}</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="merge-button">
			<el-button type="primary" @click="searchMergeData" v-auth= "'merge:export:select'" :disabled="subjectMergeList.length == 0">确认查询</el-button>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'MergeDataExport',
		data() {
			return {
				projectList: [],
				projectMergeList: [],
				projectRightList: [],
				projectLeftList: [],
				projectRightChecked: false,
				projectLeftChecked: false,
				subjectList: [],
				subjectMergeList: [],
				subjectRightList: [],
				subjectLeftList: [],
				subjectRightChecked: false,
				subjectLeftChecked: false,
				projectName: '',
				proParam: {
					pageNum: 1,
					pageSize: 15,
					pageTotal: 0
				},
				subParam: {
					pageNum: 1,
					pageSize: 15,
					pageTotal: 0
				},
				subjectName: '',
				projectScrollLeft: false,
				subjectScrollLeft: false,
				proCount: 10,
				pageIndex: 1
			}
		},
		created() {
			this.getProjectList()
			// this.getSubjectList()
		},
		methods: {
			async getProjectList() {
				let url = '/api/meta/list'
				let param = {
					metaName: this.projectName
				}
				await this.$fetch.post(url, param).then((res) => {
					if (res.errorCode == 0) {
						this.setProjectListChecked(res.resultBody)
					}
				})
			},
			searchProjectList() {
				this.projectScrollLeft = false
				this.proParam.pageNum = 1
				this.projectList = []

				let url = '/api/bn/store/page'
				let param = {
					isLoading: true,
					orgId: "6006469204833598576",
					pageNum: this.proParam.pageNum,
					pageSize: this.proParam.pageSize,
					nameTag: this.projectName
				}
				this.$fetch.post(url, param).then((res) => {
					if (res.code == 200) {
						this.setProjectSearchChecked(res.data.content)
						this.proParam.pageTotal = res.data.totalPages
						if (this.proParam.pageNum < this.proParam.pageTotal) {
							this.proParam.pageNum++
						}
					}
				})
			},
			setProjectListChecked(data) {
				let result = []
				for (var i = 0; i < data.length; i++) {
					this.$set(data[i], "checked", this.projectLeftChecked)
					if (this.projectMergeList.find(e => e.metaGuid == data[i].metaGuid)) {
						this.$set(data[i], "show", false)
					} else {
						this.$set(data[i], "show", true)
					}
					result.push(data[i])
				}
				this.projectList = result
			},
			setProjectSearchChecked(data) {
				let result = []
				for (var i = 0; i < data.length; i++) {
					this.$set(data[i], "checked", this.projectLeftChecked)
					if (this.projectMergeList.find(e => e.metaGuid == data[i].metaGuid)) {
						this.$set(data[i], "show", false)
					} else {
						this.$set(data[i], "show", true)
					}
					result.push(data[i])
				}
				this.projectList = result
			},
			getSubjectList() {
				if (this.projectMergeList.length == 0) {
					this.$message.error('请先选择专案')
					return
				}
				this.subjectMergeList = []
				this.subjectRightList = []
				this.subjectRightChecked = false
				
				let metaGuids = []
				for (var i = 0; i < this.projectMergeList.length; i ++) {
					let item = this.projectMergeList[i]
					metaGuids.push(item.metaGuid)
				}
				let url = '/api/meta/topic'
				let param = {
					metaGuidList: metaGuids.toString(),
					questionName: this.subjectName
				}

				this.$fetch.post(url, param).then((res) => {
					if (res.errorCode == 0) {
						this.setSubjectListChecked(res.resultBody)
					}
				})
			},
			searchSubjectList() {
				this.subjectScrollLeft = false
				this.subParam.pageNum = 1
				this.subjectList = []

				let url = '/api/bn/store/page'
				let param = {
					isLoading: true,
					orgId: "6006469204833598576",
					pageNum: this.subParam.pageNum,
					pageSize: this.subParam.pageSize,
					nameTag: this.subjectName
				}

				this.$fetch.post(url, param).then((res) => {
					if (res.code == 200) {
						this.setSubjectSearchChecked(res.data.content)
						this.subParam.pageTotal = res.data.totalPages
						if (this.subParam.pageNum < this.subParam.pageTotal) {
							this.subParam.pageNum++
						}
					}
				})
			},
			setSubjectListChecked(data) {
				let result = []
				for (var i = 0; i < data.length; i++) {
					this.$set(data[i], "checked", this.subjectLeftChecked)
					if (this.subjectMergeList.find(e => e.metaQuestionCode == data[i].metaQuestionCode)) {
						this.$set(data[i], "show", false)
					} else {
						this.$set(data[i], "show", true)
					}
					result.push(data[i])
				}
				this.subjectList = result
			},
			setSubjectSearchChecked(data) {
				let result = []
				for (var i = 0; i < data.length; i++) {
					this.$set(data[i], "checked", this.subjectLeftChecked)
					if (this.subjectMergeList.find(e => e.metaQuestionCode == data[i].metaQuestionCode)) {
						this.$set(data[i], "show", false)
					} else {
						this.$set(data[i], "show", true)
					}
					result.push(data[i])
				}
				this.subjectList = result
			},
			projectChange(type) {
				let list = []
				for (var i = 0; i < this.projectList.length; i++) {
					if (this.projectList[i].checked && this.projectList[i].show) {
						list.push(this.projectList[i])
					} else {
						if (type == 0) {
							this.projectLeftChecked = false
						}
					}
				}
				this.projectLeftList = list
			},
			projectMergeChange() {
				this.projectRightChecked = true
				let list = []
				for (var i = 0; i < this.projectMergeList.length; i++) {
					let item = this.projectMergeList[i]
					if (item.checked) {
						list.push(item)
					} else {
						this.projectRightChecked = false
					}
				}
				this.projectRightList = list
			},
			subjectMergeChange() {
				this.subjectRightChecked = true
				let list = []
				for (var i = 0; i < this.subjectMergeList.length; i++) {
					let item = this.subjectMergeList[i]
					if (item.checked) {
						list.push(item)
					} else {
						this.subjectRightChecked = false
					}
				}
				this.subjectRightList = list
			},
			subjectChange(type) {
				let list = []
				for (var i = 0; i < this.subjectList.length; i++) {
					if (this.subjectList[i].checked && this.subjectList[i].show) {
						list.push(this.subjectList[i])
					} else {
						if (type == 0) {
							this.subjectLeftChecked = false
						}
					}
				}
				this.subjectLeftList = list
			},
			setProjectChecked(data) {
				for (var i = 0; i < this.projectList.length; i++) {
					this.projectList[i].checked = data
				}
				this.projectChange()
			},
			setProjectMergeChecked(data) {
				for (var i = 0; i < this.projectMergeList.length; i++) {
					this.projectMergeList[i].checked = data
				}
				this.projectMergeChange()
			},
			setSubjectMergeChecked(data) {
				for (var i = 0; i < this.subjectMergeList.length; i++) {
					this.subjectMergeList[i].checked = data
				}
				this.subjectMergeChange()
			},
			projectShuttle(type) {
				if (type == 'del') {
					for (var i = 0; i < this.projectList.length; i++) {
						let item = this.projectList[i]
						if (item.checked && item.show) {
							if (this.projectMergeList.length < 10) {
								item.show = false
								this.projectMergeList.push(item)
							} else {
								this.$message.error('最多只能选择10个方案')
								this.projectMergeChange()
								this.subjectList = []
								if (this.projectMergeList.length > 0) {
									this.getSubjectList()
								}
								return
							}
						}
					}
					this.projectLeftChecked = false
					this.projectLeftList = []
					this.projectMergeChange()
					if (this.proParam.pageNum < this.proParam.pageTotal) {
						this.getProjectList()
					}
				}
				if (type == 'add') {
					this.projectMergeList = this.projectMergeList.filter(item => !item.checked)
					for (var m = 0; m < this.projectRightList.length; m++) {
						for (var t = 0; t < this.projectList.length; t++) {
							if (this.projectRightList[m].metaGuid == this.projectList[t].metaGuid) {
								this.projectList[t].show = true
								this.projectList[t].checked = false
							}
						}
					}
					this.projectRightList = []
					this.projectRightChecked = false
					this.projectLeftChecked = false
				}
				
				this.subjectList = []
				if (this.projectMergeList.length > 0) {
					this.getSubjectList()
				}
			},
			subjectShuttle(type) {
				if (type == 'del') {
					for (var i = 0; i < this.subjectList.length; i++) {
						let item = this.subjectList[i]
						if (item.checked && item.show) {
							item.show = false
							this.subjectMergeList.push(item)
						}
					}
					this.subjectLeftChecked = false
					this.subjectLeftList = []
					this.subjectMergeChange()
					if (this.subParam.pageNum < this.subParam.pageTotal) {
						this.getSubjectList()
					}
				}
				if (type == 'add') {
					this.subjectMergeList = this.subjectMergeList.filter(item => !item.checked)
					for (var m = 0; m < this.subjectRightList.length; m++) {
						for (var t = 0; t < this.subjectList.length; t++) {
							if (this.subjectRightList[m].metaQuestionCode == this.subjectList[t].metaQuestionCode) {
								this.subjectList[t].show = true
								this.subjectList[t].checked = false
							}
						}
					}
					this.subjectRightList = []
					this.subjectRightChecked = false
					this.subjectLeftChecked = false
				}
			},
			setSubjectChecked(data) {
				for (var i = 0; i < this.subjectList.length; i++) {
					this.subjectList[i].checked = data
				}
				this.subjectChange()
			},
			searchMergeData() {
				let subjectStr = []
				for (var i = 0; i < this.subjectMergeList.length; i ++) {
					subjectStr.push(this.subjectMergeList[i].metaQuestionCode)
				}
				let projectStr = []
				for (var a = 0; a < this.projectMergeList.length; a ++) {
					projectStr.push(this.projectMergeList[a].metaGuid)
				}
				// this.$store.dispatch('merge/setMergeSubjects', subjectStr.toString())
				// this.$store.dispatch('merge/setMergeProjects', projectStr.toString())
				this.$router.push(`/export/merge-data-table?projectIds=${projectStr.toString()}&subjectIds=${subjectStr.toString()}`)
			}
		},
		beforeRouteEnter(to, from, next) {
			next(vm => {
				vm.$store.commit('addTabs', {
					title: '合并导出',
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
	.merge-data-main {
		width: 100%;
		overflow: auto;

		.merge-content {
			width: 1180px;
			// height: calc(100% - 180px);
			background: #FFFFFF;
			box-shadow: 0px 0px 13px 0px rgba(0, 0, 0, 0.1);
			margin: auto;
			margin-top: 50px;
			padding: 20px;

			.merge-tip {
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

			.merge-line {
				border-top: 1px solid #D2D2D2FF;
			}

			.merge-title {
				img {
					padding-right: 10px;
				}

				height: 50px;
				line-height: 50px;
				font-size: 14px;
				font-weight: 500;
				color: #333333;
				margin-top: 10px;
			}

			.merge-project,
			.merge-subject {
				display: flex;

				.left,
				.right {
					width: 548px;
					border: 1px solid #DDDEE1;
					height: 393px;

					.title {
						height: 40px;
						background: #F8F8F8;
						line-height: 40px;
						padding-left: 15px;
						color: #333333;
						font-weight: 600;
						font-size: 14px;
					}

					.operation {
						padding: 10px 15px;

						.input {
							.el-input {
								width: 210px;

								::v-deep .el-input__inner {
									height: 32px;
									line-height: 32px;
								}

								::v-deep .el-input__icon {
									line-height: 32px;
								}
							}

							.el-button {
								padding: 8px 25px;
								margin-left: 12px;
								font-weight: 600;
								font-size: 12px;
								color: #495060;
							}
						}

						.all {
							color: #6D7278;
						}

						.el-checkbox {
							margin-right: 13px;
						}

						.data {
							overflow: auto;
							height: 300px;
							margin-top: 7px;

							.item {
								cursor: pointer;
								white-space: nowrap;
								overflow: hidden;
								margin-top: 7px;
								font-size: 14px;
								font-weight: 400;
								color: #333333;
							}
						}

						.no-data {
							text-align: center;
							color: #c1cad3;
							font-size: 16px;
							margin-top: 100px;
						}
					}
				}

				.opera {
					padding: 150px 20px;

					img {
						margin-bottom: 33px;
						display: block;
						cursor: pointer;
					}

					.imgN {
						background-color: #fbf7f7;
						z-index: 2;
						opacity: 0.3;
						filter: alpha(opacity=30);
					}
				}

			}
		}

		.merge-button {
			width: 1180px;
			margin: auto;
			text-align: center;
			margin: 20px auto;
		}
	}
</style>
