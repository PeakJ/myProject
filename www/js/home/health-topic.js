/**
 * 健康专栏商品列表
 * Created by geshuo on 2016/2/16.
 */
CYXApp.controller('healthTopicController',['$scope','HealthService','$stateParams','$ionicHistory','CollectService','$timeout','GoodsService',
  function($scope,HealthService,$stateParams,$ionicHistory,CollectService,$timeout,GoodsService){

    $scope.searchParams ={};
    $scope.pageNo = 0;
    $scope.pageSize = 5;
    $scope.goodsList ;
    $scope.hasMore;
    $scope.gpsCity = '210100';// 从本地缓存中获取的定位城市 //默认沈阳

    //以下参数由路由提供， 从首页进入时传来
    $scope.name = $stateParams.name;
    $scope.id = $stateParams.id;
    $scope.imgPath = $stateParams.imgPath;
    $scope.introduction = $stateParams.introduction;

    $scope.goodPicForTest ='data/temp-img/goods-img1.png';

    $scope.init = function(){

      $scope.hasMore = false;
      $scope.pageNo = 1;
      $scope.pageSize = 5;
      $scope.goodsList =[];

      loadData();
    };
    //加载初始数据   more 是否是 加载更多
    function loadData(more){
      var reqParam = {
        cityId:$scope.gpsCity,
        pageNo:$scope.pageNo,
        displayCount:$scope.pageSize
      };//准备参数
      GoodsService.getGoodsList(reqParam).then(function(response){
        if(!response.data){
          return;
        }
        var result = response.data;
        if(result.code == 0){
          if(result.data.isNoneForLocal){
            console.log('定位的城市没有商品，返回默认城市 沈阳的 商品');
          }
          if(more){
            $scope.pageNo ++ ;
            $scope.goodsList =  $scope.goodsList.concat(result.data.goodsList);
          }else{
            $scope.goodsList = result.data.goodsList;
          }
          $timeout(function(){
            $scope.totalPage = Math.ceil(result.sumTotal/$scope.pageSize);
            $scope.hasMore = $scope.pageNo < $scope.totalPage;
          },500);

        }else {
          console.log(result.message);
        }
        $scope.$broadcast('scroll.infiniteScrollComplete');
      });
    }
    $scope.loadData = loadData;

    $scope.doSearch = function(){

    };


    /* 跳转到商品详细页面 */
    $scope.toGoodsDetail = function(goodsId){
      var params = {
        goodsId:goodsId
      };
      $state.go('goodsDetail',params);
    };

    /* 收藏商品 */
    $scope.collectGoods = function(goodsId){
      var params = {
        goodsId:goodsId
      };
      CollectService.collectGoods(params).then(function(response){
        if(!response.data){
          return;
        }
        var result = response.data;
        if(result.code == 0){
          PopupService.showMsg(result.data);
        }
      });
    };

    /* 取消收藏商品 */
    $scope.cancelCollectGoods = function(goodsId){
      var params = {
        goodsId:goodsId
      };
      CollectService.cancelCollectGoods(params).then(function(response){
        if(!response.data){
          return;
        }
        var result = response.data;
        if(result.code == 0){
          PopupService.showMsg(result.data);
        }
      });
    };

    /*返回上一页*/
    $scope.goBack = function () {
      //$ionicViewSwitcher.nextDirection('back');
      $ionicHistory.goBack();
      //($ionicHistory.backView() && $ionicHistory.backView().url.indexOf('login') > 0) ? $ionicHistory.goBack(-2) : $ionicHistory.goBack();
    };

    $scope.$on('$ionicView.beforeEnter',function(e,v){
      if(v.direction == 'back'){//不需要刷新
      }else{
        //需要刷新
        $scope.init();
      }
    });

    $scope.$on('$ionicView.afterLeave',function(e,v){

    });
    $scope.$on('$destroy', function() {

    });
}]);

/**
 * 健康专栏Service
 * by geshuo 20160216
 */
CYXApp.service('HealthService', ['$http', 'UrlService', function ($http, UrlService) {
  this.getTopicGoodsList = function (requestParams) {
    var url = UrlService.getDebugUrl('HEALTH_TOPIC_GOODS');
    return $http.get(url,requestParams);
  };
}]);
