/**
 * Created by dhc-jiangfeng on 2015/8/11.
 */
/*
待我审核的出差
* */
bomApp.controller('waitingCheckCtrl',['$scope','userService','$state','planData','common','approvalService',
    '$stateParams','$ionicScrollDelegate','loadingUtil',
    function($scope,userService,$state,planData,common,approvalService,$stateParams,$ionicScrollDelegate,loadingUtil){
        var userId ;
        var chatsPageNo=1;
        var userLevel;
        $scope.chats =[];
        $scope.needReflesh = true;
        $scope.$on('$ionicView.beforeEnter',function(){
            userId = userService.getUserId();
            if(userId =='-1'){
                $state.go('login');
            }

            if($scope.needReflesh){
                $scope.chats =[];
                $ionicScrollDelegate.scrollTop(0);
                $scope.noMoreItems = false;
                chatsPageNo = 1;
                //$scope.chats_more();
            }
        });

        //待我审核
        $scope.chats_more = function() {
            userLevel = userService.getUserLevel();
            if(userLevel =='2' || userLevel =='5'){
                $scope.noMoreItems = true;
                $scope.chatsPrompt="已经没有数据哦";
                return;
            }
            loadingUtil.show();
            var parameter = "userId=" + userId + "&pageNo=" + chatsPageNo + "&pageSize=" + common.pageSize()+"&status=0";
            approvalService.get(parameter).then(function (data) {
                if(chatsPageNo > data.page.last){
                    $scope.noMoreItems = true;
                    $scope.chatsPrompt="已经没有数据哦";
                }else{
                    var dataList = data.businessTripApplys;
                    for (var i = 0; i < dataList.length; i++) {
                           $scope.chats.push({
                               id: dataList[i].id,
                               startDate: dataList[i].startDate.substring(5, 10),  //开始时间
                               endDate: dataList[i].endDate.substring(5, 10),  //结束时间
                               applyProject: dataList[i].applyProject, //所属项目
                               applyReason: dataList[i].applyReason,   //出差申请理由
                               price: "￥"+dataList[i].price.toFixed(2),//交通费用
                               name: dataList[i].userName,// 申请人姓名
                               status: dataList[i].status//审核状态
                           })
                    }
                }
                chatsPageNo++;
                loadingUtil.hide();
                $scope.$broadcast("scroll.infiniteScrollComplete");
            });
        };

        //新增按钮
      /*  $scope.addBtu = function(){
            planData.setPlanId();
            $scope.needReflesh = true;
            $state.go('businessTripAdd');
        };*/
        //待我审批详情
        $scope.approval = function(businessTripId){
            $scope.needReflesh = false;
            $state.go('businessTripApproval',{businessTripId : businessTripId});
        };
        /*返回上一页*/
        $scope.goBackList = function(){
            $scope.needReflesh = true;
            $state.go('tab.businessTrip');
        };
    }]);
