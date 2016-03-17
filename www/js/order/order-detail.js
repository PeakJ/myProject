/**
 *订单详情Controller
 *
 */
CYXApp.controller('orderDetailController', ['$scope', 'OrderDetailService','$ionicPopup', '$state','$timeout' ,'$stateParams','$ionicHistory',
  function ($scope, OrderDetailService,$ionicPopup, $state,$timeout,$stateParams,$ionicHistory) {


    $stateParams.orderId;//订单id
    $scope.orderInfo;//记录信息
   console.log("订单号ID:"+$stateParams.orderId);
    loadData();
  /**
   * 获取记录详细
   */
  function loadData() {
    var params={
      orderId:$stateParams.orderId
    };
    OrderDetailService.getRecordDetail(params).then(function (response) {
      if (!response.data) {
        //请求失败
        console.log('请求失败 ');
        return;
      }
      var result = response.data;
      if (result.code == 0) {
        console.log('记录详细 response = ' + JSON.stringify(response.data));
        $scope.orderInfo = result.data;
        $scope.goodsInfo=  $scope.orderInfo.detailList[0]
      }
    });
  }
    /** 返回上一页面 */
    $scope.goBack = function(){
      if(!$ionicHistory.backView()){
        $state.go('home');
        return;
      }
      ($ionicHistory.backView() && $ionicHistory.backView().url.indexOf('login') > 0) ? $ionicHistory.goBack(-2) : $ionicHistory.goBack();
    };

    $scope.$on('$ionicView.beforeEnter', function (e, v) {
      if(v.direction == 'backward'){//不需要刷新
      }else {

        loadData();
      }
    });
}]);

/**
 * 记录详情Service
 *
 */
CYXApp.service('OrderDetailService', ['$http', 'UrlService', function ($http, UrlService) {
  //获取记录详细
  this.getRecordDetail = function (requestParams) {
    var url = UrlService.getUrl('RECORD_DETAIL');
    return $http.post(url, requestParams);
  };



}]);
