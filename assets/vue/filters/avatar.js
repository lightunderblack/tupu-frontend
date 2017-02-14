import $ from "jquery";
import * as Config from "../common/Config";

/**
 * 设置头像, 若头像为空, 则使用默认头像
 * @param  {[type]} url 头像地址
 * @return {[type]}     [description]
 */
export default function avatar (url) {
	return $.trim(url) || Config.defaultAvatar;
};