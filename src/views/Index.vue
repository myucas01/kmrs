<template>
	<!--专案查询页-->
	<div class="index">
		<div class='indexFrame'>
			<div class='indexTitle'>KMRS系统服务</div>
			<div class='indexContent'>
				<div class='topTabs'>
					<div class='perTab caseQuery' :class='{tabActive: current_component === "CaseQueryContainer"}' @click='switchTab("CaseQueryContainer")'><span class='tabText'>专案查询</span></div>
					<div class='perTab BIQuery' :class='{tabActive: current_component === "BIBoard"}' @click='switchTab("BIBoard")'><span class='tabText'>BI查询</span></div>
				</div>
				<div class='mainContent'>
					<component :is='current_component'></component>	
				</div>
			</div>
		</div>
		<div class='bottomText'>© 2021 上海晶确科技有限公司</div>
	</div>
</template>

<script>
	import CaseQueryContainer from '../components/case_query_comp/CaseQueryContainer'
	import BIBoard from './BI/BIdata'
	export default {
		name: 'Index',
		data() {
			return {
				current_component:'CaseQueryContainer'
			}
		},
		components:{
			CaseQueryContainer,
			BIBoard
		},
		beforeRouteEnter(to, from, next) {
			next((vm) => {
				vm.$store.commit('addTabs', {
					title: '• 首页-专案查询',
					link: '/index',
					on: true,
					needCatch: true
				})
			})
		},
		methods:{
			switchTab(current_comp_str) {
				this.current_component = current_comp_str
			}
		}
	}
</script>
<style lang="scss" scoped>
	.index {
		width: 100%;
		background-color: #f5f5f5;
		color:#333333;
		overflow-y: auto;
		.indexFrame{
			width:1180px;
			margin-left:auto;
			margin-right:auto;
			.indexTitle{
				text-align: center;
				color:#4C4C4C;
				font-size: 24px;
				letter-spacing: 4px;
				font-weight: bold;
				margin-top:40px;
			}
			.topTabs{
				position: relative;
				display: flex;
				.perTab{
					width: 120px;
					height: 39px;
					line-height: 39px;
					text-align: center;
					background-color: #FFFFFF;
					color:#AFAFAF;
					box-shadow: 0px 2px 18px 2px rgba(0, 0, 0, 0.08);
					margin-right:10px;
					cursor:pointer;
					z-index: 0;
					.tabText{
						width:64px;
						border-bottom: 3px solid #ffffff;
					}
				}
				.tabActive{
					color:#333333;
					font-size:14px;
					font-weight: bold;
					box-shadow: 0px -14px 34px -3px rgba(0, 0, 0, 0.08);
					z-index: 2;
					.tabText{
						width:64px;
						padding-bottom: 4px;
						border-bottom: 3px solid #930CEA;
					}
				}
			}
			.mainContent{
				position: relative;
				z-index: 1;
				// height:610px;
				background-color: #ffffff;
				box-shadow: 0px 2px 10px 2px rgba(0, 0, 0, 0.08);
			}
		}
	}
	.bottomText{
		font-size:14px;
		margin:30px 0;
		text-align: center;
		color: rgba(0, 0, 0, 0.58);
	}
	.index > div {
		flex: 1;
		width: 100%;
	}
</style>

<style lang="scss">
	.index{
		div, section, article, p {
			box-sizing: border-box;
		}
	}
</style>
