/**
 * 个人中心-->订单列表
 * Created by geshuo on 2015/6/25.
 */

//控制器
cdfgApp.controller('OrderListController', ['$scope', '$http', '$ionicHistory', 'PopupService', '$stateParams', '$state',
    '$ionicViewSwitcher', '$ionicScrollDelegate','$timeout','UrlService','$rootScope', '$location',
    function ($scope, $http, $ionicHistory, PopupService, $stateParams, $state, $ionicViewSwitcher,
               $ionicScrollDelegate,$timeout,UrlService,$rootScope, $location) {
        var pageIndex = 1;//列表分页索引
        var pageSize = 10;
        var listType = '';//页面列表类型：全部、待付款、待发货、已发货/待收货、待评价

        //交易状态 1:待付款,2:已付款(待发货、待自提),3:已发货/待收货,4:交易完成,5:未付款取消,6:等待取消(取消申请中),
        // 7付款后取消(交易终止、拒收),8:拆分后的订单

        /*订单状态*/
        $scope.NOT_PAY = 1;//待付款
        $scope.PAYED = 2;//已付款(待发货、待自提)
        $scope.DELIVERED = 3;//已发货/待收货
        $scope.DEAL = 4;//交易完成
        $scope.CANCELED = 5;//已取消
        $scope.CANCELING = 6;//等待取消(取消申请中)
        $scope.CANCEL_PAYED = 7;//7付款后取消(交易终止、拒收)

        /*待评价订单常量*/
        $scope.WAIT_REMARK = '4';//显示待评价订单列表

        /*订单类型*/
        $scope.TYPE_ALL = 0;//混合式订单
        $scope.TYPE_MALL = 1;//商城订单

        $scope.fromType = $stateParams.orderStatus;//4：待评价

        /*方法定义*/
        $scope.loadData = loadData;
        $scope.getStatus = getStatus;//获取订单状态
        $scope.confirmReceive = confirmReceive;//确认收货
        $scope.getOrder = getOrder;//获取订单数据
        $scope.doRefreshOrders = doRefreshOrders;//刷新订单列表
        $scope.remarkOrder = remarkOrder;//评价晒单
        $scope.toOrderDetail = toOrderDetail;//订单详情
        $scope.toImmediatePay = toImmediatePay;//立即付款
        $scope.onContentScroll = onContentScroll;//列表滚动，判断是否显示返回顶部
        $scope.scrollTop = scrollTop;//滚动到顶部

        //判断是否刷新页面
        $scope.$on('$ionicView.beforeEnter',function(){
            if($stateParams.reload && !$scope.orderDataList){
                loadData();
            }
        });

        /*页面初始化*/
        function loadData(){
            scrollTop();

            pageIndex = 1;//列表分页索引
            $scope.hasMoreOrder = false;
            $scope.orderDataList = [];
            $scope.networkError = false;//网络异常标志初始化
            $scope.showToTopImage = false;//显示返回顶部

            console.log('order-list show--> order status = ' + $scope.fromType);
            if($scope.fromType){
                listType = parseInt($scope.fromType);//判断页面订单类型：待付款、待发货、待收货、待评价、我的订单
            }

            //根据fromType判断显示的订单标题
            switch ($scope.fromType) {
                case '1':
                    $scope.pageTitle = '待付款';
                    break;
                case '2':
                    $scope.pageTitle = '待发货';
                    break;
                case '3':
                    $scope.pageTitle = '待收货';
                    break;
                case '4':
                    $scope.pageTitle = '待评价';
                    break;
                default:
                    $scope.pageTitle = '我的订单';
                    break;
            }
            getOrder(false);
        }

        //接收详情页面的广播，刷新列表数据
        $rootScope.$on('RefreshOrderList',function(event,data){
            console.log('接收广播 刷新订单列表');
            doRefreshOrders();
        });

        /*返回顶部*/
        function scrollTop(){
            $ionicScrollDelegate.$getByHandle('orderContent').scrollTop();//滚动到顶部
        }

        /*列表滚动，判断是否显示返回顶部*/
        function onContentScroll(){
            var position = $ionicScrollDelegate.$getByHandle('orderContent').getScrollPosition();//获取滚动位置

            $scope.$apply(function(){
                $scope.showToTopImage = position.top > $rootScope.deviceHeight / 3.0;
                console.log($scope.showToTopImage);
            });
        }

        /**获取订单状态*/
        function getStatus(orderStatus,orderType) {
            var statusText = '';
            switch (orderStatus) {
                case $scope.DEAL:
                    statusText = '交易完成';
                    break;
                case $scope.NOT_PAY:
                    statusText = '待付款';
                    break;
                case $scope.PAYED:
                    statusText = '已付款';
                    break;
                case $scope.DELIVERED:
                    statusText = '待收货';
                    break;
                case $scope.NOT_DELIVERED://1:快递到家 3:免税店自提',
                    if(orderType == 1){
                        statusText = '待发货';
                    } else {
                        statusText = '待自提取货';
                    }
                    break;
                case $scope.CANCELED:
                case $scope.CANCEL_PAYED:
                    statusText = '已取消';
                    break;
                case $scope.CANCELING:
                    statusText = '取消申请中';//等待取消(取消申请中)
                    break;
            }
            return statusText;
        }

        /**获取订单列表*/
        function getOrder(loadMore){
            if(loadMore){
                pageIndex++;
            }
            console.log('pageIndex = ' + pageIndex);

            if($scope.fromType && $scope.fromType == '4'){
                //获取待评价订单列表
                var url = UrlService.getUrl('WAIT_REMARK_ORDERS');
                var params = {
                    currentPageNo: pageIndex,
                    pageSize:pageSize
                };

                $scope.responseBack = false;//隐藏暂无数据
                $scope.networkError = false;//不显示网络错误

                $http.post(url,params).success(function(response){
                    console.log('获取待评价订单列表 response = ' + JSON.stringify(response));
                    $scope.responseBack = true;
                    //网络异常、服务器出错
                    if(!response || response == CDFG_NETWORK_ERROR){
                        $scope.networkError = true;
                        return;
                    }

                    parseData(response,loadMore);
                }).error(function(response){
                    $scope.responseBack = true;
                    PopupService.alertPopup(CDFG_NETWORK_ERROR);
                });

            } else {
                // 订单类型：待付款、待发货、待收货、待评价、我的订单
                var orderParams = {
                    currentPageNo:pageIndex,
                    pageSize:pageSize,
                    status:listType
                };
                console.log('获取订单列表request == ' + JSON.stringify(orderParams));

                $scope.responseBack = false;//隐藏暂无数据
                $scope.networkError = false;//不显示网络错误

                $http.post(UrlService.getUrl('GET_ORDER_LIST'),orderParams).success(function (response) {
                    console.log('获取订单列表  response == ' + JSON.stringify(response));
                    $scope.responseBack = true;
                    //网络异常、服务器出错
                    if(!response || response == CDFG_NETWORK_ERROR){
                        $scope.networkError = true;
                        return;
                    }

                    parseData(response,loadMore);
                }).error(function(response){
                    $scope.responseBack = true;
                    PopupService.alertPopup(CDFG_NETWORK_ERROR);
                });
            }

        }

        //解析服务器返回的数据
        function parseData(response,loadMore){
            if(response.code == 1){
                var resultObject = response.data;

                /*解析数据*/
                var orderArray = [];
                if(resultObject.result != '[]'){
                    orderArray = resultObject.result;
                }

                /*遍历数据*/
                for (var i = 0, len = orderArray.length; i < len; i++) {
                    var orderData = orderArray[i];
                    if (orderData.items.length > 1){
                        //设置多个商品时的滚动区域宽度
                        orderArray[i].items.scrollWidth = ((0.9375 + 4.0625) * orderData.items.length) + 'rem';
                    }
                    if(orderData.orderType == $scope.TYPE_MALL || orderData.orderType == $scope.TYPE_ALL){
                        //判断显示的店铺名称
                        orderData.storeName = '中免';
                    }
                }

                if(loadMore){
                    //加载下一页时，连接数据
                    $scope.orderDataList = $scope.orderDataList.concat(orderArray);
                } else{
                    $scope.orderDataList = orderArray;
                }

                $timeout(function(){
                    //判断是否还有下一页
                    $scope.hasMoreOrder = ((pageIndex*pageSize) < resultObject.totalRecord);
                },500);

                fixAllScroll(orderArray);
            } else {
                var alertText = response.data? response.data : '获取数据失败';
                PopupService.alertPopup(alertText);
            }
            if(loadMore){
                $scope.$broadcast('scroll.infiniteScrollComplete');
            }

        }

        /*返回上一页*/
        $scope.goBack = function () {
            $ionicViewSwitcher.nextDirection('back');
            $ionicHistory.goBack();
            clearData();
        };

        //Android设备back键按下
        $rootScope.$on('goBack',function(event,data){
            if($location.path().indexOf('order-list') > 0) {
                clearData();
            }
        });

        /*清除数据*/
        function clearData(){
            $scope.orderDataList = null;
        }

        /*立即付款*/
        function toImmediatePay(orderId) {
            console.log('我的订单列表-->orderId = ' + orderId);
            $state.go('paytype',{'orderId': orderId});
        }

        /*确认收货*/
        function confirmReceive(orderId) {
            console.log('我的订单列表-->确认收货 orderId = ' + orderId);
            PopupService.confirmPopup('是否确认收到货物？').then(function(res){
                if(res){
                    var confirmUrl = UrlService.getUrl('CONFIRM_RECEIVE');
                    var params = {
                        orderId:orderId
                    };
                    console.log('确认收货 request = ' + JSON.stringify(params));
                    $http.post(confirmUrl,params).success(function(response){
                        console.log('确认收货 response = ' + JSON.stringify(response));

                        //网络异常、服务器出错
                        if(!response || response == CDFG_NETWORK_ERROR){
                            $scope.networkError = true;
                            return;
                        }

                        if(response.code == 1){
                            PopupService.alertPopup('确认收货成功！');
                            doRefreshOrders();
                        } else {
                            var errorText = response.data? response.data:'确认收货失败';
                            PopupService.alertPopup(errorText);
                        }
                    }).error(function(response){
                        PopupService.alertPopup(CDFG_NETWORK_ERROR);
                    });
                }
            });
        }

        /*评价晒单*/
        function remarkOrder(orderId, goodsData) {
            console.log('我的订单列表-->评价晒单 orderId = ' + orderId +
                'goods = ' + JSON.stringify(goodsData));
            if (goodsData.length == 1) {//只有一个商品
                var params = {
                    'orderId':orderId,
                    'itemId':goodsData[0].id
                };
                console.log(JSON.stringify(params));
                $state.go('remark-goods', params);
            } else {
                //多个商品
                $state.go('remark-goods-list',{'orderId':orderId});
            }
        }

        /*订单详情*/
        function toOrderDetail(orderId) {
            console.log('我的订单列表-->查看订单详情 orderId = ' + orderId);
            $state.go('order-detail', {'orderId': orderId},{reload:true});
        }

        /*下拉刷新*/
        function doRefreshOrders() {
            console.log('refresh personal orders');
            pageIndex = 1;
            $ionicScrollDelegate.$getByHandle('orderContent').scrollTop();
            getOrder(false);
            $scope.$broadcast('scroll.refreshComplete');
        }

        /*水平滚动影响列表上下滑动的 处理*/
        function fixScrollMethod(horizontalName) {
            var sv = $ionicScrollDelegate.$getByHandle(horizontalName).getScrollView();
            if(!sv){
                return;
            }

            var container = sv.__container;

            var originaltouchStart = sv.touchStart;
            var originalmouseDown = sv.mouseDown;
            var originaltouchMove = sv.touchMove;
            var originalmouseMove = sv.mouseMove;

            container.removeEventListener('touchstart', sv.touchStart);
            container.removeEventListener('mousedown', sv.mouseDown);
            document.removeEventListener('touchmove', sv.touchMove);
            document.removeEventListener('mousemove', sv.mousemove);


            sv.touchStart = function (e) {
                e.preventDefault = function () {
                };
                originaltouchStart.apply(sv, [e]);
            };

            sv.touchMove = function (e) {
                e.preventDefault = function () {
                };
                originaltouchMove.apply(sv, [e]);
            };

            sv.mouseDown = function (e) {
                e.preventDefault = function () {
                };
                if(originalmouseDown){
                    originalmouseDown.apply(sv, [e]);
                }
            };

            sv.mouseMove = function (e) {
                e.preventDefault = function () {
                };
                if(originalmouseMove){
                    originalmouseMove.apply(sv, [e]);
                }
            };

            container.addEventListener("touchstart", sv.touchStart, false);
            container.addEventListener("mousedown", sv.mouseDown, false);
            document.addEventListener("touchmove", sv.touchMove, false);
            document.addEventListener("mousemove", sv.mouseMove, false);
        }

        /*水平滚动影响列表上下滑动的 处理*/
        function fixAllScroll(dataList){
            $timeout(function(){
                for (var i = 0; i < dataList.length; i++) {
                    if(dataList[i].items.length > 1){
                        fixScrollMethod(dataList[i].id);
                    }
                }
            },1000);
        }

        /*进入免税店*/
        $scope.toShopDetail = function (shopId) {
            if(!shopId){
                return;
            }
            console.log('我的订单列表-->免税店详情 shopId = ' + shopId);
            $state.go('shop', {'id': shopId});
        };
    }
]);