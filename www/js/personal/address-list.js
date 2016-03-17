/********************************

 creator:dhc-jiangfeng
 create time:2016/2/27
 describe：地址列表Controller

 ********************************/

CYXApp.controller('addressListController', ['$scope', '$ionicHistory', 'AddressListService', '$state',
    function ($scope, $ionicHistory, AddressListService, $state) {
        //第一部分 页面绑定的数据  写注释 根据需要 初始化
        $scope.addressList;//地址列表数据：省份，城市，乡镇
        //第二部分 必备方法
        /**
         * 获取个人信息
         */
        $scope.getAddressList = function () {
            AddressListService.getAddressList().then(function (response) {
                console.log('地址列表 response = ' + JSON.stringify(response.data));
                if (!response.data) {
                    //请求失败
                    return;
                }
                var result = response.data;
                if (result.code == 0) {
                    $scope.addressList = result.data;
                }
            });
        };
        //返回
        $scope.goBack = function () {
            //$ionicHistory.goBack();
            //判断wap是否能获取到上一页路由 没有则返回首页
            if (!$ionicHistory.backView()) {
                $state.go('home');
                return;
            }
            ($ionicHistory.backView() && $ionicHistory.backView().url.indexOf('login') > 0) ? $ionicHistory.goBack(-2) : $ionicHistory.goBack();
        };
        //第三部分 相应事件的方法 ,命名或者用业务含义 比如 submit，toDetail
        //第四部分  ionic 事件 或者自定义事件的监听
        $scope.$on('$ionicView.beforeEnter', function (e, v) {
            $scope.getAddressList();

        });

    }]);

/**
 *地址列表Service
 *
 */
CYXApp.service('AddressListService', ['$http', 'UrlService', function ($http, UrlService) {
    //加载地址列表
    this.getAddressList = function (requestParams) {
        var url = UrlService.getDebugUrl('ADDRESS_LIST');
        return $http.get(url, requestParams);
    };
}]);