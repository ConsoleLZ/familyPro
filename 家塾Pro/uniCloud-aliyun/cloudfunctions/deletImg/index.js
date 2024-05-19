'use strict';
exports.main = async (event, context) => {
	// 云函数删除文件示例代码
	let result = await uniCloud.deleteFile({
	    fileList: [
	        event.imgUrl
	    ]
	});

};
