<template>
	<div class="raw-data-main">
		<div class="raw-content">
			<div class="raw-tip"><span class="tip-l"></span><span class="tip-t">原数据导出</span><span class="tip-r">产品测试专案</span></div>
			<div class="raw-title">{{ case_name }}</div>
			<div class="raw-input">
				<el-input placeholder="请输入关键字" clearable v-model="subjectName"></el-input>
				<el-button type="primary" @click="getSubjectList">搜索</el-button>
			</div>
			<div class="raw-shuttle">
				<div class="shuttle-out">
					<div class="title">
						<el-checkbox v-model="bfChecked" @change="bfAllChange"></el-checkbox><span>未添加专案题目({{ bfshutData.length }})</span>
					</div>
					<!-- <div class="no-data" v-if="bfdata.length == 0">暂无数据</div> -->
					<!-- v-infinite-scroll="getSubjectList" infinite-scroll-disabled="subjectTopScroll" infinite-scroll-distance="0" -->
					<div class="data">
						<div v-for="(item, index) in bfdata" :key="index">
							<div class="item" v-if="item.show">
								<el-checkbox v-model="item.checked" @change="bfChange(0)"></el-checkbox><span>{{ item.questionSName }}</span>
							</div>
						</div>
					</div>
				</div>

				<div class="shuttle-operation">
					<img src="../../assets/img/raw-left.png" class="imgN" v-if="afshutData.length == 0" />
					<img src="../../assets/img/raw-left.png" @click="shuttle('del')" v-else />
					<img src="../../assets/img/raw-right.png" class="imgN" v-if="bfshutData.length == 0" />
					<img src="../../assets/img/raw-right.png" @click="shuttle('add')" v-else />
				</div>

				<div class="shuttle-in">
					<div class="title">
						<el-checkbox v-model="afChecked" @change="afAllChange"></el-checkbox><span>已添加专案题目({{ afshutData.length }})</span>
					</div>
					<div class="no-data" v-if="afdata.length == 0">暂无数据</div>
					<div class="data" v-else>
						<div class="item" v-for="(item, index) in afdata" :key="index">
							<el-checkbox v-model="item.checked" @change="afChange"></el-checkbox><span>{{ item.questionSName }}</span>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="raw-button">
			<el-button type="primary" @click="searchExportData" :disabled="afdata.length == 0">确认查询</el-button>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'RawDataExport',
		data() {
			return {
				case_id: '',
				case_name: '',
				subjectName: '',
				bfChecked: false,
				afChecked: false,
				bfdata: [],
				bfshutData: [],
				afdata: [],
				afshutData: [],
				param: {
					pageNum: 1,
					pageSize: 15,
					pageTotal: 0
				},
				subjectTopScroll: false
			}
		},
		beforeRouteEnter(to, from, next) {
			next(vm => {
				vm.$store.commit('addTabs', {
					title: '产品测试专案-原始数据导出',
					link: decodeURIComponent(vm.$route.fullPath),
					on: true,
					needCatch: true,
					isPathNameCheck: true
				})
			})
		},
		methods: {
			async getSubjectList() {
				let url = '/api/meta/topic'
				let param = {
					metaGuidList: this.case_id,
					questionName: this.subjectName
				}
				await this.$fetch.post(url, param).then((res) => {
					if (res.errorCode == 0) {
						this.setListChecked(res.resultBody)
						// this.param.pageTotal = res.data.totalPages
						// if (this.param.pageNum < this.param.pageTotal) {
						// 	this.param.pageNum ++
						// } else {
						// 	this.subjectTopScroll = true
						// }
					}
				})
			},
			searchSubject() {
				this.subjectTopScroll = false
				this.param.pageNum = 1
				this.bfdata = []

				let url = '/api/bn/store/page'
				let param = {
					isLoading: true,
					orgId: "6006469204833598576",
					pageNum: this.param.pageNum,
					pageSize: this.param.pageSize,
					nameTag: this.subjectName
				}
				this.$fetch.post(url, param).then((res) => {
					if (res.code == 200) {
						this.setSearchChecked(res.data.content)
						this.param.pageTotal = res.data.totalPages
						if (this.param.pageNum < this.param.pageTotal) {
							this.param.pageNum++
						}
					}
				})
			},
			setListChecked(data) {
				let result = []
				for (var i = 0; i < data.length; i++) {
					this.$set(data[i], "checked", this.bfChecked)
					if (this.afdata.find(e => e.questionCode == data[i].questionCode)) {
						this.$set(data[i], "show", false)
					} else {
						this.$set(data[i], "show", true)
					}
					result.push(data[i])
				}
				this.bfdata = result
			},
			setSearchChecked(data) {
				let result = []
				for (var i = 0; i < data.length; i++) {
					this.$set(data[i], "checked", this.bfChecked)
					if (this.afdata.find(e => e.id == data[i].id)) {
						this.$set(data[i], "show", false)
					} else {
						this.$set(data[i], "show", true)
					}
					result.push(data[i])
				}
				this.bfdata = result
			},
			setBfData(data) {
				for (var i = 0; i < this.bfdata.length; i++) {
					this.bfdata[i].checked = data
				}
			},
			setAfData(data) {
				for (var i = 0; i < this.afdata.length; i++) {
					this.afdata[i].checked = data
				}
			},
			shuttle(type) {
				if (type == 'add') {
					for (var d = 0; d < this.bfdata.length; d++) {
						if (this.bfdata[d].checked && this.bfdata[d].show) {
							this.bfdata[d].show = false
							this.afdata.push(this.bfdata[d])
						}
					}
					this.bfshutData = []
					this.bfChecked = false
					this.afChange()
					if (this.param.pageNum < this.param.pageTotal) {
						this.getSubjectList()
					}
				}
				if (type == 'del') {
					this.afdata = this.afdata.filter(item => !item.checked)
					for (var t = 0; t < this.afshutData.length; t++) {
						for (var i = 0; i < this.bfdata.length; i++) {
							if (this.afshutData[t].questionCode == this.bfdata[i].questionCode) {
								this.bfdata[i].show = true
								this.bfdata[i].checked = false
							}
						}
					}
					this.afshutData = []
					this.bfChecked = false
					this.afChecked = false
				}
			},
			bfAllChange(data) {
				this.setBfData(data)
				this.bfChange()
			},
			bfChange(type) {
				let list = []
				for (var i = 0; i < this.bfdata.length; i++) {
					if (this.bfdata[i].checked && this.bfdata[i].show) {
						list.push(this.bfdata[i])
					} else {
						if(type == 0) {
							this.bfChecked = false
						}
					}
				}
				this.bfshutData = list
			},
			afAllChange(data) {
				this.setAfData(data)
				this.afChange()
			},
			afChange() {
				this.afChecked = true
				let list = []
				for (var i = 0; i < this.afdata.length; i++) {
					if (this.afdata[i].checked) {
						list.push(this.afdata[i])
					} else {
						this.afChecked = false
					}
				}
				this.afshutData = list
			},
			searchExportData() {
				let queStr = []
				for (var i = 0; i < this.afdata.length; i ++) {
					queStr.push(this.afdata[i].questionCode)
				}
				// this.$store.dispatch('merge/setMergeQuestions', queStr.toString())
				this.$router.push(`/export/raw-data-table?case_id=${this.case_id}&case_name=${this.case_name}&subjectId=${queStr}`)
			}
		},
		created() {
			this.case_id = this.$route.query.case_id
			this.case_name = this.$route.query.case_name
			this.getSubjectList()
		}
	}
</script>

<style lang="scss" scoped>
	.raw-data-main {
		width: 100%;
		overflow: auto;

		.raw-content {
			width: 1180px;
			background: #FFFFFF;
			box-shadow: 0px 0px 13px 0px rgba(0, 0, 0, 0.1);
			margin: auto;
			margin-top: 50px;
			padding: 20px;

			.raw-tip {
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

			.raw-title {
				height: 63px;
				line-height: 63px;
				font-size: 13px;
				font-weight: 600;
				color: #333333;
				margin-top: 13px;
				border: 1px solid #E0E6ED;
				padding-left: 15px;
			}

			.raw-input {
				margin-top: 15px;

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
					padding: 8px 40px;
					margin-left: 10px;
				}
			}

			.raw-shuttle {
				margin-top: 10px;

				.shuttle-out,
				.shuttle-in {
					height: 352px;
					overflow: auto;
					border: 1px solid #DDDEE1;

					.title {
						background: #F8F8F8;
						height: 40px;
						line-height: 40px;
						font-size: 14px;
						font-weight: 600;
						color: #333333;
						cursor: pointer;
					}

					.data {
						height: 310px;
						overflow: auto;

						.item {
							font-size: 14px;
							font-weight: 400;
							color: #333333;
							padding: 4px 0px;
							cursor: pointer;
							white-space: nowrap;
							overflow: hidden;
						}
					}

					.no-data {
						text-align: center;
						color: #c1cad3;
						font-size: 20px;
						margin-top: 100px;
					}

					.el-checkbox {
						padding: 0 15px;
					}
				}
			}

			.shuttle-operation {
				text-align: center;
				padding: 15px 0px;

				img {
					cursor: pointer;

					&:first-child {
						margin-right: 23px;
					}

					&:last-child {
						margin-left: 23px;
					}
				}

				.imgN {
					background-color: #fbf7f7;
					z-index: 2;
					opacity: 0.3;
					filter: alpha(opacity=30);
				}
			}
		}

		.raw-button {
			width: 1180px;
			margin: auto;
			text-align: center;
			margin: 20px auto;
		}
	}
</style>
