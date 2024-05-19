<template>
	<view>
		未找到页面，请检查路径是否错误
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			
		},
		created() {
			let timer = setTimeout(function(){
				uni.switchTab({
					url:"/pages/index/index"
				})
			}, 2000)
		}
	}
</script>

<style>

</style>
