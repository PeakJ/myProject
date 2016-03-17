/**
 * 商品搜索
 * Created by geshuo on 2016/2/16.
 */
CYXApp.controller('goodsSearchController',['$scope','GoodsService','$ionicHistory','$state',
  function($scope,GoodsService,$ionicHistory,$state){

  loadData();

  //加载初始数据
  function loadData(){
    $scope.searchParams = {};
    getFirstCategory();
  }

  /* 获取一级商品分类列表 */
  function getFirstCategory(){
    GoodsService.getFirstCategoryList().then(function(response){
      //console.log('获取分类列表 response = ' + JSON.stringify(response));
      if(!response.data){
        return;
      }
      var result = response.data;
      if(result.code == 0){
        $scope.firstCatList = result.data;
        if($scope.firstCatList.length > 0){
          $scope.showSecondCatList($scope.firstCatList[0]);
        }
      }else {
        //TODO: 错误处理
      }

      //若一级类型list长度为0，默认左侧高度10px
      var h = $scope.firstCatList? $scope.firstCatList.length * 54+10 : 10;
      $scope.leftScrollHeight = {'height': h + 'px'};
    });
  }

  /* 显示二级分类列表 */
  $scope.showSecondCatList = function(categoryItem){
    $scope.activeItem = categoryItem;
    var param ={
      parentId:categoryItem.id
    };
    GoodsService.getSecondCategoryList(param).then(function(response){
      //console.log('获取分类列表 response = ' + JSON.stringify(response));
      if(!response.data){
        return;
      }
      var result = response.data;
      if(result.code == 0){
        $scope.secondCatList = result.data;
      }else {
        //TODO: 错误处理
      }
    });
  };

  /* 跳转到商品列表 */
  $scope.toGoodsList = function(categoryId){
    if(categoryId){
      $scope.searchParams.categoryId = categoryId;
    }
    $state.go('goodsList',$scope.searchParams);
  };

  /*返回上一页*/
  $scope.goBack = function () {
    //$ionicViewSwitcher.nextDirection('back');
    $ionicHistory.goBack();
    //($ionicHistory.backView() && $ionicHistory.backView().url.indexOf('login') > 0) ? $ionicHistory.goBack(-2) : $ionicHistory.goBack();
  };
}]);

/**
 * 健康专栏Service
 * by geshuo 20160216
 */
CYXApp.service('GoodsService', ['$http', 'UrlService', function ($http, UrlService) {
  this.getFirstCategoryList = function () {
    var param ={
      parentId:-1
    };
    var url = UrlService.getUrl('FIRST_CATEGORY');
    return $http.post(url,param);
  };

  this.getSecondCategoryList = function (requestParams) {
    var url = UrlService.getUrl('SECOND_CATEGORY');
    return $http.post(url,requestParams);
  };

  this.getGoodsList = function (requestParams) {
    var url = UrlService.getUrl('SEARCH_GOODS_LIST');
    return $http.post(url,requestParams);
  };

  /* 获取商品详情 */
  this.getGoodsDetail = function (requestParams) {
    var url = UrlService.getUrl('GOODS_DETAIL');
    return $http.post(url,requestParams);
  };

  /* 获取商品售卖药店列表 */
  this.getGoodsShopList = function (requestParams) {
    var url = UrlService.getUrl('GOODS_SALES_SHOP');
    return $http.post(url,requestParams);
  };

  /* 获取商品亮点 */
  this.getGoodsIntroduction = function (requestParams) {
    var url = UrlService.getDebugUrl('GOODS_INTRODUCTION');
    return $http.get(url,requestParams);
  };

  /* 获取商品说明书 */
  this.getGoodsAttr = function (requestParams) {
    var url = UrlService.getDebugUrl('GOODS_ATTR');
    return $http.get(url,requestParams);
  };

  /* 获取商品说明书 */
  this.addToShoppingCart = function (requestParams) {
    var url = UrlService.getUrl('ADD_TO_SHOPPING_CART');
    return $http.post(url,requestParams);
  };
}]);
