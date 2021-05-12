<!--
    专案查询模块容器
-->
<template>
	<div class="CaseQueryContainer">
		<!--搜索模块-->
		<SearchBox />
		<!--总体首页详情-->
		<GeneralDetail :part='case_query_part'/>
		<!--专案详情-->
		<CaseDetail :part='case_query_part'/>
		<!--概念详情-->
		<ConceptDetail :part='case_query_part'/>
	</div>
</template>

<script>
	import SearchBox from './SearchBox'
	import CaseDetail from './CaseDetail'
	import ConceptDetail from './ConceptDetail'
	import GeneralDetail from './GeneralDetail'

	export default {
		data() {
			return {
				case_query_part: 1,
			}
		},
		components:{
			SearchBox,
			CaseDetail,
			ConceptDetail,
			GeneralDetail
		},
		mounted() {
			console.log('---总体路由监听2---')
			if(this.$route.query.page_type === 'case_detail'){
				this.case_query_part = 2
			} else if(this.$route.query.page_type === 'concept_detail') {
				this.case_query_part = 3
			} else {
				this.case_query_part = 1
			}
		}
	}
</script>

<style scoped lang="scss">
	.CaseQueryContainer{
		padding-top:40px;
		padding-bottom:20px;
	}
</style>
