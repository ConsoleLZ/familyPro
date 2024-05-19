<template>
	<view>
		<!-- 登录 -->
		<image src="@/static/images/login/logo.png" mode="widthFix" class="logo"></image>
		<form class="form">
			<view class="flex-column">
				<label>账号</label>
			</view>
			<view class="inputForm">
				<image src="@/static/images/login/admin.png" mode="widthFix"></image>
				<input type="text" class="input" placeholder="输入你的账号" v-model="username">
			</view>

			<view class="flex-column">
				<label>密码</label>
			</view>
			<view class="inputForm">
				<span class="span2">忘记密码?</span>
				<image src="@/static/images/login/mima.png" mode="widthFix"></image>
				<input type="password" class="input" placeholder="输入你的密码" v-model="password">
			</view>
			<view style="font-size: 24rpx;color: gray;text-align: center;margin-top: 50rpx;">
				登录或注册即视为已同意家塾Pro的服务协议与隐私政策
			</view>
			<button class="button-submit" @tap="loginBTN">登录</button>
			<p class="p">没有账号? <span class="span" @click="toRegister">注册</span></p>
			<p class="p line">或者</p>
			<view class="flex-row">
				<button class="btn" @tap="wxLogin">
					<image src="@/static/images/login/wx.png" mode="widthFix"></image>
					微信
				</button>
				<button class="btn" @tap="qqLogin">
					<image src="@/static/images/login/QQ.png" mode="widthFix"></image>
					QQ
				</button>
			</view>
		</form>
		<!-- 注册 -->
		<view class="register" :style="position">
			<form class="form">
				<view class="flex-column">
					<label>账号</label>
				</view>
				<view class="inputForm">
					<image src="@/static/images/login/admin.png" mode="widthFix"></image>
					<input type="text" class="input" placeholder="输入你的账号" v-model="re_username">
				</view>
			
				<view class="flex-column">
					<label>密码</label>
				</view>
				<view class="inputForm">
					<image src="@/static/images/login/mima.png" mode="widthFix"></image>
					<input type="password" class="input" placeholder="输入你的密码" v-model="re_password">
				</view>
				<view class="flex-column">
					<label>验证码</label>
				</view>
				<view class="inputForm">
					<image src="@/static/images/login/code.png" mode="widthFix"></image>
					<input type="text" class="input" placeholder="输入验证码" v-model="code">
				</view>
				<view style="display: flex;justify-content: space-between;margin-top: 10rpx;">
					<view class="code" :style="'background-image: url(' + codeURL +')'"></view>
					<view class="codeCh" @click="codeChange">更换一张</view>
				</view>
				<button class="button-submit" @click="register">注册</button>
				<p class="p">返回<span class="span" @click="toLogin">登录</span></p>
			</form>
		</view>
	</view>
</template>

<script>
	const AV = require('static/js/sangFangKu/AV.js')
	export default {
		data() {
			return {
				username: '',
				password: '',
				re_username: '',
				re_password: '',
				codeURL: '',
				position: 'left: 100vw;',
				captcha: null,
				code: '' //验证码

			}
		},
		created() {
			var token = uni.getStorageSync('AV/oIIbvLZCzqBIhw5ILnQ0W3lX-gzGzoHsz/currentUser')
			if (token !== '') {
				var tokenObj = JSON.parse(token)
				AV.User.become(tokenObj?._sessionToken).then(function(user) {
					// token 验证成功，user 是验证后返回的用户对象
					uni.reLaunch({
						url: '/pages/index/index'
					})
				})
			}
		},
		mounted() {
			// 获取图片验证码
			AV.Captcha.request({
			  width:100, // 图片的宽度
			  height:50, // 图片的高度
			}).then((captcha)=> {
			   this.codeURL = captcha.url
			   this.captcha = captcha
			});
		},
		methods: {
			// 弹出注册页面
			toRegister(){
				this.position = 'left: 0;'
			},
			// 返回登录
			toLogin(){
				this.position = 'left: 100vw;'
			},
			// 登录
			loginBTN() {
				AV.User.logIn(this.username, this.password).then(function(user) {
					// 登录成功，跳转页面
					var info = JSON.parse(uni.getStorageSync('AV/oIIbvLZCzqBIhw5ILnQ0W3lX-gzGzoHsz/currentUser'))
					// 在某个页面或组件中调用该方法
					uni.connectSocket({
					  url: `ws://47.113.229.178:8080/?id=${info.objectId}`, // WebSocket 服务器的URL
					  header: {
					    'content-type': 'application/json' // 请求头设置
					  },
					  success: function () {
					    console.log('WebSocket连接成功');
					  },
					  fail: function (err) {
					    console.log('WebSocket连接失败：', err);
					  }
					});
					uni.switchTab({
						url: '/pages/index/index'
					})
				}).catch(function(error) {
					// 登录失败
					uni.showModal({
						title: "失败",
						content: "登录失败",
						showCancel: false
					})
				});
			},
			// 微信登录
			wxLogin(){
				uni.showModal({
					title: '提示',
					content: '微信登录暂未开放',
					showCancel: false
				})
			},
			// qq登录
			qqLogin(){
				uni.showModal({
					title: '提示',
					content: 'QQ登录暂未开放',
					showCancel: false
				})
			},
			// 注册
			register(){
				if(this.re_username!=''&&this.re_password!=''&&this.code!=''){
					this.captcha.verify(this.code).then((validateToken)=> {
						// 创建实例
						const user = new AV.User();
						// 等同于 user.set('username', 'Tom')
						user.setUsername(this.re_username);
						user.setPassword(this.re_password);
						
						user.signUp().then(
						  (user) => {
						    // 注册成功
						    uni.switchTab({
						    	url: '/pages/index/index'
						    })
						  },
						  (error) => {
						     uni.showModal({
						     	title: '提示',
								content: '该用户名已被注册',
								showCancel: false
						     })
							 AV.Captcha.request({
							   width:100, // 图片的宽度
							   height:50, // 图片的高度
							 }).then((captcha)=> {
							    this.codeURL = captcha.url
							    this.captcha = captcha
							 });
						  }
						);
					}).catch(()=>{
						uni.showModal({
							title: "提示",
							content: "验证码错误",
							showCancel: false
						})
						AV.Captcha.request({
						  width:100, // 图片的宽度
						  height:50, // 图片的高度
						}).then((captcha)=> {
						   this.codeURL = captcha.url
						   this.captcha = captcha
						});
					});
				}else{
					uni.showModal({
						title: '提示',
						content: '表单内容不完整',
						showCancel: false
					})
				}
			},
			codeChange(){
				// 获取图片验证码
				AV.Captcha.request({
				  width:100, // 图片的宽度
				  height:50, // 图片的高度
				}).then((captcha)=> {
				   this.codeURL = captcha.url
				   this.captcha = captcha
				});
			}
		}
	}
</script>

<style scoped>
	.code{
		width: 210rpx;
		height: 80rpx;
		background-repeat: no-repeat;
		background-size: cover;
	}
	.codeCh{
		width: 130rpx;
		height: 50rpx;
		text-align: center;
		line-height: 50rpx;
		padding: 10rpx;
		border-radius: 10rpx;
		font-size: 28rpx;
		border: 1px solid gray;
	}
	
	.register{
		width: 100vw;
		height: 100vh;
		position: absolute;
		top: 0;
		z-index: 999;
		background-color: white;
		transition: all 300ms;
	}
	.logo{
		width: 250rpx;
		margin: 0 auto;
		display: block;
	}
	.form {
		display: flex;
		flex-direction: column;
		gap: 10rpx;
		background-color: #ffffff;
		padding: 30rpx;
		width: 450rrpx;
		border-radius: 20rpx;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
	}

	::placeholder {
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
	}

	.form button {
		align-self: flex-end;
	}

	.flex-column>label {
		color: #151717;
		font-weight: 600;
		font-size: 35rpx;
	}

	.inputForm {
		border: 1.5rpx solid #ecedec;
		border-radius: 15rpx;
		height: 100rpx;
		display: flex;
		align-items: center;
		padding-left: 10rpx;
		transition: 0.2s ease-in-out;
		margin-top: 5rpx;
		position: relative;
	}

	.inputForm>image {
		width: 50rpx;
	}

	.input {
		margin-left: 10rpx;
		border-radius: 10rpx;
		border: none;
		width: 634rpx;
		height: 100rpx;
		font-size: 30rpx;
	}

	.input:focus {
		outline: none;
	}

	.inputForm:focus-within {
		border: 1.5rpx solid #2d79f3;
	}

	.flex-row {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 10rpx;
		justify-content: space-between;
	}

	.flex-row>view>label {
		font-size: 14rpx;
		color: black;
		font-weight: 400;
	}

	.span {
		font-size: 16rpx;
		margin-left: 5rpx;
		color: #2d79f3;
		font-weight: 500;
		cursor: pointer;
	}

	.span2 {
		position: absolute;
		right: 8rpx;
		bottom: -35rpx;
		font-size: 16rpx;
		margin-left: 5rpx;
		color: #2d79f3;
		font-weight: 500;
		cursor: pointer;
	}

	.button-submit {
		margin: 58rpx auto;
		background-color: #151717;
		border: none;
		color: white;
		font-size: 35rpx;
		font-weight: 500;
		border-radius: 10rpx;
		height: 80rpx;
		line-height: 80rpx;
		width: 300rpx;
		cursor: pointer;
	}

	.button-submit:hover {
		background-color: #252727;
	}

	.p {
		text-align: center;
		color: black;
		font-size: 16rpx;
		margin: 5rpx 0;
	}

	.btn {
		margin-top: 60rpx;
		width: 230rpx;
		height: 80rpx;
		border-radius: 10rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		font-weight: 500;
		gap: 10rpx;
		border: 1rpx solid #ededef;
		background-color: white;
		cursor: pointer;
		transition: 0.2s ease-in-out;
	}
	
	.btn>image{
		width: 45rpx;
	}

	.btn:hover {
		border: 1rpx solid #2d79f3;
		;
	}
</style>