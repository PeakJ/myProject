/********************************

 creater:haosijia@cdfg.com.cn
 create time:2015/06/17
 describe：品牌街
 modify time:2015/06/17

 ********************************/
/*
 Service 服务
 */
cdfgApp.factory('BrandService', ['$http','UrlService',function ($http,UrlService) {
    return {

        // 获取品牌列表页
        brandsList: function (params,reco) {

            if(reco == 'reco'){
                params = angular.extend({reco:1}, params);
                console.log(params)
                return $http.post(UrlService.getUrl('BRAND'),params);
            }else{
                console.log(params)
                return $http.post(UrlService.getUrl('BRAND'),params);
            }

            //return $http.get('datas/products.json');
        }

    }
}]);

/* directive模块指令 */

//点击全部品牌判断滑动方向改变页面位置
cdfgApp.directive('cdfgScrollSwipe', [function factory() {
    return {
        restrict: 'A',
        scope: false,
        link: function($scope, $el, $attrs){
            var nStartY,nChangY,
                brandAlphabet = document.getElementById('brand-alphabet'),
                brandMenu = document.getElementById('brand-menu');
            $el.on('touchstart',function(e){
                nStartY = e.targetTouches[0].pageY;
            });
            $el.on('touchend',function(e){
                nChangY = e.changedTouches[0].pageY;
                if(nChangY<nStartY){
                    $scope.scrollTo(brandMenu.offsetTop);
                    brandAlphabet.style.opacity = 1;
                }else{
                    $scope.scrollTo(0);
                    brandAlphabet.style.opacity = 0;
                }
            });
        }
    }
}]);


/* controller模块指令 */
cdfgApp.controller('BrandController', ['$scope', '$http', '$ionicNavBarDelegate', '$ionicScrollDelegate','$timeout','BrandService','CartService','$stateParams', function ($scope, $http, $ionicNavBarDelegate, $ionicScrollDelegate,$timeout,BrandService,CartService,$stateParams) {
    //高亮当前nav导航
    $scope.tabNav={curNav:'brand'};

    angular.extend($scope, {
        param: {
            channel:1
        }
    });

    //刷新购物车数字
    $scope.$on('$ionicView.enter', function () {
        //导航购物车数字
        $scope.cartInfo=CartService.getCartTotal();
    });

    /*$scope.goBack = function () {
        $ionicNavBarDelegate.back();
    };*/
    // 字母索引
    var scroll = $ionicScrollDelegate.$getByHandle('brand-scroll');
    $scope.scrollTo = function (top) {
        scroll.scrollTo(0, top, true);
    };

    /*if($scope.storeId){
        $scope.param.storeId = 1;//$scope.storeId
    };*/


    //by xuf 下拉刷新页面
    $scope.refresh = function(){
        //window.location.reload(true);
        $scope.brandFn();
        $scope.$broadcast('scroll.refreshComplete');
    };

    $scope.networkError = false;//不显示网络错误
    $scope.restartPage = function(){
        $scope.brandFn();
    };
    //获取推荐品牌
    $scope.brandFn = function(){
        BrandService.brandsList($scope.param,'reco')
            .success(function (data, status, headers, config) {

                //网络异常、服务器出错
                if(!data || data == CDFG_NETWORK_ERROR){
                    $scope.networkError = true;
                    return;
                }
                $scope.networkError = false;

                $scope.commends = data;

                for (i in $scope.commends) {
                    var commend = $scope.commends[i];
                    commend.href = '#/productList/brand/' + commend.id + '/' + encodeURIComponent(commend.enName) + '//view';
                }
            })
            .error(function (data, status, headers, config) {
                    PopupService.alertPopup(CDFG_NETWORK_ERROR);
            });
        //获取品牌列表
        $timeout(function () {

                BrandService.brandsList($scope.param)
                    .success(function (data, status, headers, config) {
                        if(!data || data == CDFG_NETWORK_ERROR){
                            return;
                        }
                        /* 排序 */
                        data.sort(function (a, b) {
                            return a.enName.toUpperCase() > b.enName.toUpperCase() ? 1 : -1;
                        });

                        /* 组合数组 */
                        $scope.brandList = data;

                        $scope.letter = []; //用于存放字母的空数组
                        $scope.curCart = null;


                        $scope.isShowTitle = function (item) {
                            if($scope.brandList.length <= 1){
                                var type = true;
                            }else{
                                var type = false;
                            }
                            var newCart = item.enName.charAt(0).toUpperCase();
                            newCart != $scope.curCart ? type = true : null;
                            if (type) $scope.curCart = newCart;
                            //添加字母到数组中
                            if ($scope.letter.indexOf($scope.curCart) == -1) $scope.letter.push($scope.curCart);
                            return type;
                        };

                        //console.log($scope.letter);

                    })
                    .error(function (data, status, headers, config) {
                        PopupService.alertPopup(CDFG_NETWORK_ERROR);
                    });
        }, 500);
    };

    $scope.brandFn();


    var brandAlphabet = document.getElementById('brand-alphabet');

    angular.extend($scope, {
        //滑过屏幕推荐品牌显示隐藏动画
        logoTouch : function($event){
            $scope.opacity = true;
        },
        logoRelease : function($event){
            $scope.opacity = false;
        },
        //索引菜单显示与隐藏
        alphabetHide : function($event){
            if(brandAlphabet) brandAlphabet.style.opacity = 0;
        },
        alphabetShow : function($event){
            if(brandAlphabet) brandAlphabet.style.opacity = 1;
        }

    });

}]);





