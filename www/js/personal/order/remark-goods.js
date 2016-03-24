/**
 * 个人中心-->评价商品
 * Created by geshuo on 2015/6/25.
 */
cdfgApp.controller('RemarkGoodsController',['$scope','$http','$ionicHistory','$ionicPopup','$stateParams','$state',
    '$ionicLoading','UserService','PopupService','UrlService', '$rootScope',
    function($scope,$http,$ionicHistory,$ionicPopup,$stateParams,$state,$ionicLoading,UserService,PopupService,
             UrlService, $rootScope){
    var orderId = $stateParams.orderId;
    var itemId = $stateParams.itemId;
    var orderType = 1;

    $scope.isAnonymity = true;

    /*方法定义*/
    $scope.loadData = loadData;//加载数据
    $scope.checkAnonymity = checkAnonymity;//checkbox点击
    $scope.submitRemark = submitRemark;//提交评价

    var mallLevels = [{
            label:'商品满意度：',
            value:0
        },
        {
            label:'商品包装满意度：',
            value:0
        }];
    var shopLevels = [{
            label:'商品满意度：',
            value:0
        },
        {
            label:'服务满意度：',
            value:0
        },
        {
            label:'商品包装满意度：',
            value:0
        }];


    /*返回上一页*/
    $scope.goBack = function(){
        $ionicHistory.goBack();
    };

    //页面显示的评分数据
    $scope.ratingData = {
        ratingText:'',
        isAnonymity:true
    };

    loadData();
    //初始化数据
    function loadData(){
        var getGoodsUrl = UrlService.getUrl('ORDER_DETAIL');
        var getGoodsParams = {
            orderId: orderId
        };
        $http.post(getGoodsUrl,getGoodsParams).success(function(response){
            console.log('获取订单详情 response= ' + JSON.stringify(response));
            $scope.$broadcast('scroll.refreshComplete');
            //网络异常、服务器出错
            if(!response || response == CDFG_NETWORK_ERROR){
                return;
            }

            if(response && response.code == 1){
                orderType = response.data.orderType;
                $scope.ratingData.ratingBars = (orderType == 1)?mallLevels:shopLevels;
                if(response.data.items.length != 0){
                    for(var i = 0,len = response.data.items.length; i < len;i++){
                        console.log('i = ' + i + '  itemId = ' + itemId + '  responseId = ' + response.data.items[i].id);
                        if(itemId == response.data.items[i].id){
                            $scope.goodsData = response.data.items[i];
                            break;
                        }
                    }
                } else {
                    var errorNoData = response.data?response.data:'获取数据失败';
                    PopupService.alertPopup(errorNoData)
                }
            } else {
                var errorText = response.data? response.data:'获取数据失败';
                PopupService.alertPopup(errorText);
            }
        }).error(function(response){
            $scope.$broadcast('scroll.refreshComplete');
            PopupService.alertPopup(CDFG_NETWORK_ERROR);
        });
    }

    //提交评价
    function submitRemark(){
        if($scope.ratingData.ratingBars[0].value == 0){
            PopupService.alertPopup('请完成商品满意度评分');
            return;
        } else {
            if(orderType == 1){
                if($scope.ratingData.ratingBars[1].value == 0){
                    PopupService.alertPopup('请完成商品包装满意度评分');
                    return;
                }
            } else {
                if($scope.ratingData.ratingBars[1].value == 0){
                    PopupService.alertPopup('请完成服务满意度评分');
                    return;
                } else if($scope.ratingData.ratingBars[2].value == 0){
                    PopupService.alertPopup('请完成商品包装满意度评分');
                    return;
                }
            }

        }

        if($scope.ratingData.ratingText.length < 10){
            PopupService.alertPopup('评价内容不能少于10个字');
            return;
        } else if($scope.ratingData.ratingText.length > 500){
            PopupService.alertPopup('评价内容不能多于500个字');
            return;
        }
        var url = UrlService.getUrl('REMARK_GOODS');
        //var url = 'http://192.168.103.122:8080/if4app/my/comment/add';
        var user = UserService.getUser();
        var params =   {
            order:orderId,
            prodId:$scope.goodsData.prodId,
            sku:$scope.goodsData.skuId + '',
            loginName: user.loginName,
            nickName:user.nickName,
            goodsRate:$scope.ratingData.ratingBars[0].value,
            content:$scope.ratingData.ratingText,
            isAnonymous:$scope.ratingData.isAnonymity
        };
        if(orderType == 1){
            params.packageRate = $scope.ratingData.ratingBars[1].value;
        } else {
            params.serviceRate = $scope.ratingData.ratingBars[1].value;
            params.packageRate = $scope.ratingData.ratingBars[2].value;
        }
        console.log('提交评价 request = ' + JSON.stringify(params));
        $http.post(url,params).success(function(response){
            console.log('提交评价 response = ' + JSON.stringify(response));

            //网络异常、服务器出错
            if(!response || response == CDFG_NETWORK_ERROR){
                return;
            }

            if(response.code == 1){
                PopupService.showPrompt('评价成功');

                $rootScope.$broadcast("RefreshOrderList");//刷新订单列表
                $scope.goBack();
            }else{
                var errorText = response.data?response.data:'评价失败';
                PopupService.alertPopup(errorText);
            }
        }).error(function(response){
            PopupService.alertPopup(CDFG_NETWORK_ERROR);
        });
    }

    //checkbox选择
    function checkAnonymity(){
        $scope.ratingData.isAnonymity = !$scope.ratingData.isAnonymity;
    }

}]);

//自定义指令：评分星星  by葛硕 2015/07/06
cdfgApp.directive('ratingBar',function(){
    return{
        restrict:'E',
        template:
            '<div class="cdfg-remark-wrapper">' +
                '<a href="javascript:;" ng-class="{\'cdfg-rating-light\':ratingValue>=1,\'cdfg-rating-fade\':ratingValue<1}" ng-click="rating(1)"></a>' +
                '<a href="javascript:;" ng-class="{\'cdfg-rating-light\':ratingValue>=2,\'cdfg-rating-fade\':ratingValue<2}" ng-click="rating(2)"></a>' +
                '<a href="javascript:;" ng-class="{\'cdfg-rating-light\':ratingValue>=3,\'cdfg-rating-fade\':ratingValue<3}" ng-click="rating(3)"></a>' +
                '<a href="javascript:;" ng-class="{\'cdfg-rating-light\':ratingValue>=4,\'cdfg-rating-fade\':ratingValue<4}" ng-click="rating(4)"></a>' +
                '<a href="javascript:;" ng-class="{\'cdfg-rating-light\':ratingValue>=5,\'cdfg-rating-fade\':ratingValue<5}" ng-click="rating(5)"></a>' +
            '</div>',
        replace:true,
        scope:{
            ratingValue:'=value'//绑定到value属性上
        },
        controller:['$scope',function($scope){
            $scope.ratingValue = 0;
            $scope.rating = function(index){
                console.log('index = ' + index);
                $scope.ratingValue = index;

            };
        }]
    }
});