/**
 * 我的消息
 * 张俊辉
 * 2015-08-04 13:18
 */
bomApp.factory('MessageService',['$http','UrlService',function($http,UrlService){
    var headUrl = UrlService.getUrl();
    return{
        get : function(parameter){
            return $http.post(headUrl+'bom/a/sys/sysMessageRecord/api/getMessageRecordUnreadCount?' + parameter)
                .then(function(object){
                    data = object.data;
                    return object.data;
                });
        }
    }
}]);
/**
 * 未完成任务列表
 * 张俊辉
 * 2015-08-17 13:52
 */
bomApp.factory('outMessageService',['$http','UrlService',function($http,UrlService){
    var headUrl = UrlService.getUrl();
    return{

        get : function(parameter){
            return $http.post(headUrl+'bom/a/sys/Message/api/messageList?'+parameter)
                .then(function(object){
                    data = object.data;
                    return object.data;
                });
        }
    }
}]);

/**
 * 更新消息状态
 * 张俊辉
 * 2015-08-17 13:52
 */
bomApp.factory('setMessageReadService',['$http','UrlService',function($http,UrlService){
    var headUrl = UrlService.getUrl();
    return{
        get : function(parameter){
            return $http.post(headUrl+'bom/a/sys/sysMessageRecord/api/updateMessageRecordReadflag?'+parameter)
                .then(function(object){
                    data = object.data;
                    return object.data;
                });
        }
    }
}]);
