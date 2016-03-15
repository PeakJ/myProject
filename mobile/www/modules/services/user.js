/**
 * Created by 11150421050181 on 2015/7/20.
 */
/**
 * 登录用户管理
 * 张俊辉
 * 2015-07-22 17:38
 */
bomApp.factory('userService', ['$localStorage', function ($localStorage) {
    var userIdKey = 'userId';//用户id （id）
    var userNameKey = 'userName';//用户name (姓名)
    var loginNameKey = 'loginName';//登录名 
    var userStateKey = 'userState'; //用户state （状态）
    var userLevelKey = 'userLevel'; //用户level （级别）

    return {
        setUserInfo: function (userinfo) {
            $localStorage.set(userIdKey, userinfo.userId);
            $localStorage.set(userNameKey, userinfo.userName);
            $localStorage.set(loginNameKey, userinfo.loginName);
            $localStorage.set(userLevelKey, userinfo.userLevel);
            $localStorage.set(userStateKey, userinfo.userState);
        },
        getUserInfo: function () {
            var userId = $localStorage.get(userIdKey, -1);
            var userName = $localStorage.get(userNameKey, -1);
            var loginName = $localStorage.get(loginNameKey, -1);
            var userState = $localStorage.get(userStateKey, -1);
            var userLevel = $localStorage.get(userLevelKey, -1);
            var userinfo = {userId: userId, userName: userName, loginName: loginName, userLevel:userLevel,userState: userState};
            return userinfo;
        },
        setUserId: function (userId) {
            $localStorage.set(userIdKey, userId);
        },
        getUserId: function () {
            return $localStorage.get(userIdKey, -1);
        },
        setUserName: function (userName) {
            $localStorage.set(userNameKey, userName);
        },
        getUserName: function () {
            return $localStorage.get(userNameKey, -1);
        },
        setloginName: function (loginName) {
            $localStorage.set(loginNameKey, loginName);
        },
        getloginName: function () {
            return $localStorage.get(loginNameKey, -1);
        },
        setUserState: function (userState) {
            $localStorage.set(userStateKey, userState);
        },
        getUserState: function () {
            return $localStorage.get(userStateKey, -1);
        },
        setUserLevel: function (userLevel) {
            $localStorage.set(userLevelKey, userLevel);
        },
        getUserLevel: function () {
            return $localStorage.get(userLevelKey, -1);
        },
        clearUserInfo: function () {
            $localStorage.set(userIdKey, -1);
            $localStorage.set(userNameKey, -1);
            $localStorage.set(loginNameKey, -1);
            $localStorage.set(userStateKey, -1);
            $localStorage.set(userLevelKey, -1);
        }
    }
}]);