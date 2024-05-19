<template>
	<view style="padding: 10rpx;">
		<view class="header">
			<image @click="back" src="@/static/images/back.png" mode="widthFix"></image>
			<image src="@/static/images/search.png" mode="widthFix"></image>
			<input type="text" placeholder="请输入用户的id或名称" v-model="searchValue" />
			<view style="font-size: 30rpx;" @click="search">搜索</view>
		</view>
		<!-- #ifdef MP-WEIXIN -->
			<view class="list" v-if="searchList.length">
				<view class="list_item" v-for="(user, index) in searchList" :key="index">
					<image :src="user.avatar">
					</image>
					<view
						style="width: 560rpx;height: 90rpx;display: flex;flex-direction: column;justify-content: space-between;">
						<view style="font-size: 30rpx;font-weight: 700;">{{ user.name }}</view>
						<view style="display: flex;justify-content: space-between;">
							<view class="xingYuFen">信誉分:{{ user.credit }} | id: {{ user.shortId }}</view>
							<view class="list_item_right" @click="addFriend(index)">
								<image src="@/static/images/addFri24.png" mode="widthFix"></image>
								<view>添加</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		<!-- #endif -->
		<!-- #ifdef APP || H5 -->
			<view class="list" v-if="searchList.length">
				<view class="list_item" v-for="(user, index) in searchList" :key="index">
					<image :src="user.attributes.avatar">
					</image>
					<view
						style="width: 560rpx;height: 90rpx;display: flex;flex-direction: column;justify-content: space-between;">
						<view style="font-size: 30rpx;font-weight: 700;">{{ user.attributes.name }}</view>
						<view style="display: flex;justify-content: space-between;">
							<view class="xingYuFen">信誉分:{{ user.attributes.credit }} | id: {{ user.attributes.shortId }}</view>
							<view class="list_item_right" @click="addFriend(index)">
								<image src="@/static/images/addFri24.png" mode="widthFix"></image>
								<view>添加</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		<!-- #endif -->
	</view>
</template>

<script>
	const AV = require('static/js/sangFangKu/AV.js')
	export default {
		data() {
			return {
				searchValue: '',
				searchList: []
			}
		},
		methods: {
			// 返回
			back() {
				uni.navigateBack({
					fail() {
						uni.switchTab({
							url: '/pages/chatList/chatList'
						})
					}
				})
			},
			// 搜索
			search() {
				uni.showLoading({
					title: "搜索中"
				})
				const id = new AV.Query("User");
				id.equalTo("shortId", this.searchValue);

				const name = new AV.Query("User");
				name.equalTo("name", this.searchValue);

				const query = AV.Query.or(id, name);
				query.find().then((user) => {
					this.searchList = user
					uni.hideLoading()
				});
			},
			// 发送好友申请
			addFriend(index) {
				var info = JSON.parse(uni.getStorageSync('AV/oIIbvLZCzqBIhw5ILnQ0W3lX-gzGzoHsz/currentUser'))

				if (info.objectId === this.searchList[index].id) {
					uni.showModal({
						title: '提示',
						content: "不能添加自己哦!",
						showCancel: false
					})
					return
				}

				uni.showLoading({
					title: "加载中"
				})
				// 在申请好友前先去云端查询是否已经申请过
				const fromQuery = new AV.Query("friendSubmit");
				fromQuery.equalTo("from", {
					name: info.name,
					avatar: info.avatar,
					id: info.objectId
				});
				const toQuery = new AV.Query("friendSubmit");
				toQuery.equalTo("to", {
					name: this.searchList[index].attributes.name,
					avatar: this.searchList[index].attributes.avatar,
					id: this.searchList[index].id
				});
				const query = AV.Query.and(fromQuery, toQuery);
				query.find().then((fri) => {
					if (fri.length) {
						uni.showModal({
							title: '提示',
							content: "已经申请过了，请不要重复添加",
							showCancel: false
						})
						uni.hideLoading()
					} else {
						// 好友申请存云端
						const friendSubmit = AV.Object.extend("friendSubmit");
						const awAgree = AV.Object.extend("awAgree");
						const friendsubmit = new friendSubmit();
						const awagree= new awAgree();
						// 设置friendSubmit
						friendsubmit.set("from", {
							name: info.name,
							avatar: info.avatar,
							id: info.objectId
						});
						friendsubmit.set("to", {
							name: this.searchList[index].attributes.name,
							avatar: this.searchList[index].attributes.avatar,
							id: this.searchList[index].id
						});
						// 设置awAgree(在这之前先去查询是否已经存在)
						var fromQuery2 = new AV.Query("awAgree");
						fromQuery2.equalTo("from", info.objectId);
						var toQuery2 = new AV.Query("awAgree");
						toQuery2.equalTo("to", this.searchList[index].id);
						
						var queryAll2 = AV.Query.and(fromQuery2, toQuery2);
						queryAll2.find().then((agr) => {
							// 进行if判断
							if(!agr.length){
								awagree.set("from", info.objectId)
								awagree.set("to", this.searchList[index].id)
								// 成功保存之后，执行其他逻辑
								awagree.save()
							}
						});
						// 提交
						friendsubmit.save().then(
							(fri) => {
								uni.hideLoading()
								uni.showModal({
									title: '提示',
									content: "发送成功",
									showCancel: false
								})
							},
							(error) => {
								// 异常处理
								console.log(error)
							}
						);
					}
				});
			}
		}
	}
</script>

<style scoped>
	.header {
		width: 95vw;
		height: 80rpx;
		display: flex;
		align-items: center;
		position: relative;
	}

	.header input {
		background-color: #15151517;
		flex-grow: 1;
		height: 70rpx;
		line-height: 70rpx;
		margin-right: 10rpx;
		border-radius: 5rpx;
		box-sizing: border-box;
		padding-left: 65rpx;
		font-size: 28rpx;
	}

	.header image {
		width: 40rpx;
	}

	.header image:nth-child(2) {
		position: absolute;
		left: 50rpx;
	}

	.list {
		margin-top: 40rpx;
		overflow: hidden;
	}

	.list_item {
		height: 130rpx;
		display: flex;
		align-items: center;
		margin-bottom: 20rpx;
		border-bottom: 1px solid gray;
	}

	.list_item image {
		width: 120rpx;
		height: 120rpx;
		border-radius: 60rpx;
		margin-right: 20rpx;
	}

	.xingYuFen {
		font-size: 26rpx;
		height: 40rpx;
		line-height: 40rpx;
		border-radius: 10rpx;
		text-align: center;
		color: gray;
	}

	.list_item_right {
		display: flex;
		height: 55rpx;
		border-radius: 10rpx;
		justify-content: center;
		align-items: center;
		font-size: 30rpx;
		border: 1px solid grey;
		position: relative;
		top: -36rpx;
		padding: 10rpx;
	}

	.list_item_right image {
		width: 50rpx;
	}
</style>