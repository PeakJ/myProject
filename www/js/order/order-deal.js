/**
 * 优惠券核销Controller
 *
 */
CYXApp.controller('orderDealController', ['$scope', '$state','OrderDealService', '$cordovaBarcodeScanner', '$ionicHistory',
  function ($scope, $state,OrderDealService, $cordovaBarcodeScanner, $ionicHistory) {
 // 二维码扫描
  $scope.scanBarcode = function () {
    //$state.go("bunchInput");
    $cordovaBarcodeScanner.scan().then(function (imageData) {
      alert("format:" +imageData.format);
    	if(imageData.format=='IMEI'){
        $state.go("bunchInput");//切换串码输入
      }else if(imageData.format=='QR_CODE'){
    	getOrderInfo( imageData.text);
      }
      console.log("扫描信息:" +  imageData.text);
    }, function (error) {
      console.log("An error happened -> " + error);
    });
  };




// 测试用 临时设置收到扫描订单编号 111
  //getOrderInfo( "111");
  /**
   * 获取核销订单信息
   */
   function getOrderInfo(OrderNum) {
    console.log("ordeerNum:" + OrderNum);
	   alert("ordeerNum:" +OrderNum);
    OrderDealService.getOrderDealInfo(OrderNum).success(function (response, status, headers, config) {


        if (response.code == 0) {
          var result = response.data;
          var params = {
            "confirmOrderInfo":JSON.stringify(response.data)
          };
          $state.go("confirmOrder",params);
        }
      });
  }
    /** 返回上一页面 */
    $scope.goBack = function(){
      $ionicHistory.goBack();
    };

}]);


/**
 * 核销Service
 *
 */
CYXApp.service('OrderDealService', ['$http', 'UrlService', function ($http, UrlService) {

  //生成订单
  this.getOrderDealInfo=function(num){
    var param = {
      qrCode : num//
    };
    console.log('获取优惠券核销信息qrCode'+num);
    return $http.post(UrlService.getUrl('COUPON_VERIFY'), param);
  };

}]);
