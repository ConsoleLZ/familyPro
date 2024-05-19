<template>
	<view v-if="info" style="position: relative;height: 100vh;">
		<view class="item">
			<view
				:style="'width: 150rpx;height: 150rpx;border-radius: 75rpx;' + 'background: no-repeat url(' + info.avatar + ');' + 'background-size: cover;background-position: center;'">
			</view>
			<view class="change" @click="changeImg">更改</view>
		</view>
		<view class="item">
			<view>昵称</view>
			<view style="font-size: 32rpx;color: grey;">{{ info.name }}</view>
			<view class="change" @click="changeNamePage">更改</view>
		</view>
		<view style="font-size: 30rpx;color: gray;text-align: center;">更新后,退出应用或者刷新页面才能看到最新的数据哦</view>
		<view class="inputName" v-if="isShow" @click="backName">
			<view class="inputName_item" @click.stop>
				<view style="font-size: 35rpx;margin-bottom: 20rpx;font-weight: 700;">请输入你的名字</view>
				<input placeholder="名字长度不能大于10" type="text"
					style="border: 1px solid black;border-radius: 5px;height: 50rpx;font-size: 28rpx;padding: 10rpx;"
					v-model="userName">
				<view v-if="isShowTips" style="font-size: 20rpx;color: red;">输入为空或者错误...</view>
				<button @click="changeName"
					style="font-size: 28rpx;width: 130rpx;height: 70rpx;line-height: 70rpx;border: 1px solid black;margin-top: 30rpx;">确定</button>
				<view style="font-size: 25rpx;position: absolute;bottom: 10rpx;color: gray;">点击任意空白处可退出</view>
			</view>
		</view>
	</view>
</template>

<script>
	const AV = require('@/static/js/sangFangKu/AV.js')
	const currentUser = AV.User.current();
	export default {
		data() {
			return {
				info: null,
				isShow: false,
				userName: '',
				isShowTips: false,
			}
		},
		onShow() {
			var info = JSON.parse(uni.getStorageSync('AV/oIIbvLZCzqBIhw5ILnQ0W3lX-gzGzoHsz/currentUser'))
			this.info = info
		},
		methods: {
			// 更换名字的退出事件
			backName() {
				this.isShow = false
			},
			// 显示更换名字的页面
			changeNamePage() {
				this.isShow = true
			},
			// 更换名字
			changeName() {
				if (this.userName.trim() != '' && this.userName.trim().length < 10) {
					// 更新用户名字
					currentUser.set("name", this.userName.trim());
					currentUser
						.save()
						.then(async (updatedUser) => {
							// 更新成功
							// 更新全局的名字
							// 先查询
							var queryName = new AV.Query("Total");
							queryName.equalTo('dataObj.name', this.info
								.name);
							var queryUser = new AV.Query("Total");
							queryUser.equalTo('dataObj.userId', this.info
								.objectId);
							var query = AV.Query.and(queryName,
								queryUser);
							await query.find().then((results) => {
								// 处理查询结果
								for (var i = 0; i < results
									.length; i++) {
									var total = AV.Object
										.createWithoutData("Total",
											results[i].id);
									total.set("dataObj.name", this.userName.trim());
									total.save();
								}

							}).catch(function(error) {
								// 处理错误
								console.log(error)
								uni.showModal({
									title: '错误',
									content: '发生未知错误'
								});
							});
							uni.showModal({
								title: '提示',
								content: '名字更新成功'
							});
							// 局部更新页面
							var info = JSON.parse(uni.getStorageSync(
								'AV/oIIbvLZCzqBIhw5ILnQ0W3lX-gzGzoHsz/currentUser'
							))
							this.info = info
							this.isShow = false
							this.userName = ''
						})
						.catch(function(error) {
							// 更新失败
							console.log(error)
							uni.showModal({
								title: '错误',
								content: '名字更新失败'
							});
						});
				} else {
					setTimeout(() => {
						this.isShowTips = false
					}, 2000)
					this.isShowTips = true
				}
			},
			// 更换头像
			changeImg() {
				//前端代码
				uni.chooseImage({
					count: 1,
					// 选择图片成功调用
					success: (res) => {
						uni.showLoading({
							title: "数据加载中"
						})
						const imgName = res.tempFilePaths[0].split('/')
						if (res.tempFilePaths.length > 0) {
							let filePath = res.tempFilePaths[0]
							// 删除之前的头像图片，释放内存
							if (this.info.avatar !=
								'https://ucarecdn.com/4a074d69-ace0-466e-89ad-dee713d8bb95/KHCFDC_2.png') {
								uniCloud.callFunction({
										name: 'deletImg',
										data: {
											imgUrl: this.info.avatar
										}
									})
									.then(res => {
										console.log('删除成功')
									}).catch(err => {
										console.log(err)
									});
							}
							//进行上传操作
							uniCloud.uploadFile({
								filePath: filePath,
								cloudPath: imgName[imgName.length - 1],
								fileType: 'image',
								// 上传成功调用
								success: (res) => {
									// 保存到leanCloud云数据库中
									currentUser.set("avatar", res.fileID);
									currentUser
										.save()
										.then(async (updatedUser) => {
											// 更新首页的头像数据
											// 先查询（同时查询图片与用户的id）
											var queryImg = new AV.Query("Total");
											queryImg.equalTo('dataObj.avatar', this.info
												.avatar);
											var queryUser = new AV.Query("Total");
											queryUser.equalTo('dataObj.userId', this.info
												.objectId);
											var query = AV.Query.and(queryImg,
												queryUser);
											await query.find().then((results) => {
												// 处理查询结果
												for (var i = 0; i < results
													.length; i++) {
													var total = AV.Object
														.createWithoutData("Total",
															results[i].id);
													total.set("dataObj.avatar", res
														.fileID);
													total.save();
												}
											uni.hideLoading()
											var info = JSON.parse(uni.getStorageSync(
												'AV/oIIbvLZCzqBIhw5ILnQ0W3lX-gzGzoHsz/currentUser'
											))
											this.info = info
											// 更新成功
											uni.showModal({
												title: '提示',
												content: '头像上传成功'
											});
											}).catch(function(error) {
												// 处理错误
												console.log(error)
											});
										})
										.catch(function(error) {
											console.log(error)
											// 更新失败
											uni.showModal({
												title: '错误',
												content: '头像上传错误'
											});
										});
								},
								fail() {
									uni.showModal({
										title: '失败',
										content: '上传失败，请检查文件格式'
									});
								}
							});

						}
					}
				});

			}
		}
	}
</script>

<style scoped>
	.item {
		display: flex;
		align-items: center;
		position: relative;
		margin-bottom: 78rpx;
		padding: 10px;
		background-color: #f6f7f8;
	}

	.change {
		width: 120rpx;
		height: 50rpx;
		line-height: 50rpx;
		font-size: 32rpx;
		text-align: center;
		border-radius: 5px;
		border: 1px solid black;
		position: absolute;
		right: 5px;
	}

	.item view:nth-child(1) {
		margin-right: 20rpx;
	}

	.inputName {
		width: 100vw;
		height: 100vh;
		background-color: rgba(0, 0, 0, 0.5);
		display: flex;
		justify-content: center;
		align-items: center;
		position: absolute;
		left: 0%;
		top: 0%;
	}

	.inputName_item {
		width: 494rpx;
		height: 381rpx;
		border-radius: 5px;
		background-color: white;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		position: relative;
	}
</style>