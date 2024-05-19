<template>
	<view>
		<view class="chatList">
			<view v-for="(chatListData, index) in chatList" :key="index">
				<view v-if="chatListData.date != ''"
					style="width: 100vw;text-align: center;font-size: 20rpx;color: gray;">{{ chatListData.date }}</view>
				<view v-if="chatListData.identity === idTo" class="chatList_item">
					<view class="avatar" :style="'background-image: url(' + avatar + ');margin-right: 20rpx;'">
					</view>
					<view class="txt">{{ chatListData.message }}</view>
				</view>
				<view v-else class="chatList_item" style="justify-content: flex-end;">
					<view class="txt" style="margin-right: 20rpx;">{{ chatListData.message }}</view>
					<view class="avatar" :style="'background-image: url(' + selfAvatar + ');margin-right: 20rpx;'">
					</view>
				</view>
			</view>
			<view style="width: 100vw;height: 120rpx;"></view>
		</view>
		<footer>
			<view class="footer">
				<textarea v-model="text" maxlength="-1" :auto-height="true"></textarea>
				<image src="@/static/images/bq.png" mode="widthFix" @click="croBiaoQing"></image>
				<image src="@/static/images/add.png" mode="widthFix" @click="croMenu"></image>
				<view class="send" @click="send" :style="text===''?'':'background-color: #59c896;'">发送</view>
			</view>
			<view class="menu" v-show="isShowMenu">
				<view class="menu_item" @click="resume">
					<image src="@/static/images/me/grjl.png" mode="widthFix"></image>
					<view style="font-size: 25rpx;">个人简历</view>
				</view>
			</view>
			<view class="biaoQingPop" v-show="isShow">
				<text v-for="(list, index) in biaoQingList" :key="index" @click="o_o(index)">{{ list }}</text>
			</view>
		</footer>
	</view>
</template>

<script>
	const AV = require('static/js/sangFangKu/AV.js')
	export default {
		data() {
			return {
				isFriend: null,  //记录是否为好友
				biaoQingList: ['😀', '😆', '😅', '😂', '🙃', '😍', '😘', '😗', '😜', '🤑', '🫣', '🤔', '🫡', '😑', '😮‍💨',
					'😪', '🤤', '😴', '😷', '🤮', '😵‍💫', '🥳', '🥹', '😭', '🥱', '😤', '😡', '💩', '👻', '❣️', '💔',
					'👌', '👍', '🤜', '👏', '💪', '🍇', '🍓', '🥥', '🍞', '🍷', '🍺', '🍻', '🏳️', '👓'
				], //存储所有的表情
				isShow: false, //控制表情页
				isShowMenu: false, //控制加号菜单
				text: '',
				idTo: '',
				chatList: [],
				avatar: '', //聊天用户的头像
				selfAvatar: '', //自己的头像
				name: '',
				// 实时更新聊天数据
				updateChat: () => {
					var info = JSON.parse(uni.getStorageSync('AV/oIIbvLZCzqBIhw5ILnQ0W3lX-gzGzoHsz/currentUser'))
					var chatList = uni.getStorageSync(this.idTo+info.objectId)
					if (chatList) {
						var chatListMap = chatList.map(item => {
							var itemObj = JSON.parse(item)
							return {
								identity: itemObj['fromId'],
								type: 'txt',
								message: itemObj['message'],
								date: itemObj['date'] === "" ? "" : itemObj['date']
							}
						})
					}
					this.chatList = chatListMap
				}
			}
		},
		onLoad(options) {
			var info = JSON.parse(uni.getStorageSync('AV/oIIbvLZCzqBIhw5ILnQ0W3lX-gzGzoHsz/currentUser'))
			this.avatar = options.avatar
			this.selfAvatar = info.avatar
			this.idTo = options.id
			this.name = options.name
			uni.setNavigationBarTitle({
				title: options.name
			})
		},
		onShow() {
			// 判断此用户是否为好友，如果是，不作处理，否则增加一条陌生人私信列表,并且暂存本地
			var info = JSON.parse(uni.getStorageSync('AV/oIIbvLZCzqBIhw5ILnQ0W3lX-gzGzoHsz/currentUser'))
			let isFriend = info.friend.find(item=>item.id === this.idTo)
			if(isFriend){
				this.isFriend = true
			}else{
				this.isFriend = false
			}
			uni.$on('customEvent', (data) => {
				this.chatList = data
				setTimeout(function() {
					uni.pageScrollTo({
						scrollTop: 999999,
						duration: 100
					}, 0);
				})
			});
			this.updateChat()
			setTimeout(function() {
				uni.pageScrollTo({
					scrollTop: 999999,
					duration: 100
				}, 0);
			})
		},
		methods: {
			// 表情选择
			o_o(index) {
				this.text += this.biaoQingList[index]
			},
			// 控制表情页的弹出
			croBiaoQing(){
				this.isShow = !this.isShow
				this.isShowMenu = false
			},
			// 控制菜单的弹出
			croMenu(){
				this.isShowMenu = !this.isShowMenu
				this.isShow = false
				setTimeout(function() {
					uni.pageScrollTo({
						scrollTop: 999999,
						duration: 100
					}, 0);
				})
			},
			// 发送简历
			resume(){
				var currentUser = AV.User.current();
				var resume = currentUser.attributes.resume
				this.isShowMenu = false
				this.text += `姓名: ${resume.xingMing}\n性别: ${resume.radio}\n学校: ${resume.school}\n专业: ${resume.speciality}\n年级: ${resume.nianJi}\n家教经验: ${resume.experience}\n我的性格: ${resume.about}`
			},
			// 消息发送
			send() {
				if(this.text === ''){
					return
				}
				// 去重函数
				function unique(arr) {
					let s = new Set()
					for (let item of arr) {
						if (typeof item === 'object') {
							s.add(JSON.stringify(item))
						} else {
							s.add(item)
						}
					}
					return [...s]
				}
				let strangers = []   //存储陌生人信息
				let strangersStor = uni.getStorageSync('strangers')
				if(strangersStor === '' && !this.isFriend){
					strangers.push({
						name: this.name,
						avatar: this.avatar,
						id: this.idTo
					})
					uni.setStorageSync('strangers', unique(strangers))
				}else if(strangersStor !== '' && !this.isFriend){
					strangersStor.push({
						name: this.name,
						avatar: this.avatar,
						id: this.idTo
					})
					uni.setStorageSync('strangers', unique(strangersStor))
				}
				if (uni.getStorageSync('timeNum') != '') {
					console.log('定时器重新计时')
					uni.setStorageSync('timeNum', setTimeout(() => {
						uni.setStorageSync('isTimeNum', true)
					}, 1800000))
				} else {
					uni.setStorageSync('timeNum', setTimeout(() => {
						uni.setStorageSync('isTimeNum', true)
					}, 1800000))
				}
				// 获取当前时间
				var nowDate = new Date()
				var dateStr
				switch (uni.getStorageSync('isTimeNum')) {
					case '':
						dateStr = nowDate.getFullYear() + "-" + (nowDate.getMonth() + 1) + "-" + nowDate.getDate() + " " +
							nowDate.getHours() + ":" + nowDate.getMinutes()
						break
					case true:
						dateStr = nowDate.getFullYear() + "-" + (nowDate.getMonth() + 1) + "-" + nowDate.getDate() + " " +
							nowDate.getHours() + ":" + nowDate.getMinutes()
						break
					case false:
						dateStr = ''
						break
				}
				// 一个数组，用来存储聊天记录
				let messageArr = []
				var info = JSON.parse(uni.getStorageSync('AV/oIIbvLZCzqBIhw5ILnQ0W3lX-gzGzoHsz/currentUser'))

				function createMessage(id, message, fromId, date) {
					return JSON.stringify({
						fromId, //谁发的
						id, //你需要发送给的用户
						message, //发送的内容
						date //发送的日期
					})
				}
				uni.sendSocketMessage({
					data: createMessage(this.idTo, this.text, info.objectId, dateStr)
				})
				// 将this.isTimeNum变为false，在用户持续发送消息时，将不会存当前时间
				uni.setStorageSync('isTimeNum', false)
				// 先获取本地聊天记录
				let bendiMES = uni.getStorageSync(this.idTo+info.objectId)
				if (bendiMES) {
					messageArr = bendiMES
					messageArr.push(JSON.stringify({
						fromId: info.objectId,
						id: this.idTo,
						message: this.text,
						date: dateStr === "" ? "" : dateStr
					}))
					uni.setStorageSync(this.idTo+info.objectId, messageArr)
					messageArr = []
				} else {
					messageArr.push(JSON.stringify({
						fromId: info.objectId,
						id: this.idTo,
						message: this.text,
						date: dateStr === "" ? "" : dateStr
					}))
					uni.setStorageSync(this.idTo+info.objectId, messageArr)
					messageArr = []
				}
				// 更新视图
				this.updateChat()
				this.text = ''
				setTimeout(function() {
					uni.pageScrollTo({
						scrollTop: 999999,
						duration: 100
					}, 0);
				})
			},
		},
	}
</script>

<style scoped>
	.chatList_item {
		display: flex;
		padding: 10rpx;
		align-items: center;
	}

	.avatar {
		width: 60rpx;
		height: 60rpx;
		border-radius: 30rpx;
		background-size: cover;
		background-position: center;
	}

	.txt {
		font-size: 29rpx;
		max-width: 75vw;
		min-height: 50rpx;
		background-color: #b1d5c8;
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 10rpx;
		border-radius: 10rpx;
		line-height: 50rpx;
		letter-spacing: 5rpx;
		white-space: pre-wrap;
	}

	footer{
		width: 100vw;
		position: fixed;
		bottom: 0;
		left: 0;
	}

	.footer {
		background-color: #dfe0d9;
		display: flex;
		align-items: center;
		justify-content: space-around;
		padding: 20rpx;
	}

	.biaoQingPop {
		width: 100vw;
		height: 400rpx;
		background-color: #d5dad7;
		box-sizing: border-box;
		padding: 20rpx;
		overflow: auto;
	}
	
	.biaoQingPop text{
		font-size: 50rpx;
		letter-spacing: 20rpx;
	}

	.footer textarea {
		width: 55%;
		background-color: white;
		font-size: 35rpx;
		border-radius: 10rpx;
		padding: 10rpx;
		max-height: 500rpx;
		transition: all 100ms;
	}

	.footer image {
		width: 50rpx;
	}

	.send {
		width: 120rpx;
		height: 65rpx;
		border-radius: 10rpx;
		background-color: #d5ebe1;
		font-size: 28rpx;
		color: white;
		text-align: center;
		line-height: 65rpx;
		margin-right: 30rpx;
	}

	.menu {
		width: 100vw;
		height: 400rpx;
		background-color: #d5dad7;
		box-sizing: border-box;
		padding: 20rpx;
	}

	.menu_item {
		display: flex;
		flex-direction: column;
		align-items: center;
		background-color: #ffffff;
		width: 100rpx;
		height: 100rpx;
		border-radius: 20rpx;
		justify-content: center;
		padding: 10rpx;
	}
	
	.menu_item image{
		width: 50rpx;
	}
</style>