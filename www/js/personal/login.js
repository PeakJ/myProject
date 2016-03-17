/********************************

 creator:dhc-jiangfeng
 create time:2016/2/25
 describe：登录页面Controller

 ********************************/

CYXApp.controller('loginController', ['$scope', '$state', '$ionicHistory','LoginService','UserService','$ionicPopup','$localstorage','PopupService',

    function ($scope, $state, $ionicHistory,LoginService,UserService,$ionicPopup,$localstorage,PopupService) {
        //第一部分 页面绑定的数据  写注释 根据需要 初始化
        $scope.userInfo={
            phone:'',
            password:'',
            userId:''
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
        $scope.login = function () {
            if ($scope.userInfo.phone.length == 0) {
                $ionicPopup.alert({
                    title: '提示',
                    template: '请输入手机号！'
                });
            } else if (!(/^1[3|4|5|8|7][0-9]\d{8}$/.test($scope.userInfo.phone))) {
              PopupService.showMsg('手机号格式不正确');
            } else if ($scope.userInfo.password.length == 0) {
                $ionicPopup.alert({
                    title: '提示',
                    template: '请输入密码！'
                });
            }else{
                var params = {
                    phone: $scope.userInfo.phone,
                    password: $scope.userInfo.password
                };
                LoginService.login(params).then(function(response){
                    console.log('登录 response = ' + JSON.stringify(response));
                    if (!response.data) {
                      return;
                    }
                      var result = response.data;
                      if(result.code == 0){
                        var detail = result.data.detail;
                        //将后台传来的 用户信息 放到本地缓存，地址信息 放到本地缓存
                        $scope.userInfo={
                            userId:detail.id,
                            userName:detail.showName,
                            mobile:detail.mobile,
                            headImage:detail.logoPath,
                            sex:detail.sex,
                            address:detail.address,
                            email:detail.email,
                            areaId:detail.areaId,
                          provinceName :detail.provinceName,
                          cityName:detail.cityName,
                          areaName:detail.areaName
                        };
                        $localstorage.set('USER_PROVINCEID',detail.provinceId);
                        $localstorage.set('USER_CITYID',detail.cityId);
                        $localstorage.set('USER_AREAID',detail.areaId);
                        UserService.setUser($scope.userInfo);
                        $state.go('home');
                    }
                })
            }
        };
        //第四部分  ionic 事件 或者自定义事件的监听

    }]);

/**
 * 登录Service
 * jiangfeng
 */
CYXApp.service('LoginService', ['$http', 'UrlService', function ($http, UrlService) {
    this.login = function (requestParams) {
        var url = UrlService.getUrl('LOGIN');
        console.log('url = ' + url);
        return $http.post(url, requestParams);
    };
}]);
