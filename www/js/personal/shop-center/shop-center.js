/*
 * 药店中心Controller
 * wangshuang 20160218
 **/

CYXApp.controller('shopCenterController', ['$scope', 'ShopCenterService', '$ionicHistory', '$cordovaBarcodeScanner', '$state', 'OrderDealService', '$stateParams',
  '$ionicPopup', 'UserService',
  function ($scope, ShopCenterService, $ionicHistory, $cordovaBarcodeScanner, $state, OrderDealService, $stateParams, $ionicPopup, UserService) {
    $scope.role = $stateParams.role;//角色信息
    $scope.headImg=$stateParams.headImg//用户头像
    console.log("药店中心角色信息:" + $scope.role);
    console.log("药店中心用户头像:" +   $scope.headImg);
    //$scope.role = 2;//模拟角色信息
    $scope.orderCode = {oc: ""};//串码号
    $scope.ishide = false;
    var user;
    //加载数据
    function loadData() {
      var params = {
        //userId: user.userId
      };
      //console.log("params:" + params.userId);
      ShopCenterService.getShopCenterList(params).then(function (response) {
        var result = response.data;
        if (result.code == 0) {
          console.log('药店中心 response = ' + JSON.stringify(response.data));
          $scope.shopCenterData = result.data;
        }
        //注意对请求失败的状态原因 区分处理 ，
        if ('net-error') {

        } else if ('500') {

        }

      }).finally(function (response) {


      });

    };
    //跳转积分信息
    $scope.onIntegralClick = function () {

      $state.go('integral', {score:$scope.shopCenterData.score, headImg:$scope.headImg});
    };
    // 开启二维码扫描
    $scope.onOrderDealClick = function () {
      // barcodeScanner();
      popShow();

    };
    //二维码扫描
    function barcodeScanner() {
      if(!$cordovaBarcodeScanner){
       //插件 还没加载好
        return;
      }

      $cordovaBarcodeScanner.scan().then(function (imageData) {
        //alert("format:" +imageData.format);
        if (imageData.format == 'IMEI') {
          //$state.go("bunchInput");//切换串码输入
          popShow();
        } else if (imageData.format == 'QR_CODE') {
          getOrderInfo(imageData.text);
        }
      }, function (error) {
        console.log("An error happened -> " + error);
      });

    }

    // 自定义串码输入弹出框
    function popShow() {
      $ionicPopup.show({
        templateUrl: './templates/common/popup/order-barcode-popup.html',
        title: '输入二维码下方串码，进行核销',
        cssClass: 'cyxOrderPopup', // 通过在 父 级div 加class 改变 ionic 的popup 层的样式
        subTitle: '',
        scope: $scope,
        buttons: [
          {
            text: '取消',
            type: 'cyx-barcode-pop-left-btn'
          },
          {
            text: '确定',
            type: 'cyx-barcode-pop-center-btn',
            onTap: function () {
              if ($scope.orderCode.oc == "") {
                alert("输入二维码下方串码，进行核销");
                popShow();
              } else {
                console.log("串码："+$scope.orderCode.oc);
                getOrderInfo($scope.orderCode.oc);
              }

            }
          },
          {
            text: '切换二维码扫描',
            type: 'cyx-barcode-pop-right-btn',
            onTap: function () {
              barcodeScanner();
            }
          }
        ]
      });

      //myPopup.then(function(res) {
      //    console.log('Tapped!', res);
      //});

    }


    /**
     * 获取核销订单信息
     */
    function getOrderInfo(OrderNum) {
      console.log("ordeerNum:" + OrderNum);
      OrderDealService.getOrderDealInfo(OrderNum).then(function (response){
        console.log('获取优惠券核销信息 response = ' + JSON.stringify(response.data));
        var result = response.data;
        if (result.code == 0) {
          var params = {
            //confirmOrderInfo: JSON.stringify(response.data)
            qrCode: OrderNum
          };
          $state.go("confirmOrder", params);//跳转核销确认页面
        }
      });
    };

    //返回上一页
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
 * 药店中心Service
 * by wangshuang 20160218
 */
CYXApp.service('ShopCenterService', ['$http', 'UrlService', function ($http, UrlService) {
  this.getShopCenterList = function (requestParams) {
    var url = UrlService.getUrl('SHOP_CENTER');
    console.log('url = ' + url);
    return $http.post(url, requestParams);
  };
}]);
