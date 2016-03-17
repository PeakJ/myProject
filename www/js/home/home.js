/*
 * 首页Controller
 * geshuo 20160216
 **/

CYXApp.controller('homeController', ['$scope', 'HomeService', '$ionicSlideBoxDelegate', '$timeout', '$ionicHistory',
  '$ionicModal', '$state', 'CollectService', 'PopupService', '$cordovaGeolocation', '$ionicTabsDelegate',
  '$stateParams','$ionicLoading','$localstorage',
  function ($scope, HomeService, $ionicSlideBoxDelegate, $timeout, $ionicHistory, $ionicModal, $state, CollectService,
            PopupService, $cordovaGeolocation, $ionicTabsDelegate, $stateParams,$ionicLoading,$localstorage) {

    if(ionic.Platform.version() >= 7 && ionic.Platform.platform().indexOf('ios') != -1 && window.cordova){
      //ios header 里的 图标需要加个top值
      $scope.headerPerson = {width:"18px",height: "20px","margin-top": "26px","margin-right": "10px"};
      $scope.headerSearch = {width: "18px","margin-top":"26px","margin-right":"25px"};
      $scope.headerCity = {"margin-top":"25px"};
      $scope.homeTabbar = {"margin-top":"1rem"};
      $scope.homeTabbar = true;
      $scope.homeTabContent = {"background-color": "#efefef","margin-top":"20px"};
    }else{
      $scope.headerSearch = {width: "18px","margin-top":"6px","margin-right":"25px"};
      $scope.headerPerson = {width:"18px",height: "20px","margin-top": "6px","margin-right": "10px"};
      $scope.headerCity = {};
      $scope.homeTabbar = false;
      $scope.homeTabContent = {"background-color": "#efefef"};
    }

    $scope.tabSelectedTimes = 0;// 每次 tab的on-select 执行 时加一, $scope 销毁时 归零
    //作用 每次初始化首页时 触发loadData 方法 ，切换tab时触发on-select 也触发loadData
    //初始化时 会触发on-select方法 导致 loadData 连续执行了2次， on-select 在方法内判断$scope.tabSelectedTimes为0时，不触发loadData请求

    $scope.healthBanner ='data/temp-img/10.png';
    $scope.lifeBanner = 'data/temp-img/5.png';
    $scope.goodsImg = 'data/temp-img/11.png';
    $scope.shopImg='data/temp-img/15.png';
    $scope.healthTopicImg ='data/temp-img/14.png';
    $scope.lifeTopicImg ='data/temp-img/14.png'; // 为了使页面有图片

    $scope.currentCity = '沈阳';
    $scope.postCode = $localstorage.get('GPS_POSTCODE')?$localstorage.get('GPS_POSTCODE'):'210100';  //城市区码 默认 每次调用 getCityInfo 时更新，调用失败时 默认是沈阳区号

    $scope.healthAdList ;//健康轮播图 数组
    $scope.healthGoodsList ;//健康 产品  数组 ；
    $scope.healthTopicList; //健康专题数组
    $scope.healthPageNo = 1;
    $scope.healthPageSize = 10;
    $scope.sumTotalHealth = 0;
    $scope.healthHasMore = false;//获得数据后 再赋值

    $scope.lifeAdList ;//生活轮播图 数组
    $scope.lifeGoodsList ;//生活 产品  数组 ；
    $scope.lifeTopicList; //生活专题数组
    $scope.lifePageNo = 1;
    $scope.lifePageSize = 10;
    $scope.sumTotallife = 0;
    $scope.lifeHasMore = false;

    $scope.VIPList ;//生活轮播图 数组
    $scope.VIPGoodsList ;//生活 产品  数组 ；
    //  $scope.VIPTopicList; //生活专题数组 vip 没有专题
    $scope.VIPPageNo = 1;
    $scope.VIPPageSize = 10;
    $scope.sumTotalVIP = 0;
    $scope.VIPHasMore = false;

    //初始化方法 首先 得到地址信息 得到地址后 再loadData
    $scope.init = function(){
       // getCityInfo();
    };

    $scope.getNoPageData = function(tabIndex){
      var param ={
        channel:0
      };
      if(tabIndex ==1){ //生活
        param ={
          channel:'10',
          cityId:'210100'
        };
      }else if(tabIndex ==2){//vip
        param ={
          channel:'20',
          cityId:'210100'
        };
      }else {
        param ={
          channel:'00', //健康
          cityId:'210100'
        };
      }
      HomeService.getNoPageData(param).then(function (response) {
        if (!response.data) {
          //请求失败
          return;
        }
        var result = response.data;
        if (result.code == 0) {

          if(tabIndex ==1){ //生活
            $scope.lifeAdList = result.data.bannerList;
            $scope.lifeTopicList = result.data.seminarList;
          }else if(tabIndex ==2){//vip

          }else {//健康
            $scope.healthAdList = result.data.bannerList;
            $scope.healthTopicList = result.data.seminarList;
          }
        }else{

        }
        $ionicSlideBoxDelegate.$getByHandle('healthAdHandle').update();
        $ionicSlideBoxDelegate.$getByHandle('lifeAdHandle').update();
      }).finally(function(){


      })
    };
    /*loadData 方法 获取 数据  根据 当前激活的tab 调取相关的接口
     *  掉 两个 接口  一个轮播图 一个商品列表
     *  参数 获取哪个tab 页的数据
     */
    function loadData(indexOfTab) {console.log('home-load-data');

      $scope.getNoPageData(indexOfTab);
      //  getPageData(indexOfTab);
      if(indexOfTab ===0){//获取健康 数据 list
        $scope.healthPageNo =1;
        $scope.healthHasMore = false;
        var param ={};
        $scope.getGoodsList(false);
      }else if(indexOfTab ===1){//获取生活 数据 现 轮播，后list
        $scope.lifePageNo =1;
        $scope.lifeHasMore = false;
      }else if(indexOfTab ===2){//获取vip数据 现 轮播，后list
        $scope.VIPPageNo =1;
        $scope.VIPHasMore = false;
      }else{
        console.warn('home tab index is undefined ');
      }
    }

    //加载商品列表 参数 是否是加载更多
    $scope.getGoodsList = function(more){
      var param ={
        pageNo:1,
        displayCount:5,
        cityId:'210100'
      };
      HomeService.getHealthGoods(param).then(function (response) {
        //console.log('获取健康频道商品 response = ' + JSON.stringify(response.data));
        if (!response.data) {
          //请求失败
          return;
        }
        var result = response.data;console.log('请求返回');
        if (result.code == 0) {
          if(!more){
            $scope.healthGoodsList = result.data;
          }else{//加载更多
            $scope.healthGoodsList =$scope.healthGoodsList.concat(result.data);
          }
          $timeout(function(){
            $scope.totalPage = Math.ceil(result.sumTotal/$scope.healthPageSize);
            $scope.healthHasMore = $scope.healthPageNo < $scope.totalPage;
          },500);
        }
      });
    };

    $scope.selectTab = function () {
      console.log('当前是第几个tab'+ $ionicTabsDelegate.selectedIndex());

      //需要loadData
      var xx = $ionicTabsDelegate.$getByHandle('homeTab');
      loadData($ionicTabsDelegate.selectedIndex());
      //update 各个tab 的slidebox

      $scope.tabSelectedTimes++;
    };

    $scope.getCityInfo = getCityInfo;
    //获取用户所在城市信息
    function getCityInfo() {
      $ionicLoading.show({ template:'正在定位....'});
      return $cordovaGeolocation.getCurrentPosition()
        .then(function (position) {
          var lnglatXY = [position.coords.longitude, position.coords.latitude]; //已知点坐标
          if (typeof AMap != 'undefined') {
            var geocoder = new AMap.Geocoder({
              radius: 1000,
              extensions: "all"
            });
            geocoder.getAddress(lnglatXY, function (status, result) {
              if (status === 'complete' && result.info === 'OK') {
                var city = '';
                if (result.regeocode.addressComponent.city) {
                  city = result.regeocode.addressComponent.city;
                } else {
                  city = result.regeocode.addressComponent.province;
                }
                $scope.postCode= result.regeocode.addressComponent.adcode;//需要传给后台作为查询条件
                $scope.currentCity = city.substring(0, city.length - 1);
                console.log('返回地址信息 = ' + JSON.stringify(result));
              }else{
                console.warn('高德地图调用地图失败');
              }
              loadData(0);
              $ionicLoading.hide();
            });
          }
        }, function (error) {
          console.log('定位失败');
          PopupService.showMsg('定位失败');
          loadData(0);
          $ionicLoading.hide();
        });
    }


    /* 获取生活频道店铺列表 todo  */
    function getLifeList() {
      HomeService.getLifeShopList().then(function (response) {
        //console.log('获取生活频道店铺列表 response = ' + JSON.stringify(response.data));
        if (!response.data) {
          //请求失败
          return;
        }
        var result = response.data;
        if (result.code == 0) {
          $scope.lifeShopList = result.data;
        }
      });
    }

    /*获取城市列表*/
    function getCityList() {
      var param ={
      };
      HomeService.getCityList(param).then(function (response) {
        //console.log('获取城市列表 response = ' + JSON.stringify(response.data));
        if (!response.data) {
          //请求失败
          return;
        }
        var result = response.data;
        if (result.code == 0) {
          $scope.resData = result.data;
          $scope.cityGroupList= _.groupBy(result.data,function(one){
            return one.initial;
          });
        }
      });
    }

    /* 获取外部链接列表 todo */
    function getVipList(more) {
      HomeService.getVipList().then(function (response) {
        //console.log('获取外部链接列表 response = ' + JSON.stringify(response.data));
        if (!response.data) {
          //请求失败
          return;
        }
        var result = response.data;
        if (result.code == 0) {
          $scope.vipList = result.data;
        }
      });
    }

    $scope.goBack = function () {
      $ionicHistory.goBack();
    };

    $scope.openModal = function () {
      console.log('open');
      getCityList();
      $ionicModal.fromTemplateUrl('templates/city-modal.html', {
        scope: $scope,
        animation: 'animated slideInDown',
        hideDelay: 500
      }).then(function (modal) {
        $scope.modal = modal;
        $scope.modal.show();
      });
    };

    $scope.hideModal = function () {
      $scope.modal.hide();
      // Note that $scope.$on('destroy') isn't called in new ionic builds where cache is used
      // It is important to remove the modal to avoid memory leaks
      $scope.modal.remove();
    };
    /* 选择城市 */
    $scope.chooseCity = function (cityId, cityName) {
      console.log('cityId = ' + cityId + ' cityName = ' + cityName);
      $scope.currentCity = cityName;
      $scope.hideModal();
    };

    /* 跳转到健康专栏商品列表 */
    $scope.toHealthTopic = function (id, name) {
      var params = {
        id: id,
        name: name
      };
      $state.go('healthTopic', params);
    };

    /* 跳转到生活专题店铺列表 */
    $scope.toLifeTopic = function (id, name) {
      var params = {
        id: id,
        name: name
      };
      $state.go('lifeTopic', params);
    };

    /* 跳转到店铺首页 */
    $scope.toShopHome = function (shopId) {
      var params = {
        shopId: shopId
      };
      $state.go('shopHome', params);
    };

    /* 跳转到个人中心页面 */
    $scope.toPersonalCenter = function () {
      $state.go('personalCenter');
    };

    /* 跳转到购物车页面 */
    $scope.toShoppingCart = function () {
      $state.go('shoppingCart');
    };

    /* 收藏商品 */
    $scope.collectGoods = function (goodsId) {
      var params = {
        goodsId: goodsId
      };
      CollectService.collectGoods(params).then(function (response) {
        if (!response.data) {
          return;
        }
        var result = response.data;
        if (result.code == 0) {
          PopupService.showMsg(result.data);
        }
      });
    };

    /* 取消收藏商品 */
    $scope.cancelCollectGoods = function (goodsId) {
      var params = {
        goodsId: goodsId
      };
      CollectService.cancelCollectGoods(params).then(function (response) {
        if (!response.data) {
          return;
        }
        var result = response.data;
        if (result.code == 0) {
          PopupService.showMsg(result.data);
        }
      });
    };

    /* 收藏店铺 */
    $scope.collectShop = function (shopId) {
      var params = {
        shopId: shopId
      };
      CollectService.collectShop(params).then(function (response) {
        if (!response.data) {
          return;
        }
        var result = response.data;
        if (result.code == 0) {
          PopupService.showMsg(result.data);
        }
      });
    };

    /* 收藏店铺 */
    $scope.cancelCollectShop = function (shopId) {
      var params = {
        shopId: shopId
      };
      CollectService.cancelCollectShop(params).then(function (response) {
        if (!response.data) {
          return;
        }
        var result = response.data;
        if (result.code == 0) {
          PopupService.showMsg(result.data);
        }
      });
    };

    /* 跳转到商品搜索页面 */
    $scope.toSearch = function () {getCityInfo();
     // $state.go('goodsSearch');
    };

    /* 跳转到商品详细页面 */
    $scope.toGoodsDetail = function (goodsId) {
      var params = {
        goodsId: goodsId
      };
      $state.go('goodsDetail', params);
    };

    $scope.toLink = function (link) {
      window.open(link);
    };

    $scope.toRight = function(){
      $ionicTabsDelegate.select(1)
    };

    $scope.$on('$ionicView.beforeEnter',function(e,v){
      if(v.direction == 'back'){//不需要刷新
      }else{
        //需要刷新 定位比较耗时间 只有第一次近入 初始化
        // if($scope.tabSelectedTimes ===0){
        //   $scope.init();
        // }else{
        //   loadData(0);
        // }
        // loadData(0);
        //通过路由参数 决定进入home页 哪个tab 是actived

      }
    //$scope.init();
    //getCityInfo();
      //需要gpsCity 作为请求参数的页面 ，beforeEnter都要发加 getCityInfo
      var ti = parseInt($stateParams.tabIndex) ;
      $ionicTabsDelegate.select(ti);
      console.log($stateParams.tabIndex);
      //if(!$stateParams.tabIndex){
      //  $timeout(function(){
      //    console.log($stateParams.tabIndex)
      //    $ionicTabsDelegate.select(0);
      //  },300);
      //}
      //else{
      //  $timeout(function(){
      //    $ionicTabsDelegate.select($stateParams.tabIndex);
      //    console.log($stateParams.tabIndex);
      //  },300);
      //}
    });

    $scope.$on('$ionicView.afterLeave',function(e,v){

    });
    $scope.$on('$destroy', function() {
      $scope.tabSelectedTimes = 0;
    });



  }]);

/**
 * 首页Service
 * by geshuo 20160216
 */
CYXApp.service('HomeService', ['$http', 'UrlService', function ($http, UrlService) {

  this.getHealthGoods = function (requestParams) {
    var url = UrlService.getUrl('HOME_HEALTH_GOODS');
    return $http.post(url, requestParams);
  };
  this.getHealthTopic = function (requestParams) {
    var url = UrlService.getDebugUrl('HOME_HEALTH_TOPIC');
    return $http.get(url, requestParams);
  };
  this.getLifeShopList = function (requestParams) {
    var url = UrlService.getDebugUrl('HOME_LIFE_SHOPS');
    return $http.get(url, requestParams);
  };
  this.getLifeTopicList = function (requestParams) {
    var url = UrlService.getDebugUrl('HOME_LIFE_TOPIC');
    return $http.get(url, requestParams);
  };
  this.getCityList = function (requestParams) {
    var url = UrlService.getUrl('HOME_CITY_LIST');
    return $http.post(url, requestParams);
  };
  this.getVipList = function (requestParams) {
    var url = UrlService.getDebugUrl('HOME_VIP_LIST');
    return $http.get(url, requestParams);
  };
  this.getNoPageData = function(requestParams) {
    var url = UrlService.getUrl('HOME_PAGE_DATA');
    return $http.post(url, requestParams);
  };
}]);

/*
 * 收藏Service
 * */
CYXApp.service('CollectService', ['$http', 'UrlService', function ($http, UrlService) {
  this.collectGoods = function (requestParams) {
    var url = UrlService.getUrl('COLLECT_GOODS');
    return $http.post(url, requestParams);
  };
  this.collectGoodsList = function (requestParams) {
    var url = UrlService.getUrl('COLLECT_GOODS_LIST');
    return $http.post(url, requestParams);
  };

  this.cancelCollectGoods = function (requestParams) {
    var url = UrlService.getUrl('CANCEL_COLLECT_GOODS');
    return $http.post(url, requestParams);
  };

  this.collectShop = function (requestParams) {
    var url = UrlService.getUrl('COLLECT_SHOP');
    return $http.post(url, requestParams);
  };
  this.collectShopList = function (requestParams) {
    var url = UrlService.getUrl('COLLECT_SHOP_LIST');
    return $http.post(url, requestParams);
  };
  this.cancelCollectShop = function (requestParams) {
    var url = UrlService.getUrl('CANCEL_COLLECT_SHOP');
    return $http.post(url, requestParams);
  };
  this.collectOther = function (requestParams) {
    var url = UrlService.getDebugUrl('COLLECT_SHOP');
    return $http.get(url, requestParams);
  };
  this.collectOtherList = function (requestParams) {
    var url = UrlService.getDebugUrl('COLLECT_SHOP_LIST');
    return $http.get(url, requestParams);
  };
  this.cancelOtherShop = function (requestParams) {
    var url = UrlService.getDebugUrl('CANCEL_COLLECT_SHOP');
    return $http.get(url, requestParams);
  };
}]);
