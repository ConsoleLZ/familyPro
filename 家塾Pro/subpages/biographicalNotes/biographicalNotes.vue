<template>
	<view>
		<view>
			<form @submit="formSubmit" @reset="formReset">
				<view class="uni-form-item">
					<view class="title">姓名:</view>
					<input class="uni-input" name="xingMing" placeholder="请输入您的名字" />
				</view>
				<view class="uni-form-item">
					<view style="margin-right: 20rpx;width: 24vw;text-align: center;font-size: 34rpx;">性别:</view>
					<radio-group name="radio">
						<label>
							<radio value="男" /><text style="font-size: 35rpx;">男</text>
						</label>
						<label>
							<radio value="女" /><text style="font-size: 35rpx;">女</text>
						</label>
					</radio-group>
				</view>
				<view class="uni-form-item">
					<view style="margin-right: 20rpx;width: 24vw;text-align: center;font-size: 34rpx;">籍贯:</view>
					<view @tap="showCityPicker" style="border-bottom: 1px solid #958f8f;width: 70vw;font-size: 35rpx;">
						{{ cityName }}
					</view>
					<image src="@/static/images/xljt.png" mode="widthFix" style="position: absolute;right: 35rpx;">
					</image>
					<mpvue-city-picker ref="mpvueCityPicker" :pickerValueDefault="pickerValueDefault"
						@onConfirm="onConfirm">
					</mpvue-city-picker>
				</view>
				<view class="uni-form-item">
					<view style="margin-right: 20rpx;width: 24vw;text-align: center;font-size: 34rpx;">现居:</view>
					<view @tap="showCityPicker1" style="border-bottom: 1px solid #958f8f;width: 70vw;font-size: 35rpx;">
						{{ cityName1 }}
					</view>
					<image src="@/static/images/xljt.png" mode="widthFix" style="position: absolute;right: 35rpx;">
					</image>
					<mpvue-city-picker ref="mpvueCityPicker1" :pickerValueDefault="pickerValueDefault1"
						@onConfirm="onConfirm1">
					</mpvue-city-picker>
				</view>
				<view class="uni-form-item">
					<view class="title">学校:</view>
					<input class="uni-input" name="school" placeholder="请输入..." />
				</view>
				<view class="uni-form-item">
					<view class="title">专业:</view>
					<input class="uni-input" name="speciality" placeholder="请输入您的专业" />
				</view>
				<view class="uni-form-item">
					<view class="title">年级:</view>
					<input class="uni-input" name="nianJi" placeholder="请输入您的年级, 比如大二" />
				</view>
				<view class="uni-form-item">
					<view class="title">家教经验:</view>
					<input class="uni-input" name="experience" placeholder="若没有,可暂时跳过" />
				</view>
				<view class="uni-form-item">
					<view class="title">个人介绍:</view>
					<input class="uni-input" name="about" placeholder="请输入您的个人爱好或者性格" />
				</view>
				<view class="uni-btn-v">
					<button type="default" form-type="reset">清空</button>
					<button form-type="submit" class="submit">保存</button>
				</view>
			</form>
		</view>
		<view style="font-size: 28rpx;color: gray;text-align: center;">个人简历保存后，可以在聊天页面中，点击加号进行发送</view>
	</view>
</template>

<script>
	import mpvueCityPicker from '@/components/mpvue-citypicker/mpvueCityPicker.vue'
	const AV = require('static/js/sangFangKu/AV.js')
	export default {
		data() {
			return {
				cityName: '...',
				pickerValueDefault: [0, 0, 1],
				cityName1: '...',
				pickerValueDefault1: [0, 0, 1],

			}
		},
		components: {
			mpvueCityPicker
		},
		methods: {
			// 籍贯的选择
			showCityPicker() {
				this.$refs.mpvueCityPicker.show();
			},
			// 现居的选择
			showCityPicker1() {
				this.$refs.mpvueCityPicker1.show();
			},
			onConfirm(e) {
				this.cityName = e.label
			},
			onConfirm1(e) {
				this.cityName1 = e.label
			},
			// 提交
			formSubmit: function(e) {
				uni.showLoading({
					title: '保存中'
				})
				var currentUser = AV.User.current();
				currentUser.set("resume", e.detail.value);
				currentUser
					.save()
					.then(function(updatedUser) {
						// 更新成功
						uni.showModal({
							title: "成功",
							content: "个人简历保存成功"
						})
						uni.hideLoading()
					})
					.catch(function(error) {
						// 更新失败
					});
			},
			// 清空
			formReset: function(e) {
				console.log('清空数据')
			}
		}
	}
</script>

<style scoped>
	.uni-form-item {
		display: flex;
		align-items: center;
		position: relative;
		margin-top: 20rpx;
	}

	.uni-form-item image {
		width: 60rpx;
	}

	.uni-input {
		width: 70vw;
		height: 40rpx;
		margin: 0 auto;
		border-bottom: 1px solid #958f8f;
		padding: 5px;
		font-size: 35rpx;
	}

	.uni-btn-v {
		margin-top: 50rpx;
		display: flex;
		justify-content: space-around;
	}


	.uni-btn-v button {
		width: 200rpx;
		height: 80rpx;
		line-height: 80rpx;
		font-size: 30rpx;
		border: 1px solid black;
		margin: 50rpx auto;
		background-color: #efefef;
	}

	.title {
		width: 24vw;
		text-align: center;
		font-size: 34rpx;
	}
</style>