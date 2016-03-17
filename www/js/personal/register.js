/********************************

 creator:dhc-jiangfeng
 create time:2016/2/24
 describe：注册页面Controller

 ********************************/

CYXApp.controller('registerController', ['$scope', '$ionicHistory', '$state', '$ionicPopup', 'RegisterService',
    function ($scope, $ionicHistory, $state, $ionicPopup, RegisterService) {
        //第一部分 页面绑定的数据  写注释 根据需要 初始化
        //用户注册所需信息
        $scope.userInfo = {
            phone: '',
            password: '',
            valCode: ''
        };

        //第二部分 必备方法
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
        $scope.register = function () {
            if ($scope.userInfo.phone.length == 0) {
                $ionicPopup.alert({
                    title: '提示',
                    template: '请输入手机号！'
                });
            //} else if (!(/^1[3|4|5|8|7][0-9]\d{8}$/.test($scope.userInfo.phone))) {
            //    $ionicPopup.alert({
            //        title: '提示',
            //        template: '手机号格式不正确！'
            //    });
            } else if ($scope.userInfo.valCode.length == 0) {
                $ionicPopup.alert({
                    title: '提示',
                    template: '请输入验证码！'
                });
            } else if ($scope.userInfo.password.length == 0) {
                $ionicPopup.alert({
                    title: '提示',
                    template: '请输入密码！'
                });
            } else {
                var params = {
                    phone: $scope.userInfo.phone,
                    valCode: $scope.userInfo.valCode,
                    password: $scope.userInfo.password
                };
                RegisterService.addRegisterUserInfo(params).then(function (response) {
                    console.log('注册 response = ' + JSON.stringify(response));
                    if (!response.data) {
                        return;
                    }
                    var result = response.data;
                    if (result.code == 0) {
                        console.log("register success!");
                        $state.go('login');
                    } else {
                        //TODO: 错误处理
                    }
                })
            }

        };

        $scope.getVerifyCode = function () {
            if ($scope.userInfo.phone.length == 0) {
                $ionicPopup.alert({
                    title: '提示',
                    template: '请输入手机号！'
                });
            //} else if (!(/^1[3|4|5|8|7][0-9]\d{8}$/.test($scope.userInfo.phone))) {
            //    $ionicPopup.alert({
            //        title: '提示',
            //        template: '手机号格式不正确！'
            //    });
            } else {

            }
        };
        //第四部分  ionic 事件 或者自定义事件的监听

    }]);

/**
 * 注册Service
 * jiangfeng
 */
CYXApp.service('RegisterService', ['$http', 'UrlService', function ($http, UrlService) {
    this.addRegisterUserInfo = function (requestParams) {
        var url = UrlService.getUrl('REGISTER');
        //var url='http://172.16.63.32:8085/insert_user.ajax';
        console.log('url = ' + url);
        return $http.post(url, requestParams);
    };
}]);