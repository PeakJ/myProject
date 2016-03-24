/**
 * 友盟社会化插件
 */
var exec = require('cordova/exec');

var umeng = function() {
};

/**
 * 分享
 * @param title {String} 分享标题
 * @param content {String} 分享内容
 * @param pic {String} 分享图片url
 * @param url {String} 分享内容跳转链接
 */
umeng.share = function(title, content, pic, url) {
    exec(null, null, "UmengPlugin", "share", [title, content, pic, url]);
};

/**
 * 联合登录
 * @param type {String} 平台类型 QQ:qq, 微博:sina, 微信:wechat
 * @param success {Function} 成功回调，返回json字符串{"uid":"uid","name":"name"}
 * @param error {Function} 失败回调，返回错误信息
 */
umeng.login = function(type, success, error) {
    exec(success, error, "UmengPlugin", "login", [type]);
};

/**
 * 检查应用是否已安装
 * @param type {String} 平台类型 QQ:qq, 微博:sina, 微信:wechat
 * @param success {Function} 成功回调
 * @param error {Function} 失败回调，返回错误信息
 */
umeng.checkAppInstalled = function(type, success, error) {
    exec(success, error, "UmengPlugin", "checkAppInstalled", [type]);
};

module.exports = umeng;



