/**
 * 个人中心-->订单详情
 * Created by geshuo on 2015/6/29.
 */
cdfgApp.controller('OrderDetailController', ['$scope', '$rootScope', '$ionicHistory', '$http', '$ionicActionSheet', '$state',
        '$stateParams', 'UrlService', 'PopupService', 'CartService', '$ionicScrollDelegate',
        function ($scope, $rootScope, $ionicHistory, $http, $ionicActionSheet, $state, $stateParams, UrlService, PopupService,
                  CartService, $ionicScrollDelegate) {
            //订单类型：0：混合式订单 1:快递到家 2:海外直邮，3免税预订
            $scope.TYPE_ALL = 0;
            $scope.TYPE_MALL = 1;
            $scope.TYPE_SHOP = 3;
            //交易状态 1:待付款,2:已付款(待发货、待自提),3:已发货/待收货,4:交易完成,5:未付款取消,6:等待取消(取消申请中),
            // 7付款后取消(交易终止、拒收),8:拆分后的订单
            $scope.NOT_PAY = 1;//待付款
            $scope.PAYED = 2;//已付款(待发货、待自提)
            $scope.DELIVERED = 3;//已发货/待收货
            $scope.DEAL = 4;//交易完成
            $scope.CANCELED = 5;//已取消
            $scope.CANCELING = 6;//等待取消(取消申请中)
            $scope.CANCEL_PAYED = 7;//7付款后取消(交易终止、拒收)

            /*自提订单状态*/
            $scope.PICK_NOT_PAY = 0;//待付款->取消订单、立即付款（付款短信或邮件通知（通知内容包含提货点））
            $scope.PICK_PAYED = 1;//待提货->取消订单、查看自提点
            $scope.PICK_DEAL = 2;//交易完成->评价晒单（30天内未评价系统默认好评）、再次购买
            $scope.PICK_REMARKED = 3;//已评价->再次购买

            $scope.showAll = false;//是否显示所有商品
            $scope.showAllMallItems = false;//是否显示所有商城商品
            $scope.showAllShopItems = false;//是否显示所有免税店商品
            $scope.hasFooter = false;//是否显示footer栏
            $scope.showAfterSale = false;//是否显示【返修/退货】按钮

            /*方法定义*/
            $scope.loadData = loadData;//加载初始数据
            $scope.showOrHideGoods = showOrHideGoods;//显示或隐藏商品
            $scope.customerService = customerService;//联系客服
            $scope.toGoodsDetail = toGoodsDetail;//查看商品详细信息
            $scope.toOrderExpress = toOrderExpress;
            /*查看物流信息*/
            $scope.refundOrder = refundOrder;//返修退货
            $scope.cancelOrder = cancelOrder;//取消订单
            $scope.payOrder = payOrder;//立即付款
            $scope.confirmReceive = confirmReceive;//确认收货
            $scope.evaluateOrder = evaluateOrder;//评价晒单
            $scope.buyAgain = buyAgain;//再次购买

            var deliverTimes = ['工作日、双休日、假日均可送货', '工作日送货', '双休日送货'];//送货时间

            //进入页面时，判断是否刷新页面
            $scope.$on('$ionicView.beforeEnter', function () {
                if (!$scope.orderDetailData) {
                    loadData();
                }
            });

            //接收刷新数据的广播，刷新列表数据（接收提交评价、申请售后成功后的广播）
            $rootScope.$on('RefreshOrderList', function (event, data) {
                console.log('接收广播 刷新订单详情');
                loadData();
            });

            //Android设备back键按下
            $rootScope.$on('goBack', function (event, data) {
                clearData();
            });

            /*清除数据*/
            function clearData() {
                $scope.orderDetailData = null;
            }

            /*加载页面初始数据*/
            function loadData() {
                $ionicScrollDelegate.$getByHandle('orderDetailHandle').scrollTop();//滚动到顶部

                var orderId = $stateParams.orderId;
                console.log('订单详情页面 orderId = ' + orderId);
                var params = {
                    orderId: orderId
                };

                var getDetailUrl = UrlService.getUrl('ORDER_DETAIL');
                //var getDetailUrl = 'datas/orderDetailData.json';
                $http.post(getDetailUrl, params).success(function (response) {
                    console.log('订单详情 response = ' + JSON.stringify(response));
                    $scope.$broadcast('scroll.refreshComplete');
                    //网络异常、服务器出错
                    if (!response || response == CDFG_NETWORK_ERROR) {
                        return;
                    }

                    //获取基本信息
                    if (response.code == 1) {

                        if (!response.data) {
                            PopupService.alertPopup('获取数据失败');
                            return;
                        }

                        var detailData = response.data;

                        detailData.statusText = getStatus(detailData.status, detailData.orderType);
                        detailData.invoiceTypeText = getInvoiceType(detailData.invoiceType);
                        detailData.payTypeText = getPayType(detailData.payType);
                        detailData.deliverTime = deliverTimes[detailData.deliverTimeRequest];
                        detailData.invoiceStyleText = getInvoiceStyle(detailData.invoiceStyle);

                        detailData.mallItems = [];//初始化商城商品列表
                        detailData.shopItems = [];//初始化店铺商品列表

                        $scope.showAfterSale = false;
                        for (var i = 0, len = detailData.items.length; i < len; i++) {
                            var item = detailData.items[i];
                            if (item.afterSale == 0) {
                                $scope.showAfterSale = true;//有商品未申请售后，显示 返修/退货
                            }

                            if (item.businessModel == 1) {
                                detailData.mallItems.push(item);//商城商品
                            } else if (item.businessModel == 3) {
                                detailData.shopItems.push(item);//免税店商品
                            }
                        }

                        $scope.orderDetailData = detailData;

                        //是否显示底部栏
                        $scope.hasFooter = ($scope.orderDetailData.status != $scope.CANCELED &&
                        $scope.orderDetailData.status != $scope.CANCELING &&
                        $scope.orderDetailData.status != $scope.CANCEL_PAYED);

                        if (detailData.awbNo && detailData.lcId) {
                            //根据单号、物流公司获取物流信息
                            var expressParams = {
                                awbNo: detailData.awbNo,
                                lcId: detailData.lcId
                            };
                            //获取物流详情
                            $http.post(UrlService.getUrl('EXPRESS_DETAIL'), expressParams).success(function (response) {
                                console.log('获取物流详情  response = ' + JSON.stringify(response));

                                //网络异常、服务器出错
                                if (!response || response == CDFG_NETWORK_ERROR) {
                                    return;
                                }

                                if (response.code == 1 && response.data) {
                                    if (response.data.length == 0) {
                                        $scope.hasExpressDetail = false;
                                    } else {
                                        $scope.hasExpressDetail = true;
                                        var expressInfo = response.data[0];
                                        $scope.orderDetailData.expressInfo = expressInfo.address + ' ' + expressInfo.remark
                                        $scope.orderDetailData.expressUpdateTime = expressInfo.time;
                                    }
                                } else {
                                    var errorText = response.data ? response.data : '获取物流失败';
                                    PopupService.alertPopup(errorText);
                                }
                            }).error(function (response) {
                                //错误处理
                                PopupService.alertPopup(CDFG_NETWORK_ERROR);
                            });
                        }

                    } else {
                        var errorText = response.data ? response.data : '获取数据失败';
                        PopupService.alertPopup(errorText);
                    }
                }).error(function (response) {
                    $scope.$broadcast('scroll.refreshComplete');
                    //错误处理
                    PopupService.alertPopup(CDFG_NETWORK_ERROR);
                });
            }

            /*查看物流信息*/
            function toOrderExpress() {
                console.log('用户中心-->订单详情-->查看物流');
                $state.go('order-express', {
                    'awbNo': $scope.orderDetailData.awbNo,
                    'lcId': $scope.orderDetailData.lcId,
                    'lcName': $scope.orderDetailData.lcName
                });
            }

            /*查看商品详细信息*/
            function toGoodsDetail(goodsId) {
                console.log('用户中心-->订单详情-->商品详细 goodsId = ' + goodsId);
                $state.go('product.detail', {'type': 'prod', 'id': goodsId});
            }

            /*显示或隐藏商品*/
            function showOrHideGoods(type) {
                if (type) {
                    //混合式订单
                    if (type == $scope.TYPE_MALL) {
                        $scope.showAllMallItems = !$scope.showAllMallItems;
                    } else if (type == $scope.TYPE_SHOP) {
                        $scope.showAllShopItems = !$scope.showAllShopItems;
                    }
                } else {
                    //正常订单
                    $scope.showAll = !$scope.showAll;
                }
            }

            /*联系客服*/
            function customerService() {
                console.log('用户中心-->订单详情-->联系客服');

                // Show the action sheet
                var hideSheet = $ionicActionSheet.show({
                    titleText: '<b>联系中免客服</b>',
                    buttons: [
                        {text: '4008599599'}
                    ],
                    buttonClicked: function (index) {
                        location.href = 'tel:4008599599';
                        return true;
                    },
                    cancelText: '取消',
                    cancel: function () {
                        // add cancel code..
                    }
                });
            }

            /*取消订单*/
            function cancelOrder(orderId) {
                console.log('用户中心-->订单详情-->取消订单 orderId = ' + orderId);
                PopupService.confirmPopup('您是否确认取消订单？').then(function (res) {
                    if (res) {
                        var cancelUrl = UrlService.getUrl('CANCEL_ORDER');
                        var params = {
                            orderId: orderId,
                            reason: '1'
                        };
                        console.log(params);
                        $http.post(cancelUrl, params).success(function (response) {
                            console.log('取消订单 response = ' + JSON.stringify(response));

                            //网络异常、服务器出错
                            if (!response || response == CDFG_NETWORK_ERROR) {
                                return;
                            }

                            //1:取消申请成功,2:取消申请中,-2:已发货不允许取消
                            if (response.code == '1') {
                                PopupService.showPrompt('订单取消成功');
                                $rootScope.$broadcast("RefreshOrderList");
                                $scope.goBack();
                            } else if (response.code == '2') {
                                PopupService.showPrompt('订单取消申请已提交');
                                $rootScope.$broadcast("RefreshOrderList");
                                $scope.goBack();
                            } else if (response.code == '-2') {
                                PopupService.alertPopup('订单已发货，无法取消');
                            } else {
                                var errorText = response.data ? response.data : '订单取消失败';
                                PopupService.alertPopup(errorText);
                            }
                        }).error(function (response) {

                        });
                    }
                });
            }

            /*立即付款*/
            function payOrder(orderCode) {
                console.log('用户中心-->订单详情-->立即付款 orderId = ' + orderCode);
                $state.go('paytype', {'orderId': orderCode});
            }

            /* 确认收货*/
            function confirmReceive(orderId) {
                console.log('用户中心-->订单详情-->确认收货 orderId = ' + orderId);
                console.log('我的订单列表-->确认收货 orderId = ' + orderId);
                PopupService.confirmPopup('是否确认收到货物？').then(function (res) {
                    if (res) {
                        var confirmUrl = UrlService.getUrl('CONFIRM_RECEIVE');
                        var params = {
                            orderId: orderId
                        };
                        console.log('确认收货 request = ' + JSON.stringify(params));
                        $http.post(confirmUrl, params).success(function (response) {
                            console.log('确认收货 response = ' + JSON.stringify(response));

                            //网络异常、服务器出错
                            if (!response || response == CDFG_NETWORK_ERROR) {
                                return;
                            }

                            if (response.code == 1) {
                                PopupService.showPrompt('确认收货成功！');
                                $rootScope.$broadcast("RefreshOrderList");
                                $scope.goBack();
                            } else {
                                var errorText = response.data ? response.data : '确认收货失败';
                                PopupService.alertPopup(response.data);
                            }
                        }).error(function (response) {
                            PopupService.alertPopup(CDFG_NETWORK_ERROR);
                        });
                    }
                });
            }

            /*返修/退货*/
            function refundOrder(orderId) {
                console.log('用户中心-->订单详情-->返修/退货 orderId = ' + orderId);
                var goodsCount = $scope.orderDetailData.items.length;
                if ($scope.orderDetailData.items.length > 1) {
                    var params = {
                        'orderId': orderId,
                        'goodsCount': goodsCount,
                        'reload': true
                    };
                    $state.go('after-sale-goods', params);
                } else {
                    var afterSaleParams = {
                        'orderId': $scope.orderDetailData.id,
                        'goodsData': JSON.stringify($scope.orderDetailData.items[0]),
                        'goodsCount': goodsCount
                    };
                    $state.go('after-sale-apply', afterSaleParams);
                }
            }

            /*评价/晒单*/
            function evaluateOrder(orderId) {
                console.log('用户中心-->订单详情-->评价/晒单 orderId = ' + orderId);
                if ($scope.orderDetailData.items.length == 1) {
                    $state.go('remark-goods', {'orderId': orderId, 'itemId': $scope.orderDetailData.items[0].id});
                } else {
                    $state.go('remark-goods-list', {'orderId': orderId});
                }
            }

            /*再次购买*/
            function buyAgain() {
                console.log('用户中心-->订单详情-->再次购买');
                //加入购物车
                for (var i = 0, len = $scope.orderDetailData.items.length; i < len; i++) {
                    var goods = $scope.orderDetailData.items[i];
                    CartService.addToCart(goods.skuId, goods.num);
                }
                $state.go('cart');
            }

            /*获取订单状态*/
            function getStatus(orderStatus, orderType) {
                var statusText = '';
                switch (orderStatus) {
                    case $scope.NOT_PAY:
                        statusText = '待付款';
                        break;
                    case $scope.PAYED:
                        if (orderType == 1) {
                            statusText = '待发货';
                        } else if (orderType == 3) {
                            statusText = '待自提取货';
                        }
                        break;
                    case $scope.DELIVERED:
                        statusText = '待收货';
                        break;
                    case $scope.DEAL:
                        statusText = '交易完成';
                        break;
                    case $scope.CANCELED:
                    case $scope.CANCEL_PAYED:
                        statusText = '已取消';
                        break;
                    case $scope.CANCELING:
                        statusText = '取消申请中';
                        break;
                }
                console.log('订单状态 = ' + statusText);
                return statusText;
            }

            //支付类型 1：在线支付；2：货到付款,
            function getPayType(type) {
                switch (type) {
                    case 1:
                        return '在线支付';
                    case 2:
                        return '货到付款';
                }
            }

            /**获取发票类型*/
            function getInvoiceType(type) {
                switch (type) {
                    case 1:
                        return '明细';
                }
            }

            /*获取发票形式*/
            function getInvoiceStyle(type){
                //发票形式 1:纸质,2:电子',
                switch (type){
                    case 1:
                        return '纸质发票';
                    case 2:
                        return '电子发票';
                }
            }

            /*返回上一页*/
            $scope.goBack = function () {
                $ionicHistory.goBack();
                clearData();
            };


            /*免税店：进入店铺*/
            $scope.toShopDetail = function (shopId) {
                console.log('用户中心-->订单详情-->进入店铺 shopId = ' + shopId);
                $state.go('shop', {'id': shopId});
            };

            /*查看自提点*/
            $scope.checkAddress = function (orderId) {
                console.log('用户中心-->订单详情-->查看自提点 orderId = ' + orderId);
                var params = {
                    storeName: $scope.orderDetailData.storeName,
                    storeId: $scope.orderDetailData.storeId
                };
                $state.go('shop-location', params);
            };
        }]
);