/**
 * 我的订单-待核销Controller
 *
 */

CYXApp.controller('dealOrderController', ['$scope', 'OrderPendingService', '$ionicPopup', '$state', '$timeout', '$filter', '$ionicHistory','$ionicScrollDelegate',
  function ($scope, OrderPendingService, $ionicPopup, $state, $timeout, $filter, ionicHistory,$ionicScrollDelegate) {

    $scope.hasData=false;//默认列表无数据
    $scope.hasMoreData=false;//默认不加载下拉刷新
    $scope.dealOrderListData;//未核销订单数据
    $scope.pageNo = 1;//页码
    $scope.pageSize = 5;//每页数据条数
    $scope.sumTotal = 0;//数据总条数
    var upDataFlag=false;//是否加载更多

    /** 获取待核销订单 upDataFlag true:加载更多；false：默认初始化数据 ；pageNo：页码*/
    function loadData(upDataFlag,pageNo) {
      var params ={
        orderState:'00', //订单状态：00-待核销、10-已核销
        pageNo:pageNo,//页码
        displayCount:$scope.pageSize//每页数据条数

      };
      OrderPendingService.getPendingOrderList(params).then(function (response) {
        console.log('我的订单-待核销 response = ' + JSON.stringify(response.data));
        if (!response.data) {
          //请求失败
          return;
        }
        var result = response.data;
        if (result.code == 0) {
         if(upDataFlag){
           $scope.dealOrderListData =  $scope.dealOrderListData.concat(result.data);

         }else{
           $scope.pageNo=1;
           $scope.hasData=true;
           $scope.dealOrderListData = result.data;
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
  //  下拉刷新
    $scope.loadMore = function(){
      $scope.pageNo++;
      loadData( true, $scope.pageNo);
      console.log('more ....pageNo--'+ $scope.pageNo);

    };

    /** 返回上一页面 */
    $scope.goBack = function () {
      if (!$ionicHistory.backView()) {
        $state.go('home');
        return;
      }
      ($ionicHistory.backView() && $ionicHistory.backView().url.indexOf('login') > 0) ? $ionicHistory.goBack(-2) : $ionicHistory.goBack();
    };
    /** 生成优惠 */
    $scope.onBuildCouponClick = function (orderNum, couponTotal, IMEI) {


      //生成优惠券 （参数：订单号，抵值券，串码）
      OrderPendingService.createQRCode(orderNum, couponTotal, IMEI);

    }
    $scope.$on('$ionicView.beforeEnter', function (e, v) {
      if(v.direction == 'backward'){//不需要刷新
      }else{
       loadData( false,1);

      }
    });
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
  }]);

/**
 * 待核销订单Service
 *
 */

CYXApp.service('OrderPendingService', ['$http', 'UrlService', function ($http, UrlService) {
//获取未核销订单
  this.getPendingOrderList = function (requestParams) {
    var url = UrlService.getUrl('ORDER_LIST');
    return $http.post(url, requestParams);
  };
  this.createQRCode = function (orderNum, coupon, IMEI) {
    //二维码生成
    $('body').qrcodeBox({
      orderNum: orderNum,//订单号
      coupon: coupon,//抵值券
      IMEI: IMEI,//串码
      des: "请销售员或者店主使用手机扫码进行二维码扫描进行优惠券核销",
      //offsetY:'0.1px',
      qrcodeText: utf16to8(IMEI)

    });
  };
  /** 转码 */
  function utf16to8(str) {
      var out, i, len, c;
      out = "";
      len = str.length;
      for (i = 0; i < len; i++) {
        c = str.charCodeAt(i);
        if ((c >= 0x0001) && (c <= 0x007F)) {
          out += str.charAt(i);
        } else if (c > 0x07FF) {
          out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
          out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
          out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
        } else {
          out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
          out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
        }
      }
      return out;
  }
}]);
