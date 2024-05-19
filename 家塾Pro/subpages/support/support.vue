<template>
	<view>
		<view class="item">
			<view class="bg1 bg"></view>
			<text>Gitee: 代码存储平台</text>
		</view>
		<view class="item">
			<view class="bg2 bg"></view>
			<text>uniCloud: 图片等文件存储</text>
		</view>
		<view class="item">
			<view class="bg3 bg"></view>
			<text>LeanCloud: 数据存储</text>
		</view>
		<view class="item">
			<view class="bg4 bg"></view>
			<text>阿里巴巴矢量图标库: 提供矢量图标</text>
		</view>
		<view class="item">
			<view class="bg6 bg"></view>
			<text>uv-ui: 组件库</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			
		}
	}
</script>

<style scoped>
.item{
	width: 95vw;
	height: 60rpx;
	line-height: 60rpx;
	border-radius: 10rpx;
	padding: 10rpx;
	margin: 10rpx auto;
	background-color: #e0e0d0;
	display: flex;
	font-size: 28rpx;
	align-items: center;
}

.bg{
	width: 40rpx;
	height: 40rpx;
	margin-right: 10rpx;
	border-radius: 5rpx;
	background-size: contain;
}

.bg1{
	background-image: url(https://gitee.com/favicon.ico);
}

.bg2{
	background-image: url(https://unicloud.dcloud.net.cn/favicon.ico);
}

.bg3{
	background-image: url(https://www.leancloud.cn/favicon.ico);
}

.bg4{
	background-image: url(https://img.alicdn.com/imgextra/i4/O1CN01Z5paLz1O0zuCC7osS_!!6000000001644-55-tps-83-82.svg);
}

.bg5{
	background-image: url(https://static.canva.cn/static/images/favicon.ico);
}

.bg6{
	background-image: url(https://www.uvui.cn/favicon.ico);
}
</style>
