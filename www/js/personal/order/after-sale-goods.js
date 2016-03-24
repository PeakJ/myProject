/**
 * 个人中心-->售后商品列表
 * Created by 葛硕 on 2015/08/06
 */
cdfgApp.controller('AfterSaleGoodsController', ['$scope', '$ionicHistory', '$state', 'PopupService',
        '$ionicViewSwitcher', '$stateParams', '$http', 'UrlService', '$rootScope',
        function ($scope, $ionicHistory, $state, PopupService, $ionicViewSwitcher, $stateParams, $http,
                  UrlService, $rootScope) {
            var orderId = $stateParams.orderId;//订单id

            $scope.showAll = false;//是否显示全部
            $scope.hasMoreOrder = false;
            $scope.afterSaleGoods = {};//页面数据

            /*方法定义*/
            $scope.loadData = loadData;
            $scope.toAfterSaleApply = toAfterSaleApply;//申请售后
            $scope.toOrderDetail = toOrderDetail;//查看订单详情
            $scope.toAfterSaleProgress = toAfterSaleProgress;//查看售后进度

            /*返回上一页*/
            $scope.goBack = function () {
                $ionicViewSwitcher.nextDirection('back');
                $ionicHistory.goBack();
                clearData();
            };

            //接收广播，刷新列表数据
            $rootScope.$on('RefreshAfterSaleList',function(event,data){
                console.log('接收广播 刷新售后商品列表');
                loadData();
            });

            //判断是否刷新页面
            $scope.$on('$ionicView.beforeEnter',function(){
                if($stateParams.reload && !$scope.afterSaleGoods){
                    loadData();
                }
            });

            //Android设备back键按下
            $rootScope.$on('goBack',function(event,data){
               clearData();
            });

            //初始化数据
            function loadData() {
                //查询可以申请售后的商品列表
                var getDetailUrl = UrlService.getUrl('ORDER_DETAIL');
                var getDetailParams = {
                    orderId: orderId
                };
                $http.post(getDetailUrl,getDetailParams).success(function(response){
                    console.log('获取详情  response = ' + JSON.stringify(response));
                    $scope.$broadcast('scroll.refreshComplete');
                    //网络异常、服务器出错
                    if(!response || response == CDFG_NETWORK_ERROR){
                        return;
                    }

                    if(response.code == 1){
                        for(var i = 0,len = response.data.items.length;i<len;i++){
                            response.data.items[i].statusText = getGoodsStatus(response.data.items[i].afterSale);
                        }
                        $scope.afterSaleGoods = response.data;
                    } else {
                        var errorText = response.data? response.data:'获取数据失败';
                        PopupService.alertPopup(errorText);
                    }
                }).error(function(){
                    $scope.$broadcast('scroll.refreshComplete');
                    PopupService.alertPopup(CDFG_NETWORK_ERROR);
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
                $state.go('after-sale-apply', {'orderId': orderId,'goodsData':JSON.stringify(goodsData),goodsCount:goodsCount});
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

            /*清空数据*/
            function clearData(){
                $scope.afterSaleGoods = null;
            }
        }]
);