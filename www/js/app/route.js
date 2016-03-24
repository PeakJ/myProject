cdfgApp.config(['$urlRouterProvider', '$ionicConfigProvider', '$stateProvider', function ($urlRouterProvider, $ionicConfigProvider, $stateProvider) {

    $ionicConfigProvider.tabs.position('bottom');
    //$urlRouterProvider.otherwise('/home');
    $urlRouterProvider.otherwise('/splash');//debug用

    var addRoute = function () {
        for (var i = 0; i < arguments.length; i++) {
            var route = arguments[i];

            if (angular.isArray(route)) {
                angular.forEach(route, function (routeItem) {
                    $stateProvider.state(routeItem.state, routeItem);
                });
            } else {
                $stateProvider.state(route.state, route);
            }
        }
    };

    //個人中心
    var route = {
        //个人中心
        personal: {
            //订单部分
            order: [
                {
                    state: 'order-list',
                    url: '/order-list/:orderStatus/:reload',
                    templateUrl: 'templates/personal/order/order-list.html',
                    controller: 'OrderListController',
                    requiredLogin: true
                },
                {
                    state: 'order-detail',
                    url: '/order-detail/:orderId/:reload',
                    templateUrl: 'templates/personal/order/order-detail.html',
                    controller: 'OrderDetailController',
                    requiredLogin: true
                },
                {
                    state: 'order-express',
                    url: '/order-express/:awbNo/:lcId/:lcName/:reload',
                    templateUrl: 'templates/personal/order/order-express.html',
                    controller: 'OrderExpressController',
                    requiredLogin: true
                },
                {
                    state: 'shop-location',
                    url: '/shop-location/:storeName/:reload/:storeId',
                    templateUrl: 'templates/personal/order/shop-location.html',
                    controller: 'ShopLocationController',
                    requiredLogin: true
                },
                {
                    state: 'shop-location-image',
                    url: '/shop-location-image/:reload/:imageUrl',
                    templateUrl: 'templates/personal/order/shop-location-image.html',
                    controller: 'ShopLocationImageController',
                    requiredLogin: true
                }
            ],

            //账号
            account: [
                {
                    state: 'account',
                    url: '/acount',
                    templateUrl: 'templates/personal/account/account.html',
                    controller: 'AccountController',
                    requiredLogin: true
                },
                //消息中心
                {
                    state: 'message',
                    url: '/message',
                    templateUrl: 'templates/personal/message.html',
                    controller: 'MessageController',
                    requiredLogin: true
                },
                //意见反馈
                {
                    state: 'feedback',
                    url: '/feedback',
                    templateUrl: 'templates/personal/feedback.html',
                    controller: "FeedbackController",
                    cache: false,
                    requiredLogin: true
                },
                //选择页面
                {
                    state: 'commonSelect',
                    url: '/common/select/:selectMode/:defaultValue/:children',
                    templateUrl: 'templates/common/select.html',
                    controller: 'CommonSelectController',
                    cache: false,
                    requiredLogin: true
                },
                //公共编辑页面
                {
                    state: 'commonEdit',
                    url: '/common/edit/:selectMode/:defaultValue',
                    templateUrl: 'templates/common/edit.html',
                    controller: 'CommonEditController',
                    cache: false,
                    requiredLogin: true
                }
            ],
            //安全
            security: [
                {
                    state: 'security',
                    url: '/security',
                    templateUrl: 'templates/personal/account/security/security.html',
                    controller: 'SecurityController',
                    requiredLogin: true
                },
                //密码修改页面
                {
                    state: 'password',
                    url: '/security/password',
                    templateUrl: 'templates/personal/account/security/password.html',
                    controller: 'PasswordController',
                    cache: false,
                    requiredLogin: true
                },
                //手机第一次绑定页面
                {
                    state: 'bind',
                    url: '/security/bind',
                    templateUrl: 'templates/personal/account/security/bind.html',
                    cache: false,
                    controller: 'BindController',
                    requiredLogin: true
                },
                //手机验证页面
                {
                    state: 'validation',
                    url: '/security/validation',
                    templateUrl: 'templates/personal/account/security/validation.html',
                    cache: false,
                    controller: 'ValidationController',
                    requiredLogin: true
                },
                //支付密码
                {
                    state: 'payPassword',
                    url: '/security/pay-password',
                    templateUrl: 'templates/personal/account/security/pay-password.html',
                    controller: 'PayPasswordController',
                    cache: false,
                    requiredLogin: true
                }
            ],
            //我的收藏
            favourite: [
                {
                    state: 'favourite',
                    url: '/favourite',
                    templateUrl: 'templates/personal/favourite.html',
                    controller: 'FavouriteController',
                    requiredLogin: true

                }
            ],

            address: [
                {
                    state: 'address',
                    url: '/address:addrId',
                    templateUrl: 'templates/personal/account/address.html',
                    controller: 'AddressController',
                    requiredLogin: true
                },
                {
                    state: 'addressDetail',
                    url: '/address/detail/:addressId/:init',
                    templateUrl: 'templates/personal/account/address-detail.html',
                    controller: 'AddressDetailController',
                    requiredLogin: true
                },
                {
                    state: 'goabroad',
                    url: '/goabroad:addrId',
                    templateUrl: 'templates/personal/account/goabroad.html',
                    controller: 'GoabroadController',
                    requiredLogin: true
                },
                {
                    state: 'goabroadDetail',
                    url: '/goabroad/detail/:addressId',
                    templateUrl: 'templates/personal/account/goabroad-detail.html',
                    controller: 'GoabroadDetailController',
                    cache: false,
                    requiredLogin: true
                },
                {
                    state: 'goabroadTraffic',
                    url: '/goabroad/traffic/:shop',
                    templateUrl: 'templates/personal/account/goabroad-traffic.html',
                    controller: 'GoabroadTrafficController',
                    cache: false,
                    requiredLogin: true
                }
            ],
            setting: [
                {
                    state: 'setting',
                    url: '/setting',
                    templateUrl: 'templates/personal/setting/setting.html',
                    controller: 'SettingController'
                }

            ],
            company: [
                {
                    state: 'company',
                    url: '/company',
                    templateUrl: 'templates/personal/setting/company.html',
                    controller: 'CompanyController'
                }
            ],

            connectUs: [
                {
                    state: 'connectUs',
                    url: '/connect-us',
                    templateUrl: 'templates/personal/setting/connect-us.html',
                    requiredLogin: true,
                    controller: 'ConnectUsController'
                }
            ],

            /*ADD START BY 葛硕 20150731：售后相关路由--------------------------------------------------------*/
            afterSale: [
                /*个人中心-->售后订单列表 by 葛硕 20150706*/
                {
                    state: 'after-sale-list',
                    url: '/after-sale-list/:orderId/:reload',
                    templateUrl: 'templates/personal/order/after-sale-list.html',
                    controller: 'AfterSaleListController',
                    requiredLogin: true
                },
                /*个人中心-->售后商品列表 by 葛硕 20150806*/
                {
                    state: 'after-sale-goods',
                    url: '/after-sale-goods/:orderId/:reload',
                    templateUrl: 'templates/personal/order/after-sale-goods.html',
                    controller: 'AfterSaleGoodsController',
                    requiredLogin: true
                },
                /*个人中心-->申请售后服务 by 葛硕 20150707*/
                {
                    state: 'after-sale-apply',
                    url: '/after-sale-apply/:orderId/:goodsData/:goodsCount',
                    templateUrl: 'templates/personal/order/after-sale-apply.html',
                    controller: 'AfterSaleApplyController',
                    requiredLogin: true
                },
                /*个人中心-->售后服务进度 by 葛硕 20150708*/
                {
                    state: 'after-sale-progress',
                    url: '/after-sale-progress/:orderId/:itemId',
                    templateUrl: 'templates/personal/order/after-sale-progress.html',
                    controller: 'AfterSaleProgressController',
                    requiredLogin: true
                },
                /*个人中心-->申请售后-->图片 by 葛硕 20150713*/
                {
                    state: 'apply-images',
                    url: '/apply-images/:imageList/:index/:clearDel/:fromProgress',
                    templateUrl: 'templates/personal/order/apply-images.html',
                    controller: 'ApplyImagesController',
                    requiredLogin: true
                }
            ],
            /*ADD END   BY 葛硕 20150731：售后相关路由--------------------------------------------------------*/

            /*ADD START BY 葛硕 20150731：评价相关路由--------------------------------------------------------*/
            remark: [
                /*个人中心-->待评价商品列表 by 葛硕 20150704*/
                {
                    state: 'remark-goods-list',
                    url: '/remark-goods-list/:orderId/:reload',
                    templateUrl: 'templates/personal/order/remark-goods-list.html',
                    controller: 'RemarkGoodsListController',
                    requiredLogin: true
                },
                /*个人中心-->评价商品 by 葛硕 20150704*/
                {
                    state: 'remark-goods',
                    url: '/remark-goods/:orderId/:itemId',
                    templateUrl: 'templates/personal/order/remark-goods.html',
                    controller: 'RemarkGoodsController',
                    requiredLogin: true
                }
            ],
            /*ADD END   BY 葛硕 20150731：评价相关路由--------------------------------------------------------*/

            /*ADD START BY 葛硕 20150731：中免卡、优惠券相关路由--------------------------------------------------------*/
            assets: [
                /*个人中心-->中免卡 by 葛硕 20150709*/
                {
                    state: 'card-list',
                    url: '/card-list',
                    templateUrl: 'templates/personal/assets/card-list.html',
                    controller: 'CardListController',
                    requiredLogin: true
                },
                /*个人中心-->我的优惠券 by 葛硕 20150709*/
                {
                    state: 'coupon-list',
                    url: '/coupon-list',
                    templateUrl: 'templates/personal/assets/coupon-list.html',
                    controller: 'CouponListController',
                    requiredLogin: true
                }
            ]
            /*ADD END BY 葛硕 20150731：中免卡、优惠券相关路由--------------------------------------------------------*/
        }
    };


// addRoute(routeTable);
    addRoute(route.personal.account);
    addRoute(route.personal.security);
    addRoute(route.personal.address);
    addRoute(route.personal.company);
    addRoute(route.personal.connectUs);
    addRoute(route.personal.setting);
    addRoute(route.personal.favourite);

    addRoute(route.personal.order);//订单相关
    addRoute(route.personal.afterSale);//售后相关
    addRoute(route.personal.remark);//评价相关
    addRoute(route.personal.assets);//资产相关

// tabs
    addRoute(
        /*ADD START BY 葛硕 20150825：添加欢迎页面/广告页面------------------------------------*/
        {
            state: 'splash',
            url: '/splash',
            templateUrl: 'templates/home/splash.html',
            controller: 'SplashController'
        },
        /*ADD END   BY 葛硕 20150825：添加欢迎页面/广告页面------------------------------------*/
        {
            state: 'home',
            url: '/home',
            templateUrl: 'templates/home/home.html',
            controller: 'HomeController'
        },
        {
            state: 'brand',
            url: '/brand',
            templateUrl: 'templates/brand/brand.html',
            controller: 'BrandController'
        },
        {
            state: 'category',
            url: '/category',
            templateUrl: 'templates/category/category.html',
            controller: 'CategoryController'
        },
        {
            state: 'personal',
            url: '/personal',
            templateUrl: 'templates/personal/personal.html',
            controller: 'PersonalController'
            //requiredLogin: true
        }
    );

// 注册和注册协议
    addRoute(
        {
            state: 'register',
            cache: false,
            url: '/register/:last/:params',
            templateUrl: 'templates/register/register.html',
            controller: 'RegisterController'
        }
    );

//登录A
    addRoute(
        {
            state: 'login',
            url: '/login/:last/:params',
            cache: false,
            templateUrl: 'templates/login/login.html',
            controller: 'LoginController'
        },
        {
            state: 'reset-password',
            cache: false,
            url: '/login/password',
            templateUrl: 'templates/login/reset-password.html',
            controller: 'ResetPasswordController'
        }
    );
//购物车 订单提交
    addRoute(
        {
            state: 'cart',
            url: '/cart',
            templateUrl: 'templates/order/cart.html',
            controller: 'CartController'
        },
        {
            state: 'confirm-order',
            url: '/order/confirm-order',
            templateUrl: 'templates/order/confirm-order.html',
            controller: 'ConfirmOrderController'
        },
        {
            state: 'cart-pro-list',
            url: '/order/cart-pro-list/:type',
            templateUrl: 'templates/order/cart-pro-list.html',
            cache: false,
            controller: 'CartProListController'
        },
        {
            state: 'orderinvalid',
            url: '/order/orderinvalid',
            cache: false,
            templateUrl: 'templates/order/cart-invalid.html',
            controller: 'cartInvalidController'
        },
        {
            state: 'paytype',
            url: '/order/paytype/:orderId',
            templateUrl: 'templates/order/paytype.html',
            controller: 'PaytypeController'
        },
        {
            state: 'pay-success',
            cache: false,
            url: '/order/paysuccess/:orderId/:orderTotal',
            templateUrl: 'templates/order/pay-success.html',
            controller: 'PaySuccessController'
        }
    );
//商品详情页


    addRoute(
        {
            state: 'product',
            cache: false,
            url: '/product/:type/:id',
            templateUrl: 'templates/product/product.html',
            controller: 'ProductController'
        },
        {
            state: 'product.detail',
            url: '/detail',
            views: {
                'product.tab': {
                    templateUrl: 'templates/product/product-detail.html'
                }
            }
        },
        {
            state: 'product.policy',
            url: '/policy',
            views: {
                'product.tab': {
                    templateUrl: 'templates/product/policy.html'
                }
            }
        },
        {
            state: 'product.comment',
            url: '/comment/:prodId',
            views: {
                'product.tab': {
                    templateUrl: 'templates/comment/comment.html',
                    controller: 'CommentController'
                }
            }
        }
    );
//商品列表页
    addRoute(
        {
            state: 'productList',
            cache: false,
            url: '/productList/:fromPage/:id/:title/:query',
            templateUrl: 'templates/category/category-template.html',
            controller: 'ProductListController'
        },
        {
            state: 'productList.view',
            url: '/view',
            views: {
                'productList.tab': {
                    templateUrl: 'templates/product/product-list.html'
                }
            }
        },
        {
            state: 'productList.filter',
            url: '/filter',
            views: {
                'productList.tab': {
                    templateUrl: 'templates/product/product-list-filter.html'
                }
            }
        },
        {
            state: 'productList.select',
            url: '/select',
            views: {
                'productList.tab': {
                    templateUrl: 'templates/product/product-list-select.html'
                }
            }
        }
    );

    var routeSearch = {
        state: 'search',
        url: '/search/:fromPage/:query',
        templateUrl: 'templates/search/search-template.html',
        controller: 'SearchController'
    };
    var routePromotion = [
        {
            state: 'promotionProductList',
            url: '/promotion/productList/:promId',
            templateUrl: 'templates/promotion/promotion-product-list.html',
            controller: 'PromotionProductListController'
        },
        {
            state: 'promotionList',
            url: '/promotion/list/:promotionId',
            templateUrl: 'templates/promotion/promotion-template.html',
            controller: 'PromotionListController'
        }

    ];
    //免税店路由
    var routeShop = [

        /*{
            state: 'storeBrand',
            url: '/storeBrand/:storeId',
            templateUrl: 'templates/brand/store-brand.html',
            controller: 'BrandController'
        },*/
        {
            state: 'shopList',
            url: '/shopList/:shopType/:reload/view',
            templateUrl: 'templates/shop/shop-list.html',
            controller: 'ShopListController'
        },
        {
            state: 'shopListFilter',
            url: '/filter/:selectedCity/:shopCities',
            templateUrl: 'templates/shop/shop-filter.html',
            controller: 'ShopListFilterController'
        },
        {
            state: 'shop',
            url: '/shop/:id/view',
            templateUrl: 'templates/shop/shop-detail.html',
            controller: 'ShopController',
            cache: false
        },
        {//xuf test
            state: 'shoptest',
            url: '/shoptest/:id/view',
            templateUrl: 'templates/shop/shop-detail-test.html',
            controller: 'ShopTestController'
        },
        {
            state: 'shopProductList',
            url: '/shopProductList/:fromPage/:shopId/:typeId/:brandId/:query',
            templateUrl: 'templates/shop/shop-product-list.html',
            controller: 'ShopProductListController'
        },
        {
            state: 'shopCategory',
            url: '/shopCategory/:shopId',
            templateUrl: 'templates/shop/shop-category.html',
            controller: 'ShopCategoryController'
        },

        /*ADD START BY 葛硕 20150812：免税店购物指南-----------------------------------------------*/
        {
            state: 'shop-guide',
            url: '/shop-guide',
            templateUrl: 'templates/shop/shop-guide.html',
            controller: 'ShopGuideController'
        }
        /*ADD END   BY 葛硕 20150812：免税店购物指南-----------------------------------------------*/
    ];
    addRoute(routeSearch);
    addRoute(routePromotion);
    addRoute(routeShop);

}]);

