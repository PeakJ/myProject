/**
 * 个人中心-->我的优惠券
 * Created by geshuo on 2015/07/09.
 */
cdfgApp.controller('CouponListController', ['$scope', '$ionicHistory', '$ionicViewSwitcher', '$ionicLoading',
        '$timeout', 'UserService', 'PopupService', '$http', 'UrlService', '$ionicScrollDelegate', '$rootScope',
        function ($scope, $ionicHistory, $ionicViewSwitcher, $ionicLoading, $timeout, UserService, PopupService,
                  $http, UrlService, $ionicScrollDelegate, $rootScope) {
            var pageSize = 10;
            $scope.rechargeParams = {};

            $scope.couponList = [];//可用优惠券列表数据
            $scope.availableError = false;//可用优惠券http请求网络错误
            $scope.availableBack = false;//可用优惠券http请求返回
            $scope.hasMoreAvailable = false;//是否有更多可用优惠券
            $scope.loadAvailableList = loadAvailableList;//加载可用优惠券列表
            $scope.indexObj = {};//页面索引
            $scope.showAvailableTop = false;//显示返回顶部图片--可用优惠券列表
            $scope.availableToTop = availableToTop;//返回顶部
            $scope.availableScroll = availableScroll;//滚动页面监听

            var availableIndex = 1;//可用优惠券页码索引

            $scope.couponHistoryList = [];
            $scope.historyError = false;//历史优惠券http请求网络错误
            $scope.historyBack = false;//历史优惠券http请求返回
            $scope.hasMoreHistory = false;//是否有更多历史优惠券
            $scope.loadHistoryList = loadHistoryList;//加载历史优惠券列表
            $scope.showHistoryTop = false;//显示返回顶部图片--历史优惠券列表
            $scope.historyToTop = historyToTop;//返回顶部
            $scope.historyScroll = historyScroll;//滚动页面监听

            var historyIndex = 1;//历史优惠券页面索引

            $scope.bindCoupon = bindCoupon;


            /*返回上一页*/
            $scope.goBack = function () {
                $ionicViewSwitcher.nextDirection('back');
                $ionicHistory.goBack();
            };

            loadAvailableList(false);
            loadHistoryList(false);

            /**
             * 获取更多可用优惠券
             * */
            function loadAvailableList(loadMore) {
                console.log('loadMoreAvailable---loadmore = ' + loadMore);
                availableIndex = loadMore ? (availableIndex + 1) : 1;
                //userInfo,userId,ticket，type,page,pageSize
                var availableParams = {
                    type: 1,
                    page: availableIndex,
                    pageSize: pageSize
                };
                console.log('可用优惠券列表 request == ' + JSON.stringify(availableParams));

                $scope.availableBack = false;
                $scope.availableError = false;
                //获取可用优惠券列表
                //var debugUrl = 'datas/couponList.json';//debug用
                var availableUrl = UrlService.getUrl('GET_COUPONS');
                $http.post(availableUrl, availableParams).success(function (response) {
                    console.log('可用优惠券列表 response == ' + JSON.stringify(response));
                    //加载完毕
                    finish(loadMore);
                    $scope.availableBack = true;
                    //网络异常、服务器出错
                    if (!response || response == CDFG_NETWORK_ERROR) {
                        $scope.availableError = true;
                        return;
                    }

                    if (response.code == 1) {
                        var couponList = formatTime(response.data.coupons);
                        if (loadMore) {
                            $scope.couponList = $scope.couponList.concat(couponList);
                        } else {
                            $scope.couponList = [];
                            $scope.couponList = couponList;
                        }

                        //避免 立即加载下一页
                        $timeout(function () {
                            //判断是否有更多可用优惠券
                            $scope.hasMoreAvailable = ((availableIndex + 1) * pageSize < response.data.total);
                        }, 500);
                    } else {
                        if ($scope.indexObj.index == 0) {
                            PopupService.alertPopup(response.data);
                        }
                    }

                }).error(function (response) {
                    $scope.availableBack = true;
                    $scope.availableError = true;
                    if ($scope.indexObj.index == 0) {
                        PopupService.alertPopup(CDFG_NETWORK_ERROR);
                    }
                    finish(loadMore);
                });
            }

            /**
             * 获取历史优惠券
             * */
            function loadHistoryList(loadMore) {
                console.log('loadHistoryList--------------loadMore = ' + loadMore);
                historyIndex = loadMore ? (historyIndex + 1) : 1;
                //历史优惠券类型传4
                var historyParams = {
                    type: 4,
                    page: historyIndex,
                    pageSize: pageSize
                };

                console.log('历史优惠券列表 request == ' + JSON.stringify(historyParams));
                $scope.historyError = false;//历史优惠券http请求网络错误
                $scope.historyBack = false;
                //获取历史优惠券
                //var debugUrl = 'datas/couponHistoryList.json';//debug用
                var historyUrl = UrlService.getUrl('GET_COUPONS');
                $http.post(historyUrl, historyParams).success(function (response) {
                    console.log('历史优惠券列表 response == ' + JSON.stringify(response));
                    finish(loadMore);
                    $scope.historyBack = true;
                    //网络异常、服务器出错
                    if (!response || response == CDFG_NETWORK_ERROR) {
                        $scope.historyError = true;
                        return;
                    }

                    if (response.code == 1) {
                        var couponList = formatTime(response.data.coupons);

                        if (loadMore) {
                            $scope.couponHistoryList = $scope.couponHistoryList.concat(couponList);
                        } else {
                            $scope.couponHistoryList = [];
                            $scope.couponHistoryList = couponList;
                        }

                        //判断是否有更多历史优惠券
                        $scope.hasMoreHistory = ((historyIndex + 1) * pageSize < response.data.total);
                    } else {
                        if ($scope.indexObj.index == 1) {
                            PopupService.alertPopup(response.data);
                        }
                    }
                }).error(function (response) {
                    $scope.historyBack = true;
                    $scope.historyError = true;
                    if ($scope.indexObj.index == 1) {
                        PopupService.alertPopup(CDFG_NETWORK_ERROR);
                    }
                    finish(loadMore);
                });
            }

            function finish(isLoadMore) {
                if (isLoadMore) {
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                } else {
                    $scope.$broadcast('scroll.refreshComplete');
                }
            }

            //绑定优惠券
            function bindCoupon() {
                console.log('绑定优惠券--couponNo = ' + $scope.rechargeParams.couponNo);
                if (!$scope.rechargeParams.couponNo) {
                    return;
                }
                var bindParams = {
                    couponCode: $scope.rechargeParams.couponNo
                };
                console.log('绑定优惠券 request params == ' + JSON.stringify(bindParams));
                $http.post(UrlService.getUrl('BIND_COUPON'), bindParams).success(function (response) {
                    console.log('绑定优惠券 response == ' + JSON.stringify(response));

                    //网络异常、服务器出错
                    if (!response || response == CDFG_NETWORK_ERROR) {
                        return;
                    }

                    if (response && response.code == 1) {
                        console.log('绑定成功');
                        //PopupService.promptPopup('绑定成功');
                        PopupService.showPrompt('绑定成功');
                        loadAvailableList(false);
                        $scope.rechargeParams.couponNo = '';
                    } else {
                        var errorText = response.data ? response.data : '绑定失败';
                        PopupService.alertPopup(errorText);
                    }
                }).error(function (response) {
                    PopupService.alertPopup(CDFG_NETWORK_ERROR);
                });
            }

            /**转换时间格式*/
            function formatTime(couponList) {
                //时间格式转换
                for (var i = 0, len = couponList.length; i < len; i++) {
                    if (couponList[i].timeInfo) {
                        var timeStr = couponList[i].timeInfo.split('/');
                        if (timeStr.length == 2) {
                            couponList[i].timeInfo = timeStr[0].substring(0, 10) + '~' + timeStr[1].substring(0, 10);
                        }
                    }
                }
                return couponList;
            }

            /*可用优惠券：返回顶部*/
            function availableToTop(){
                $ionicScrollDelegate.$getByHandle('availableHandle').scrollTop();
            }

            /*可用优惠券：列表滚动监听*/
            function availableScroll(){
                var position = $ionicScrollDelegate.$getByHandle('availableHandle').getScrollPosition();//获取滚动位置

                $scope.$apply(function(){
                    $scope.showAvailableTop = position.top > $rootScope.deviceHeight / 3.0;//超过高度的1/3时显示
                });
            }

            /*历史优惠券：返回顶部*/
            function historyToTop(){
                $ionicScrollDelegate.$getByHandle('historyHandle').scrollTop();
            }

            /*历史优惠券：列表滚动监听*/
            function historyScroll(){
                var position = $ionicScrollDelegate.$getByHandle('historyHandle').getScrollPosition();//获取滚动位置

                $scope.$apply(function(){
                    $scope.showHistoryTop = position.top > $rootScope.deviceHeight / 3.0;//超过1/3时显示
                });
            }
        }]
);