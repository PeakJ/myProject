// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
var bomApp = angular.module('bomApp', ['ionic','ngCordova'])

.run(function($ionicPlatform,$ionicPopup,$location,$state,$ionicHistory,$localStorage,userService,$rootScope) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleLightContent();
        }
    });

    function showConfirm() {
        var confirmPopup = $ionicPopup.confirm({
            title: '<strong>退出应用?</strong>',
            template: '确定要退出应用吗?',
            okText: '退出',
            okType: 'button-assertive',
            cancelText: '取消'
        });

        confirmPopup.then(function (res) {
            if (res) {
                //退出应用
                ionic.Platform.exitApp();
            } else {
                // Don't close
            }
        });
    }

    //拦截android设备物理back键
    $ionicPlatform.registerBackButtonAction(function (e) {
        if ($location.path() == '/home') {
            //当前在首页
            showConfirm();
        }else if($location.path() == '/login'){
            //当前在登录页面
            showConfirm();
        } else if ($location.path() == '/tab/businessTrip' || $location.path() == '/tab/statistical'
            || $location.path() == '/tab/cart' || $location.path() == '/tab/personal') {
            //其他tab页面
            $state.go('home');
        } else if ($ionicHistory.backView()) {
            //返回上一页
            $ionicHistory.goBack();
        } else {
            //没有历史记录时，退出应用
            showConfirm();
        }
        e.preventDefault();
        return false;
    }, 101);
    //登录检测
    if($localStorage.get('main',false)){
        if(userService.getUserId() == '-1'){
            $location.path('/login');
        }
        else{
            $location.path('/home');
        }
    }
})

.config(['$stateProvider','$urlRouterProvider','$ionicConfigProvider',
    function($stateProvider, $urlRouterProvider,$ionicConfigProvider) {
    //解决android情况下底部菜单在上面情况
    $ionicConfigProvider.tabs.position('bottom');
    //$ionicConfigProvider.views.forwardCache(true);
    //$ionicConfigProvider.views.maxCache(0);
    $stateProvider
    .state('main', {
        url: "/",
        templateUrl: "modules/home/view/main.html",
        controller:'MainCtrl'
    })
    //首页
    .state('login', {
        url: "/login",
        templateUrl: "modules/home/view/login.html",
        controller:'LoginCtrl'
    })
    //底部导航
    .state('tab', {
        url: "/tab",
        abstract: true,
        templateUrl: "modules/templates/tabs.html"
    })
    /**
     * 首页管理
     */
    //首页管理 首页
    .state('home', {
        url: "/home",
        templateUrl: "modules/home/view/index.html",
        controller:'HomeCtrl'
    })
    /**
     * 出差管理
     * */
    //出差管理 出差首页
    .state('tab.businessTrip', {
        url: '/businessTrip',
        views: {
            'tab-businessTrip': {
                templateUrl: 'modules/businessTrip/view/list.html',
                controller: 'businessTripListCtrl'
            }
        }
    })
    /**
     * 统计管理
     */
    //统计管理 统计信息
    .state('tab.statistical', {
        url: '/statistical',
        views: {
           'tab-statistical': {
             templateUrl: 'modules/statistical/view/index.html',
             controller:'statisticalCtrl'
           }
        }
    })
    /**
     * 消息管理
     */
    //消息管理 消息列表
    .state('message', {
        url: '/message',
        templateUrl: 'modules/message/view/index.html',
        controller:'messageCtrl'
    })
        .state('outMessage',{
            url : '/outMessage',
            templateUrl: 'modules/message/view/outMessage.html',
            controller:'outMessageCtrl'
        })
    /**
     * 商机管理
     */
        //商机管理 商机信息
        .state('tab.business', {
            url: '/business',
            views: {
                'tab-business': {
                    templateUrl: 'modules/business/view/index.html',
                    controller:'businessCtrl'
                }
            }

        })
    /**
     * 日报管理
     */
        //日报管理 日报列表
        .state('tab.daily', {
            url: '/daily',
            views: {
                'tab-daily': {
                    templateUrl: 'modules/daily/view/index.html',
                    controller:'dailyCtrl'
                }
            }

        });
  // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/');
}]);
