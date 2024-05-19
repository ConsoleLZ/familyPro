<template>
	<view>
		<view style="position: fixed;z-index: 1;width: 100vw;height: 100vh;top: 0;left: 0;" @click="CroPop = 'bottom: -520rpx;'"></view>
		<view class="top">
			<view style="font-size: 26rpx;">一共有{{ list.length }}条评论</view>
			<view class="send" @click.stop="CroPop = 'bottom: 0rpx;'">我要留言</view>
		</view>
		<view class="pop-comment" :style="CroPop">
			<view class="pop-comment-send" @click="pub">发布</view>
			<view style="font-size: 28rpx;font-weight: 700;margin-bottom: 5rpx;">{{ name }}</view>
			<textarea maxlength="350" placeholder="请输入你的留言消息,最多有350个字符哦" v-model="comment"></textarea>
		</view>
		<view class="uni-padding-wrap">
			<!-- 评论区 start -->
			<!-- #ifdef MP-WEIXIN -->
				<view class="uni-comment" v-for="(data, index) in list" :key="index">
					<view class="uni-comment-list">
						<view class="uni-comment-face">
							<view :style="'width: 100rpx;height: 100rpx;border-radius: 50rpx;'+ 'background: no-repeat url(' + data.avatar + ');' + 'background-size: cover;'"></view>
						</view>
						<view class="uni-comment-body">
							<view class="uni-comment-top">
								<text>{{ data.name }}</text>
							</view>
							<view class="uni-comment-content">{{ data.comment }}</view>
							<text style="font-size: 25rpx;color: gray;">{{ data.time }}</text>
						</view>
					</view>
				</view>
			<!-- #endif -->
			<!-- #ifdef APP || H5 -->
				<view class="uni-comment" v-for="(data, index) in list" :key="index">
					<view class="uni-comment-list">
						<view class="uni-comment-face">
							<view :style="'width: 100rpx;height: 100rpx;border-radius: 50rpx;'+ 'background: no-repeat url(' + data.attributes.avatar + ');' + 'background-size: cover;'"></view>
						</view>
						<view class="uni-comment-body">
							<view class="uni-comment-top">
								<text>{{ data.attributes.name }}</text>
							</view>
							<view class="uni-comment-content">{{ data.attributes.comment }}</view>
							<text style="font-size: 25rpx;color: gray;">{{ data.attributes.time }}</text>
						</view>
					</view>
				</view>
			<!-- #endif -->
		</view>
	</view>
</template>

<script>
	const AV = require('static/js/sangFangKu/AV.js')
	export default {
		data() {
			return {
				CroPop: 'bottom: -520rpx;',
				name: '',
	            list: [],
				comment: '',
				avatar: '',
				time: ''
			}
		},
		created() {
			const date = new Date()
			var info = JSON.parse(uni.getStorageSync('AV/oIIbvLZCzqBIhw5ILnQ0W3lX-gzGzoHsz/currentUser'))
			this.name = info.name
			this.avatar = info.avatar
			this.time = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()+' '+date.getHours()+':'+date.getMinutes()
		},
		mounted() {
			var query = new AV.Query("Comment");
			query.find().then((com) => {
			   this.list = com
			});
		},
		methods: {
			async pub(){
				uni.showLoading({
					title: '加载中'
				})
				// 声明 class
				const Comment = AV.Object.extend("Comment");
				
				// 构建对象
				const comment = new Comment();
				
				// 为属性赋值
				comment.set("name", this.name);
				comment.set("avatar", this.avatar);
				comment.set("comment", this.comment);
				comment.set("time", this.time);
				
				// 将对象保存到云端
				await comment.save().then(
				  (todo) => {
				    // 成功保存之后，执行其他逻辑
				    uni.showModal({
				    	title: "提示",
						content: '发布成功',
						showCancel: false
				    })
				  },
				  (error) => {
				    // 异常处理
					uni.showModal({
						title: "提示",
						content: '未知错误',
						showCancel: false
					})
				  }
				);
				// 重新渲染页面
				var query = new AV.Query("Comment");
				await query.find().then((com) => {
				   this.list = com
				});
				this.comment = ''
				uni.hideLoading()
			}
		}
	}
</script>

<style scoped>
	.pop-comment {
		height: 500rpx;
		position: fixed;
		padding: 10rpx;
		z-index: 999;
		background-color: #1f2c35;
		transition: all 200ms;
		color: white;
	}

	.pop-comment-send {
		width: 100rpx;
		height: 50rpx;
		line-height: 50rpx;
		position: absolute;
		right: 10rpx;
		top: 15rpx;
		background-color: #528cf6;
		padding: 5rpx;
		border-radius: 10rpx;
		text-align: center;
	}

	.pop-comment textarea {
		width: 94vw;
		height: 400rpx;
		border: 1px solid gray;
		margin: 0 auto;
		font-size: 28rpx;
		padding: 10rpx;
		border-radius: 5rpx;
		margin-top: 35rpx;
	}

	.send {
		font-size: 28rpx;
		width: 140rpx;
		height: 50rpx;
		line-height: 50rpx;
		cursor: pointer;
		border-radius: 10rpx;
		background-color: #528cf6;
		padding: 10rpx;
		color: white;
		letter-spacing: 5rpx;
		text-align: center;
	}

	.top {
		display: flex;
		justify-content: space-between;
		padding-left: 20rpx;
		padding-right: 20rpx;
		margin-top: 10rpx;
		position: relative;
		z-index: 2;
	}

	/* comment */
	page {
		background-color: #f8f8f8;
	}

	.uni-padding-wrap {
		padding: 30rpx;
	}

	view {
		font-size: 28rpx;
	}

	.uni-comment {
		padding: 5rpx 0;
		display: flex;
		flex-grow: 1;
		flex-direction: column;
	}

	.uni-comment-list {
		flex-wrap: nowrap;
		padding: 10rpx 0;
		margin: 10rpx 0;
		width: 100%;
		display: flex;
	}

	.uni-comment-face {
		width: 100rpx;
		height: 100rpx;
		border-radius: 100%;
		margin-right: 20rpx;
		flex-shrink: 0;
		overflow: hidden;
		position: relative;
		top: 25rpx;
	}

	.uni-comment-body {
		width: 100%;
		position: relative;
	}

	.uni-comment-top {
		line-height: 1.5em;
		justify-content: space-between;
	}

	.uni-comment-top text {
		color: #0A98D5;
		font-size: 28rpx;
		font-weight: 700;
	}

	.uni-comment-date {
		line-height: 38rpx;
		flex-direction: row;
		justify-content: space-between;
		display: flex !important;
		flex-grow: 1;
	}

	.uni-comment-date view {
		color: #666666;
		font-size: 24rpx;
		line-height: 38rpx;
	}

	.uni-comment-content {
		line-height: 1.6em;
		font-size: 28rpx;
		padding: 8rpx 0;
	}

	.uni-comment-replay-btn {
		background: #FFF;
		font-size: 24rpx;
		line-height: 28rpx;
		padding: 5rpx 20rpx;
		border-radius: 30rpx;
		color: #333 !important;
		margin: 0 10rpx;
	}
</style>