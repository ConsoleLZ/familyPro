> 组件兼容APP-VUE、H5、MP-WEIXIN，其他端未做兼容测试，不支持。  
> 遇到问题或有建议可以添加qq:173253786  
> 如果觉得组件不错，<font color=#f00>给五星鼓励鼓励</font>咯！

##使用说明  
在页面中使用组件  
``` 
<template>
	<L-Dropdown menuTop="200rpx;" :filterData="menuItems2" :defaultSelected="filterDropdownValue"></L-Dropdown>
</template>
<script>
	import menuData from '@/common/data2.js';
	export default {
		data() {
			return {
				menuItems2: [],
			}
		},
		created() {
			this.menuItems2 = menuData;
		}
	}
</script>
```
###说明一下,如果菜单列表使用的数据过多,建议放在js文件里面,像我这样

data2.js里面存放的是菜单数据,如要修改数据,请模仿格式自行更改

##属性说明  

|属性名	|类型	|说明				|
|--	|--	|--	|
|filterData|Object	|必选，菜单数据，数据格式请下载示例查看		|
|defaultSelected|Array	|可选，默认选中子菜单数据，需要传入跟``@confirm``输出的index相同的结构数据，如不确定可以先传入数据看下输出的结果	|
|updateMenuName|Boolean	|可选，选择子菜单是否自动修改对应的顶部菜单文字，可取值:``true``/``false``，默认值:``true``	|
|menuTop|Number	|可选，菜单到顶部距离，单位rpx，一般用于页面有自己写的标题栏或搜索栏时，默认值:0	|
|@confirm|EventHandle	|用户选择完毕/收起菜单，触发confirm事件，event= {value,index}	|

###传入数据格式等更多的说明请下载示例查看，有数据对照注释更容易明白。

####偷偷的打广告
定制模板，开发uniapp、H5+APP、vue2,vue3、微信小程序，付费咨询指导，有需要加QQ。  

<table><tr><td bgcolor=#8f9396 >
<center><font color=#8f9396>v:19120597808</font> <font color=#fff>(刮刮卡)</font></center>
</td></tr></table>

