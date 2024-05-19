<template>
	<view>
		<uv-form labelPosition="left" :model="model1" :rules="rules" ref="form">
			<uv-form-item label="姓名" prop="userInfo.name" borderBottom>
				<uv-input v-model="model1.userInfo.name" border="none">
				</uv-input>
			</uv-form-item>
			<uv-form-item label="性别" prop="userInfo.sex" borderBottom @click="showSexSelect">
				<uv-input v-model="model1.userInfo.sex" disabled disabledColor="#ffffff" placeholder="请选择性别" border="none">
				</uv-input>
				<template v-slot:right>
					<uv-icon name="arrow-right"></uv-icon>
				</template>
			</uv-form-item>
			<uv-form-item label="邮箱" prop="userInfo.email" borderBottom>
				<uv-input v-model="model1.userInfo.email" border="none" placeholder="请输入正确的邮箱,不然无法联系你">
				</uv-input>
			</uv-form-item>
			<uv-form-item label="内容:" prop="userInfo.content"></uv-form-item>
			<uv-textarea count maxlength="300" height="200" placeholder="请输入举报内容,最多输入300个字" v-model="model1.userInfo.content"></uv-textarea>
			<uv-button type="primary" text="提交" customStyle="margin-top: 10px" @click="submit"></uv-button>
			<uv-button type="error" text="重置" customStyle="margin-top: 10px" @click="reset"></uv-button>
		</uv-form>
		<uv-action-sheet ref="sexSelect" :actions="actions" title="请选择性别" description="如果选择保密会报错" @select="sexSelect">
		</uv-action-sheet>
	</view>
</template>
<script>
	const AV = require('static/js/sangFangKu/AV.js')
	export default {
		data() {
			return {
				model1: {
					userInfo: {
						userId: '',
						name: '',
						sex: '',
						content: '',
						email: ''
					},
				},
				reportId: '',  //被举报用户的id
				actions: [{
					name: '男',
				}, {
					name: '女',
				}, {
					name: '保密',
				}, ],
				rules: {
					'userInfo.name': {
						type: 'string',
						required: true,
						message: '请填写姓名',
						trigger: ['blur', 'change']
					},
					'userInfo.sex': {
						type: 'string',
						max: 2,
						required: true,
						message: '请选择男或女',
						trigger: ['blur', 'change']
					},
					'userInfo.email': {
						type: 'string',
						required: true,
						message: '请填写邮箱',
						trigger: ['blur', 'change']
					},
					'userInfo.content': {
						type: 'string',
						required: true,
						message: '请填写举报内容',
						trigger: ['blur', 'change']
					}
				},
				radio: '',
				switchVal: false
			}
		},
		onLoad(options) {
			this.reportId = options.reportId
		},
		created() {
			var info = JSON.parse(uni.getStorageSync('AV/oIIbvLZCzqBIhw5ILnQ0W3lX-gzGzoHsz/currentUser'))
			this.model1.userInfo.userId = info.objectId
		},
		methods: {
			// 提交
			submit() {
				// 如果有错误，会在catch中返回报错信息数组，校验通过则在then中返回true
				this.$refs.form.validate().then(res => {
					// 声明 class
					const Report = AV.Object.extend("report");
					
					// 构建对象
					const report = new Report();
					
					// 为属性赋值
					report.set("infoFrom", this.model1.userInfo);
					report.set("reportId", this.reportId);
					
					// 将对象保存到云端
					report.save().then(
					  (todo) => {
					    // 成功保存之后，执行其他逻辑
					  },
					  (error) => {
					    // 异常处理
					  }
					);
					this.model1.userInfo.name = ''
					this.model1.userInfo.sex = ''
					this.model1.userInfo.email = ''
					this.model1.userInfo.content = ''
					uni.showToast({
						icon: 'success',
						title: '提交成功'
					})
				}).catch(errors => {
					uni.showToast({
						icon: 'error',
						title: '校验失败'
					})
				})
			},
			// 重置
			reset() {
				this.$refs.form.resetFields();
				this.$refs.form.clearValidate();
			},
			// 性别选择
			showSexSelect() {
				this.$refs.sexSelect.open();
				this.hideKeyboard();
			},
			// 性别选择返回结果
			sexSelect(e) {
				this.model1.userInfo.sex = e.name;
				// 对部分表单字段进行校验
				this.$refs.form.validateField('userInfo.sex',err=>{
					// 处理错误后的逻辑
				})
			},
			hideKeyboard() {
				uni.hideKeyboard()
			}
		}
	}
</script>