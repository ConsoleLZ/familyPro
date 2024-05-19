<template>
	<view>
		<!-- #ifdef MP-WEIXIN -->
			<view class="list" v-if="list.length">
				<view class="list_item" v-for="(user, index) in list" :key="index"
					:style="listNumber===index?listItemMove1:listItemMove" @touchstart="touchStart"
					@touchmove="touchMove($event, index)" @touchend="touchEnd">
					<image :src="user.from.avatar">
					</image>
					<view
						style="width: 560rpx;height: 90rpx;display: flex;flex-direction: column;justify-content: space-between;">
						<view style="font-size: 30rpx;font-weight: 700;">{{ user.from.name }}</view>
						<view style="display: flex;justify-content: space-between;">
							<view class="xingYuFen">id: {{ user.from.id }}</view>
							<view v-if="isShow" class="list_item_right"
								@click="listNumber2 === index ? '' : addFriend(index)">
								<image src="@/static/images/add1.png" mode="widthFix"></image>
								<view>同意</view>
							</view>
						</view>
					</view>
					<view class="delete" @click="listNumber1=== index ? '' : refuse(index)">拒绝</view>
				</view>
			</view>
		<!-- #endif -->
		<!-- #ifdef APP || H5 -->
			<view class="list" v-if="list.length">
				<view class="list_item" v-for="(user, index) in list" :key="index"
					:style="listNumber===index?listItemMove1:listItemMove" @touchstart="touchStart"
					@touchmove="touchMove($event, index)" @touchend="touchEnd">
					<image :src="user.attributes.from.avatar">
					</image>
					<view
						style="width: 560rpx;height: 90rpx;display: flex;flex-direction: column;justify-content: space-between;">
						<view style="font-size: 30rpx;font-weight: 700;">{{ user.attributes.from.name }}</view>
						<view style="display: flex;justify-content: space-between;">
							<view class="xingYuFen">id: {{ user.attributes.from.id }}</view>
							<view v-if="isShow" class="list_item_right"
								@click="listNumber2 === index ? '' : addFriend(index)">
								<image src="@/static/images/add1.png" mode="widthFix"></image>
								<view>同意</view>
							</view>
						</view>
					</view>
					<view class="delete" @click="listNumber1=== index ? '' : refuse(index)">拒绝</view>
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
				list: [],
				listItemMove: 'transform: translateX(0rpx);',
				listItemMove1: 'transform: translateX(-200rpx);',
				isShow: true,
				listNumber: null,
				listNumber1: null,
				listNumber2: null
			}
		},
		onShow() {
			var info = JSON.parse(uni.getStorageSync('AV/oIIbvLZCzqBIhw5ILnQ0W3lX-gzGzoHsz/currentUser'))
			// 查有哪些用户给我发送了好友申请
			var query = new AV.Query("friendSubmit");
			query.equalTo("to", {
				name: info.name,
				avatar: info.avatar,
				id: info.objectId
			});
			query.find().then((fri) => {
				this.list = fri
				console.log(fri)
			});
		},
		methods: {
			// 同意好友申请
			addFriend(index) {
				uni.showLoading({
					title: '加载中'
				})
				let friendArr = []
				let friendSet
				let uniqueArr
				// 查询该用户目前好友列表
				const currentUser = AV.User.current();
				if (currentUser.attributes.friend === undefined) {
					friendArr.push(this.list[index].attributes.from)
					// 数组去重
					uniqueArr = friendArr.filter((obj, index, self) =>
					  index === self.findIndex((o) => (
							o.id === obj.id
					  ))
					);
				} else {
					friendArr = currentUser.attributes.friend
					friendArr.push(this.list[index].attributes.from)
					// 数组去重
					uniqueArr = friendArr.filter((obj, index, self) =>
					  index === self.findIndex((o) => (
							o.id === obj.id
					  ))
					);
				}
				currentUser.set("friend", uniqueArr);
				currentUser
					.save()
					.then((updatedUser) => {
						// 同意后删除云端的好友申请信息
						var info = JSON.parse(uni.getStorageSync('AV/oIIbvLZCzqBIhw5ILnQ0W3lX-gzGzoHsz/currentUser'))
						var fromQuery = new AV.Query("friendSubmit");
						fromQuery.equalTo("from", this.list[index].attributes.from);
						var toQuery = new AV.Query("friendSubmit");
						toQuery.equalTo("to", {
							name: info.name,
							avatar: info.avatar,
							id: info.objectId
						});

						var queryAll = AV.Query.and(fromQuery, toQuery);
						queryAll.find().then((fri) => {
							// 删除
							var FFF = AV.Object.createWithoutData("friendSubmit", fri[0].id);
							FFF.destroy();
						});
						// 同意后将awAgree中对应的type变为1
						var fromQuery2 = new AV.Query("awAgree");
						fromQuery2.equalTo("from", this.list[index].attributes.from.id);
						var toQuery2 = new AV.Query("awAgree");
						toQuery2.equalTo("to", info.objectId);
						
						var queryAll2 = AV.Query.and(fromQuery2, toQuery2);
						queryAll2.find().then((agr) => {
							// 将type变为1
							var isAgree = AV.Object.createWithoutData("awAgree", agr[0].id);
							isAgree.set("type", 1);
							isAgree.save();
						});
						// 更新成功
						uni.hideLoading()
						uni.showModal({
							title: "提示",
							content: "已同意该好友的申请",
							showCancel: false
						})
						this.listNumber1 = index
					})
					.catch(function(error) {
						// 更新失败
						console.log(error)
					});
			},
			// 拒绝好友申请
			refuse(index) {
				uni.showLoading({
					title: '加载中'
				})
				var info = JSON.parse(uni.getStorageSync('AV/oIIbvLZCzqBIhw5ILnQ0W3lX-gzGzoHsz/currentUser'))
				var fromQuery = new AV.Query("friendSubmit");
				fromQuery.equalTo("from", this.list[index].attributes.from);
				var toQuery = new AV.Query("friendSubmit");
				toQuery.equalTo("to", {
					name: info.name,
					avatar: info.avatar,
					id: info.objectId
				});
				
				var queryAll = AV.Query.and(fromQuery, toQuery);
				queryAll.find().then((fri) => {
					// 删除
					var FFF = AV.Object.createWithoutData("friendSubmit", fri[0].id);
					FFF.destroy();
				});
				uni.hideLoading()
				uni.showModal({
					title: "提示",
					content: "已拒绝该好友的申请",
					showCancel: false
				})
				this.listNumber2 = index
			},
			touchStart(event) {
				this.startX = event.touches[0].clientX;
				this.startY = event.touches[0].clientY;
			},
			touchMove(event, index) {
				// 记录触摸起始位置
				this.listNumber = index
				const currentX = event.touches[0].clientX;
				const currentY = event.touches[0].clientY;

				const deltaX = currentX - this.startX;
				const deltaY = currentY - this.startY;

				// 判断滑动方向
				if (deltaX > 0) {
					// 向右滑动
					this.isShow = true
					this.listNumber = null
				} else {
					// 向左滑动
					this.isShow = false
				}
			},
			touchEnd() {
				// 清除起始位置信息
				this.startX = null;
				this.startY = null;
			}
		}
	}
</script>

<style scoped>
	.list {
		margin-top: 40rpx;
		overflow: hidden;
	}

	.list_item {
		height: 130rpx;
		display: flex;
		align-items: center;
		margin-bottom: 20rpx;
		transition: all 400ms;
	}

	.list_item image {
		width: 120rpx;
		height: 120rpx;
		border-radius: 60rpx;
		margin-right: 20rpx;
	}

	.list_item_right {
		display: flex;
		height: 55rpx;
		border-radius: 10rpx;
		justify-content: center;
		align-items: center;
		font-size: 30rpx;
		border: 1px solid black;
		padding: 10rpx;
		position: absolute;
		right: 10rpx;
		top: 25rpx;
		background-color: aquamarine;
	}

	.list_item_right image {
		width: 35rpx;
	}

	.xingYuFen {
		font-size: 26rpx;
		height: 40rpx;
		line-height: 40rpx;
		border-radius: 10rpx;
		text-align: center;
		color: gray;
	}

	.delete {
		position: absolute;
		top: 0;
		right: -200rpx;
		height: 130rpx;
		width: 200rpx;
		color: white;
		background-color: #ff6b81;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 28rpx;
	}
</style>