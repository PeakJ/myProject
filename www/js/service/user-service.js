/**
 * Created by xuzunyuan on 2015/7/29.
 */

/**
 * 用户信息服务
 */
cdfgApp.factory('UserService', ['$rootScope', 'LocalCacheService', function ($rootScope, LocalCacheService) {
    // 用户信息定义
    var User = function () {
        //common attr
        this.userId = undefined; //用户名
        this.nickName = undefined; //昵称
        this.headerPic = undefined; //头像
        //login attr
        this.type = 1; //类型
        this.userInfo = undefined; //用户信息字符串
        this.ticket = undefined; //令牌
        this.loginName = undefined;//登录名
        //account attr
        this.birthday = undefined;//登录名
        this.gender = undefined;//登录名

        //判断用户是否登录
        this.isLogined = function () {
            return (!!this.ticket);
        };
    };
    var user, USER_CACHE_KEY = 'cdfg_user_cache_key';

    return {
        getUser: function () {
            // 如果没有初始化，则尝试从本地缓存中读取
            if (!user) {
                user = new User();
                var cachedUser = LocalCacheService.getObject(USER_CACHE_KEY);
                if (cachedUser) {

                    //common attr
                    user.userId = cachedUser.userId;
                    user.nickName = cachedUser.nickName;
                    user.headerPic = cachedUser.headerPic;

                    //login attr
                    user.loginName = cachedUser.loginName;
                    user.type = cachedUser.type;
                    user.userInfo = cachedUser.userInfo;
                    user.ticket = cachedUser.ticket;

                    //extends attr
                    user.birthday = cachedUser.birthday;
                    user.gender = cachedUser.gender;
                }
            }
            return user;
        },

        setUser: function (userObj) {
            console.log(userObj);
            if (!user) {
                user = new User();
            }
            //common attr
            if (userObj.userId) {
                user.userId = userObj.userId;
            }
            if (userObj.nickName) {
                user.nickName = userObj.nickName;
                console.log('nickName:' + userObj.nickName);
            } else if (userObj.loginName) {
                user.nickName = userObj.loginName;
                console.log('nickName is empty,use loginName instead:' + userObj.loginName);
            } else if (user.loginName) {
                user.nickName = user.loginName;
                console.log('userObj.loginName is empty,too.use local.loginName instead:' + user.loginName);
            }
            if (userObj.headerPic) {
                user.headerPic = userObj.headerPic;
            }
            /* 默认头像调整到filter中
            else {
                user.headerPic = 'img/photo.png';
            }*/
            //login attr
            if (userObj.loginName) {
                user.loginName = userObj.loginName;
            }
            if (userObj.type) {
                user.type = userObj.type;
            }
            if (userObj.userInfo) {
                user.userInfo = userObj.userInfo;
            }
            if (userObj.ticket) {
                user.ticket = userObj.ticket;
            }
            //account attr
            if (userObj.gender) {
                user.gender = userObj.gender;
            }
            if (userObj.birthday) {
                user.birthday = userObj.birthday;
            } else {
                user.birthday = '19900101';
            }
            console.log('set User ：');
            console.log(user);
            LocalCacheService.setObject(USER_CACHE_KEY, user);
            $rootScope.$broadcast('user:refresh', user);
        }
        ,

        clearUser: function () {
            if (user) {
                user.userId = user.nickName = user.headerPic = undefined;
                user.type = user.userInfo = user.ticket = user.loginName = undefined;
                user.birthday = user.gender = undefined;
            }

            LocalCacheService.remove(USER_CACHE_KEY);
            $rootScope.$broadcast('user:clear');
        }
    }
}
])
;