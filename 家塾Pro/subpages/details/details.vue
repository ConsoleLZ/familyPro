<template>
	<view style="padding: 20rpx;" v-if="data">
		<view class="header">
			<view @click="changePageShowUser"
				:style="'width: 100rpx;height: 100rpx;border-radius: 50rpx;' + 'background: no-repeat url(' + data.avatar + ');' + 'background-size: cover;background-position: center;'">
			</view>
			<view class="header_right">
				<view style="font-weight: 700;">{{ data.name }}</view>
				<view>联系方式:{{ data.phone }}</view>
			</view>
		</view>
		<view style="display: flex;font-size: 35rpx;color: gray;margin-top: 20rpx;">
			<view>发布时间:</view>
			<view>{{ date }}</view>
		</view>
		<view
			style="margin-top: 50rpx;background-color: #ecf0f1;padding: 30rpx;border-radius: 5px;margin-bottom: 130rpx;">
			<view style="margin-bottom: 30rpx;font-size: 33rpx;font-weight: 700;border-bottom: 1px solid black;">详情如下:
			</view>
			<view class="item">
				<view>学生性别</view>
				<view>{{ data.gender }}</view>
			</view>
			<view class="item">
				<view>学生年级</view>
				<view>{{ data.grade }}</view>
			</view>
			<view class="item">
				<view>补习科目</view>
				<view>{{ data.subject }}</view>
			</view>
			<view class="item" @click="showTime(data.time)">
				<view>补习时间</view>
				<view>{{ data.time }}</view>
			</view>
			<view class="item" @click="showSalary(data.salary)">
				<view>薪资</view>
				<view>{{ data.salary }}</view>
			</view>
			<view class="item">
				<view>地址</view>
				<view>{{ data.cityName }}</view>
			</view>
			<view class="item" @click="showAddress(data.address)">
				<view>详细地址</view>
				<view>{{ address(data.address) }}</view>
			</view>
			<view class="item_notes">
				<view>用户备注</view>
				<textarea v-model="data.notes" maxlength="100"></textarea>
			</view>
		</view>
		<view class="footer">
			<view class="footer_item" @click="changePageChat">
				<image src="@/static/images/details/dxcz.png" mode="widthFix"></image>
				<view>私聊</view>
			</view>
			<view class="footer_item" @click="changeStar">
				<image :src="star" mode="widthFix"></image>
				<view>收藏</view>
			</view>
			<view class="footer_item" @click="changePage">
				<image src="@/static/images/details/back.png" mode="widthFix"></image>
				<view>返回</view>
			</view>
		</view>
		<view class="detailPops" v-if="isShowDetailPops" @click="isShowDetailPops=false">
			<textarea maxlength="40" v-model="details"></textarea>
		</view>
	</view>
</template>

<script>
	const AV = require('static/js/sangFangKu/AV.js')
	export default {
		onLoad(options) {
			this.data = JSON.parse(options.data)
			this.date = options.date
			this.id = options.id
			// 获取用户收藏的数据信息--数组
			var currentUser = AV.User.current();
			var dataArr = currentUser.attributes.star
			this.user = currentUser
			// 查找数据库是否已经收藏
			if(dataArr === undefined || dataArr.length === 0){
				this.findTag = -1
			}else{
				var idObj = currentUser.attributes.star.map(item => item.id)
				this.findTag = idObj.indexOf(options.id)
			}
		},
		data() {
			return {
				data: null,
				star: '',
				date: '', //发布时间
				id: '',
				details: '', //详情的文字信息
				isShowDetailPops: false, //详情的弹出控制
				findTag: null,
				user: null
			}
		},
		methods: {
			// 跳转好友聊天页面
			changePageChat() {
				uni.navigateTo({
					url: `/subpages/chat/chat?id=${this.data.userId}&avatar=${this.data.avatar}&name=${this.data.name}`
				})
			},
			// 跳转至用户详细信息
			changePageShowUser(){
				const query = new AV.Query("User");
				query.equalTo("objectId", this.data.userId);
				query.find().then((users) => {
				      uni.navigateTo({
				      	url: `/subpages/showUser/showUser?user=${JSON.stringify(users[0])}`
				      })
				});
			},
			// 返回上个页面或者跳转首页
			changePage() {
				uni.navigateBack({
					fail() {
						uni.switchTab({
							url: '/pages/index/index'
						})
					}
				})
			},
			address(data) {
				if (data === '') {
					return "用户未填写"
				} else {
					return data
				}
			},
			changeStar() {
				var currentUser = AV.User.current();
				if (this.data.userId === currentUser.id) {
					uni.showModal({
						title: '提示',
						content: '自己发布的无法收藏',
						showCancel: false
					})
					return
				}
				if (this.findTag === -1) {
					uni.showModal({
						title: '提示',
						content: '你确定要收藏吗？',
						success: (select) => {
							var currentUser = AV.User.current();
							// 获取用户收藏的数据信息--数组
							var dataArr = currentUser.attributes.star
							if (select.confirm) {
								uni.showLoading({
									title: "提示",
									content: '数据更新中'
								})
								const newObj = {
									...this.data,
									id: this.id,
									date: this.date
								}
								if (dataArr != undefined && dataArr.length != 0) {
									dataArr.unshift(newObj)
									currentUser.set("star", dataArr);
								} else {
									let starArr = []
									starArr.unshift(newObj)
									currentUser.set("star", starArr);
								}
								currentUser
									.save()
									.then((updatedUser) => {
										// 更新成功
										uni.hideLoading()
										this.star = '../../static/images/details/star2.png'
										this.findTag = 0
									})
									.catch(function(error) {
										// 更新失败
										console.log(error)
									});
							}
						}
					})
				} else {
					// 取消收藏
					uni.showModal({
						title: '提示',
						content: '确定要取消收藏吗？',
						success: (select) => {
							var currentUser = AV.User.current();
							if (select.confirm) {
								uni.showLoading({
									title: "提示",
									content: '数据更新中'
								})
								// 获取用户收藏的数据信息--数组
								var dataArr = currentUser.attributes.star
								var idObj = currentUser.attributes.star.map(item => item.id)
								var findTag = idObj.indexOf(this.id)
								dataArr.splice(findTag, 1)
								currentUser.set("star", dataArr);
								currentUser
									.save()
									.then((updatedUser) => {
										// 更新成功
										uni.hideLoading()
										this.star = '../../static/images/details/star.png'
										this.findTag = -1
									})
									.catch(function(error) {
										// 更新失败
										console.log(error)
									});
							}
						}

					})
				}
			},
			// 补习时间的详情展示
			showTime(text) {
				this.details = text
				this.isShowDetailPops = true
			},
			// 薪资的详情展示
			showSalary(text) {
				this.details = text
				this.isShowDetailPops = true
			},
			// 详细地址的详情展示
			showAddress(text) {
				if (text === '') {
					this.details = '用户未填写'
				} else {
					this.details = text
				}
				this.isShowDetailPops = true
			}
		},
		mounted() {
			if (this.data.notes === '') {
				this.data.notes = '用户未填写'
			}
			if(this.findTag === -1){
				this.star = '../../static/images/details/star.png'
			}else{
				this.star = '../../static/images/details/star2.png'
			}
		},
	}
</script>

<style scoped>
	.header {
		display: flex;
		align-items: center;
	}

	.header_right {
		margin-left: 20rpx;
		font-size: 30rpx;
	}

	.item {
		display: flex;
		margin-bottom: 30rpx;
		align-items: center;
	}

	.item view:nth-child(1),
	.item_notes view:nth-child(1) {
		width: 150rpx;
		text-align: center;
		margin-right: 30rpx;
		background-color: gray;
		color: white;
		padding: 10rpx;
		border-radius: 5px;
		font-size: 33rpx;
	}

	.item view:nth-child(2) {
		font-size: 30rpx;
		width: 69%;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.item_notes textarea {
		width: 95%;
		margin: 20rpx auto;
		height: 200rpx;
		font-size: 30rpx;
		padding: 20rpx;
		background-color: #d3ccd6;
		border-radius: 10px;
		pointer-events: none;
	}

	.footer {
		width: 100vw;
		height: 125rpx;
		position: fixed;
		bottom: 0;
		left: 0;
		z-index: 2;
		display: flex;
		align-items: center;
		justify-content: space-around;
		background-color: white;
	}

	.footer_item {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.footer_item image {
		width: 55rpx;
	}

	.footer_item view {
		font-size: 30rpx;
	}

	.detailPops {
		width: 100vw;
		height: 100vh;
		background-color: rgba(0, 0, 0, 0.5);
		position: fixed;
		top: 0;
		left: 0;
		z-index: 3;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.detailPops textarea {
		width: 490rpx;
		height: 200rpx;
		font-size: 30rpx;
		padding: 40rpx;
		border-radius: 7px;
		background-color: white;
		pointer-events: none;
	}
</style>