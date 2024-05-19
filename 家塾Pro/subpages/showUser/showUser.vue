<template>
	<view style="padding: 20rpx;">
		<view style="display: flex;flex-direction: column;align-items: center;">
			<view v-if="data.avatar"
				:style="'width: 200rpx;height: 200rpx;border-radius: 100rpx;' + 'background: no-repeat url(' + data.avatar + ');' + 'background-size: cover;background-position: center;'">
			</view>
			<view style="font-size: 35rpx;margin-top: 10px;">{{ data.name }}</view>
		</view>
		<view class="text">这是该用户在家塾Pro的第{{ date(data.createdAt) }}天
		</view>
		<view class="text">该用户的发布数:{{ length1 }}</view>
		<view class="text">该用户的信誉分:{{ data.credit }}</view>
		<view class="juBao" @click="changePageReport">
			<image src="@/static/images/report.png" mode="widthFix"></image>
			<view style="font-size: 30rpx;">举报该用户</view>
		</view>
	</view>
</template>

<script>
	export default {
		onLoad(options) {
			this.data = JSON.parse(options.user)
			this.length1 = String(JSON.parse(options.user).data.length)
		},
		data() {
			return {
				data: {},
				length1: ""
			}
		},
		methods: {
			date(time) {
				var date = new Date();
				var date1 = new Date(time);
				// 获取两个日期的时间戳，并计算它们的差值
				var timeDiff = Math.abs(date.getTime() - date1.getTime());
				// 将时间差转换为天数
				var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
				return diffDays + ''
			},
			// 跳转到举报表单提交页面
			changePageReport(){
				var info = JSON.parse(uni.getStorageSync('AV/oIIbvLZCzqBIhw5ILnQ0W3lX-gzGzoHsz/currentUser'))
				if(info.objectId === this.data.objectId){
					uni.showModal({
						title: "提示",
						content: '无法举报自己'
					})
					return
				}
				uni.navigateTo({
					url: `/subpages/report/report?reportId=${this.data.objectId}`
				})
			}
		}
	}
</script>

<style scoped>
	.juBao {
		width: 220rpx;
		height: 120rpx;
		border-radius: 20rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		margin: 100rpx auto;
		border: 1px solid black;
	}

	.juBao image {
		width: 70rpx;
	}

	.text {
		font-size: 30rpx;
		margin-top: 40rpx;
		padding: 20rpx;
		border: 1px solid gray;
		border-radius: 10rpx;
	}
</style>