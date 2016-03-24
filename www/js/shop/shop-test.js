//搜索服务

//var bbb =angular.module('ionic', ['ngAnimate', 'ngSanitize', 'ui.router']);
var im = angular.module('ionic');
cdfgApp.factory('ShopService',['$http','UrlService',function($http,UrlService){
    return {
        getShopSearchAssist:function(){
        },
        getShopPage:function(storeId){
            var url = UrlService.getUrl('HOME_LAYOUT'),
                params={
               'storeId':storeId
            };
            return $http.get(url,{params:params});
        }

    };
}]);

cdfgApp.controller('ShopTestController',['$scope','SearchService','PopupService','UrlService','$http',
    '$state','LocalCacheService','$stateParams','$window','$timeout','$ionicScrollDelegate',
    '$ionicHistory','StyleConfig','StyleForPlatform',
    'ShopService','$window','$ionicTabsDelegate','BrandService','$rootScope','ProductListService',
    function($scope,SearchService,PopupService,UrlService,$http,$state,LocalCacheService,
             $stateParams,$window,$timeout,
             $ionicScrollDelegate, $ionicHistory,StyleConfig,StyleForPlatform,ShopService,
             $window,$ionicTabsDelegate,BrandService,$rootScope,ProductListService){

        $scope.brandNum = '';
        $scope.prodNum = '';
        $scope.storeName = '';
        //由于 tabs 占了 50px的高度 view 需要加50
        $scope.viewHeight = {top:'-50px',height:new Number($window.innerHeight) +250};

        $scope.init = function(){
            //加载数据
            var url=UrlService.getUrl('HOME_LAYOUT');
            $http.get(url+"?storeId="+$stateParams.id,{cache:false}).success(function(d){
                if(!d){
                    //网络超时
                    return ;
                }
                $scope.$broadcast('scroll.refreshComplete');
                $scope.cmsData= d.data;
                $scope.brandNum = d.brandNum;
                $scope.prodNum = d.prodNum;
                $scope.storeName= d.storeName;
                $scope.backPic = d.backPic;
                if(d.data[0].type==0){
                    $scope.showSearchBar=true;
                }
            }).then(function(res){

                if(!res){  //网络未连接

                }
            });
        };
       $scope.init();
        $scope.myGoBack = function(){
            $ionicHistory.goBack();
        };

        $scope.shopHeader = {top:44,width:'100%'};
   //     $scope.shopContent = {top:296};
        $scope.tabsY = "tabsDown";
        //动画方法， 向上推出header 图片 图片高200,200-44 =156 content

        $scope.css3up = function(){
            $scope.shopHeader = {top:'-156px',width:'100%'};
         //   $scope.shopContent = {top:'96px'};
            $scope.viewHeight = {top:'-250px',height:new Number($window.innerHeight) +250};
        //    $scope.tabsY = "tabsUp";

        }
        $scope.css3down = function(){
            $scope.shopHeader = {top:'44px',width:'100%'};
         //   $scope.shopContent = {top:'296px'};
            $scope.viewHeight = {top:'-50px',height:new Number($window.innerHeight) +250};
          //  $scope.tabsY = "tabsDown";
        };
        $scope.tabsAnimate = 'cdfg-animate-down';
        $scope.isUp = false;
        $ionicTabsDelegate.select(3);
        var t1Scroll =  $ionicScrollDelegate.$getByHandle('t1');//从左至右 这个滚动区域代理
        var t2Scroll =  $ionicScrollDelegate.$getByHandle('t2');
        var t3Scroll =  $ionicScrollDelegate.$getByHandle('t3');
        var t4Scroll =  $ionicScrollDelegate.$getByHandle('t4');
        var tArray = [0,t1Scroll,t2Scroll,t3Scroll,t4Scroll];
        var brandAlphabet = document.getElementById('brand-alphabet');
        $scope.scroll = function(index){
            var y = tArray[index].getScrollPosition().top;
            console.log("---->"+y);
          if(y>20){
              //if(!$scope.isUp){
              //    $ionicScrollDelegate.scrollTop(0);
              //}
              $scope.css3up();
              console.log("aaaaauuuuppp");
              $scope.tabsAnimate = 'cdfg-animate-up';
            $scope.isUp =true;
              if(index == 3){

                  if(brandAlphabet) brandAlphabet.style.opacity = 1;
              }else{
                  if(brandAlphabet) brandAlphabet.style.opacity = 0;
              }
          }
            else{
              $scope.css3down();
              console.log("aaddddooowwwnnn");
              $scope.isUp = false;
              $scope.tabsAnimate = 'cdfg-animate-down';
              if(brandAlphabet) brandAlphabet.style.opacity = 0;
          }
        };
        $scope.shopId = $stateParams.id;
      //通过广播 实现 子scope 调用 父scope 事件
        $rootScope.$on("toShopProductList",function(event,data){
            $ionicTabsDelegate.select(1);
            $scope.param.brand= undefined;
            $scope.param.keywords = undefined;
            $scope.param.sc = [{id:data.typeId}];//设置店内分类
            $scope.initData();
        });

        //免税店分类 页面的指令配置对象
        $scope.category ={shopId: $scope.shopId};

        //转到品牌店
        $scope.goBrand = function(){
            $scope.param = {
                storeId : $scope.shopId
            }
            BrandService.brandsList($scope.param,'reco')
                .success(function (data, status, headers, config) {

                    //网络异常、服务器出错
                    if(!data || data == CDFG_NETWORK_ERROR){
                        $scope.networkError = true;
                        return;
                    }
                    $scope.networkError = false;

                    $scope.commends = data;
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
        $scope.goBrand();
        //brandto 跳转到全部商品
        $scope.goShopBrandId = function(storeId){
            //$scope.param.brand
            $ionicTabsDelegate.select(1);
            $scope.param.sc = undefined;
            $scope.param.brand =[{id:storeId}];
            $scope.param.keywords =undefined;
            $scope.initData();
        };
        //联网是失败点击重新加载
        $scope.restartPage = function(){
            $scope.goBrand();
        };
        // 字母索引
        $scope.scrollTo = function (top) {
            t3Scroll.scrollTo(0, top-51, true);
        };

        $scope.headerStyle = StyleConfig.header;
        $scope.searchInputStyle = StyleConfig.searchInput;
        $scope.headerLeftArrowStyle = StyleConfig.headerLeftArrow;
        $scope.leftArrow = StyleForPlatform.getStyle('leftArrow');

        $scope.productList ={shopId: $scope.shopId};

        //搜索指令的设置
        $scope.query = {tag:'',
            isShowSearch:false,
            hasPopularDiv:false,
            hasHistoryDiv:false,
            shopId:$stateParams.id, //路由中的id 是shopId
            urlParam:{
                shopId:$stateParams.shopId
            },
            varInDirective:{
                shopId:$stateParams.shopId
            },
            goTo:'shopProductList',
            isBroadCast:'true'
        };
        $scope.showSearch = function(){
            $scope.query.isShowSearch = true;
        };
        //seachto
        $rootScope.$on('searchInShop',function(event,data){
            $timeout(function(){
                $ionicTabsDelegate.select(1);
              //  $scope.param.sc = undefined;
            //    $scope.param.brand =undefined;
                $scope.param.keywords = data.word;
                $scope.initData();
            },10);

        });

    }]);
