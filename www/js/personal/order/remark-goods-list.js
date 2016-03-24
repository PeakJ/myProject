/**
 * 个人中心-->待评价商品列表
 * Created by geshuo on 2015/6/25.
 */
cdfgApp.controller('RemarkGoodsListController',['$scope','$ionicHistory','$stateParams','$state','UrlService',
    'PopupService','$http', '$rootScope',
    function($scope,$ionicHistory,$stateParams,$state,UrlService,PopupService,$http, $rootScope){
    var orderId = $stateParams.orderId;

    $scope.loadData = loadData;//加载数据

    //Android设备back键按下
    $rootScope.$on('goBack',function(event,data){
        clearData();
    });

    /*清除数据*/
    function clearData(){
        $scope.goodsList = null;
    }

    //判断是否刷新页面
    $scope.$on('$ionicView.beforeEnter',function(){
        if(!$scope.goodsList){
            loadData();
        }
    });

    //页面初始化
    function loadData(){
        var goodsRequest = {
            orderId:orderId
        };
        $http.post(UrlService.getUrl('ORDER_DETAIL'),goodsRequest).success(function(response){
            console.log('获取待评价商品  response =  ' + JSON.stringify(response));
            $scope.$broadcast('scroll.refreshComplete');
            //网络异常、服务器出错
            if(!response || response == CDFG_NETWORK_ERROR){
                return;
            }

            if(response && response.code == 1){
                $scope.goodsList = response.data.items;
            } else {
                var errorText = response.data?response.data:'获取数据失败';
                PopupService.alertPopup(errorText);
            }
        }).error(function(response){
            $scope.$broadcast('scroll.refreshComplete');
            PopupService.alertPopup(CDFG_NETWORK_ERROR);
        });
    }


    /*返回上一页*/
    $scope.goBack = function(){
        $ionicHistory.goBack();
        clearData();
    };

    //评价商品
    $scope.toRemarkGoods = function(index){
        console.log('评价商品 goods = ' + JSON.stringify($scope.goodsList[index]));
        var params = {
            'orderId': orderId,
            'itemId':$scope.goodsList[index].id
        };
        $state.go('remark-goods',params);
    };
}]);