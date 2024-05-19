<template>
	<view>
		<view class="pop" :style="popNode">
			<view @click="changePage">添加好友</view>
			<view @click="changePage1">好友申请</view>
		</view>
		<view class="header">
			<view>好友列表({{ friendList.length }})</view>
			<image src="@/static/images/add1.png" mode="widthFix" @click="conPop"></image>
		</view>
		<view class="list">
			<text class="list_text">我的好友</text>
			<view v-if="friendList.length">
				<view class="list_item" @click="changePage2(user.id, user.avatar, user.name)" v-for="user in friendList"
					:key="user.id">
					<view
						:style="'width: 100rpx;height: 100rpx;border-radius: 50rpx;' + 'background: no-repeat url(' + user.avatar + ');' + 'background-size: cover;background-position: center;'">
					</view>
					<view
						style="width: 560rpx;height: 90rpx;display: flex;flex-direction: column;justify-content: space-between;margin-left: 10rpx;">
						<view style="display: flex;justify-content: space-between;">
							<view style="font-size: 30rpx;font-weight: 700;">{{ user.name }}</view>
							<view style="font-size: 25rpx;color: gray;">{{ date(user.date) }}</view>
						</view>
						<view class="message">
							<view>{{ user.messageLast }}</view>
						</view>
					</view>
				</view>
			</view>
			<view v-else style="font-size: 26rpx;text-align: center;height: 100rpx;line-height: 100rpx;">暂无好友，可以通过右上角加号进行添加</view>
			<text class="list_text">陌生人私信</text>
			<view v-if="strangersList.length">
				<view class="list_item" @click="changePage2(user.id, user.avatar, user.name)" v-for="user in strangersList"
					:key="user.id">
					<view
						:style="'width: 100rpx;height: 100rpx;border-radius: 50rpx;' + 'background: no-repeat url(' + user.avatar + ');' + 'background-size: cover;background-position: center;'">
					</view>
					<view
						style="width: 560rpx;height: 90rpx;display: flex;flex-direction: column;justify-content: space-between;margin-left: 10rpx;">
						<view style="display: flex;justify-content: space-between;">
							<view style="font-size: 30rpx;font-weight: 700;">{{ user.name }}</view>
							<view style="font-size: 25rpx;color: gray;">{{ date(user.date) }}</view>
						</view>
						<view class="message">
							<view>{{ user.messageLast }}</view>
						</view>
					</view>
				</view>
			</view>
			<view v-else style="font-size: 26rpx;text-align: center;height: 100rpx;line-height: 100rpx;">暂无陌生人消息</view>
		</view>
	</view>
</template>

<script>
	const AV = require('static/js/sangFangKu/AV.js')
	export default {
		data() {
			return {
				popNode: "width: 226rpx;height: 0rpx",
				isShow: false,
				friendList: [], //好友列表
				strangersList: []  //陌生人列表
			}
		},
		async onShow() {
			var info = JSON.parse(uni.getStorageSync('AV/oIIbvLZCzqBIhw5ILnQ0W3lX-gzGzoHsz/currentUser'))
			// 获取陌生人列表
			let strangers = uni.getStorageSync('strangers')
			if(strangers !== ''){
				this.strangersList = strangers.map(item=>{
					var objItem = JSON.parse(item)
					let messageList = uni.getStorageSync(objItem.id+info.objectId)
					let messageLast = JSON.parse(messageList[messageList.length-1]).message
					let date = JSON.parse(messageList[messageList.length-1]).date
					return {
						...objItem,
						messageLast,
						date
					}
				})
			}
			const currentUser = AV.User.current();
			// 查询发送的好友申请是否已经同意
			let query2 = new AV.Query("awAgree");
			query2.equalTo("from", info.objectId);
			query2.find().then(async (user) => {
				// 判断对方是否已经同意
				for (var i = 0; i < user.length; i++) {
					var delId = user[i].id
					if (user[i].attributes.type) {
						let query3 = new AV.Query("User");
						var currentUser = AV.User.current();
						query3.equalTo("objectId", user[i].attributes.to);
						await query3.find().then((ad) => {
							let friendList = []
							let uniqueArr
							// 存入我的好友列表
							if (!currentUser.attributes.friend) {
								friendList.push({
									name: ad[0].attributes.name,
									avatar: ad[0].attributes.avatar,
									id: ad[0].id
								})
								uniqueArr = friendList.filter((obj, index, self) =>
									index === self.findIndex((o) => (
										o.id === obj.id
									))
								);
							} else {
								friendList = currentUser.attributes.friend
								friendList.push({
									name: ad[0].attributes.name,
									avatar: ad[0].attributes.avatar,
									id: ad[0].id
								})
								uniqueArr = friendList.filter((obj, index, self) =>
									index === self.findIndex((o) => (
										o.id === obj.id
									))
								);
							}
							currentUser.set('friend', uniqueArr)
							currentUser.save().then(() => {
								// 删除已经同意的申请
								var a = AV.Object.createWithoutData("awAgree", delId);
								a.destroy();
							})
						});
					}
				}
			});
			// 渲染页面
			let friendList = []
			for (let i = 0; i < currentUser.attributes.friend.length; i++) {
				let query = new AV.Query("User");
				query.equalTo("objectId", currentUser.attributes.friend[i].id);
				await query.find().then((user) => {
					let messLast = uni.getStorageSync(user[0].id + info.objectId) //最后一条消息
					let messageLast, date
					if (messLast[messLast.length - 1] === undefined) {
						messageLast = '暂无消息'
						date = ''
					} else {
						messageLast = JSON.parse(messLast[messLast.length - 1]).message
						date = JSON.parse(messLast[messLast.length - 1]).date
					}
					var obj = {
						...user[0].attributes,
						id: user[0].id,
						messageLast,
						date
					}
					friendList.push(obj)
				});
			}
			this.friendList = friendList
		},
		methods: {
			// 最后一条消息的时间
			date(date) {
				if (date.split(' ')[1] === undefined) {
					return ''
				} else {
					return date.split(' ')[1]
				}
			},
			// 跳转加好友页面
			changePage() {
				uni.navigateTo({
					url: '/subpages/searchFriend/searchFriend'
				})
			},
			// 跳转好友申请页面
			changePage1() {
				uni.navigateTo({
					url: '/subpages/friendSubmit/friendSubmit'
				})
			},
			// 跳转好友聊天页面
			changePage2(id, avatar, name) {
				uni.navigateTo({
					url: `/subpages/chat/chat?id=${id}&avatar=${avatar}&name=${name}`
				})
			},
			// 控制弹出层的显示，隐藏
			conPop() {
				if (!this.isShow) {
					this.popNode = 'width: 226rpx;height: 200rpx'
					this.isShow = true
				} else {
					this.popNode = 'width: 226rpx;height: 0rpx'
					this.isShow = false
				}
			}
		}
	}
</script>

<style scoped>
	.list_text {
		width: 100vw;
		padding-top: 15rpx;
		padding-bottom: 15rpx;
		font-size: 24rpx;
		display: block;
	}

	.header {
		width: 100vw;
		height: 100rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-bottom: 1px solid gray;
		position: fixed;
		top: 0;
		left: 0;
		padding-left: 20rpx;
		padding-right: 20rpx;
		box-sizing: border-box;
		background-color: white;
		z-index: 9;
	}

	.header view {
		font-size: 30rpx;
	}

	.header image {
		width: 40rpx;
	}

	.list {
		margin-top: 100rpx;
		overflow: hidden;
	}

	.list_item {
		height: 130rpx;
		display: flex;
		align-items: center;
		position: relative;
		padding-left: 5rpx;
	}

	.message {
		display: flex;
		justify-content: space-between;
	}

	.message view:nth-child(1) {
		width: 460rpx;
		font-size: 28rpx;
		color: gray;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.pop {
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		align-items: center;
		font-size: 28rpx;
		background-color: black;
		position: absolute;
		right: 10rpx;
		z-index: 10;
		transition: all 200ms;
		overflow: hidden;
		border-radius: 10rpx;
	}

	.pop view {
		width: 80%;
		height: 60rpx;
		line-height: 60rpx;
		text-align: center;
		border-radius: 15rpx;
		border: 1px solid gray;
		color: white;
	}

	.delete {
		position: absolute;
		top: 0;
		right: -130rpx;
		height: 130rpx;
		width: 130rpx;
		color: white;
		background-color: #ff6b81;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 28rpx;
	}
</style>