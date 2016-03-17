/**
 * 商品详情页面
 * Created by geshuo on 2016/2/16.
 */
CYXApp.controller('goodsDetailController',['$scope','GoodsService','$ionicHistory','$stateParams','$timeout',
  '$ionicSlideBoxDelegate','$ionicPopup','CollectService','PopupService','$state','ShoppingCartService',
  'OrderPendingService','$ionicScrollDelegate',
  function($scope,GoodsService,$ionicHistory,$stateParams,$timeout,$ionicSlideBoxDelegate,$ionicPopup,
           CollectService,PopupService,$state,ShoppingCartService,OrderPendingService,$ionicScrollDelegate){

  loadData();

  //加载初始数据
  function loadData(){
    $scope.goodsId = $stateParams.goodsId;
    $scope.activeTab = 0;
    $scope.buyParams = {
      count:1
    };
    changeMinusImg();

    getGoodsDetail();

    getShopList();

   // getGoodsIntroduction();

  //  getGoodsAttr();
  }

  /* 获取商品详情 */
  function getGoodsDetail(){
    var params = {
      goodsId:$scope.goodsId
    };
    GoodsService.getGoodsDetail(params).then(function(response){
      //console.log('获取商品详情 response = ' + JSON.stringify(response));
      if(!response.data){
        return;
      }
      var result = response.data;
      if(result.code == 0){
        $scope.goodsData = result.data;
        $timeout(function(){
          $ionicSlideBoxDelegate.$getByHandle('picHandle').update();
        },500);
      }else {
        //TODO: 错误处理
      }
    });
  }

  /* 获取商品售卖药店列表 */
  function getShopList(){
    var params = {
      goodsId:$scope.goodsId
    };
    GoodsService.getGoodsShopList(params).then(function(response){
      //console.log('获取商品售卖药店列表 response = ' + JSON.stringify(response));
      if(!response.data){
        return;
      }
      var result = response.data;
      if(result.code == 0){
        $scope.shopList = result.data;
      }else {
        //TODO: 错误处理
      }
    });
  }

  /* 获取商品亮点 */
  function getGoodsIntroduction(){
    var params = {
      goodsId:$scope.goodsId
    };
    GoodsService.getGoodsIntroduction(params).then(function(response){
      //console.log('获取商品亮点 response = ' + JSON.stringify(response));
      if(!response.data){
        return;
      }
      var result = response.data;
      if(result.code == 0){
        $scope.goodsIntro = $sce.trustAsHtml(result.data.introduction);
      }else {
        //TODO: 错误处理
      }
    });
  }

  /* 获取商品说明书 */
  function getGoodsAttr(){
    var params = {
      goodsId:$scope.goodsId
    };
    GoodsService.getGoodsAttr(params).then(function(response){
      //console.log('获取商品说明书 response = ' + JSON.stringify(response));
      if(!response.data){
        return;
      }
      var result = response.data;
      if(result.code == 0){
        $scope.goodsAttr = result.data;
      }else {
        //TODO: 错误处理
      }
    });
  }

  /* 切换tab */
  $scope.changeTab = function(index){
    $scope.activeTab = index;
    $ionicScrollDelegate.$getByHandle('detailHandle').resize();
  };

  //调用手机电话功能
  $scope.callPhone=function(phoneNumber){
    var confirmPopup = $ionicPopup.confirm({
      title: '提示',
      template: '是否拨打'+phoneNumber+'?',
      subTitle: '', // String (可选)。弹窗的副标题。
      templateUrl: '', // String (可选)。放在弹窗body内的一个html模板的URL。
      cancelText: '取消', // String (默认: 'Cancel')。一个取消按钮的文字。
      cancelType: '', // String (默认: 'button-default')。取消按钮的类型。
      okText: '确定', // String (默认: 'OK')。OK按钮的文字。
      okType: '' // String (默认: 'button-positive')。OK按钮的类型。
    });
    confirmPopup.then(function(res) {
      if(res) {
        window.location.href="tel:" + phoneNumber;
      } else {
        console.log('取消拨打');
      }
    });
  };

  /* 收藏商品 */
  $scope.collectGoods = function(goodsId){
    var params = {
      goodsId:$scope.goodsId
    };
    CollectService.collectGoods(params).then(function(response){
      if(!response.data){
        return;
      }
      var result = response.data;
      if(result.code == 0){
        PopupService.showMsg(result.data);
        loadData();
      }
    });
  };

  /* 取消收藏商品 */
  $scope.cancelCollectGoods = function(){
    var params = {
      goodsId:$scope.goodsId
    };
    CollectService.cancelCollectGoods(params).then(function(response){
      if(!response.data){
        return;
      }
      var result = response.data;
      if(result.code == 0){
        PopupService.showMsg(result.data);
        loadData();
      }
    });
  };

  /* 修改购买数量 */
  $scope.changeCount = function(count){
    var newCount = $scope.buyParams.count + count;
    if(newCount > 0){
      $scope.buyParams.count = newCount;
      changeMinusImg();
    }
  };

  function changeMinusImg(){
    $scope.minusImg = $scope.buyParams.count==1?'img/goods-un-minus.png':'img/goods-minus.png';
  }

    /* 跳转到店铺首页 */
    $scope.toShopHome = function (shopId) {
      var params = {
        shopId: shopId
      };
      $state.go('shopHome', params);
    };
  /* 跳转到店铺地图页面 */
  $scope.toShopMap = function(address){
    var params = {
      address:address
    };
    $state.go('shopMap',params);
  };

  /* 加入购物车 */
  $scope.addToShoppingCart = function(){
    var params = {
      goodsId:$scope.goodsId,
      amount:$scope.buyParams.count
    };
    GoodsService.addToShoppingCart(params).then(function(response){
      if(!response.data){
        return;
      }
      var result = response.data;
      if(result.code == 0){
        PopupService.showMsg(result.data);
      }
    });
  };

  /* 生成订单  调用立即购买*/
  $scope.createOrder = function(){
    console.log('生成订单  createOrder -------------');
    var plist = [{

    }];
    var param={
      goodsId:$scope.goodsId,
      amount:$scope.buyParams.count
    };

    ShoppingCartService.buyNow(param).then(function(response){
      if(!response.data){
        //请求失败
        return;
      }
      var result = response.data;
      if(result.code == 0){
        //提交订单成功，我的 订单的待核销订单
        var orderData = result.data;


      //  OrderPendingService.createQRCode( orderData.orderCode,orderData.coupon);
      } else {
        //TODO: 错误处理
      }
    });
  };

  /* 跳转到购物车页面 */
  $scope.toShoppingCart = function(){
    $state.go('shoppingCart');
  };

  /* 分享 */
  $scope.toShare = function(){
    var title = $scope.goodsData.goodsName + ' 仅售' + $scope.goodsData.price + '元，限时特惠',
        content = '机不可失，快来抢购吧',
        pic = $scope.goodsData.pictureList[0].picUrl,
        url = 'https://baidu.com';
    if (window.umeng) {
      alert(title + content + pic + url);
      window.umeng.share(title, content, pic, url);
    } else {
      alert('分享失败');
    }
  };

  /* 跳转到地图页面 */
  $scope.toMap = function(keywords){
    var params = {
        keywords:keywords
    };
    console.log('params = ' + JSON.stringify(params));
    $state.go('goodsMap',params);
  };

  /*返回上一页*/
  $scope.goBack = function () {
    //$ionicViewSwitcher.nextDirection('back');
    $ionicHistory.goBack();
    //($ionicHistory.backView() && $ionicHistory.backView().url.indexOf('login') > 0) ? $ionicHistory.goBack(-2) : $ionicHistory.goBack();
  };
}]);
