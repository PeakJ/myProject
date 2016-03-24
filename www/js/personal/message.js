/**
 * Created by ZCP on 2015/7/1.
 */
cdfgApp.controller('MessageController', ['$scope', 'UrlService', 'MessageService', '$timeout', '$ionicHistory',
    function ($scope, UrlService, MessageService, $timeout, $ionicHistory) {

    /* ADD START BY 葛硕20150808：[APP-95] bug:部分标题会显示样式错乱 -------------------------------*/
    $scope.goBack = goBack;
    /* ADD END   BY 葛硕20150808：[APP-95] bug:部分标题会显示样式错乱 -------------------------------*/

    $scope.init = function () {
        $scope.messageList = [];
        $scope.index = 1;
        $scope.total = 1;
    };

    $scope.moreDataCanBeLoaded = function () {
        console.log('check');
        return ($scope.total > $scope.messageList.length);
    };
    $scope.loadMore = function () {
        console.log('loadMore');
        $timeout(function () {
            MessageService.getMessageList($scope.index)
                .success(function (response, status, headers, config) {
                    if (response.code == 1) {
                        console.log(response);
                        $scope.messageList = $scope.messageList.concat(response.data.data);
                        $scope.total = response.data.total;
                        $scope.index = $scope.index + 1;
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                        //$scope.messageList = formatHtml($scope.messageList)
                    }
                })
        }, 500);

    };

    $scope.doRefresh = function () {
        MessageService.getMessageList($scope.index)
            .success(function (response, status, headers, config) {
                console.log(response);
                if (response.code == 1) {
                    $scope.messageList = response.data.data;
                    $scope.total = response.data.total;
                    $scope.index = 1;
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                }
            })
    };

    $scope.readMessage = function (message) {
        console.log(response);
        MessageService.readMessage(message.id)
            .success(function (response, status, headers, config) {
                if (response.code == 1) {
                    console.log(response);
                    //response.
                }
            })
    };

    $scope.init();

    //返回上一页
    function goBack(){
        $ionicHistory.goBack();
    }
}]);

/**
 * MessageService
 * Created by ZCP on 2015/7/6.
 */
cdfgApp.service('MessageService', ['$http', 'UrlService', function ($http, UrlService) {
    this.getMessageList = function (index) {
        var param = {
            pageNo: index,
            pageSize: CDFG_PAGE_SIZE
        };
        return $http.post(UrlService.getUrl('PERSONAL_MESSAGE_LIST'), param)
    } ;
    this.readMessage = function (msgId) {
        var param = {
            msgId:msgId
        };
        return $http.post(UrlService.getUrl('PERSONAL_MESSAGE_READ'), param)
    };

}]);
