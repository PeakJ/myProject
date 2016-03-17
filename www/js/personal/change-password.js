/********************************

 creator:dhc-jiangfeng
 create time:2016/2/24
 describe：修改密码Controller

 ********************************/

CYXApp.controller('changePasswordController',['$scope','$ionicHistory','$state',
    function($scope,$ionicHistory,$state){
        //第一部分 页面绑定的数据  写注释 根据需要 初始化
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
        $scope.changePassword = function () {
            console.log("修改密码");
        };
        //第四部分  ionic 事件 或者自定义事件的监听

}]);