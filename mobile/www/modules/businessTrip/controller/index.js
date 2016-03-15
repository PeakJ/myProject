/**
 * 出差列表
 * 张俊辉
 * 2015-07-23 15:29
 */
bomApp.controller('businessTripCtrl',['$scope','ListServices','userService','$state','planData','common','approvalService',
    '$stateParams','$ionicScrollDelegate','$ionicTabsDelegate',
    function($scope,ListServices,userService,$state,planData,common,approvalService,$stateParams,$ionicScrollDelegate,
             $ionicTabsDelegate){
        var userId ;
        var pageNo = 1;
        var chatsPageNo = 1;
        $scope.businessTrips =[];
        
        //$scope.ad ='sas';
        $scope.ad ={
            name:'a'
        };
        console.log($scope.ad.name);

        $scope.chats =[];
        $scope.needReflesh = true;
        $scope.$on('$ionicView.beforeEnter',function(){
            userId = userService.getUserId();
            console.log(userId);
            console.log($scope.needReflesh);
            if(userId =='-1'){
                $state.go('login');
            }
           /* if($scope.needReflesh){
                $ionicScrollDelegate.scrollTop(0);
                $scope.onTabs(1);
            }*/
        });
        //tab选择
       /* $scope.onTabs = function(index){
            console.log(index);
            $ionicScrollDelegate.scrollTop(0);
            if(index == 2){ // 待我审批列表
                $ionicTabsDelegate.$getByHandle('tabsHandle').select(1);
                chatsPageNo = 1;
                $scope.chats =[];
                $scope.noMoreItemsAvailable = false;
                $scope.chats_more();
            }else{   // 我的出差
                $ionicTabsDelegate.$getByHandle('tabsHandle').select(0);
                pageNo = 1;
                $scope.businessTrips =[];
                $scope.noMoreItems = false;
                $scope.load_more();
            }
        };*/
        //出差上拉更新
        $scope.load_more = function(){
            var parameter = "userId="+userId+"&pageNo="+pageNo+"&pageSize="+common.pageSize();
            ListServices.get(parameter).then(function(data){
                console.log(data);
                console.log(pageNo);
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
                            price : dataList[i].price.toFixed(2)    //交通费用
                        })
                    }
                }
                console.log($scope.businessTrips);
                pageNo++;
                $scope.$broadcast("scroll.infiniteScrollComplete");
            });
        };
        //带我审核
        $scope.chats_more = function() {
            var parameter = "userId=" + userId + "&pageNo=" + chatsPageNo + "&pageSize=" + common.pageSize();
            approvalService.get(parameter).then(function (data) {
                console.log(data);
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
                            price: dataList[i].price.toFixed(2),//交通费用
                            name: dataList[i].userName,// 申请人姓名
                            status: data.page.list[i].checkStatus//审核状态
                        })
                    }
                }
                console.log($scope.chats);
                chatsPageNo++;
                $scope.$broadcast("scroll.infiniteScrollComplete");
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
        //带我审批详情
        $scope.approval = function(businessTripId){
            $scope.needReflesh = false;
            $state.go('businessTripApproval',{businessTripId : businessTripId});
        };
        /*返回上一页*/
        $scope.goBack = function(){
            $scope.needReflesh = true;
            $state.go('home');
        };
    }]);
