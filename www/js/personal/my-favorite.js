/*
 * 我的收藏Controller
 **/

CYXApp.controller('myFavoriteController', ['$scope',  '$state', 'CollectService','PopupService','$ionicHistory','$ionicTabsDelegate',
  function ($scope,  $state,CollectService,PopupService, $ionicHistory, $ionicTabsDelegate) {

    $scope.collectGoodsList;//收藏商品数据
    $scope.collectShopsList;//收藏店铺数据
    $scope.goodsPageNo = 1;//收藏商品页码
    $scope.pageSize = 10;//每页显示数量
    $scope.goodsSumTotal = 0;//收藏商品总条数
    $scope.shopsPageNo = 1;//收藏店铺页码
    $scope.shopsSumTotal = 0;//收藏店铺总条数
    $scope.hasMoreGoods=false;
    $scope.hasMoreStores = false;
    var upGoodsFlag = false;//是否加载更多
    var upStoresFlag = false;//是否加载更多
  /**
   * 获取收藏商品信息
   */
  function loadCollectGoodsData(upGoodsFlag,params) {
    CollectService.collectGoodsList(params).then(function (response) {
      console.log('收藏商品 response = ' + JSON.stringify(response.data));
      if (!response.data) {
        //请求失败
        return;
      }
      var result = response.data;
      if (result.code == 0) {
        if(upGoodsFlag){
          $scope.collectGoodsList =  $scope.collectGoodsList.concat(result.data);

        }else{
          $scope.goodsPageNo=1;
          $scope.collectGoodsList = result.data;
        }
        $scope.goodsSumTotal=result.sumTotal;
        console.log(" $scope.sumTotal:"+  $scope.goodsSumTotal+";;"+( $scope.goodsSumTotal/$scope.pageSize));
        if( $scope.goodsSumTotal/$scope.pageSize>= $scope.goodsPageNo ){
          $timeout(function(){
            $scope.hasMoreGoods=true;
          },1000);

        }else{
          $scope.hasMoreGoods=false;
          console.log("没有更多数据了");
        }
        console.log("是否还有更多数据"+$scope.hasMoreGoods);
      }
      if(upGoodsFlag){
        $scope.$broadcast('scroll.infiniteScrollComplete');
      }
    });

  }
    //加载更多店铺
    $scope.loadMoreStores = function(){

      $scope.shopsPageNo++;
      console.log('more ....pageNo--'+ $scope.shopsPageNo);
      var params={
        pageNo: $scope.shopsPageNo,//页码
        displayCount: $scope.pageSize//每页显示数量
      };
      loadCollectShopsData(true, params);
    };
    //加载更多商品
    $scope.loadMoreGoods = function(){
      $scope.goodsPageNo++;
      console.log('more ....pageNo--'+ $scope.goodsPageNo);
      var params={
        pageNo: $scope.goodsPageNo,//页码
        displayCount: $scope.pageSize//每页显示数量
      };
      loadCollectGoodsData(true, params);
    };
  /**
   * 获取收藏店铺信息
   */
  function loadCollectShopsData(upStoresFlag,params) {
    CollectService.collectShopList(params).then(function (response) {
      console.log('收藏店铺 response = ' + JSON.stringify(response.data));
      if (!response.data) {
        //请求失败
        return;
      }
      var result = response.data;
      if (result.code == 0) {
        if(upStoresFlag){
          $scope.collectShopsList =  $scope.collectShopsList.concat(result.data);

        }else{
          $scope.shopsPageNo=1;
          $scope.collectShopsList = result.data;
        }
        $scope.shopsSumTotal=result.sumTotal;
        console.log(" $scope.shopsSumTotal:"+  $scope.shopsSumTotal+";;"+( $scope.shopsSumTotal/$scope.pageSize));
        if( $scope.shopsSumTotal/$scope.pageSize>= $scope.shopsPageNo ){
          $timeout(function(){
            $scope.hasMoreStores=true;
          },1000);

        }else{
          $scope.hasMoreStores=false;
          console.log("没有更多数据了");
        }
        console.log("是否还有更多数据"+$scope.hasMoreGoods);
      }
      if(upStoresFlag){
        $scope.$broadcast('scroll.infiniteScrollComplete');
      }
    });
  }

  /* 取消收藏商品 */
  $scope.onCancelCollectGoodsClick = function(goodId){
    var params = {
      goodsId:  goodId
    };
    CollectService.cancelCollectGoods(params).then(function(response){
      if(!response.data){
        return;
      }
      var result = response.data;
      if(result.code == 0){
        PopupService.showMsg(result.data);
        var params = {
          pageNo: 1,//页码
          displayCount:$scope.pageSize //每页显示数量

        };
        loadCollectGoodsData(false, params);
      }
    });
  };


  /* 取消收藏店铺 */
  $scope.onCancelCollectShopClick = function(shopId){

    var params = {
      storeId:shopId
    };
    CollectService.cancelCollectShop(params).then(function(response){
      if(!response.data){
        return;
      }
      var result = response.data;
      if(result.code == 0){
        console.log("删除成功");
        PopupService.showMsg(result.data);
        var params = {
          pageNo: 1,//页码
          displayCount:$scope.pageSize //每页显示数量

        };
        loadCollectShopsData(false, params);
      }
    });
  };

    /*返回上一页*/
    $scope.goBack = function () {
      if(!$ionicHistory.backView()){
        $state.go('home');
        return;
      }
      ($ionicHistory.backView() && $ionicHistory.backView().url.indexOf('login') > 0) ? $ionicHistory.goBack(-2) : $ionicHistory.goBack();
    };

  /* 跳转到商品详细页面 */
  $scope.onGoodsDetailClick = function(goodsId){
    var params = {
      goodsId: goodsId
    };
    $state.go('goodsDetail',params);
  };
  /* 跳转到店铺详情 */
  $scope.onShopDetailClick = function(shopId){
    var params = {
      shopId:shopId
    };
    $state.go('shopHome',params);
  };
    $scope.$on('$ionicView.beforeEnter', function (e, v) {
      if(v.direction == 'back'){//不需要刷新
      }else {
        $scope.goodsPageNo = 1;
        var params = {
          pageNo: 1,//页码
          displayCount:$scope.pageSize //每页显示数量
        };
        loadCollectGoodsData(false, params);
      }
    });

    $scope.selectTab = function () {
      if($scope.tabSelectedTimes !==0){
        //需要loadData
      //  console.log('当前是第几个tab'+ $ionicTabsDelegate.selectedIndex());
        //update 各个tab 的slidebox
        switch ($ionicTabsDelegate.selectedIndex()){
          case 0:
            console.log('当前是第几个tab'+ $ionicTabsDelegate.selectedIndex());
            $scope.goodsPageNo = 1;
            var params = {
              pageNo: 1,//页码
              displayCount:$scope.pageSize //每页显示数量

            };
            loadCollectGoodsData(false, params);
                break;
          case 1:
            console.log('当前是第几个tab'+ $ionicTabsDelegate.selectedIndex());
            $scope.shopsPageNo = 1;
            var params = {
              pageNo: 1,//页码
              displayCount:$scope.pageSize //每页显示数量

            };
            loadCollectShopsData(false, params);
                break;

        }
      }
      $scope.tabSelectedTimes++;
    };
}]);



