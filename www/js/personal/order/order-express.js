/**
 * 个人中心-->物流详情
 * Created by geshuo on 2015/07/01.
 */
cdfgApp.controller('OrderExpressController',['$scope','$ionicHistory','$http','$stateParams','UrlService','PopupService',
        function($scope,$ionicHistory,$http,$stateParams,UrlService,PopupService){
            $scope.expressData = {};
            $scope.expressData.awbNo = $stateParams.awbNo;//运单号
            $scope.expressData.lcId = $stateParams.lcId;//物流公司Id
            $scope.expressData.lcName = $stateParams.lcName;//物流公司名称

            /*方法定义*/
            $scope.loadData = loadData;//加载数据

            loadData();

            //初始化数据
            function loadData(){
                //物流详情 请求参数
                var params = {
                    awbNo: $scope.expressData.awbNo,
                    lcId: $scope.expressData.lcId
                };
                $http.post(UrlService.getUrl('EXPRESS_DETAIL'),params).success(function(response){
                    console.log('获取物流详情 response = ' + JSON.stringify(response));
                    $scope.$broadcast('scroll.refreshComplete');
                    //网络异常、服务器出错
                    if(!response || response == CDFG_NETWORK_ERROR){
                        return;
                    }

                    if(response.code == 1){
                        var data = response.data;
                        for(var i = 0,len = data.length; i < len; i++){
                            data[i].info = data[i].address + ' ' + data[i].remark;
                        }
                        if(data.length != 0){
                            $scope.expressData.statusText = getStatus(data[0].code);
                        }
                        $scope.expressData.detail = data;
                    } else {
                        // WEBAPI错误处理
                        var errorText = response.data? response.data:'获取物流信息失败';
                        PopupService.alertPopup(errorText);
                    }
                }).error(function(response){
                    $scope.$broadcast('scroll.refreshComplete');
                    // WEBAPI错误处理
                    PopupService.alertPopup(CDFG_NETWORK_ERROR);
                });
            }

            //获取物流状态
            function getStatus(status){
                if(status == 80 || status == 8000){
                    return '签收成功';
                } else {
                    return '待签收';
                }
            }

            /*返回上一页*/
            $scope.goBack = function(){
                $ionicHistory.goBack();
            };

        }]
);