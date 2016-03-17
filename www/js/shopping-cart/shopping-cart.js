/**
 * 购物车Controller
 *
 */
CYXApp.controller('shoppingCartController', ['$scope', 'ShoppingCartService', '$state', 'OrderPendingService', '$filter', '$ionicHistory', 'PopupService',
  'UserService',
  function ($scope, ShoppingCartService, $state, OrderPendingService, $filter, $ionicHistory, PopupService, UserService) {
    //所选商品索引
    var checkIndex = 0;
    //零售价合计
    var goodsTotalPrice = 0;
    //优惠券合计
    var goodsTotalCoupon = 0;
    //所选商品数量
    var goodsTotalCount = 0;
    //购物车数组
    $scope.shoppingCartData;
    //全选状态
    $scope.isAllSelected;
    //总共选择商品件数
    $scope.totalCount;
    //零售价合计
    $scope.goodsPriceToall;
    //抵值券合计
    $scope.couponPriceTotal;
    //默认购物车没有数据
    $scope.hadData = false;
    //var user = UserService.getUser();//用户ID
    //console.log("userID:" + user.userId);
    loadData();

    /**
     * 获取购物车数据
     */
    function loadData() {

        goodsTotalPrice = 0;
        goodsTotalCoupon = 0;
        goodsTotalCount = 0;
        var params = {
        };
        ShoppingCartService.getShoppingCartGoodsList(params).then(function (response) {
          //console.log('购物车列表 response = ' + JSON.stringify(response.data));
          if (!response.data) {
            //请求失败
            return;
          }
          var result = response.data;
          if (result.code == 0) {
            console.log('购物车列表 response = ' + JSON.stringify(response.data));
            $scope.shoppingCartData = result.data;
            $scope.isAllSelected = true;//默认全选
            var len = $scope.shoppingCartData.length;
            if (len > 0)
              $scope.hadData = true;

            goodsTotalCount = len;

            for (var i = 0; i < len; i++) {
              $scope.shoppingCartData[i].isSelected = true;//默认商品状态选中
              var goodCount = +$scope.shoppingCartData[i].amount;
              goodsTotalPrice = $scope.shoppingCartData[i].retaiPrice * goodCount + goodsTotalPrice;
              goodsTotalCoupon = $scope.shoppingCartData[i].couponAmount * goodCount + goodsTotalCoupon;
            }
            $scope.goodsPriceToall = goodsTotalPrice;
            $scope.couponPriceTotal = goodsTotalCoupon;
            $scope.totalCount = goodsTotalCount;
          }
        });

    }

    //输入数量变化监控
    $scope.onInputChange = function (index, count) {
      console.log("数量变化:" + count);
      if (count > 99999) {
        $scope.shoppingCartData[index].amount = 99999;
      } else if (count < 1) {
        $scope.shoppingCartData[index].amount = 1;
      }
      sumTotalPrice();
    };
    //选择商品
    $scope.checkGoods = function (selectIndex) {
      var len = $scope.shoppingCartData.length;//商品件数
      var selectGoods = $scope.shoppingCartData[selectIndex];//所选商品
      if (selectGoods.isSelected) {
        selectGoods.isSelected = false;
        //
        if ($scope.isAllSelected) {
          $scope.isAllSelected = false;
          $scope.goodsPriceToall = goodsTotalPrice - selectGoods.retaiPrice * selectGoods.amount;
          $scope.couponPriceTotal = goodsTotalCoupon - selectGoods.couponAmount * selectGoods.amount;
          $scope.totalCount = $scope.totalCount - 1;
          console.log("goodsTotalPrice:" + goodsTotalPrice);
        } else {
          sumTotalPrice();
        }
      } else {
        selectGoods.isSelected = true;
        checkIndex = selectIndex;
        sumTotalPrice();
        if (goodsTotalCount == len) {
          $scope.isAllSelected = true;

        }
      }

      // }
    };
    //减少商品数量
    $scope.onCountMinusClick = function (minusIndex) {
      $scope.shoppingCartData[minusIndex].amount--;
      if ($scope.shoppingCartData[minusIndex].amount < 1) {
        $scope.shoppingCartData[minusIndex].amount = 1;
      }
      sumTotalPrice();
    };
    //添加商品数量
    $scope.onCountAddClick = function (addIndex) {
      $scope.shoppingCartData[addIndex].amount++;
      if ($scope.shoppingCartData[addIndex].amount > 99999) {
        $scope.shoppingCartData[addIndex].amount = 99999;
      }
      sumTotalPrice();

    };
    //核算价格和优惠
    function sumTotalPrice() {
      goodsTotalPrice = 0;
      goodsTotalCoupon = 0;
      goodsTotalCount = 0;
      var len = $scope.shoppingCartData.length;
      for (var i = 0; i < len; i++) {
        var goodItem = $scope.shoppingCartData[i];
        if (goodItem.isSelected) {
          goodsTotalCount++;
          goodsTotalPrice = goodItem.retaiPrice * goodItem.amount + goodsTotalPrice;
          goodsTotalCoupon = goodItem.couponAmount * goodItem.amount + goodsTotalCoupon;
        }
      }
      $scope.goodsPriceToall = goodsTotalPrice;
      $scope.couponPriceTotal = goodsTotalCoupon;
      $scope.totalCount = goodsTotalCount;
    }

    /* 删除商品 */
    $scope.onDeleteGoodsClick = function (id) {
      var params = {
        shopcartIdList: id
      };
      ShoppingCartService.shoppingCartGoodsRemove(params).then(function (response) {
        if (!response.data) {
          return;
        }
        var result = response.data;
        if (result.code == 0) {
          PopupService.showMsg(result.data);
          loadData();//删除完刷新
        }
      });
    };
    //全选
    $scope.checkGoodsAll = function () {
      goodsTotalPrice = 0;
      goodsTotalCoupon = 0;
      goodsTotalCount = 0;
      if ($scope.isAllSelected) {
        $scope.isAllSelected = false;
        for (var i = 0, len = $scope.shoppingCartData.length; i < len; i++) {
          $scope.shoppingCartData[i].isSelected = false;

        }
        $scope.goodsPriceToall = 0;
        $scope.couponPriceTotal = 0;
        $scope.totalCount = 0;
      } else {
        $scope.isAllSelected = true;
        for (var i = 0, len = $scope.shoppingCartData.length; i < len; i++) {
          $scope.shoppingCartData[i].isSelected = true;
          goodsTotalCount = $scope.shoppingCartData.length;
          goodsTotalPrice = $scope.shoppingCartData[i].retaiPrice * $scope.shoppingCartData[i].amount + goodsTotalPrice;
          goodsTotalCoupon = $scope.shoppingCartData[i].couponAmount * $scope.shoppingCartData[i].amount + goodsTotalCoupon;
        }
        $scope.goodsPriceToall = goodsTotalPrice;
        $scope.couponPriceTotal = goodsTotalCoupon;
        $scope.totalCount = goodsTotalCount;
      }
    };
    /** 生成订单*/
    $scope.onBuildOrderClick = function () {
      console.log(goodsTotalCount);
      if($scope.shoppingCartData.length<=0){//购物车无商品
        PopupService.showMsg("购物车还没有商品请先逛逛吧");
        return;
      }
      if(goodsTotalCount==0){//没有选中的商品
        PopupService.showMsg("请至少选择一件商品在结算");
        return;
      }
      var goodsList=[];
      for (var i = 0, len = $scope.shoppingCartData.length; i < len; i++) {
        var goods = {
          goodsId: $scope.shoppingCartData[i].goodsId,
         amount:  $scope.shoppingCartData[i].amount,
          shopcartId: $scope.shoppingCartData[i].id
        }
        goodsList.push(goods);
      }
      var params = {
        goodsList: goodsList

      };
      console.log("goodsList"+goodsList);
      ShoppingCartService.createOrder(params).then(function (response) {
        console.log('生成订单 response = ' + JSON.stringify(response.data));
        if (!response.data) {
          return;
        }
        var result = response.data;
        if (result.code == 0) {
          console.log("订单生成成功");
          $state.go('myOrder.deal');
          //商品只有一件时直接生成二维码
          //if (goodsTotalCount == 1) {
          //  var orderData = result.data;
          //  var coupon = $filter('currency')(orderData.totalCoupon, '￥');
          //  OrderPendingService.createQRCode(orderData.orderCode, coupon, orderData.IMEI);
          //} else if (goodsTotalCount > 1) {//如果多见商品 跳转我的订单-待核销
          //  $state.go('myOrder.deal');
          //}
        }
      });

    };
    /*返回上一页*/
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
        //user = UserService.getUser();//用户ID
        //if (user && user.userId) {

          loadData();
        //} else {
        //  PopupService.showMsg("请先登录");
        //  // $state.go("login");//跳转登录页
        //  console.warn('userId undefined...')
        //}
        //console.log("userqID:" + user.userId);

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
 * 购物车Service
 *
 */
CYXApp.service('ShoppingCartService', ['$http', 'UrlService', 'UserService', '$state', 'PopupService', function ($http, UrlService, UserService, $state, PopupService) {


  //加载购物车
  this.getShoppingCartGoodsList = function (requestParams) {

    //var url = UrlService.getDebugUrl('GET_SHOPPING_CART_GOODS_INFO');
    var url = UrlService.getUrl('SHOPPING_CART_LIST');
    console.log('url = ' + url);
    return $http.post(url, requestParams);
  };
  //删除商品
  this.shoppingCartGoodsRemove = function (requestParams) {
    return $http.post(UrlService.getUrl('DEL_SHOPPING_CART'), requestParams);
  };
  //生成订单
  this.createOrder = function (requestParams) {
    var url = UrlService.getUrl('CREATE_ORDER');
    return $http.post(url, requestParams);
  };
  //立即购买
  this.buyNow = function (requestParams) {
    var url = UrlService.getUrl('BUY_NOW');
    return $http.post(url, requestParams);
  };
}]);
