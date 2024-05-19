<template>
	<view>
		<view class="header" v-if="info!==null">
			<view
				:style="'width: 150rpx;height: 150rpx;border-radius: 75rpx;' + 'background: no-repeat url(' + info.avatar + ');' + 'background-size: cover;background-position: center;'">
			</view>
			<view style="margin-left: 10px;">
				<view style="height: 50rpx;line-height: 50rpx;font-size: 30rpx;">{{ info.name }}</view>
				<view style="font-size: 25rpx;color: white;">id:{{ info.shortId }} | 信誉分:{{ info.credit }}</view>
			</view>
		</view>
		<view class="middle">
			<view @click="changePageStarInfo">
				<view>{{ starNum }}</view>
				<view style="font-size: 28rpx;color: gray;">收藏</view>
			</view>
			<view @click="changePagePublishInfo">
				<view>{{ publishNum }}</view>
				<view style="font-size: 28rpx;color: gray;">发布</view>
			</view>
		</view>
		<view class="footer">
			<view @click="changePage">
				<image src="@/static/images/me/grjl.png" mode="widthFix"></image>
				<view>设置个人简历</view>
				<image src="@/static/images/enter2.png" mode="widthFix" style="position: absolute;right: 5rpx;"></image>
			</view>
			<view @click="changePage1">
				<image src="@/static/images/me/publish.png" mode="widthFix"></image>
				<view>发布家教信息</view>
				<image src="@/static/images/enter2.png" mode="widthFix" style="position: absolute;right: 5rpx;"></image>
			</view>
			<view @click="changePage2">
				<image src="@/static/images/me/help.png" mode="widthFix"></image>
				<view>平台指南</view>
				<image src="@/static/images/enter2.png" mode="widthFix" style="position: absolute;right: 5rpx;"></image>
			</view>
			<view @click="changePage3">
				<image src="@/static/images/me/shezhi.png" mode="widthFix"></image>
				<view>个人信息</view>
				<image src="@/static/images/enter2.png" mode="widthFix" style="position: absolute;right: 5rpx;"></image>
			</view>
			<view @click="changePageReward">
				<image src="@/static/images/me/reward.png" mode="widthFix"></image>
				<view>打赏作者</view>
				<image src="@/static/images/enter2.png" mode="widthFix" style="position: absolute;right: 5rpx;"></image>
			</view>
			<view @click="changePageSup">
				<image src="@/static/images/me/support.png" mode="widthFix"></image>
				<view>技术支持</view>
				<image src="@/static/images/enter2.png" mode="widthFix" style="position: absolute;right: 5rpx;"></image>
			</view>
			<view @click="changePageDiscuss">
				<image src="@/static/images/me/ly.png" mode="widthFix"></image>
				<view>社区留言</view>
				<image src="@/static/images/enter2.png" mode="widthFix" style="position: absolute;right: 5rpx;"></image>
			</view>
			<view @click="changePageYingsi">
				<image src="@/static/images/me/suo.png" mode="widthFix"></image>
				<view>隐私政策摘要</view>
				<image src="@/static/images/enter2.png" mode="widthFix" style="position: absolute;right: 5rpx;"></image>
			</view>
		</view>
		<button class="btn" @tap="loginOut">退出登录</button>
	</view>
</template>

<script>
	const AV = require('static/js/sangFangKu/AV.js')
	export default {
		data() {
			return {
				info: null,
				publishNum: null, //用户发布的数量
				starNum: null //用户收藏的数量
			}
		},
		methods: {
			// 设置个人简历界面的跳转
			changePage(){
				uni.navigateTo({
					url: '/subpages/biographicalNotes/biographicalNotes'
				})
			},
			// 发布页面的跳转
			changePage1(){
				uni.navigateTo({
					url: '/subpages/publish/publish'
				})
			},
			// 平台指南页面的跳转
			changePage2(){
				uni.navigateTo({
					url: '/subpages/help/help'
				})
			},
			// 用户信息设置界面的跳转
			changePage3(){
				uni.navigateTo({
					url: '/subpages/userInfo/userInfo'
				})
			},
			// 发布信息页面跳转
			changePagePublishInfo(){
				uni.navigateTo({
					url: '/subpages/publishInfo/publishInfo'
				})
			},
			// 收藏界面跳转
			changePageStarInfo(){
				uni.navigateTo({
					url: '/subpages/starInfo/starInfo'
				})
			},
			// 技术支持界面跳转
			changePageSup(){
				uni.navigateTo({
					url: '/subpages/support/support'
				})
			},
			// 打赏界面跳转
			changePageReward(){
				uni.navigateTo({
					url: '/subpages/reward/reward'
				})
			},
			// 社区留言界面跳转
			changePageDiscuss(){
				uni.navigateTo({
					url: '/subpages/discuss/discuss'
				})
			},
			// 隐私政策摘要跳转
			changePageYingsi(){
				uni.navigateTo({
					url: '/subpages/privacyPolicy/privacyPolicy'
				})
			},
			// 退出登录
			loginOut(){
				uni.showModal({
					title: '提示',
					content:'退出登录后将清空本地数据，聊天记录也会被删除，你确定退出登录吗？',
					success(sel) {
						if(sel.confirm){
							AV.User.logOut();
							uni.reLaunch({
								url: '/pages/login/login'
							})
							uni.closeSocket({})
							uni.setStorageSync('isTimeNum', true)
							uni.clearStorage()
						}else{
							return
						}
					}
				})
			}
		},
		onShow() {
			var currentUser = AV.User.current();
			this.info = currentUser.attributes
			if(currentUser.attributes.data===undefined){
				this.publishNum = 0
			}else{
				this.publishNum = currentUser.attributes.data.length
			}
			if(currentUser.attributes.star===undefined){
				this.starNum = 0
			}else{
				this.starNum = currentUser.attributes.star.length
			}
		}
	}
</script>

<style scoped>
.header{
	height: 326rpx;
	display: flex;
	align-items: center;
	padding-left: 20rpx;
	background: linear-gradient(135deg,#eacda3,#d6ae7b);
}
.middle{
	display: flex;
	justify-content: space-around;
	align-items: center;
	background-color: ghostwhite;
}
.middle view{
	display: flex;
	flex-direction: column;
	align-items: center;
}
.footer{
	margin-top: 26rpx;
	padding: 10rpx;
	position: relative;
	background-color: ghostwhite;
}
.footer view{
	display: flex;
	margin-bottom: 23rpx;
	font-size: 35rpx;
}
.footer view image{
	width: 45rpx;
	margin-right: 15rpx;
}
.btn{
	width: 200rpx;
	height: 80rpx;
	line-height: 80rpx;
	font-size: 30rpx;
	border: 1px solid #9f9a9a;
	margin: 50rpx auto;
	position: relative;
	top: -20rpx;
}
</style>
