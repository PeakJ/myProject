/**
 * 店铺首页Controller
 * Created by jiangfeng on 2016/2/16.
 *
 */
CYXApp.controller('shopHomeController', ['$scope', 'ShopHomeService', '$ionicHistory', '$ionicPopup', 'CollectService',
    'PopupService','$state','$sce','$stateParams',
    function ($scope, ShopHomeService, $ionicHistory, $ionicPopup, CollectService, PopupService,$state,$sce,$stateParams) {
        //第一部分 页面绑定的数据  写注释 根据需要 初始化
        $scope.shopInfo;//店铺信息
        $scope.storeId= $stateParams.shopId;
        var userId='m001';
        //第二部分 必备方法
        $scope.loadData=function(){
            var params={
                storeId: $scope.storeId
            };
            ShopHomeService.getShopInfo(params).then(function (response) {
                console.log('店铺首页 response = ' + JSON.stringify(response.data));
                if (!response.data) {
                    //请求失败
                    return;
                }
                var result = response.data;
                if (result.code == 0) {
                    $scope.shopInfo = result.data;
                    $scope.shopInfo.description=$sce.trustAsHtml(result.data.description);
                }
            });
        };
        //第三部分 相应事件的方法 ,命名或者用业务含义 比如 submit，toDetail
        //调用手机电话功能
        $scope.callPhone = function () {
            var confirmPopup = $ionicPopup.confirm({
                title: '提示',
                template: '是否拨打' + $scope.shopInfo.telephone + '?',
                subTitle: '', // String (可选)。弹窗的副标题。
                templateUrl: '', // String (可选)。放在弹窗body内的一个html模板的URL。
                cancelText: '取消', // String (默认: 'Cancel')。一个取消按钮的文字。
                cancelType: '', // String (默认: 'button-default')。取消按钮的类型。
                okText: '确定', // String (默认: 'OK')。OK按钮的文字。
                okType: '' // String (默认: 'button-positive')。OK按钮的类型。
            });
            confirmPopup.then(function (res) {
                if (res) {
                    window.location.href = "tel:" + $scope.shopInfo.phoneNumber;
                } else {
                    console.log('取消拨打');
                }
            });
        };
        /* 收藏店铺 */
        $scope.collectShop = function () {
            if($scope.shopInfo.collected == true)
            return;
            var params = {
                storeId: $scope.shopInfo.id
            };
            CollectService.collectShop(params).then(function (response) {
                if (!response.data) {
                    return;
                }
                var result = response.data;
                if (result.code == 0) {
               //     $scope.shopInfo.collectCount=$scope.shopInfo.collectCount + 1;
                //    $scope.shopInfo.collected = true;
                    PopupService.showMsg("收藏成功");
                  $scope.loadData();
                }else{
                  PopupService.showMsg(result.message);
                }
            });
        };

        /* 取消收藏店铺 */
        $scope.cancelCollectShop = function () {
            if($scope.shopInfo.collected == false)
                return;
            var params = {
                storeId: $scope.shopInfo.id
            };
            CollectService.cancelCollectShop(params).then(function (response) {
                if (!response.data) {
                    return;
                }
                var result = response.data;
                if (result.code == 0) {
                    if($scope.shopInfo.collectCount > 0){
                        $scope.shopInfo.collectCount=$scope.shopInfo.collectCount - 1;
                        $scope.shopInfo.collected = false;
                        PopupService.showMsg("取消收藏成功");
                    }
                }else{
                  PopupService.showMsg(result.message);
                }
            });
        };

        /* 分享 */
        $scope.toShare = function () {
            var title = $scope.shopInfo.shopName,
                content = $scope.shopInfo.shopName + '百姓认可，让您放心！',
                pic = $scope.shopInfo.brandImage,
                url = 'https://baidu.com';
            if (window.umeng) {
                alert(title + content + pic + url);
                window.umeng.share(title, content, pic, url);
            } else {
                alert('分享失败');
            }
        };

        //返回
        $scope.goBack = function(){
            //$ionicHistory.goBack();
            //判断wap是否能获取到上一页路由 没有则返回首页
            if(!$ionicHistory.backView()){
                $state.go('home');
                return;
            }
            ($ionicHistory.backView() && $ionicHistory.backView().url.indexOf('login') > 0) ? $ionicHistory.goBack(-2) : $ionicHistory.goBack();
        };
        //第四部分  ionic 事件 或者自定义事件的监听
        $scope.$on('$ionicView.beforeEnter',function(e,v){
            $scope.loadData();

        });

        $scope.$on('$ionicView.afterLeave',function(e,v){


        });

        $scope.$on('$destroy', function() {
          //  $scope.modal.remove();
        });
    }]);


/**
 * 店铺首页Service
 * jiangfeng
 */
CYXApp.service('ShopHomeService', ['$http', 'UrlService', function ($http, UrlService) {
    this.getShopInfo = function (requestParams) {
        var url = UrlService.getUrl('SHOP_HOME_INFO');
        console.log('url = ' + url);
        return $http.post(url, requestParams);
    };
}]);
