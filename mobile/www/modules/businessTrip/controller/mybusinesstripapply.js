/**
 * Created by dhc-jiangfeng on 2015/8/11.
 */
/**
 * 我申请的出差
 */
bomApp.controller('businessTripApplyCtrl',['$scope','ListServices','userService','$state','planData','common'
    ,'$ionicScrollDelegate','loadingUtil',
    function($scope,ListServices,userService,$state,planData,common,$ionicScrollDelegate,loadingUtil){
        var userId ;
        var pageNo = 1;
        $scope.businessTrips =[];
        $scope.needReflesh = true;

        $scope.$on('$ionicView.beforeEnter',function(){
            userId = userService.getUserId();
            if(userId =='-1'){
                $state.go('login');
            }
            if($scope.needReflesh){
                $scope.businessTrips =[];
                $ionicScrollDelegate.scrollTop(0);
                $scope.noMoreItemsAvailable = false;
                pageNo = 1;
                //$scope.load_more();

            }
        });

        //出差上拉更新
        $scope.load_more = function(){
            loadingUtil.show();
            var parameter = "userId="+userId+"&pageNo="+pageNo+"&pageSize="+common.pageSize();
            ListServices.get(parameter).then(function(data){
                console.log(data);
                var  dataList = data.list;
                if ( pageNo >data.last) {
                    $scope.noMoreItemsAvailable = true;
                    $scope.prompt="已经没有数据哦";
                }else{
                    for(var i = 0 ;i< dataList.length;i++){
                        $scope.businessTrips.push({
                            id : dataList[i].id,
                            startDate : dataList[i].startDate.substring(5,10),  //开始时间
                            endDate : dataList[i].endDate.substring(5,10),  //结束时间
                            applyProject : dataList[i].applyProject,  //所属项目
                            applyReason : dataList[i].applyReason,   //出差申请理由
                            status :dataList[i].status,   //审核状态
                            name: dataList[i].userName,//申请人姓名
                            price : "￥"+ dataList[i].price.toFixed(2)    //交通费用
                        })
                    }
                }
                pageNo++;
                $scope.$broadcast("scroll.infiniteScrollComplete");
                loadingUtil.hide();
            });
        };
         //新增按钮
         $scope.addBtu = function(){
         planData.setPlanId();
         $scope.needReflesh = true;
         $state.go('businessTripAdd');
         };
        //我的审批详情
        $scope.detail = function(businessTripId){
            $scope.needReflesh = false;
            $state.go('businessTripDetails',{businessTripId : businessTripId})
        };
        /*返回上一页*/
        $scope.goBackList = function(){
            $scope.needReflesh = true;
            $state.go('tab.businessTrip');
        };
    }]);
