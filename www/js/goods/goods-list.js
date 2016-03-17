/**
 * 商品列表页面
 * Created by geshuo on 2016/2/16.
 */
CYXApp.controller('goodsListController',['$scope','GoodsService','$ionicHistory','$stateParams','$state',
  'CollectService','PopupService','$timeout',
  function($scope,GoodsService,$ionicHistory,$stateParams,$state,CollectService,PopupService,$timeout){

    //搜索 带着 前一个页面 的参数 ，二级id 和关键字
    // 二级id 只有当从分类页的搜索按钮点击跳到此页面 二级id 为空
    $scope.searchParams ={};
    $scope.pageNo = 0;
    $scope.pageSize = 5;
    $scope.goodsList ;
    $scope.hasMore;
    $scope.gpsCity = '210100';// 从本地缓存中获取的定位城市 //默认沈阳

    $scope.goodPicForTest ='data/temp-img/goods-img1.png';

    $scope.init = function(){
      $scope.searchParams.keywords = $stateParams.keywords;
      $scope.searchParams.categoryId = $stateParams.categoryId;
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
    if($scope.searchParams.keywords){
      reqParam.name = $scope.searchParams.keywords;
    }
    if($scope.searchParams.categoryId){
      reqParam.category2Id=$scope.searchParams.categoryId
    }
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
        $scope.init();
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
