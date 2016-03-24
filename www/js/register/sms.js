/********************************

 creater:haosijia@cdfg.com.cn
 create time:2015/07/13
 describe：会员注册
 modify time:2015/07/13

 ********************************/

/*
 Service 模块服务
 */
cdfgApp.factory('SmsService', ['$http','UrlService',function($http,UrlService) {

    return {
        /**
         * 发送手机验证码
         */
        sendSMS: function(mobile) {
            return $http.post(UrlService.getUrl('SEND_SMS'), {
                mobile:mobile,
                channel:1
            });
        },

        /**
         * 校验手机短信验证码
         */
        validCode: function(mobile,validCode){
            return $http.post(UrlService.getUrl('VALID_CODE'), {
                mobile:mobile,
                validCode:validCode,
                channel:1
            });
        }
    }

}]);
