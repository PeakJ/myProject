/**
 * 个人中心-->售后服务进度
 * Created by 葛硕 on 2015/07/08.
 */

cdfgApp.controller('AfterSaleProgressController', ['$scope', '$ionicHistory', '$state', '$stateParams',
        'UrlService', '$http', 'PopupService','$timeout',
        function ($scope, $ionicHistory, $state, $stateParams, UrlService, $http, PopupService,$timeout) {
            var getInfoUrl = UrlService.getUrl('AFTER_SALE_PROGRESS');

            //接收上个页面的参数
            $scope.orderId = $stateParams.orderId;
            $scope.itemId = $stateParams.itemId;
            $scope.progressData = {};//页面数据

            /*方法定义*/
            $scope.loadData = loadData;
            $scope.toOrderDetail = toOrderDetail;//查看订单详情
            $scope.toApplyImages = toApplyImages;

            /*返回上一页*/
            $scope.goBack = function () {
                $ionicHistory.goBack();
            };

            loadData();//初始化数据

            /*初始化数据*/
            function loadData() {
                var params = {
                    orderId: $scope.orderId,
                    itemId: $scope.itemId
                };

                console.log('获取售后进度  url = ' + getInfoUrl + '  request = ' + JSON.stringify(params));
                $http.post(getInfoUrl, params).success(function (response) {
                    console.log('获取售后进度  response = ' + JSON.stringify(response));
                    $scope.$broadcast('scroll.refreshComplete');
                    //网络异常、服务器出错
                    if(!response || response == CDFG_NETWORK_ERROR){
                        return;
                    }

                    if (response.code == 1) {
                        var resultObject = response.data;

                        resultObject.returnTypeText = getServiceType(resultObject.serviceType);
                        resultObject.reasonTypeText = getReasonType(resultObject.reasonType);

                        if(resultObject.progress.length != 0){
                            resultObject.statusText = getStatus(resultObject.progress[0].status);
                        }

                        $scope.progressData = resultObject;

                        if(resultObject.evidencePicUrl){
                            $scope.progressData.imageList = [];
                            var url = resultObject.evidencePicUrl.split('|');
                            console.log('url.length' + url.length);

                            var count = 0;
                            var dataList = [];
                            for(var i = 0,len = url.length;i<len;i++){
                                var imageData = {};
                                imageData.url = url[i];
                                imageData.isVertical = false;

                                var imageLoad = new Image();
                                imageLoad.src = UrlService.getUrl('IMAGE_FILTER') + url[i];
                                imageLoad.onload = function () {
                                    //根据图片宽和高 判断图片是横向的还是竖向的
                                    dataList[count].isVertical = this.width < this.height;

                                    $scope.progressData.imageList[count] = dataList[count];
                                    count++;
                                };
                                dataList.push(imageData)
                            }
                        }
                    } else {
                        var errorText = response.data ? response.data : '获取数据失败';
                        PopupService.alertPopup(errorText);
                    }
                }).error(function (response) {
                    $scope.$broadcast('scroll.refreshComplete');
                    PopupService.alertPopup(CDFG_NETWORK_ERROR);
                });
            }


            //服务类型  1:维修,2:退货,3:换货',
            function getServiceType(type) {
                var typeText = '';
                switch (type) {
                    case 1:
                        typeText = '维修';
                        break;
                    case 2:
                        typeText = '退货';
                        break;
                    case 3:
                        typeText = '换货';
                        break;
                }
                return typeText;
            }

            //获取退款类型 1:尺码问题,2:质量问题,3:与实际描述不符,4:7天无理由退款,5:其它
            function getReasonType(type){
                var reason = '';
                switch (type) {
                    case 1:
                        reason = '尺码问题';
                        break;
                    case 2:
                        reason = '质量问题';
                        break;
                    case 3:
                        reason = '与实际描述不符';
                        break;
                    case 4:
                        reason = '7天无理由退款';
                        break;
                    case 5:
                        reason = '其他';
                        break;
                }
                return reason;
            }

            //售后状态  1:待审核,5:待收货,10:待处理,15:完成,20:审核不通过,25:拒绝收货
            function getStatus(status) {
                var statusText = '';
                switch (status) {
                    case 1:
                        statusText = '待审核';
                        break;
                    case 5:
                        statusText = '待收货';
                        break;
                    case 10:
                        statusText = '待处理';
                        break;
                    case 15:
                        statusText = '退款完成';
                        break;
                    case 20:
                        statusText = '审核不通过';
                        break;
                    case 25:
                        statusText = '拒绝收货';
                        break;
                }
                return statusText;
            }

            //跳转到订单详情
            function toOrderDetail(orderId) {
                console.log('申请售后服务-->查看订单详情 orderId = ' + orderId);
                $state.go('order-detail', {'orderId': orderId});
            }

            function toApplyImages(index) {
                console.log('售后进度-->图片编辑');
                var params = {
                    'imageList': JSON.stringify($scope.progressData.imageList),
                    'index': index,
                    'fromProgress':true
                };
                $state.go('apply-images', params);
            }
        }]
);