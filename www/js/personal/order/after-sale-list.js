/**
 * 个人中心-->售后订单列表
 * Created by 葛硕 on 2015/07/07.
 */
cdfgApp.controller('AfterSaleListController', ['$scope', '$ionicHistory', '$state', 'PopupService',
        '$ionicViewSwitcher', '$stateParams', '$http', 'UrlService', '$timeout', '$rootScope', '$ionicScrollDelegate',
        '$location',
        function ($scope, $ionicHistory, $state, PopupService, $ionicViewSwitcher, $stateParams, $http,
                  UrlService, $timeout, $rootScope, $ionicScrollDelegate, $location) {
            var pageIndex = 1;//当前页码
            var pageSize = 10;//每页数据条数
            var getAfterSaleListUrl = UrlService.getUrl('GET_ORDER_LIST');//http请求路径

            var orderId = $stateParams.orderId;//订单id
            $scope.fromType = $stateParams.fromType;//1:从订单详情 点击‘返修/退货’进入
            $scope.FROM_ORDER_DETAIL = 1;//从订单详情也跳转过来
            $scope.showAll = false;//是否显示全部
            $scope.hasMoreOrder = false;//是否有更多数据，判断是否加载下一页
            $scope.afterSaleList = null;//页面列表数据

            /*方法定义*/
            $scope.loadData = loadData;//加载数据
            $scope.getOrderList = getOrderList;//获取订单列表
            $scope.toAfterSaleApply = toAfterSaleApply;//申请售后
            $scope.toOrderDetail = toOrderDetail;//查看订单详情
            $scope.toAfterSaleProgress = toAfterSaleProgress;//查看售后进度
            $scope.showOrHideGoods = showOrHideGoods;//显示或隐藏商品

            $scope.onContentScroll = onContentScroll;//列表滚动，判断是否显示返回顶部
            $scope.scrollTop = scrollTop;//滚动到顶部

            /*返回上一页*/
            $scope.goBack = function () {
                $ionicViewSwitcher.nextDirection('back');//设置动画方向
                $ionicHistory.goBack();
                clearData();
            };

            //接收广播，刷新列表数据
            $rootScope.$on('RefreshAfterSaleList',function(event,data){
                console.log('接收广播 刷新订单列表');
                getOrderList(false);
            });

            //判断是否刷新页面
            $scope.$on('$ionicView.beforeEnter',function(){
                if(!$scope.afterSaleList){
                    loadData();
                }
            });

            //Android设备back键按下
            $rootScope.$on('goBack',function(event,data){
                if($location.path().indexOf('after-sale-list') > 0){
                    clearData();
                }
            });

            /*清除数据*/
            function clearData(){
                $scope.afterSaleList = null;
            }

            //初始化数据
            function loadData() {
                $scope.pageTitle = '售后服务-订单列表';
                $scope.showToTopImage = false;//显示返回顶部
                scrollTop();

                getOrderList(false);
            }

            function getOrderList(isLoadMore) {
                console.log('获取列表 isLoadMore = ' + isLoadMore);

                if(!isLoadMore){
                    //如果不是加载下一页，就清空数据，重新请求
                    $scope.afterSaleList = [];
                }

                pageIndex = isLoadMore ? (pageIndex + 1) : pageIndex;
                //售后列表数据-->售后状态：售后申请中（点击查看进度）、客服待收货、售后关闭、已退货、可申请售后。
                var params = {
                    currentPageNo: pageIndex,
                    pageSize: pageSize,
                    status: 4
                };

                $scope.responseBack = false;//不显示无数据画面
                $scope.networkError = false;//不显示网络错误
                //获取售后服务订单列表
                $http.post(getAfterSaleListUrl, params).success(function (response) {
                    finish();
                    console.log('售后订单列表 response = ' + JSON.stringify(response));
                    $scope.responseBack = true;
                    //网络异常、服务器出错
                    if(!response || response == CDFG_NETWORK_ERROR){
                        $scope.networkError = true;
                        return;
                    }

                    if (response && response.code == '1') {
                        var resultObject = response.data;
                        for(var i = 0,len = resultObject.result.length; i <len;i++){
                            for(var j = 0,len2 = resultObject.result[i].items.length; j < len2;j++){
                                var item = resultObject.result[i].items[j];
                                item.statusText = getGoodsStatus(item.afterSale);
                            }
                        }

                        if (isLoadMore) {
                            $scope.afterSaleList = $scope.afterSaleList.concat(resultObject.result);
                        } else {
                            $scope.afterSaleList = resultObject.result;
                        }

                        $timeout(function () {
                            $scope.hasMoreOrder = pageIndex * pageSize < resultObject.totalRecord;
                        }, 500);
                    } else {
                        var errorText = (response && response.data) ? response.data : '获取数据失败';
                        PopupService.alertPopup(errorText);
                    }

                }).error(function (response) {
                    finish();
                    $scope.responseBack = true;
                    $scope.networkError = true;
                    PopupService.alertPopup(CDFG_NETWORK_ERROR);
                });

                function finish(){
                    if (isLoadMore) {
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                    } else {
                        $scope.$broadcast('scroll.refreshComplete');
                    }
                }
            }

            /*返回顶部*/
            function scrollTop(){
                $ionicScrollDelegate.$getByHandle('afterSaleHandle').scrollTop();//滚动到顶部
            }

            /*列表滚动，判断是否显示返回顶部*/
            function onContentScroll(){
                var position = $ionicScrollDelegate.$getByHandle('afterSaleHandle').getScrollPosition();//获取滚动位置

                $scope.$apply(function(){
                    $scope.showToTopImage = position.top > $rootScope.deviceHeight / 3.0;
                    console.log($scope.showToTopImage);
                });
            }

            //获取售后状态
            function getGoodsStatus(status) {
                //售后状态  0:未申请,1:待审核,5:待收货,10:待处理,15:完成,20:审核不通过,25:拒绝收货
                var statusText = '';
                if ($scope.fromType == 1) {
                    statusText = '申请售后';
                } else {
                    switch (status) {
                        case 0:
                            statusText = '申请售后';
                            break;
                        case 1:
                            statusText = '售后申请中...';
                            break;
                        case 5:
                        case 10:
                            statusText = '客服' + '    ' + '待收货';
                            break;
                        case 15:
                            statusText = '已退货';
                            break;
                        case 20:
                        case 25:
                            statusText = '售后关闭';
                            break;
                    }
                }
                return statusText;
            }

            //显示或隐藏更多商品
            function showOrHideGoods() {
                console.log('Show or hide all goods');
                $scope.showAll = !$scope.showAll;
            }

            //跳转到订单详情
            function toOrderDetail(orderId) {
                if (!$scope.fromType || $scope.fromType != $scope.FROM_ORDER_DETAIL) {
                    console.log('售后订单列表-->查看订单详情 orderId = ' + orderId);
                    $state.go('order-detail', {'orderId': orderId});
                }
            }

            //跳转到申请售后
            function toAfterSaleApply(orderId,goodsData,goodsCount) {
                console.log('售后订单列表-->申请售后 orderId' + orderId + ' goodsData = ' + JSON.stringify(goodsData));
                var params = {
                    'orderId': orderId,
                    'goodsData':JSON.stringify(goodsData),
                    'goodsCount':goodsCount
                };
                $state.go('after-sale-apply', params);
            }

            //跳转到售后进度
            function toAfterSaleProgress(orderId, itemId) {
                console.log('售后订单列表-->查看售后进度 orderId = ' + orderId + ' itemId = ' + itemId);
                var params = {
                    'orderId': orderId,
                    'itemId':itemId
                };
                $state.go('after-sale-progress', params);
            }
        }]
);