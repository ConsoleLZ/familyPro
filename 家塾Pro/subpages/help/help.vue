<template>
	<view>
		<view class="title">
			平台简介:
		</view>
		<view class="content">
			本平台使用uni-app技术，由个人开发，如果该平台的一些商标或文章有侵权，请立即联系作者：17347187569@163.com
		</view>
		<view class="title">
			关于平台合作
		</view>
		<view class="content">
			<view>1.广告合作</view>
			<view>2.成为开发者</view>
			<view>3.赞助本平台</view>
			所有的合作都请联系：17347187569@163.com
		</view>
		<view class="title">
			常见问题
		</view>
		<view class="content">
			<view>为什么不能发布了?</view>
			<text>如果不是网络问题，请先检查自己的信誉分，如果低于480分，就不能发布了，还请联系作者，或者做一些提高信誉分的任务</text>
			<view>头像显示失败,或者移位</view>
			<text>因为本平台由个人制作，难免遇到一些bug，还请各位能够理解，如果遇到，请务必联系我，或者在社区进行讨论，我会认真解决每一个bug的</text>
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
.title{
	font-weight: 700;
	margin-left: 10rpx;
	margin-top: 20rpx;
	font-size: 30rpx;
}
.content{
	width: 95vw;
	margin: 10rpx auto;
	background-color: #F2EDED;
	border-radius: 10rpx;
	font-size: 28rpx;
	padding: 10rpx;
}
.content view{
	width: 60%;
	height: 50rpx;
	line-height: 50rpx;
	padding: 10rpx;
	background-color: #efa78d;
	margin-bottom: 15rpx;
	border-radius: 10rpx;
}
</style>