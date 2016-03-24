/********************************

 creater:haosijia@cdfg.com.cn
 create time:2015/07/13
 describe：会员注册
 modify time:2015/07/13

 ********************************/

/*
 Service 模块服务
 */


cdfgApp.factory('ValidateService', ['$http','UrlService',function($http,UrlService) {

    return {
        /**
         * 手机号唯一性验证
         */

        uniqueMobile: function(mobile) {
            return $http.post(UrlService.getUrl('UNIQUE_MOBILE'), {
                mobile:mobile,
                channel:1
            });
        },

        /**
         * 邀请码验证
         */
        checkInvitationCode: function(inviteCode){
            return $http.post(UrlService.getUrl('CHECK_INVITATION_CODE'), {
                inviteCode:inviteCode,
                channel:1
            });
        },
        /**
         * 注册
         */
        doRegister: function(mobile,validCode,pwd,inviteCode){
            return $http.post(UrlService.getUrl('DO_REGISTER'), {
                mobile:mobile,
                validCode:validCode,
                pwd:pwd,
                inviteCode:inviteCode==null ? null : inviteCode,
                channel:1
            });
        }

    }
}]);
