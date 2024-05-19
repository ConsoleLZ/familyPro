<template>
	<view>
		<view class="header">{{ text }}</view>
		<view class="list">
			<view class="list_item" v-for="(listData, index) in data" :key="listData.id" @click="changePage(listData, listData.date, listData.id)">
				<view style="font-size: 28rpx;color: gray;">{{ listData.grade }} | {{ listData.subject }} | {{ listData.gender }}</view>
				<view style="width: 80%;margin: 20rpx auto;">
					<view style="display: flex;font-size: 33rpx;">
						<view style="margin-right: 15rpx;">薪资:</view>
						<view>{{ listData.salary }}</view>
					</view>
					<view style="display: flex;font-size: 33rpx;">
						<view style="margin-right: 15rpx;">补习时间:</view>
						<view class="timeTxt">{{ listData.time }}</view>
					</view>
					<view style="font-size: 33rpx;display: flex;">
						<view style="margin-right: 15rpx;white-space: nowrap;">地址:</view>
						<view class="shenlue">{{ listData.cityName }}</view>
					</view>
					<view style="display: flex;font-size: 28rpx;">
						<view style="margin-right: 15rpx;">发布时间:</view>
						<view>{{ listData.date }}</view>
					</view>
				</view>
				<view @click.stop="deleteEvent(index, listData.id)" style="width: 100rpx;height: 100rpx;border-radius: 50rpx;margin: 0 auto;margin-top: 30rpx;display: flex;flex-direction: column;align-items: center;justify-content: center;background-color: #ced5d5;">
					<image src="@/static/images/delete.png" mode="widthFix" style="width: 55rpx;"></image>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "flex",
		props: {
			text: {
				type: String,
				default: '未知'
			},
			data: {
				type: Array,
				default: []
			}
		},
		data() {
			return {

			};
		},
		methods: {
		    changePage(data, date, id){
				this.$emit('clickEvent', data, date, id)
			},
			deleteEvent(index, id){
				this.$emit('deleteEvent', index, id)
			}
		}
	}
</script>

<style scoped>
	.header {
		height: 50rpx;
		line-height: 50rpx;
		text-align: center;
		font-weight: 700;
		font-size: 35rpx;
		margin-bottom: 30rpx;
	}

	.list {
		width: 90vw;
		display: flex;
		flex-direction: column;
		align-items: center;
		margin: 0 auto;
	}

	.list_item {
		width: 630rpx;
		height: 400rpx;
		background-color: #efeded;
		font-size: 30rpx;
		margin-bottom: 24rpx;
		border-radius: 10px;
		padding: 15rpx;
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}
	.list_item view{
		margin-bottom: 5rpx;
	}
	.shenlue{
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	
	.timeTxt{
		width: 300rpx;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
</style>