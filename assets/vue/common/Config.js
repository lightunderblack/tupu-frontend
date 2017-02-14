let userInfo = {};

let userList = {};

let qiniuInfo = {};

let posts = {
	data: [], 
	page: 1, 
	reload: false, 
	hasNext: false
};

//配置信息
let config = {
	emptyImg: "data:image/gif;base64,R0lGODlhAQABAIABAAAAAP///yH5BAEAAAEALAAAAAABAAEAAAICTAEAOw=="
};

//公用API
let API = {
	qiniu: "apps/qiniu/", //载入七牛基础信息
	userInfo: "users/self/", //载入当前用户信息
	apiUrlPrefix: "api/v1/"//api前缀
};

export {
	API,
	posts,
	config,
	userList,
	userInfo,
	qiniuInfo
};