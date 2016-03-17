/**
 * Created by geshuo on 2016/2/16.
 *
 * 用户信息服务
 *
 */
CYXApp.factory('UserService', ['$rootScope', '$localstorage', function ($rootScope, $localstorage) {
    // User类
    var User = function () {
        this.userId = undefined;//用户id
       // this.token = undefined;//令牌

    };

    var user;
    var USER_CACHE_KEY = 'USER_CACHE_KEY';

    return {
        /**
         * 获取用户对象
         */
        getUser: function () {
            // 如果没有初始化，则尝试从本地缓存中读取

                var temp = $localstorage.getObject(USER_CACHE_KEY);
                if (temp) {
                   return temp;
                }
            return undefined;
        },
        /**
         * 更新用户
         */
        setUser: function (userObj) {
          console.log("userObj:"+userObj);
            //if (!user) {
            //    user ={};
            //}
            //user.userId = userObj.userId;
            //user.userName = userObj.userName;
            //user.tel = userObj.tel;
            //user.headImage = userObj.headImage;
            //user.sex = userObj.sex;
            //user.address = userObj.address;
            //user.mail = userObj.mail;
            //user.token = userObj.token;
            $localstorage.setObject(USER_CACHE_KEY, userObj);
            $rootScope.$broadcast('USER:REFRESH', userObj);
            $rootScope.$broadcast('USER:LOGIN_SUCCESS',userObj);
        },
        /**
         * 用户退出清理存储
         */
        clearUser: function () {
            if (user) {
                user.userId = undefined;
                user.token = undefined;
            }
            //$localstorage.remove(USER_CACHE_KEY);
            $localstorage.setObject(USER_CACHE_KEY, null);
            $rootScope.$broadcast('USER:CLEAR');
        },
        /**
         * 判断用户是否登录
         */
        isUserLogin: function () {
            if (!user) {
                user = this.getUser();
            }
            return (!!user.token);

        }
    }
}
]);
