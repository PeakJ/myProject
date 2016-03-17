/**
 * 核销确认页面Controller
 *
 */
CYXApp.controller('confirmOrderController', ['$scope', 'ConfirmOrderService', '$ionicPopup', '$state', '$timeout', '$stateParams',
  'PopupService', '$ionicHistory','OrderDealService',
  function ($scope, ConfirmOrderService, $ionicPopup, $state, $timeout, $stateParams, PopupService, $ionicHistory,OrderDealService) {
    $scope.qrCode = $stateParams.qrCode;//获取核销信息

    console.log("参数："+ $scope.qrCode);

    /**
     * 核销订单
     */
    $scope.onConfirmOrderClick = function () {
      console.log('orderId  ');
      var params = {
        orderId: $scope.orderInfo.orderId
      };
      console.log('orderId  = ' + params.orderId);
      ConfirmOrderService.confirmOrder(params).then(function (response) {
        //console.log('确认待核销订单 response = ' + JSON.stringify(response.data));
        if (!response.data) {
          return;
        }
        var result = response.data;
        if (result.code == 0) {
          PopupService.showMsg("订单核销成功");
          $state.go("orderRecord");//跳转核销记录页
          console.log('确认待核销订单'+result.data);
        }
      });
    };

    /**
     * 获取核销订单信息
     */
    function loadData() {
      OrderDealService.getOrderDealInfo( $scope.qrCode).then(function (response){
        console.log('获取优惠券核销信息 response = ' + JSON.stringify(response.data));
        var result = response.data;
        if (result.code == 0) {
          $scope.orderInfo=result.data;

          $scope.goodsInfo=$scope.orderInfo.detailList[0];
        }
      });
    };
    /** 返回上一页面 */
    $scope.goBack = function () {
      if (!$ionicHistory.backView()) {
        $state.go('home');
        return;
      }
      ($ionicHistory.backView() && $ionicHistory.backView().url.indexOf('login') > 0) ? $ionicHistory.goBack(-2) : $ionicHistory.goBack();
    };

    $scope.$on('$ionicView.beforeEnter', function (e, v) {
      if (v.direction == 'backward') {//不需要刷新
      } else {
        loadData();
      }
    });
  }]);

/**
 * 核销确认Service
 *
 */
CYXApp.service('ConfirmOrderService', ['$http', 'UrlService', function ($http, UrlService) {
   //核销订单
  this.confirmOrder = function (requestParams) {
    var url = UrlService.getUrl('VERIFY_CONFIRM');
    return $http.post(url, requestParams);
  };

}]);
