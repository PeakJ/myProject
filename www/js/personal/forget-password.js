/********************************

 creator:dhc-jiangfeng
 create time:2016/2/25
 describe：找回密码Controller

 ********************************/

CYXApp.controller('forgetPasswordController', ['$scope', '$ionicHistory', '$state','ForgetPasswordService','$ionicPopup',
    function ($scope, $ionicHistory, $state,ForgetPasswordService,$ionicPopup) {
//第一部分 页面绑定的数据  写注释 根据需要 初始化
        $scope.forgetPasswordInfo={
            phone:'',
            valCode:'',
            newPwd:'',
            confirmPwd:''
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
        $scope.forgetPassword = function () {
            if ($scope.forgetPasswordInfo.phone.length == 0) {
                $ionicPopup.alert({
                    title: '提示',
                    template: '请输入手机号！'
                });
            } else if ($scope.forgetPasswordInfo.valCode.length == 0) {
                $ionicPopup.alert({
                    title: '提示',
                    template: '请输入验证码！'
                });
            } else if ($scope.forgetPasswordInfo.newPwd.length == 0) {
                $ionicPopup.alert({
                    title: '提示',
                    template: '请输入新密码！'
                });
            } else if($scope.forgetPasswordInfo.confirmPwd.length == 0){
                $ionicPopup.alert({
                    title: '提示',
                    template: '请再次确认新密码！'
                });
            } else {
                var params = {
                    phone: $scope.forgetPasswordInfo.phone,
                    valCode: $scope.forgetPasswordInfo.valCode,
                    newPwd: $scope.forgetPasswordInfo.newPwd,
                    confirmPwd:$scope.forgetPasswordInfo.confirmPwd
                };
                ForgetPasswordService.resetPassword(params).then(function (response) {
                    console.log('找回密码 response = ' + JSON.stringify(response));
                    if (!response.data) {
                        return;
                    }
                    var result = response.data;
                    if (result.code == 0) {
                        $state.go('login');
                    } else {
                        $ionicPopup.alert({
                            title: '提示',
                            template: result.message
                        });
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
 * 忘记密码Service
 * jiangfeng
 */
CYXApp.service('ForgetPasswordService', ['$http', 'UrlService', function ($http, UrlService) {
    this.resetPassword = function (requestParams) {
        var url = UrlService.getUrl('FORGET_PASSWORD');
        console.log('url = ' + url);
        return $http.post(url, requestParams);
    };
}]);