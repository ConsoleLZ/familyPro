<template>
	<view class="tips" v-if="isShow">
		<view class="tipsItem" :style="bgColor + color">{{ text }}</view>
	</view>
</template>

<script>
	export default {
		name:"tips",
		props:{
			text: String,
			isShow: Boolean,
			// 背景色
			bgColor: {
				type: String,
				default: 'background-color: rgba(0, 0, 0, 0.8);'
			},
			// 文字颜色
			color:{
				type: String,
				default: 'color: white;'
			}
		},
		data() {
			return {
				
			};
		}
	}
</script>

<style scoped>
.tips{
	width: 100vw;
	height: 100vh;
	position: absolute;
	left: 0;
	top: 0;
	z-index: 999;
	background-color: rgba(0, 0, 0, 0.4);
	display: flex;
	justify-content: center;
	align-items: center;
}
.tipsItem{
	width: 466rpx;
	height: 322rpx;
	display: flex;
	justify-content: center;
	align-items: center;
	border-radius: 6px;
	font-size: 30rpx;
}
</style>