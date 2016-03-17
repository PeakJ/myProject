/**
 * 已核销订单Controller
 *
 */
CYXApp.controller('completedOrderController', ['$scope',  '$state', '$ionicScrollDelegate', '$ionicHistory',
  '$timeout','OrderPendingService',
  function ($scope,  $state, $ionicScrollDelegate, $ionicHistory,$timeout,OrderPendingService) {

    $scope.completedOrderListData;// 已核销订单数据
    $scope.hasData=false;//默认列表无数据
    $scope.hasMoreData=false;//默认不加载下拉刷新
    $scope.pageNo = 1;//页码
    $scope.pageSize = 5;//每页数据条数
    $scope.sumTotal = 0;//数据总条数
    var upDataFlag=false;//是否加载更多


    /**
     * 获取已核销订单
     */
    function loadData(upDataFlag,pageNo) {
      var params ={
        orderState:'10', //订单状态：00-待核销、10-已核销
        pageNo:pageNo,//页码
        displayCount:$scope.pageSize//每页数据条数

      };
      OrderPendingService.getPendingOrderList(params).then(function (response) {
        console.log('我的订单-已核销 response = ' + JSON.stringify(response.data));
        if (!response.data) {
          //请求失败
          return;
        }
        var result = response.data;
        if (result.code == 0) {
          if(upDataFlag){
            $scope.completedOrderListData =  $scope.completedOrderListData.concat(result.data);

          }else{
            $scope.pageNo=1;
            $scope.hasData=true;
            $scope.completedOrderListData = result.data;
            $ionicScrollDelegate.resize();
          }


          $scope.sumTotal=result.sumTotal;
          console.log(" $scope.sumTotal:"+ $scope.sumTotal+";;"+($scope.sumTotal/$scope.pageSize));
          if($scope.sumTotal/$scope.pageSize>=$scope.pageNo ){
            $timeout(function(){
              $scope.hasMoreData=true;
            },1000);

          }else{
            $scope.hasMoreData=false;
            console.log("没有更多数据了");
          }
          console.log("是否还有更多数据"+$scope.hasMoreData);
        }
        if(upDataFlag){
          $scope.$broadcast('scroll.infiniteScrollComplete');
        }
      });
    }


    /** 返回上一页面 */
    $scope.goBack = function () {
      if(!$ionicHistory.backView()){
        $state.go('home');
        return;
      }
      ($ionicHistory.backView() && $ionicHistory.backView().url.indexOf('login') > 0) ? $ionicHistory.goBack(-2) : $ionicHistory.goBack();
    };

    $scope.loadMore = function(){
      $scope.pageNo++;
      loadData( true, $scope.pageNo);
      console.log('more ....pageNo--'+ $scope.pageNo);
    };
    /* 跳转到商品详细页面 */
    $scope.onGoodsDetailClick = function (goodsId) {
      var params = {
        goodsId: goodsId
      };
      $state.go('goodsDetail', params);
    };
    $scope.$on('$destroy', function () {
      console.log("-----------$destroy-------");
    });

    /** 返回顶部 */
    $scope.onOrderScrollTop = function () {
      $ionicScrollDelegate.scrollTop();
    }
    $scope.$on('$ionicView.beforeEnter', function (e, v) {
      if(v.direction == 'backward'){//不需要刷新
      }else{
        loadData( false,1);

      }
    });
  }]);


