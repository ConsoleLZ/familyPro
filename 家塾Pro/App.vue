<script>
	const AV = require('static/js/sangFangKu/AV.js')
	// #ifdef APP
	import checkUpdate from 'uni_modules/uni-upgrade-center-app/utils/check-update.ts'
	// #endif
	export default {
		onLaunch: function() {
			// #ifdef APP
			checkUpdate()
			// #endif
			const adapters = require('static/js/sangFangKu/adapters.js')
			AV.setAdapters(adapters);
			AV.init({
				// 填写自己的leanCloud平台的appId与appKey
				appId: "",
				appKey: "",
				serverURL: "https://oiibvlzc.lc-cn-n1-shared.com"
			});
		},
		// 建立websocket连接
		created() {
			// WebSocket连接成功后的监听事件
			uni.onSocketOpen(function() {
				console.log('WebSocket连接已打开');
			});

			// WebSocket接收到服务器消息的监听事件
			uni.onSocketMessage((res) => {
				if (res.data === '用户不在线') {
					console.log(res.data)
					return
				}
				var chatList = uni.getStorageSync(JSON.parse(res.data).fromId + JSON.parse(res.data).id)
				if (chatList) {
					chatList.push(res.data)
					var chatListMap = chatList.map(item => {
						var itemObj = JSON.parse(item)
						return {
							identity: itemObj['fromId'],
							type: 'txt',
							message: itemObj['message'],
							date: itemObj['date'] === "" ? "" : itemObj['date']
						}
					})
					uni.$emit('customEvent', chatListMap);
				}
				let messageObj = JSON.parse(res.data)
				// 判断此用户是否为好友，如果是，不作处理，否则增加一条陌生人私信列表,并且暂存本地
				var info = JSON.parse(uni.getStorageSync('AV/oIIbvLZCzqBIhw5ILnQ0W3lX-gzGzoHsz/currentUser'))
				let isFriend = info.friend.find(item => item.id === messageObj.fromId)
				if (!isFriend) {
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
					let strangers = [] //存储陌生人信息
					let strangersStor = uni.getStorageSync('strangers')
					const query = new AV.Query("User");
					query.equalTo("objectId", messageObj.fromId);
					query.find().then((user) => {
						if (strangersStor === '') {
							strangers.push({
								name: user[0].attributes.name,
								avatar: user[0].attributes.avatar,
								id: messageObj.fromId
							})
							uni.setStorageSync('strangers', unique(strangers))
						} else {
							strangersStor.push({
								name: user[0].attributes.name,
								avatar: user[0].attributes.avatar,
								id: messageObj.fromId
							})
							uni.setStorageSync('strangers', unique(strangersStor))
						}
					});
				}
				// 一个数组，用来存储聊天记录
				let messageArr = []
				// 先获取本地聊天记录
				let bendiMES = uni.getStorageSync(messageObj.fromId + messageObj.id)
				if (bendiMES) {
					messageArr = bendiMES
					messageArr.push(res.data)
					uni.setStorageSync(messageObj.fromId + messageObj.id, messageArr)
					// 存储后清空messageArr
					messageArr = []
				} else {
					messageArr.push(res.data)
					uni.setStorageSync(messageObj.fromId + messageObj.id, messageArr)
					// 存储后清空messageArr
					messageArr = []
				}
			});

			// WebSocket发生错误的监听事件
			uni.onSocketError(function(err) {
				console.log('WebSocket发生错误：', err);
			});

			// WebSocket连接关闭的监听事件
			uni.onSocketClose(function() {
				console.log('WebSocket连接已关闭');
			});
		},
		onShow: function() {
			var token = uni.getStorageSync('AV/oIIbvLZCzqBIhw5ILnQ0W3lX-gzGzoHsz/currentUser')
			if (token === '') {
				uni.redirectTo({
					url: '/pages/login/login'
				})
			} else {
				var tokenObj = JSON.parse(token)
				AV.User.become(tokenObj?._sessionToken)
					.then(function(user) {
						var info = JSON.parse(uni.getStorageSync(
							'AV/oIIbvLZCzqBIhw5ILnQ0W3lX-gzGzoHsz/currentUser'))
						// 在某个页面或组件中调用该方法
						uni.connectSocket({
							url: `ws://47.113.229.178:8080/?id=${info.objectId}`, // WebSocket 服务器的URL
							header: {
								'content-type': 'application/json' // 请求头设置
							},
							success: function() {
								console.log('WebSocket连接成功');
							},
							fail: function(err) {
								console.log('WebSocket连接失败：', err);
							}
						});
					})
					.catch(function(error) {
						console.log('未登录')
						// token 验证失败
						uni.navigateTo({
							url: '/pages/login/login'
						})
					});
			}
		},
		mounted() {
			uni.setStorageSync('isTimeNum', '')
		},
		//未找到就跳转至404页面
		onPageNotFound() {
			uni.navigateTo({
				url: '/pages/404/404'
			})
		}
	}
</script>

<style lang="scss">
	@import '@/uni_modules/uv-ui-tools/index.scss';

	/*每个页面公共css */
	html,
	body {
		font-size: 5vw;
	}
</style>