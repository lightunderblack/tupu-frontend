import $ from "jquery";
import * as Config from "./Config";

/**
 * 异步请求统一入口
 * @param  {[type]} apiName     后台接口名称 必填
 * @param  {[type]} param       请求参数 可选,默认为空
 * @param  {[type]} type        get/post/delete 可选,默认get
 * @param  {[type]} showLoading 是否显示loading 可选,默认不显示
 * @return {[type]}
 */
let request = (apiName, param, type, showLoading) => {
    let url,
        promise,
        paramType = $.type(param);

    if (paramType === "boolean") {
        showLoading = param;
        param = null;
    } else if (paramType === "string") {
        type = paramType;
        param = null;
    }
    if ($.type(type) === "boolean") {
        showLoading = type;
        type = "get";
    }
    showLoading = !!showLoading;
    type = type || "get";
    url = Config.config.api + Config.API.apiUrlPrefix + apiName;
    if (showLoading) {
    	/*显示加载图标*/
    }
    promise = $.ajax({
    	url: url, 
    	type: type,
    	data: param, 
    	dataType: "json"
    }).done(function(data) {
        if ($.type(data) === "string") {
            data = $.parseJSON(data);
        }
        return data;
    });
    if (showLoading) {
        promise.always(function() {
        	/*隐藏加载*/
    	});
    }

    return promise;
};

/**
 * 初始化必要配置信息
 */
let initConfig = () => {
	let config = Config.config;

	//读取页面配置信息
	$(document.body).find("[type=\"hidden\"]").each(function(){
		config[$.trim(this.id || this.name)] = $.trim(this.value);
	});

	//设置异步请求头部鉴权信息
	$.ajaxSetup({
		headers: {
			"Authorization": config.auth
		}
	});
};

/**
 * 替换模板
 * @param  {[type]} tpl  模板字符串，占位符Mustach(双大括号) 必填
 * @param  {[type]} data 需填充的数据对象 必填
 * @return {[type]} 
 * @example
 * replaceTpl("Hello, {{world}} And Hello, {{kitty}}", {world: "world!", kitty: "kitty!"})
 */
let replaceTpl = (tpl, data) => {
	data = data || {};

	return (tpl || "").replace(/\{\{(\s*[^\{\}]+\s*)\}\}/g, function(match, name){
		return data[name];
	});
};

/**
 * 获取登陆用户信息
 * @return {[type]} [description]
 */
let getUserInfo = () => {
	return request(Config.API.userInfo).done(function(data){
		$.extend(true, Config.userInfo, data.user);//缓存当前用户配置信息
	});
};

/**
 * 获取七牛配置信息
 * @return {[type]} [description]
 */
let getQiniuInfo = () => {
	return request(Config.API.qiniu).done(function(data){
        $.extend(true, Config.qiniuInfo, data);//缓存七牛配置信息       
		Config.defaultAvatar = data.https_domain + 'img/avatar_default.png';//设置默认头像路径
	});	
};

/**
 * 载入基础数据 包括：当前登陆用户信息/七牛配置信息
 * @return {[type]} [description]
 */
let loadBaseInfo = () => {
	return $.when(getUserInfo(), getQiniuInfo());
};

/**
 * 终止异步请求
 * @type {String} 异步请求名称
 */
let promiseCollection = {};
let abortPromise = (name) => {
    if(promiseCollection[name]){
        promiseCollection[name].abort();
        promiseCollection[name] = null;
    }
};

/**
 * 数组转对象
 * @param  {[type]} list    数组
 * @param  {String} keyName 关键字名称
 * @param  {Object} map     对象
 */
let list2Map = (list, keyName = "id", map = {}) => {
    $.each(list || [], (i, item) => {
        map[item[keyName]] = $.extend(true, {}, item);
    });

    return map;
};

/**
 * 将用户信息存入Config.userList
 * @param  {[type]} user 用户信息
 * @return {[type]} 
 */
let cacheUser = (user) => {
    Config.userList[user.id] = $.extend(true, {}, user);
};

/**
 * 根据id值从缓存中取用户信息
 * @param  {[type]} id 用户id
 * @return {[type]}    
 */
let getUserFormCacheById = (id) => {
    return Config.userList[id] || {};
};

/**
 * 根据id获取索引
 * @type {[type]}
 */
let getIndexById = (list, id) => {
    let index = -1;

    $.each(list, (i, item) => {
        if(item.id == id){
            index = i;
            return false;
        }   
    });

    return index;
};

export {
	request,
    list2Map,
    cacheUser,
	initConfig,
	replaceTpl,
	getUserInfo,
    getIndexById,
	getQiniuInfo,
	loadBaseInfo,
    abortPromise,
    promiseCollection,
    getUserFormCacheById
};
