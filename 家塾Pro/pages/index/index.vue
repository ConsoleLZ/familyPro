<template>
	<scroll-view scroll-y="true" class="scroll" @scrolltolower="scrolltolower">
		<view class="Header">
			<view class="header">
				<image src="@/static/images/search.png" mode="widthFix"></image>
				<input type="text" placeholder="请输入要查找的内容" v-model="searchText" />
				<view style="font-size: 30rpx;" @click="search">搜索</view>
			</view>
			<view style="display: flex;justify-content: space-between;">
				<view class="sel">
					<view @click="changePageHelp">帮助</view>
					<view @click="changePagePublish">发布</view>
					<view @click="isShowShai = true">筛选</view>
				</view>
				<view style="display: flex;padding: 20rpx;">
					<view class="city">{{ city1 }}</view>
					<view class="city">{{ city2 }}</view>
				</view>
			</view>
		</view>
		<view v-show="isShowShai"
			style="position: fixed;top: 0;left: 0;width: 100vw;height: 100vh;z-index: 99;background-color: white;">
			<image @click="isShowShai = false" src="@/static/images/back.png" mode="widthFix"
				style="width: 34rpx;position: absolute;left: 10rpx;top: 24rpx;z-index: 9999;"></image>
			<L-Dropdown :filterData="menuItems2" @confirm='handle'></L-Dropdown>
		</view>
		<!-- #ifdef APP || H5 -->
		<view class="list" v-if="list.length">
			<view class="card" v-for="(data, index) in list" :key="index" @click="changePage(index)">
				<view
					style="font-size: 30rpx;font-weight: 700;position: absolute;left: 20rpx;top: 20rpx;width: 94%;height: 50rpx;line-height: 50rpx;border-bottom: 1px solid gray;">
					简介:</view>
				<view>
					<view style="font-size: 33rpx;">地址: {{ data.attributes.dataObj.cityName }}</view>
					<view style="font-size: 33rpx;">补习科目: {{ data.attributes.dataObj.subject }}</view>
				</view>
				<view style="font-size: 30rpx;">学生性别:{{ data.attributes.dataObj.gender }} | 学生年级:
					{{ data.attributes.dataObj.grade }}
				</view>
				<view style="font-size: 26rpx; color: gray;">发布时间: {{ date(data.createdAt) }}</view>
				<view class="userInfo">
					<view
						:style="'width: 50rpx;height: 50rpx;border-radius: 25rpx;' + 'background: no-repeat url(' + data.attributes.dataObj.avatar + ');' + 'background-size: cover;background-position: center;'">
					</view>
					<view style="font-size: 30rpx;margin-left: 6px;">{{ data.attributes.dataObj.name }}</view>
				</view>
			</view>
		</view>
		<!-- #endif -->
		<!-- #ifdef MP-WEIXIN -->
		<view class="list" v-if="list.length">
			<view class="card" v-for="(data, index) in list" :key="index" @click="changePage(index)">
				<view
					style="font-size: 30rpx;font-weight: 700;position: absolute;left: 20rpx;top: 20rpx;width: 94%;height: 50rpx;line-height: 50rpx;border-bottom: 1px solid gray;">
					简介:</view>
				<view>
					<view style="font-size: 33rpx;">地址: {{ data.dataObj.cityName }}</view>
					<view style="font-size: 33rpx;">补习科目: {{ data.dataObj.subject }}</view>
				</view>
				<view style="font-size: 30rpx;">学生性别:{{ data.dataObj.gender }} | 学生年级:
					{{ data.dataObj.grade }}
				</view>
				<view style="font-size: 26rpx; color: gray;">发布时间: {{ date(data.createdAt) }}</view>
				<view class="userInfo">
					<view
						:style="'width: 50rpx;height: 50rpx;border-radius: 25rpx;' + 'background: no-repeat url(' + data.dataObj.avatar + ');' + 'background-size: cover;background-position: center;'">
					</view>
					<view style="font-size: 30rpx;margin-left: 6px;">{{ data.dataObj.name }}</view>
				</view>
			</view>
		</view>
		<!-- #endif -->
		<view style="text-align: center;font-size: 20rpx;color: gray;">没有更多了...</view>
	</scroll-view>
</template>
<script>
	// 引入筛选组件
	import menuData from '@/components/L-Dropdown/data2.js';
	import ldropdown from '@/components/L-Dropdown/components/L-Dropdown/L-Dropdown.vue'
	const AV = require('static/js/sangFangKu/AV.js')
	export default {
		components: {
			LDropdown: ldropdown
		},
		data() {
			return {
				listAll: [], //存储所有的信息(数据可变)
				listAll_f: [], //存储所有的信息(数据不变)
				list: [], //一次只存部分，以供页面显示，每次滚动到底部增加数据
				n: 5, //控制截取的下标
				menuItems2: [], //筛选列表
				isShowShai: false, //控制筛选的弹出
				city1: '全国',
				city2: '全国',
				searchText: ''
			}
		},
		async onShow() {
			this.menuItems2 = menuData;
			uni.showLoading({
				title: "数据加载中"
			})
			var query = new AV.Query("Total");
			// 查找数据库
			await query.find().then((data) => {
				this.listAll = data.reverse()
				this.listAll_f = data
				this.list = this.listAll.slice(0, 5)
			});
			uni.hideLoading()
		},
		methods: {
			// 搜索
			search(){
				// 递归函数，用于提取字符串内容
				function extractText(obj) {
				  // 如果是数组，递归处理数组的每个元素
				  if (Array.isArray(obj)) {
				    return obj.map(item => extractText(item)).join(' ');
				  }
				  // 如果是对象，递归处理对象的每个属性值
				  else if (typeof obj === 'object' && obj !== null) {
				    return Object.values(obj)
				      .map(value => extractText(value))
				      .join(' ');
				  }
				  // 如果是字符串，直接返回
				  else if (typeof obj === 'string') {
				    return obj;
				  }
				  // 对于其他类型，返回空字符串
				  else {
				    return '';
				  }
				}
				this.list = this.listAll.filter(item=>
					extractText(item.attributes.dataObj).replace(/\s/g, "").includes(this.searchText)
				)
				this.searchText = ''
			},
			// 筛选完成
			handle(evt) {
				this.city1 = evt.value[0][0]
				if(evt.value[0][1] === null){
					this.city2 = '全国'
				}else{
					this.city2 = evt.value[0][1]
				}
				this.n = 5
				let arrFilter
				// 100
				if (evt.value[0][0] !== null && evt.value[1][0] === null && evt.value[2][0] === null) {
					if (evt.value[0][0] === '全国') {
						arrFilter = this.listAll_f
					} else if (evt.value[0][1] === '全部') {
						arrFilter = this.listAll_f.filter(item => item.attributes.dataObj.cityName.includes(evt.value[0][
							0
						]))
					} else {
						arrFilter = this.listAll_f.filter(item => item.attributes.dataObj.cityName.includes(evt.value[0][
							0
						] + '-' + evt.value[0][1]))
					}
				}
				// 010
				if (evt.value[0][0] === null && evt.value[1][0] !== null && evt.value[2][0] === null) {
					if (evt.value[1][0] === '全部') {
						arrFilter = this.listAll_f
					} else {
						arrFilter = this.listAll_f.filter(item => item.attributes.dataObj.subject.includes(evt.value[1][
							0
						]))
					}
				}
				// 001
				if (evt.value[0][0] === null && evt.value[1][0] === null && evt.value[2][0] !== null) {
					if (evt.value[2][0] === '全部') {
						arrFilter = this.listAll_f
					} else {
						arrFilter = this.listAll_f.filter(item => item.attributes.dataObj.grade.includes(evt.value[2][0]))
					}
				}
				// 110
				if (evt.value[0][0] !== null && evt.value[1][0] !== null && evt.value[2][0] === null) {
					if (evt.value[0][0] === '全国' && evt.value[1][0] === '全部') {
						arrFilter = this.listAll_f
					}
					if (evt.value[0][0] === '全国' && evt.value[1][0] !== '全部') {
						arrFilter = this.listAll_f.filter(item => item.attributes.dataObj.subject.includes(evt.value[1][
							0
						]))
					}
					if (evt.value[0][0] !== '全国' && evt.value[1][0] === '全部') {
						arrFilter = this.listAll_f.filter(item => item.attributes.dataObj.cityName.includes(evt.value[0][
							0
						] + '-' + evt.value[0][1]))
					}
					if (evt.value[0][0] !== '全国' && evt.value[1][0] === '全部' && evt.value[0][1] === '全部') {
						arrFilter = this.listAll_f.filter(item => item.attributes.dataObj.cityName.includes(evt.value[0][
							0
						]))
					}
					if (evt.value[0][0] !== '全国' && evt.value[1][0] !== '全部') {
						arrFilter = this.listAll_f.filter(item => item.attributes.dataObj.cityName.includes(evt.value[0][
							0
						] + '-' + evt.value[0][1]) && item.attributes.dataObj.subject.includes(evt.value[1][
							0
						]))
					}
					if (evt.value[0][0] !== '全国' && evt.value[1][0] !== '全部' && evt.value[0][1] === '全部') {
						arrFilter = this.listAll_f.filter(item => item.attributes.dataObj.cityName.includes(evt.value[0][
							0
						]) && item.attributes.dataObj.subject.includes(evt.value[1][0]))
					}
				}
				// 011
				if (evt.value[0][0] === null && evt.value[1][0] !== null && evt.value[2][0] !== null) {
					if (evt.value[1][0] === '全部' && evt.value[2][0] === '全部') {
						arrFilter = this.listAll_f
					}
					if (evt.value[1][0] !== '全部' && evt.value[2][0] === '全部') {
						arrFilter = this.listAll_f.filter(item => item.attributes.dataObj.subject.includes(evt.value[1][
							0
						]))
					}
					if (evt.value[1][0] === '全部' && evt.value[2][0] !== '全部') {
						arrFilter = this.listAll_f.filter(item => item.attributes.dataObj.grade.includes(evt.value[2][0]))
					}
					if (evt.value[1][0] !== '全部' && evt.value[2][0] !== '全部') {
						arrFilter = this.listAll_f.filter(item => item.attributes.dataObj.subject.includes(evt.value[1][
							0
						]) && item.attributes.dataObj.grade.includes(evt.value[2][0]))
					}
				}
				// 101
				if (evt.value[0][0] !== null && evt.value[1][0] === null && evt.value[2][0] !== null) {
					if (evt.value[0][0] === '全国' && evt.value[2][0] === '全部') {
						arrFilter = this.listAll_f
					}
					if (evt.value[0][0] !== '全国' && evt.value[2][0] === '全部') {
						arrFilter = this.listAll_f.filter(item => item.attributes.dataObj.cityName.includes(evt.value[0][
							0
						] + '-' + evt.value[0][1]))
					}
					if (evt.value[0][0] !== '全国' && evt.value[2][0] === '全部' && evt.value[0][1] === '全部') {
						arrFilter = this.listAll_f.filter(item => item.attributes.dataObj.cityName.includes(evt.value[0][
							0
						]))
					}
					if (evt.value[0][0] === '全国' && evt.value[2][0] !== '全部') {
						arrFilter = this.listAll_f.filter(item => item.attributes.dataObj.grade.includes(evt.value[2][0]))
					}
					if (evt.value[0][0] !== '全国' && evt.value[2][0] !== '全部') {
						arrFilter = this.listAll_f.filter(item => item.attributes.dataObj.cityName.includes(evt.value[0][
							0
						] + '-' + evt.value[0][1]) && item.attributes.dataObj.grade.includes(evt.value[2][0]))
					}
					if (evt.value[0][0] !== '全国' && evt.value[2][0] !== '全部' && evt.value[0][1] === '全部') {
						arrFilter = this.listAll_f.filter(item => item.attributes.dataObj.cityName.includes(evt.value[0][
							0
						]) && item.attributes.dataObj.grade.includes(evt.value[2][0]))
					}
				}
				// 111
				if (evt.value[0][0] !== null && evt.value[1][0] !== null && evt.value[2][0] !== null) {
					if (evt.value[0][0] === '全国' && evt.value[1][0] === '全部' && evt.value[2][0] === '全部') {
						arrFilter = this.listAll_f
					}
					if (evt.value[0][0] !== '全国' && evt.value[1][0] === '全部' && evt.value[2][0] === '全部') {
						arrFilter = this.listAll_f.filter(item => item.attributes.dataObj.cityName.includes(evt.value[0][
							0
						] + '-' + evt.value[0][1]))
					}
					if (evt.value[0][0] !== '全国' && evt.value[1][0] === '全部' && evt.value[2][0] === '全部' && evt.value[0][
							1
						] === '全部') {
						arrFilter = this.listAll_f.filter(item => item.attributes.dataObj.cityName.includes(evt.value[0][
							0
						]))
					}
					if (evt.value[0][0] === '全国' && evt.value[1][0] !== '全部' && evt.value[2][0] === '全部') {
						arrFilter = this.listAll_f.filter(item => item.attributes.dataObj.subject.includes(evt.value[1][
							0
						]))
					}
					if (evt.value[0][0] === '全国' && evt.value[1][0] === '全部' && evt.value[2][0] !== '全部') {
						arrFilter = this.listAll_f.filter(item => item.attributes.dataObj.grade.includes(evt.value[2][0]))
					}
					if (evt.value[0][0] !== '全国' && evt.value[1][0] !== '全部' && evt.value[2][0] === '全部') {
						arrFilter = this.listAll_f.filter(item => item.attributes.dataObj.cityName.includes(evt.value[0][
							0
						] + '-' + evt.value[0][1]) && item.attributes.dataObj.subject.includes(evt.value[1][
							0
						]))
					}
					if (evt.value[0][0] !== '全国' && evt.value[1][0] !== '全部' && evt.value[2][0] === '全部' && evt.value[0][
							1
						] === '全部') {
						arrFilter = this.listAll_f.filter(item => item.attributes.dataObj.cityName.includes(evt.value[0][
							0
						]) && item.attributes.dataObj.subject.includes(evt.value[1][0]))
					}
					if (evt.value[0][0] === '全国' && evt.value[1][0] !== '全部' && evt.value[2][0] !== '全部') {
						arrFilter = this.listAll_f.filter(item => item.attributes.dataObj.subject.includes(evt.value[1][
							0
						]) && item.attributes.dataObj.grade.includes(evt.value[2][0]))
					}
					if (evt.value[0][0] !== '全国' && evt.value[1][0] === '全部' && evt.value[2][0] !== '全部') {
						arrFilter = this.listAll_f.filter(item => item.attributes.dataObj.cityName.includes(evt.value[0][
							0
						] + '-' + evt.value[0][1]) && item.attributes.dataObj.grade.includes(evt.value[2][0]))
					}
					if (evt.value[0][0] !== '全国' && evt.value[1][0] === '全部' && evt.value[2][0] !== '全部' && evt.value[0][
							1
						] === '全部') {
						arrFilter = this.listAll_f.filter(item => item.attributes.dataObj.cityName.includes(evt.value[0][
							0
						]) && item.attributes.dataObj.grade.includes(evt.value[2][0]))
					}
					if (evt.value[0][0] !== '全国' && evt.value[1][0] !== '全部' && evt.value[2][0] !== '全部') {
						arrFilter = this.listAll_f.filter(item => item.attributes.dataObj.cityName.includes(evt.value[0][
							0
						] + '-' + evt.value[0][1]) && item.attributes.dataObj.grade.includes(evt.value[2][
							0
						]) && item.attributes.dataObj.subject.includes(evt.value[1][0]))
					}
					if (evt.value[0][0] !== '全国' && evt.value[1][0] !== '全部' && evt.value[2][0] !== '全部' && evt.value[0][
							1
						] === '全部') {
						arrFilter = this.listAll_f.filter(item => item.attributes.dataObj.cityName.includes(evt.value[0][
								0
							]) && item.attributes.dataObj.grade.includes(evt.value[2][0]) && item.attributes
							.dataObj.subject.includes(evt.value[1][0]))
					}
				}
				this.list = arrFilter.slice(0, 5)
				this.listAll = arrFilter
			},
			// 滚动条到达底部后触发
			async scrolltolower() {
				if (this.listAll.length === this.list.length) {
					return
				}
				uni.showLoading({
					title: '加载中...'
				})
				await new Promise((resolve, reject) => {
					setTimeout(() => {
						resolve()
					}, 500)
				})
				this.list = [...this.list, ...this.listAll.slice(this.n, this.n + 5)]
				this.n += 5
				uni.hideLoading()
			},
			date(time) {
				var date = new Date(time);
				return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
			},
			changePage(index) {
				var dataStr = JSON.stringify(this.list[index].attributes.dataObj)
				uni.navigateTo({
					url: `/subpages/details/details?data=${dataStr}&date=${this.date(this.list[index].createdAt)}&id=${this.list[index].id}`

				})
			},
			changePagePublish() {
				uni.navigateTo({
					url: '/subpages/publish/publish'
				})
			},
			// 平台指南页面跳转
			changePageHelp() {
				uni.navigateTo({
					url: '/subpages/help/help'
				})
			}
		}
	}
</script>
<style scoped>
	.Header {
		background-color: #F0F5F9;
		position: fixed;
		top: 0;
		left: 0;
		z-index: 99;
		width: 100vw;
		height: 200rpx;
	}

	.city {
		width: 100rpx;
		height: 40rpx;
		line-height: 40rpx;
		padding: 10rpx;
		border-radius: 10rpx;
		font-size: 24rpx;
		margin-right: 10rpx;
		text-align: center;
		background-color: #80808021;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.sel {
		display: flex;
		font-size: 24rpx;
		margin-left: 20rpx;
		padding: 20rpx;
	}

	.sel>view {
		margin-right: 60rpx;
		text-align: center;
		height: 50rpx;
		line-height: 50rpx;
	}

	.header {
		width: 95vw;
		height: 80rpx;
		display: flex;
		align-items: center;
		position: relative;
		margin-bottom: 10rpx;
	}

	.header input {
		background-color: #15151517;
		flex-grow: 1;
		height: 70rpx;
		line-height: 70rpx;
		margin-right: 10rpx;
		margin-left: 15rpx;
		border-radius: 5rpx;
		box-sizing: border-box;
		padding-left: 65rpx;
		font-size: 28rpx;
	}

	.header image {
		width: 40rpx;
		position: absolute;
		left: 28rpx;
	}

	.scroll {
		height: 100vh;
		background-color: #80808014;
	}

	.list {
		width: 95vw;
		margin: 0rpx auto;
		margin-top: 200rpx;
	}

	.list .card {
		width: 100%;
		height: 300rpx;
		box-sizing: border-box;
		padding: 20px;
		background-color: white;
		border-radius: 5px;
		margin: 0 auto;
		margin-bottom: 40rpx;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		position: relative;
	}

	.userInfo {
		display: flex;
		align-items: center;
		position: absolute;
		bottom: 10px;
		right: 10px;
		border-radius: 12rpx;
		padding: 10rpx;
	}
</style>