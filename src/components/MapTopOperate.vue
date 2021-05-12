<template>
	<div class="map-top-operate">
		<div class="icon-image" @click="functionListShow()">
			<svg class="icon" style="width: 16px; height: 16px;" aria-hidden="true">
				<use xlink:href="#iconicon_map_control"></use>
			</svg>
			<span class="el-icon-arrow-down" style="font-size: 14px; margin-left: 5px;"></span>
		</div>
		<div class="icon-change" v-show="iconChange" @mouseover="functionListShow()" @mouseout="functionListNone()">
			<div class="level-left" v-show="iconLevel">
				<ul>
					<li v-for="(item, index) in mapTypeData" :key="index" :class="{'checkedLi': item.type == mapStyle}" @click="changeMapType(item)">{{ item.name }}</li>
				</ul>
				<div class="map-display">
					<el-checkbox v-model="mapCheck" @change='baseMapCheck()'></el-checkbox>
					隐藏地图
				</div>
			</div>
			<div class="level-left-ranging" v-show="rangingLevel">
				<ul>
					<li v-for="(item, index) in mapRanginig" :key="index" :class="{'checkedLi': item.type == mapRanging}" @click="changeMapRanging(item)"> {{ item.name }} </li>
				</ul>
			</div>
			<ul class="level-lip">
				<li v-for="(item, index) in functionListData" :key="index" @mouseover="showLevel(item.type)" @click="clickLevel(item.type)">
					<svg class="icon" aria-hidden="true" style="width: 28px; height: 28px; vertical-align: middle;">
						<use :xlink:href="['#icon' + item.icon]"></use>
					</svg>
					<span>{{ item.name }}</span>
				</li>
			</ul>
		</div>
	</div>
</template>
<script>
	import {
		mapGetters
	} from 'vuex'
	export default {
		name: 'MapTopOperation',
		components: {},
		computed: {
			...mapGetters('map', [
				'mapStyle',
				'mapRanging'
			])
		},
		data() {
			return {
				iconChange: false,
				iconLevel: false,
				rangingLevel: false,
				mapCheck: false,
				functionListData: [{
						name: '搜索',
						icon: 'icon_map_search',
						type: 'search'
					},
					{
						name: '地图显示',
						icon: 'icon_map_display',
						type: 'mapType'
					},
					{
						name: '测距',
						icon: 'icon_map_ceju',
						type: 'ranging'
					},
				],
				mapTypeData: [{
						name: '标准',
						type: 'amap://styles/normal'
					},
					{
						name: '靛青蓝',
						type: 'amap://styles/blue'
					}
				],
				mapRanginig: [{
						name: '开',
						type: 'open',
					},
					{
						name: '关',
						type: 'close'
					}
				]
			}
		},
		beforeMount() {},
		mounted() {
			this.$store.dispatch('map/setMapRanging', 'close')
			this.$store.dispatch('map/setMapSearch', false)
		},
		methods: {
			functionListShow() {
				let that = this
				that.$set(that, 'iconChange', true)
			},
			functionListNone() {
				let that = this
				that.$set(that, 'iconChange', false)
			},
			showLevel(type) {
				let that = this
				if (type == 'mapType') {
					that.$set(that, 'iconLevel', true)
				} else {
					that.$set(that, 'iconLevel', false)
				}
				if (type == 'ranging') {
					that.$set(that, 'rangingLevel', true)
				} else {
					that.$set(that, 'rangingLevel', false)
				}
			},
			clickLevel(type) {
				let that = this
				if (type == 'search') {
					that.$store.dispatch('map/setMapSearch', true)
				}
			},
			changeMapType(data) {
				let that = this
				that.$store.dispatch('map/setMapStyle', data.type)
			},
			changeMapRanging(data) {
				let that = this
				that.$store.dispatch('map/setMapRanging', data.type)
			},
			baseMapCheck() {
				let that = this
				that.$store.dispatch('map/setMapHidden', this.mapCheck)
			}
		},
	}
</script>
<style scoped lang="scss">
	.map-top-operate {
		position: absolute;
		top: 4px;
		right: 4px;
		z-index: 2000;

		.icon-image {
			position: absolute;
			right: 0px;
			text-align: center;
			width: 48px;
			color: #FFFFFF;
			font-size: 12px;
			height: 32px;
			line-height: 32px;
			background: rgba(19, 55, 115, 0.5);
			border-radius: 4px;
			border: 1px solid rgba(255, 255, 255, 0.4);

			&:hover {
				background: #102F63;
				border-radius: 4px;
				border: 1px solid rgba(255, 255, 255, 0.2);
				cursor: pointer;
			}
		}

		.icon-change {
			position: absolute;
			right: 0px;
			top: 42px;
			display: flex;

			.level-lip {
				padding: 6px 0px;
				color: #FFFFFF;
				text-align: left;
				width: 200px;
				height: 130px;
				background: #0A2757;
				box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.5);
				border-radius: 4px;
				font-size: 13px;
				font-weight: 600;

				li {
					height: 36px;
					line-height: 36px;
					padding-left: 23px;
					padding-top: 3px;
					padding-bottom: 3px;

					&:hover {
						background-color: #4B1F98;
						cursor: pointer;
						font-weight: 600;
					}

					span {
						padding-left: 5px;
					}
				}
			}

			.level-left {
				margin-right: 10px;
				margin-top: 45px;
				width: 200px;
				background: #0A2757;
				box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.5);
				border-radius: 4px;
				text-align: left;
				color: #FFFFFF;

				ul {
					height: 105px;
					margin: 6px 0px;

					li {
						cursor: pointer;
						height: 36px;
						line-height: 36px;
						padding-left: 35px;
						padding-top: 3px;
						padding-bottom: 3px;
						font-weight: 500;
						position: relative;
					}

					.checkedLi {
						background-color: #4B1F98;

						&::before {
							content: "";
							position: absolute;
							left: 10px;
							top: 16px;
							width: 12px;
							height: 5px;
							border: 2px solid #FFFFFF;
							border-radius: 1px;
							border-top: none;
							border-right: none;
							background: transparent;
							transform: rotate(-45deg);
						}
					}

					&::after {
						width: 0;
						height: 0;
						border: 10px solid;
						border-color: transparent transparent transparent #0A2757;
						content: "";
						position: absolute;
						right: 190px;
						top: 60px;
					}
				}

				.map-display {
					height: 32px;
					line-height: 32px;
					padding-left: 30px;
					background-color: #133773;

					.el-checkbox {
						margin-right: 5px;
					}
				}
			}

			.level-left-ranging {
				margin-right: 10px;
				margin-top: 80px;
				width: 200px;
				background: #0A2757;
				box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.5);
				border-radius: 4px;
				text-align: left;
				color: #FFFFFF;

				ul {
					height: 80px;
					margin: 6px 0px;

					li {
						cursor: pointer;
						height: 36px;
						line-height: 36px;
						padding-left: 35px;
						padding-top: 3px;
						padding-bottom: 3px;
						font-weight: 500;
						position: relative;
					}

					.checkedLi {
						background-color: #4B1F98;

						&::before {
							content: "";
							position: absolute;
							left: 10px;
							top: 16px;
							width: 12px;
							height: 5px;
							border: 2px solid #FFFFFF;
							border-radius: 1px;
							border-top: none;
							border-right: none;
							background: transparent;
							transform: rotate(-45deg);
						}
					}

					&::after {
						width: 0;
						height: 0;
						border: 10px solid;
						border-color: transparent transparent transparent #0A2757;
						content: "";
						position: absolute;
						right: 190px;
						top: 95px;
					}
				}
			}
		}
	}
</style>
