//计算字符串长度
let strLen = (string) => {
    let len = 0;

    for (let i = 0; i < string.length; i++) {
        len = len + ((string.charCodeAt(i) > 255 || string.charCodeAt(i) < 0 ) ? 2 : 1);
    }

    return len;
};

//将字符串拆成字符，并存到数组中
let strToChars = (string) => {
    let chars = [];

    for (let i = 0; i < string.length; i++){
        chars[i] = [string.substr(i, 1), isCHS(string, i)];
    }

    return chars;
};

//判断某个字符是否是汉字
let isCHS = (string, i) => {
    return string.charCodeAt(i) > 255 || string.charCodeAt(i) < 0;
};

//截取字符串(从start字节到end字节)
let subCHString = (string, start, end) => {
    let len = 0;
    let str = "";
    let chars = strToChars(string);

    for (let i = 0; i < string.length; i++) {
        if(chars[i][1]){
            len += 2;
        }else{
            len += 1;
        }
        if (end < len){
            return str;
        }else if (start < len){
            str += chars[i][0];
        }
    }

    return str;
};

//截取字符串(从start字节截取length个字节)
let subCHStr = (string, start, length) => {
    return subCHString(string, start, start + length);
};

export {
	strLen,
	subCHStr,
	subCHString
};