<template>
	<view>
		<view v-if="infoData.length">
			<flex text="我的发布" :data="infoData" @deleteEvent='deleteEvent'></flex>
		</view>
		<view v-else style="font-size: 40rpx;text-align: center;">空空如也</view>
	</view>
</template>

<script>
	import flex from '../../components/flex.vue'
	const AV = require('static/js/sangFangKu/AV.js')
	export default {
		data() {
			return {
				infoData: [],
			}
		},
		components: {
			flex
		},
		methods: {
			// 删除
			deleteEvent(index, id) {
				uni.showModal({
					title: "提示",
					content: '你确定要删除吗？',
					success: (select) => {
						if (select.confirm) {
							this.infoData.splice(index, 1)
							const currentUser = AV.User.current();
							currentUser.set("data", this.infoData);
							currentUser
								.save()
								.then(function(updatedUser) {
									const total = AV.Object.createWithoutData("Total", id);
									total.destroy();
									// 更新成功
									uni.showModal({
										title: '提示',
										content: '删除成功',
										showCancel: false
									})
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
		mounted() {
			var info = JSON.parse(uni.getStorageSync('AV/oIIbvLZCzqBIhw5ILnQ0W3lX-gzGzoHsz/currentUser'))
			this.infoData = info.data
		}
	}
</script>

<style>

</style>