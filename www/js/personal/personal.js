/**
 * PersonalController
 * Created by ZCP on 2015/6/25.
 */
cdfgApp.controller('PersonalController', ['$rootScope', '$scope', 'UserService', 'UrlService', '$http', '$state', '$ionicViewSwitcher', 'PersonalService', 'PopupService', 'CartService',
    function ($rootScope, $scope, UserService, UrlService, $http, $state, $ionicViewSwitcher, PersonalService, PopupService, CartService) {

        //高亮当前nav导航
        $scope.tabNav = {curNav: 'personal'};


        $scope.$on('$ionicView.enter', function () {
            $scope.init();
            //alert(JSON.stringify($scope.localUser));
        });
        $scope.init = function () {
            //导航购物车数字
            $scope.cartInfo = CartService.getCartTotal();

            $scope.orderBadge = {
                'waitPay': 0,//待付款
                'waitSend': 0,//待发货
                'waitReceive': 0,//待收货
                'waitAppraisal': 0,//待评价
                'sellGoods': 0//售后
            };

            $scope.localPersonalUser = UserService.getUser();
            console.log($scope.localPersonalUser.nickName);
            PersonalService.getOrderListStatus()
                .success(function (response, status, headers, config) {
                    console.log(response);
                    if (response.code == 1) {
                        $scope.orderBadge.waitPay = response.data.unpay;
                        $scope.orderBadge.waitSend = response.data.send;
                        $scope.orderBadge.waitReceive = response.data.receive;
                        $scope.orderBadge.waitAppraisal = response.data.comment;
                        $scope.orderBadge.sellGoods = response.data.after;
                    } else if (response.code == -101) {
                        $state.go('login',{last:'personal'});
                    }
                })

        };


        $scope.goFavourite = function () {
            $state.go('favourite');
        };
        $scope.goAccount = function () {
            $state.go('account');
        };
        $scope.goMessage = function () {
            $state.go('message');
        };
        $scope.goFeedback = function () {
            $state.go('feedback');
        };
        $scope.goSetting = function () {
            $state.go('setting');
        };

        //跳转到【我的优惠券】页面
        $scope.goCouponList = function () {
            console.log('个人中心-->我的优惠券');
            $ionicViewSwitcher.nextDirection('forward');
            $state.go('coupon-list');
        };

        //跳转到【中免卡】画面
        $scope.goCardList = function () {
            $ionicViewSwitcher.nextDirection('forward');
            console.log('个人中心-->中免卡');
            $state.go('card-list');
        };

        $scope.goOrderAll = function () {
            console.log('个人中心-->我的订单');
            $ionicViewSwitcher.nextDirection('forward');
            $state.go('order-list', {reload: true});
        };

        //todo 等待接口
        /*
         //获取订单数据，订单的badge
         $http({
         method: 'POST',
         data: {channel: '', userInfo: '', userId: '', ticket: ''},
         url: UrlService.getUrl('GUESS_LIST')
         }).success(function (response, status, headers, config) {
         $scope.orderBadge = response;
         }).error(function (response, status, headers, config) {
         //do  anything what you want;
         });
         */

        /*//猜你喜欢数据
         $http.get(UrlService.getUrl('GUESS_LIST')).success(function (response) {
         console.log(response);
         $scope.guessProduct = response;
         });*/
    }]);


/**
 * service
 */
cdfgApp.service('PersonalService', ['$http', 'UserService', 'UrlService', function ($http, UserService, UrlService) {
    this.getOrderListStatus = function () {
        return $http.post(UrlService.getUrl('PERSONAL_FRONT_PAGE'))
    };

}]);