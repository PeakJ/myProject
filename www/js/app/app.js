/********************************
 creater:maliwei@cdfg.com.cn
 create time:2015/06/17
 modify time:
 ********************************/

var cdfgApp = angular.module('cdfgApp', ['ionic', 'ngTouch', 'ngCordova', 'ui.router']);

//Ajax拦截器
cdfgApp.factory('userInterceptor', ['UserService', '$rootScope', function (UserService, $rootScope) {
    return {
        //自动加上用户信息参数
        request: function (config) {

            config.params = config.params || {};
            if (config.method == 'POST') {
                var user = UserService.getUser();
                if (user.isLogined()) {
                    if (!config.data) {
                        config.data = {}
                    }
                    config.data.userId = user.userId;
                    config.data.userInfo = user.userInfo;
                    config.data.ticket = user.ticket;
                }
            }

            /*ADD START BY 葛硕 20150808：添加http请求超时时间 --------------------------------------------*/
            //console.log(config.url);
            if(config.url.indexOf('prom/findUsable')>0||config.url.indexOf('prom/calcPromotion')>0){
                //获取活动的超时时间为2秒
                config.timeout = 2000;
            }else{
                config.timeout = 20000;//20秒
            }
            /*ADD END   BY 葛硕 20150808：添加http请求超时时间 --------------------------------------------*/

            return config;
        },
        //如果服务端返回代码告知session过期，则要求用户重新登录
        response: function (response) {
           // console.log(response);
            //检测网络异常
            if (!response) {
                //$rootScope.$broadcast('http-response:error');
                return {code: -1, data: CDFG_NETWORK_ERROR};
            }
            if (response && response.data && response.data.code) {
                switch (response.data.code) {
                    case -100:
                        $rootScope.$broadcast('sessionTimeout');
                        break;
                    default :
                    // do nothing
                }
            }

            return response;
        }
    };
}]);

//封装ajax请求参数
cdfgApp.config(['$httpProvider', '$ionicConfigProvider', function ($httpProvider, $ionicConfigProvider) {
    /*ADD START BY 葛硕 20150803：前进页面不缓存，全部重新加载----------------------------------------------*/
    $ionicConfigProvider.views.forwardCache(false);
    //$ionicConfigProvider.views.maxCache(0);
    /*ADD END   BY 葛硕 20150803：前进页面不缓存，全部重新加载----------------------------------------------*/

    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
    var add = function (arr, key, value) {
        if (key && value) arr.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
    };

    // ios禁用侧滑返回
    $ionicConfigProvider.views.swipeBackEnabled(false);

    var param = function (obj) {
        var arr = [];

        angular.forEach(obj, function (value, name) {
            if (angular.isArray(value)) {
                angular.forEach(value, function (valueItem) {
                    add(arr, name, valueItem);
                });
            } else {
                add(arr, name, value);
            }
        });

        return arr.length ? arr.join('&').replace(/%20/g, "+") : '';
    };

    $httpProvider.defaults.transformRequest = [function (data) {
        return (angular.isObject(data) && String(data) !== '[object File]') ? param(data) : data;
    }];

    $httpProvider.interceptors.push('userInterceptor');

    /* 拦截器 拦截http请求 */
    $httpProvider.interceptors.push(function ($rootScope, $q) {
        return {
            request: function (config) {
                var patrn = /http:\/\//;
                if (patrn.exec(config.url)) {
                    console.log(config.url);
                    /*CHG START BY 葛硕 20150820：判断是否显示加载条，noLoading为true时不显示。 默认情况：显示加载条-----*/
                    if(!config.data || (config.data&&!config.data.noLoading)){
                        $rootScope.$broadcast('loading:show');
                    }
                    /*CHG END   BY 葛硕 20150820：判断是否显示加载条，noLoading为true时不显示。 默认情况：显示加载条-----*/
                }
                return config;
            },
            response: function (response) {
                $rootScope.$broadcast('loading:hide');
                return response;
            },
            responseError: function (rejection) {
                //检测网络异常
                $rootScope.$broadcast('http-response:error',rejection);
                $rootScope.$broadcast('loading:hide');
                $q.reject(rejection);
            }

        }
    });
}]);

//事件处理
cdfgApp.run(['$ionicPlatform', '$rootScope', '$ionicLoading', '$location', '$ionicHistory', '$ionicPopup',
    '$state', '$ionicViewSwitcher', 'UserService', 'PopupService', 'CartService',
    function ($ionicPlatform, $rootScope, $ionicLoading, $location, $ionicHistory, $ionicPopup, $state,
              $ionicViewSwitcher, UserService, PopupService, CartService) {
        $rootScope.$on('loading:show', function () {
            /*CHG START BY 葛硕 20150820：显示ion-spinner 加载条-----------------------------------------------*/
            //PopupService.showPrompt('加载中...');
            if ($location.path() == '/home'|| $location.path() == '/brand'
                || $location.path() == '/category' || $location.path() == '/personal'){
                //一级页面，减小ion-spinner高度，使footer部分能够点击
                $rootScope.spinnerHeight = $rootScope.deviceHeight - 44 - 50;//headerBar高度：44px;footerBar高度：50px
            } else {
                //没有footer部分的其他页面，除header以外部分都不能点击
                $rootScope.spinnerHeight = $rootScope.deviceHeight - 44;//headerBar高度：44px
            }
            $rootScope.showLoading = true;
            /*CHG END   BY 葛硕 20150820：显示ion-spinner 加载条-----------------------------------------------*/
        });

        $rootScope.$on('loading:hide', function () {
            /*CHG START BY 葛硕 20150820：隐藏ion-spinner 加载条-----------------------------------------------*/
            //$ionicLoading.hide()
            $rootScope.showLoading = false;
            /*CHG END   BY 葛硕 20150820：隐藏ion-spinner 加载条-----------------------------------------------*/
        });

        //如果目标页面需要用户登录，而当前尚未登录，则自动重定向到登录界面
        $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
            //判断toParams是否为空
            var isEmpty = true;
            for (var n in toParams) {
                isEmpty = false
            }
            //为空则将toParams由{}改为‘’,否则获取到的是[object object]，在手机上无法跳转
            toParams = isEmpty ? '' : toParams;

            var state = $state.get(toState.name);
            //console.log(arguments);
            if (state.requiredLogin && !UserService.getUser().isLogined()) {
                event.preventDefault();
                /*CHG START BY 葛硕 20150827：JSON参数以字符串格式传递--------------------------*/
                //$state.go('login', {'last': toState.name, 'params': toParams});
                $state.go('login', {'last': toState.name, 'params': JSON.stringify(toParams)});
                /*CHG END   BY 葛硕 20150827：JSON参数以字符串格式传递--------------------------*/
            }
        });
        //http响应错误
        $rootScope.$on('http-response:error', function (response,rejection) {
            PopupService.promptPopup('网络异常，请检查网络'+rejection.status+':'+rejection.config.url, 'error');
        });
        //如果服务端返回告知当前会话失效，则要求重新登录
        $rootScope.$on('sessionTimeout', function () {
            UserService.clearUser();
            $state.go('login', {'last': $state.current.name, 'params': $state.params});
        });
        //捕获用户信息更新广播--登录
        $rootScope.$on('user:refresh', function () {
            //合并购物车
            CartService.joinLocalCart();
        });
        //订单提交成功--更新购物车数量
        $rootScope.$on('order:success', function (num) {
            console.log('订单提交成功');
            var curTotal = CartService.getCartTotal().total - num;
            CartService.setCartTotal(curTotal > 0 ? curTotal : 0);
        });
        //捕获清空用户信息广播--退出
        $rootScope.$on('user:clear', function () {
            CartService.deleteLocalCart();
            CartService.setCartTotal(0);
        });
    }]);

//通用配置
cdfgApp.run(['$ionicPlatform', '$rootScope', '$ionicLoading', '$location', '$ionicHistory', '$ionicPopup', '$state', '$ionicViewSwitcher','$http','UserService','UrlService','CartService',
    function ($ionicPlatform, $rootScope, $ionicLoading, $location, $ionicHistory, $ionicPopup, $state, $ionicViewSwitcher,$http,UserService,UrlService,CartService) {
        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if (window.StatusBar) {
                StatusBar.styleDefault();
            }
            //在设备初始化完成后隐藏Splash画面
            //navigator.splashscreen.hide();
        });



        /*/add start by 葛硕 20150709 显示确认退出对话框-------------------------------------------------*/
        function showConfirm() {
            var confirmPopup = $ionicPopup.confirm({
                title: '<strong>退出应用</strong>',
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
            $rootScope.$broadcast('loading:hide');
            $rootScope.$broadcast('goBack');

            if ($location.path() == '/home') {
                //当前在首页
                showConfirm();
            } else if ($location.path() == '/brand' || $location.path() == '/category'
                || $location.path() == '/cart' || $location.path() == '/personal') {
                //其他tab页面
                $state.go('home');
            } else if ($ionicHistory.backView()) {
                //返回上一页
                $ionicViewSwitcher.nextDirection('back');
                $ionicHistory.goBack();
            } else {
                //没有历史记录时，退出应用
                showConfirm();
            }
            e.preventDefault();
            return false;
        }, 101);
        /*add end by 葛硕 20150709 显示确认退出对话框---------------------------------------------------*/

        console.log('屏幕宽度 -------' +document.body.clientWidth);
        $rootScope.deviceWidth = document.body.clientWidth;
        $rootScope.deviceHeight = document.body.clientHeight;

        //加载购物车数量
        if(UserService.getUser().isLogined()){
            $http.post(UrlService.getUrl('GET_CART_COUNT'))
                .success(function(d){
                    if(d.code==1){
                        CartService.setCartTotal(d.data);
                    }
                })
        }

    }]);


