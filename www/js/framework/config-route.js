/**
 * Created by geshuo on 2016/2/16.
 * 页面路由声明
 *
 */
var appRoute = function ($stateProvider, $urlRouterProvider) {

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider
        //APP首页
        .state('home', {
            url: '/home/:tabIndex',
            templateUrl: 'templates/home/home.html',
            controller: 'homeController'
        })
        //健康专题商品列表页面
        .state('healthTopic', {
          url: '/healthTopic/:id/:name/:imgPath/:introduction',
          templateUrl: 'templates/home/health-topic.html',
          controller: 'healthTopicController'
        })
        //生活专题店铺列表页面
        .state('lifeTopic', {
          url: '/lifeTopic/:id/:name',
          templateUrl: 'templates/home/life-topic.html',
          controller: 'lifeTopicController'
        })
        //商品搜索页面
        .state('goodsSearch', {
          url: '/goodsSearch',
          templateUrl: 'templates/goods/goods-search.html',
          controller: 'goodsSearchController'
        })
        //商品列表页面
        .state('goodsList', {
          url: '/goodsList/:keywords/:categoryId',
          templateUrl: 'templates/goods/goods-list.html',
          controller: 'goodsListController'
        })
        //商品详细页面
        .state('goodsDetail', {
          url: '/goodsDetail/:goodsId',
          templateUrl: 'templates/goods/goods-detail.html',
          controller: 'goodsDetailController'
        })
        //店铺首页
        .state('shopHome', {
            url: '/shopHome/:shopId',
            templateUrl: 'templates/shop/shop-home.html',
            controller: 'shopHomeController'
        })
        //个人中心
        .state('personalCenter', {
            url: '/personalCenter',//测试传参
            templateUrl: 'templates/personal/personal-center.html',
            controller: 'personalCenterController'
        })
        //购物车
        .state('shoppingCart', {
            url: '/shoppingCart',
            templateUrl: 'templates/shopping-cart/shopping-cart.html',
            controller: 'shoppingCartController'
        })
        //药店中心页面
        .state('shopCenter', {
            url: '/shopCenter/:role/:headImg',
            templateUrl: 'templates/personal/shop-center/shop-center.html',
            controller: 'shopCenterController'
        })
        //会员信息
        .state('member', {
            url: '/member',
            templateUrl: 'templates/personal/shop-center/member.html',
            controller: 'memberController'
        })
        //销售员统计
        .state('salesperson', {
            url: '/salesperson',
            templateUrl: 'templates/personal/shop-center/salesperson.html',
            controller: 'salespersonController'
        })
        //销售额统计
        .state('volumeStatistics', {
            url: '/volumeStatistics',
            templateUrl: 'templates/personal/shop-center/volume-statistics.html',
            controller: 'volumeStatisticsController'
        })
        //商品统计
        .state('goodsStatistics', {
            url: '/goodsStatistics',
            templateUrl: 'templates/personal/shop-center/goods-statistics.html',
            controller: 'goodsStatisticsController'
        })
        //会员消费记录
        .state('consumption', {
            url: '/consumption/:memberId/:memberAccount',
            templateUrl: 'templates/personal/shop-center/consumption.html',
            controller: 'consumptionController'
        })
        //单个商品统计
        .state('singleGoods', {
            url: '/singleGoods/:goodsId',
            templateUrl: 'templates/personal/shop-center/single-goods.html',
            controller: 'singleGoodsController'
        })
        //单个商品销售额统计
        .state('singleVolume', {
            url: '/singleVolume/:goodsName',
            templateUrl: 'templates/personal/shop-center/single-volume.html',
            controller: 'singleVolumeController'
        })
        //积分信息
        .state('integral', {
            url: '/integral/:score/:headImg',
            templateUrl: 'templates/personal/shop-center/integral.html',
            controller: 'integralController'
        })
        //店铺地图页面
        .state('shopMap', {
            url: '/shopMap/:address',
            templateUrl: 'templates/shop/shop-map.html',
            controller: 'shopMapController'
        })
        //商品地图页面
        .state('goodsMap', {
            url: '/shopMap/:keywords',
            templateUrl: 'templates/goods/goods-map.html',
            controller: 'goodsMapController'
        })
      //我的订单
      .state('myOrder', {
        url: '/myOrder',
        abstract:true,
        templateUrl: 'templates/order/my-order.html'

        })
        //账号信息页面
        .state('accountInformation', {
            url: '/accountInformation',
            templateUrl: 'templates/personal/account-information.html',
            controller: ''
        })
        //修改个人资料
        .state('personalInformation', {
            url: '/personalInformation',
            templateUrl: 'templates/personal/personal-information.html',
            controller: 'personalInformationController'
        })
        //修改地址列表
        .state('addressList', {
            url: '/addressList',
            templateUrl: 'templates/personal/address-list.html',
            controller: 'addressListController'
        })
        //修改密码
        .state('changePassword', {
            url: '/changePassword',
            templateUrl: 'templates/personal/change-password.html',
            controller: 'changePasswordController'
        })
        //注册
        .state('register', {
            url: '/register',
            templateUrl: 'templates/personal/register.html',
            controller: 'registerController'
        })
        //登录
        .state('login', {
            url: '/login',
            templateUrl: 'templates/personal/login.html',
            controller: 'loginController'
        })
        //找回密码
        .state('forgetPassword', {
            url: '/forgetPassword',
            templateUrl: 'templates/personal/forget-password.html',
            controller: 'forgetPasswordController'
        })
        //联系我们页面
        .state('contactUs', {
            url: '/contactUs',
            templateUrl: 'templates/personal/contact-us.html',
            controller: 'contactUsController'
        })
      //我的收藏
      .state('myFavorite', {
        url: '/myFavorite',
        templateUrl: 'templates/personal/my-favorite.html',
        controller: 'myFavoriteController'
      })

      //待核销订单
      .state('myOrder.deal', {
        url: '/deal',
        views: {
          'myOrder-deal': {
            templateUrl: 'templates/order/order-pending.html',
            controller: 'dealOrderController'
          }
        }

      })
      //已核销订单
      .state('myOrder.completed', {
         url: '/completed',
         views: {
          'myOrder-completed': {
            templateUrl: 'templates/order/order-completed.html',
            controller: 'completedOrderController'
          }
        }
       })
     //核销信息确认
     .state('confirmOrder', {
        url: '/confirmOrder/:qrCode',
        templateUrl: 'templates/order/order-confirm.html',
        controller: 'confirmOrderController'
       })
      //核销记录详细
      .state('orderDetail', {
        url: '/orderDetail/:orderId',
            templateUrl: 'templates/order/order-detail.html',
            controller: 'orderDetailController'

      })
      //优惠券核销
      .state('orderDeal', {
        url: '/orderDeal',
            templateUrl: 'templates/order/order-deal.html',
            controller: 'orderDealController'
      })
      //串码输入
      .state('bunchInput', {
        url: '/bunchInput',
        templateUrl: 'templates/order/bunch-input.html',
        controller: 'bunchInputController'
      })
      //核销记录
      .state('orderRecord', {
       url: '/orderRecord',
           templateUrl: 'templates/order/order-record.html',
           controller: 'orderRecordController'
       })
      //省市区 选择的路由
      .state('addressArea', {
        url: '/addressArea',
        templateUrl: 'templates/personal/address/address-area.html',
        controller: 'addressAreaController'
      }).state('addressCity', {
        url: '/addressCity',
        templateUrl: 'templates/personal/address/address-city.html',
        controller: 'addressCityController'
      }).state('addressProvince', {
        url: '/addressProvince',
        templateUrl: 'templates/personal/address/address-province.html',
        controller: 'addressProvinceController'
      });


    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/home/0');

};
