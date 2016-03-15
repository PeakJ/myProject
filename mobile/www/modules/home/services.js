/**
 * 登录services
 * 张俊辉
 * 2015-07-22 17:38
 */
bomApp.factory('loginServices',['$http','UrlService',function($http,UrlService){
    var headUrl = UrlService.getUrl();
    return{
        get : function(parameter){
            return $http.post(headUrl+'bom/a/api/login?'+parameter)
                .then(function(object){
                    var data = object.data;
                    return data;
                },function(error){
                    console.log("服务器连接失败");
                })
        }
    }
}]);


/**
 * 获取用户信息services
 * 张帅
 * 2015-08-07 09：24
 */
bomApp.factory('userCenterService',['$http','UrlService',function($http,UrlService){
    var headUrl = UrlService.getUrl();
    return{
        get : function(parameter){
            return $http.post(headUrl+'bom/a/sys/user/api/userInfo?'+parameter)
                .then(function(object){
                    var data = object.data;

                    return data;
                },function(error){
                    console.log("获取用户信息失败。");
                })
        }
    }
}]);
/**
 * 头像上传
 * 张俊辉
 * 2015-08-14 13:26
 */
bomApp.factory('userImageService',['$http','UrlService',function($http,UrlService){
    var headUrl = UrlService.getUrl();
    return{
        get : function(parameter){
            return $http.post(headUrl+'bom/a/sys/user/api/userImage?'+parameter)
                .then(function(object){
                    var data = object.data;
                    return data;
                },function(error){
                    console.log("获取用户信息失败。");
                })
        }
    }
}]);
/**
 * 重置密码
 * 张帅
 * 2015-08-14
 */
bomApp.factory('resetService',['$http','UrlService',function($http,UrlService){
    var headUrl =UrlService.getUrl();
    return{
        get : function(userInfo){
            var transform = function(data){
                return $.param(data);
            };
            console.log(userInfo);
            return $http.post(headUrl+'bom/a/sys/user/api/reset',{"userInfo":userInfo},{
                headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
                transformRequest: transform})
                .then(function (object) {
                    var data = object.data;
                    return data;
                })
        }
    }
}]);

bomApp.factory('businessTripCountService',['$http','UrlService',function($http,UrlService){
    var headUrl = UrlService.getUrl();
    return{
        get : function(parameter){
            return $http.post(headUrl+'bom/a/sys/businesstrip/api/checkInformationCount?' + parameter)
                .then(function(object){
                    data = object.data;
                    return object.data;
                });
        }
    }
}]);