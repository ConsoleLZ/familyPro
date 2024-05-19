<template>
	<view class="container">
		<tips :text='tipsText' :isShow='isTips' :bgColor="bgColor"></tips>
		<view class="container">
			<picker @change="bindPickerChange1" :value="index1" :range="selectDatas1">
				<view class="right">
					<view class="font">年级</view>
					<view class="right_left">{{ selectDatas1[index1] }}</view>
					<image src="@/static/images/xljt.png" mode="widthFix"></image>
				</view>
			</picker>
		</view>
		<view class="container">
			<picker @change="bindPickerChange2" :value="index2" :range="selectDatas2">
				<view class="right">
					<view class="font">孩子性别</view>
					<view class="right_left">{{ selectDatas2[index2] }}</view>
					<image src="@/static/images/xljt.png" mode="widthFix"></image>
				</view>
			</picker>
		</view>
		<view class="container">
			<picker @change="bindPickerChange3" :value="index3" :range="selectDatas3">
				<view class="right">
					<view class="font">补习科目</view>
					<view class="right_left">{{ selectDatas3[index3] }}</view>
					<image src="@/static/images/xljt.png" mode="widthFix"></image>
				</view>
			</picker>
		</view>
		<view class="container">
			<view class="right">
				<view class="font">补习时间</view>
				<input type="tel" v-model="time" @blur="testTime" placeholder="请输入..."
					style="width: 90%;height:40rpx;">
			</view>
			<text v-if="isPhoneTestShow1" style="font-size: 12px;color: red;">不能超过20个字</text>
		</view>
		<view class="container">
			<view class="right">
				<view class="font">联系方式</view>
				<input type="tel" v-model="phone" placeholder="请输入..." style="width: 90%;height:40rpx;"
					@blur="testPhone">
			</view>
			<text v-if="isPhoneTestShow" style="font-size: 12px;color: red;">手机号格式不正确</text>
		</view>
		<view class="container">
			<view class="right">
				<view class="font">薪资</view>
				<input type="text" v-model="salary" @blur="testSalary" placeholder="按小时计算..."
					style="width: 90%;height:40rpx;">
			</view>
			<text v-if="isPhoneTestShow2" style="font-size: 12px;color: red;">不能超过20个字</text>
		</view>
		<view class="container">
			<view class="right">
				<view class="font">地址</view>
				<view @tap="showCityPicker" class="right_left">{{ cityName }}</view>
				<image src="@/static/images/xljt.png" mode="widthFix"></image>
				<mpvue-city-picker ref="mpvueCityPicker" :pickerValueDefault="pickerValueDefault"
					@onConfirm="onConfirm">
				</mpvue-city-picker>
			</view>
		</view>
		<view class="container">
			<view class="right">
				<view class="font">详细地址</view>
				<input type="text" v-model="address" @blur="testAddress" placeholder="请输入..."
					style="width: 90%;height:40rpx;">
			</view>
			<text v-if="isPhoneTestShow3" style="font-size: 12px;color: red;">不能超过30个字</text>
		</view>
		<view style="margin-top: 30rpx;">
			<view style="font-size: 35rpx;">备注📝</view>
			<textarea v-model="notes" maxlength="100" placeholder="最多输入100个字符"></textarea>
		</view>
		<view class="foo">
			<button @tap="publish">发布</button>
		</view>
	</view>
</template>

<script>
	import mpvueCityPicker from '@/components/mpvue-citypicker/mpvueCityPicker.vue'
	import tips from '@/components/tips.vue'
	const AV = require('static/js/sangFangKu/AV.js')
	export default {
		data() {
			return {
				// 提示的背景颜色
				bgColor: '',
				isPhoneTestShow: false,
				isPhoneTestShow1: false,
				isPhoneTestShow2: false,
				isPhoneTestShow3: false,
				// 提示的文字
				tipsText: '',
				// 是否显示提示
				isTips: false,
				index1: 0, //选择的下拉列表下标，默认为第一项,
				index2: 0,
				index3: 0,
				//年级
				selectDatas1: ['一年级', '二年级', '三年级', '四年级', '五年级', '六年级', '初一', '初二', '初三', '高一', '高二', '高三', '大学',
					'其它'
				],
				// 性别
				selectDatas2: ['男', '女'],
				// 补习科目
				selectDatas3: ['语文', '数学', '英语', '物理', '化学', '政治', '历史', '生物', '地理', '大学课程（请备注）', '其他（请备注）'],
				// 补习时间
				time: '',
				// 联系方式
				phone: '',
				// 薪资
				salary: '',
				// 地址
				cityName: '请选择...',
				// 详细地址
				address: '',
				// 备注
				notes: '',
				pickerValueDefault: [0, 0, 1]
			}
		},
		components: {
			mpvueCityPicker,
			tips
		},
		methods: {
			// 检测手机号格式
			testPhone() {
				// 定义一个匹配手机号的正则
				const reg = /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/
				if (reg.test(this.phone)) {
					this.isPhoneTestShow = false
				} else {
					this.isPhoneTestShow = true
				}
			},
			// 提示补习时间文字数量超出
			testTime() {
				if (this.time.length > 20) {
					this.isPhoneTestShow1 = true
				} else {
					this.isPhoneTestShow1 = false
				}
			},
			// 提示薪资文字数量超出
			testSalary() {
				if (this.salary.length > 20) {
					this.isPhoneTestShow2 = true
				} else {
					this.isPhoneTestShow2 = false
				}
			},
			// 提示详细地址文字数量超出
			testAddress() {
				if (this.address.length > 30) {
					this.isPhoneTestShow3 = true
				} else {
					this.isPhoneTestShow3 = false
				}
			},
			// 年级选择
			bindPickerChange1: function(e) {
				this.index1 = e.detail.value; //更新选择的下拉下标
			},
			// 性别选择
			bindPickerChange2: function(e) {
				this.index2 = e.detail.value; //更新选择的下拉下标
			},
			// 科目选择
			bindPickerChange3: function(e) {
				this.index3 = e.detail.value; //更新选择的下拉下标
			},
			// 地区的选择
			showCityPicker() {
				this.$refs.mpvueCityPicker.show();
			},
			onConfirm(e) {
				this.cityName = e.label
			},
			// 发布
			publish() {
				const credit = JSON.parse(uni.getStorageSync('AV/oIIbvLZCzqBIhw5ILnQ0W3lX-gzGzoHsz/currentUser'))
					?.credit
				if(parseInt(credit) < 480){
					uni.showModal({
						title: '失败',
						content: '信誉分过低',
						showCancel: false
					})
					return
				}
				if (this.time != '' && this.phone != '' && this.salary != '' && this.cityName != '请选择...' && !this
					.isPhoneTestShow && this.time.length <= 20 && this.salary.length <= 20 && this.address.length <= 30) {
					const currentUser = AV.User.current();
					// 声明class
					const Total = AV.Object.extend("Total");
					// 构建对象
					const total = new Total();
					// 获取用户头像
					const avatar = currentUser.attributes.avatar
					// 获取用户名字
					const name = currentUser.attributes.name
					// 获取用户id
					const userId = currentUser.id
					// 获取用户发布的数据信息--数组
					const dataArr = currentUser.attributes.data
					let newDataArr
					// 获取本地时间
					const date = new Date()
					const formattedDate = date.toLocaleDateString('en-GB', {
						timeZone: 'UTC'
					}).split('/').reverse().join('-');
					// 存入单个用户
					const infoArr = [{
						grade: this.selectDatas1[this.index1],
						gender: this.selectDatas2[this.index2],
						subject: this.selectDatas3[this.index3],
						time: this.time,
						phone: this.phone,
						salary: this.salary,
						cityName: this.cityName,
						address: this.address,
						notes: this.notes,
						date: formattedDate
					}]
					// 存入数据库全局，所有人都能访问
					const infoObj = {
						grade: this.selectDatas1[this.index1],
						gender: this.selectDatas2[this.index2],
						subject: this.selectDatas3[this.index3],
						time: this.time,
						phone: this.phone,
						salary: this.salary,
						cityName: this.cityName,
						address: this.address,
						notes: this.notes,
						avatar,
						name,
						userId
					}
					uni.showLoading({
						title: "发布中"
					})
					// 存全局
					total.set('dataObj', infoObj)
					// 将对象保存到云端
					total.save().then(
						(data) => {
							// 成功保存之后，执行其他逻辑
							infoArr[0].id = data.id
							if (dataArr != undefined) {
								dataArr.unshift(infoArr[0])
								newDataArr = dataArr
							} else {
								newDataArr = infoArr
							}
							currentUser.set("data", newDataArr);
							currentUser
								.save()
								.then((updatedUser) => {
									uni.hideLoading()
									// 更新成功
									this.bgColor = 'background-color: rgba(105, 219, 70, 0.8);'
									this.tipsText = "发布成功(两秒后跳转到首页)"
									this.isTips = true
									this.time = ''
									this.phone = ''
									this.salary = ''
									this.cityName = "请选择..."
									this.address = ''
									this.notes = ''
									setTimeout(function(){
										uni.switchTab({
											url: '/pages/index/index'
										})
									}, 2000)
								})
								.catch(function(error) {
									// 更新失败
									console.log('发表失败')
								});
						},
						(error) => {
							// 异常处理
							console.log(error)
						}
					);
				} else {
					this.bgColor = 'background-color: rgba(219, 68, 73, 0.8);'
					this.tipsText = "必要信息未填写或错误"
					this.isTips = true
					setTimeout(() => {
						this.isTips = false
					}, 1500)
				}
			}
		}
	}
</script>

<style scoped>
	.font {
		width: 200rpx;
		font-weight: 700;
		font-size: 35rpx;
		color: black;
		text-align-last: justify;
		margin-right: 10px;
	}

	.right {
		width: 90vw;
		color: rgb(134, 133, 133);
		display: flex;
		border: none;
	}
	
	.right input{
		font-size: 30rpx;
		border-bottom: 1px solid black;
	}

	.right_left {
		width: 90%;
		font-size: 30rpx;
	}

	.right image {
		width: 80rpx;
		position: relative;
		top: 8px;
	}

	.container {
		padding: 10px;
	}


	button {
		margin-top: 10px;
	}

	.foo {
		width: 90vw;
		margin: 5px auto;
		display: flex;
		justify-content: space-around;
		align-items: center;
	}

	.foo button {
		width: 400rpx;
		align-items: center;
		appearance: none;
		border-radius: 4px;
		border-width: 0;
		border: 1px solid gray;
		box-sizing: border-box;
		cursor: pointer;
		display: inline-flex;
		justify-content: center;
		list-style: none;
		overflow: hidden;
		padding-left: 16px;
		padding-right: 16px;
		position: relative;
		text-align: left;
		text-decoration: none;
		transition: box-shadow .15s, transform .15s;
		user-select: none;
		-webkit-user-select: none;
		touch-action: manipulation;
		white-space: nowrap;
		will-change: box-shadow, transform;
		font-size: 1em;
	}

	textarea {
		width: 90%;
		height: 195rpx;
		border: 1px solid black;
		margin: 10rpx auto;
		font-size: 30rpx;
		border-radius: 20rpx;
		padding: 20rpx;
	}
</style>