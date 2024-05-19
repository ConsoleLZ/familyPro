<template>
	<view>
		<view v-if="infoData.length">
			<flex text="我的收藏" :data="infoData" @deleteEvent='deleteEvent' @clickEvent='changePageDetail'></flex>
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
				infoData: []
			}
		},
		components: {
			flex
		},
		methods: {
			// 跳转至详情界面
			changePageDetail(data, date, id) {
				uni.navigateTo({
					url: `/subpages/details/details?data=${JSON.stringify(data)}&date=${date}&id=${id}`

				})
			},
			// 删除
			deleteEvent(index, id) {
				uni.showModal({
					title: "提示",
					content: '你确定要取消收藏吗？',
					success: (select) => {
						if (select.confirm) {
							this.infoData.splice(index, 1)
							const currentUser = AV.User.current();
							currentUser.set("star", this.infoData);
							currentUser
								.save()
								.then(function(updatedUser) {
									// 更新成功
									uni.showModal({
										title: '提示',
										content: '取消收藏成功啦',
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
			var currentUser = AV.User.current();
			this.infoData = currentUser.attributes.star
		}
	}
</script>

<style scoped>
	
</style>