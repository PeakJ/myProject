
/**
 * 统计_项目
 */
bomApp.factory('projectServices',['$http','UrlService',function($http,UrlService){
    var headUrl = UrlService.getUrl();
    return {
        get : function(parameter){
            var url = headUrl+'bom/a/sys/statistics/api/getProjectStatistics?' + parameter;
            return $http.post(url)
                .then(function(object){
                    var data = object.data;
                    return data;
                });
        }
    }
}]);
/**
 * 统计_人员
 */
bomApp.factory('userServices',['$http','UrlService',function($http,UrlService){
    var headUrl = UrlService.getUrl();
    return {
        get : function(parameter){
            var url = headUrl+'bom/a/sys/statistics/api/getUsersStatistics?' + parameter;
            return $http.post(url)
                .then(function(object){
                    var data = object.data;
                    return data;
                });
        }
    }
}]);
/**
 * 统计_交通
 */
bomApp.factory('trafficServices',['$http','UrlService',function($http,UrlService){
    var headUrl = UrlService.getUrl();
    return {
        get : function(parameter){
            return $http.post(headUrl+'bom/a/sys/statistics/api/getTrafficList?'+parameter)
                .then(function(object){
                    var data = object.data;
                    return data;
                });
        }
    }
}]);
/**
 * 统计_目的地
 */
bomApp.factory('destinationServices',['$http','UrlService',function($http,UrlService){
    var headUrl = UrlService.getUrl();
    return {
        get : function(parameter){
            var url = headUrl+'bom/a/sys/statistics/api/getDestinationList?'+parameter;
            return $http.post(headUrl+'bom/a/sys/statistics/api/getDestinationList?'+parameter)
                .then(function(object){
                    var data = object.data;
                    return data;
                });
        }
    }
}]);