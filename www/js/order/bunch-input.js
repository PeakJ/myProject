/**
 * 核销确认页面-串码输入Controller
 *
 */
CYXApp.controller('bunchInputController', ['$scope', 'OrderDealService','$ionicPopup', '$state','$timeout',
  'PopupService','$ionicHistory',
  function ($scope, OrderDealService,$ionicPopup, $state,$timeout,PopupService,$ionicHistory) {
    //串码
    $scope.inputData = {
      value: ''
    };
  /**
   * 确认待核销订单
   */
  $scope.goConfirmOrder=function () {

    console.log( $scope.inputData.value);

    OrderDealService.getOrderDealInfo($scope.inputData.value).success(function (response, status, headers, config) {


      if (response.code == 0) {
        var result = response.data;
        var params = {
          "confirmOrderInfo":JSON.stringify(response.data)
        };
        $state.go("confirmOrder",params);
      }
    });
  };
    /** 返回上一页面 */
    $scope.goBack = function(){
      $ionicHistory.goBack();
    };
  //切换二维码核销
  $scope.changeStatus=function(){
    $state.go("orderDeal");
    }

}]);


