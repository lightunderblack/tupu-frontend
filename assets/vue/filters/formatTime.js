import $ from "jquery";

/**格式化时间*/
let formatTime = (formation, data) => {
    let tempYear = data.getFullYear(),
    	tempMonth = data.getMonth() + 1,
    	tempDate = data.getDate(),
    	tempHour = data.getHours(),
    	tempMinute = data.getMinutes(),
    	tempSecond = data.getSeconds(),
    	toTwoDigit = function(num) {
			return num < 10 ? "0" + num : num;
		};

	return formation.replace(/y+|m+|d+|h+|s+|H+|M+/g, function(part){
        switch (part) {
            case "yyyy": return tempYear;
            case "yy": return tempYear.toString().slice(-2);
            case "MM": return toTwoDigit(tempMonth);
            case "M": return tempMonth;
            case "dd": return toTwoDigit(tempDate);
            case "d": return tempDate;
            case "HH": return toTwoDigit(tempHour);
            case "H": return tempHour;
            case "hh": return toTwoDigit(tempHour > 12 ? tempHour - 12 : tempHour);
            case "h": return tempHour > 12 ? tempHour - 12 : tempHour;
            case "mm": return toTwoDigit(tempMinute);
            case "m": return tempMinute;
            case "ss": return toTwoDigit(tempSecond);
            case "s": return tempSecond;
            default: return part;
        }
    });
};

/**时间数字转换成描述性文字*/
let isInThreeMin = (subTime) => {
    let threeMin = 3 * 60 * 1000;

    return subTime <= threeMin;
};
let isInAnHour = (subTime) => {
    let threeMin = 3 * 60 * 1000;
    let hourInner = 60 * 60 * 1000;

    return (subTime > threeMin) && (subTime < hourInner);
};
let isToday = (subTime) => {
    let hourInner = 60 * 60 * 1000;
    let dayInner = 24 * 60 * 60 * 1000;

    return (subTime >= hourInner) && (subTime <= dayInner);
};
let isYestoday = (timeCreate, subTime) => {
    let dayInner = 24 * 60 * 60 * 1000;
    let now = new Date();
    let y = now.getFullYear();
    let m = now.getMonth() + 1;//获取当前月份的日期
    let d = now.getDate() - 1;
    let timeYestoday = new Date(y, m, d, 0, 0, 0).getTime();

    return (subTime > dayInner) && (timeCreate >= timeYestoday);
};
let isThisYear = (timeCreate) => {
    let now = new Date();
    let y = now.getFullYear();
    let m = now.getMonth()+1;//获取当前月份的日期
    let d = now.getDate();
    let timeYestoday = new Date(y, m, d-1, 0, 0, 0).getTime();
    let timeThisYear = new Date(y, 1, 1, 0, 0, 0).getTime();
    
    return (timeCreate < timeYestoday) && (timeCreate >= timeThisYear);
};
let timeHandler = (createTime) => {
	let m;
    let d;
	let now;
	let time;
    let result;
    let subTime;
	let millisecond;

    if(!$.trim(createTime)){
        return "";
    }
    
    now = new Date().getTime();
    time = new Date(createTime);
    millisecond = new Date(createTime).getTime();
    subTime = now - millisecond;
    m = time.getMonth() + 1;
    d = time.getDate();

    if (isInThreeMin(subTime)) {
        result = '刚刚';
    } else if (isInAnHour(subTime)) {
        let min = Math.round(subTime / 1000 / 60);
        result = min + '分钟前';
    } else if (isToday(subTime)) {
        let hour = Math.ceil(subTime / 1000 / 60 / 60);
        result = hour + '小时前';
    } else if (isYestoday(millisecond, subTime)) {
        result = '昨日';
    } else if (isThisYear(millisecond)) {
        result = m + '月' + d + '日';
    } else {
        result = formatTime('yyyy-MM-dd', time);
    }

    return result;
};

export {
	formatTime,
	timeHandler
};