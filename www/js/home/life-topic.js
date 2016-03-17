/**
 * 生活专题店铺列表
 * Created by geshuo on 2016/2/16.
 */
CYXApp.controller('lifeTopicController',['$scope','LifeService','$stateParams','$ionicHistory','$state','CollectService',
  function($scope,LifeService,$stateParams,$ionicHistory,$state,CollectService){

  loadData();

  //加载初始数据
  function loadData(){
    $scope.viewTitle = $stateParams.name;

    getTopicShops();
  }

  /**
   * 获取专栏数据
   * */
  function getTopicShops(){
    LifeService.getTopicShopList().then(function(response){
      if(!response.data){
        return;
      }

      var result = response.data;
      if(result.code == 0){
        $scope.lifeData = result.data;
      } else {
        //TODO 错误处理
      }
    });
  }

  /* 跳转到店铺首页 */
  $scope.toShopHome = function(shopId){
    var params = {
      shopId:shopId
    };
    $state.go('shopHome',params);
  };

  /* 跳转到个人中心页面 */
  $scope.toPersonalCenter = function(){
    $state.go('personalCenter');
  };

  /* 收藏店铺 */
  $scope.collectShop = function(shopId){
    var params = {
      shopId:shopId
    };
    CollectService.collectShop(params).then(function(response){
      if(!response.data){
        return;
      }
      var result = response.data;
      if(result.code == 0){
        PopupService.showMsg(result.data);
      }
    });
  };

  /* 收藏店铺 */
  $scope.cancelCollectShop = function(shopId){
    var params = {
      shopId:shopId
    };
    CollectService.cancelCollectShop(params).then(function(response){
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
}]);

/**
 * 健康专栏Service
 * by geshuo 20160216
 */
CYXApp.service('LifeService', ['$http', 'UrlService', function ($http, UrlService) {
  this.getTopicShopList = function (requestParams) {
    var url = UrlService.getDebugUrl('LIFE_TOPIC_SHOPS');
    return $http.get(url,requestParams);
  };
}]);
