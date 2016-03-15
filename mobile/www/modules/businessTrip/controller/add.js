/**
 * Created by Luan Zhicheng on 15/7/17.
 */
bomApp.controller("businessTripAddCtrl",['$scope','cityServices','$window','loadingUtil','checkUtil',
    '$state','$ionicPopup','loginServices','planServices','planData','addServices','getProjectServices','userService','planData',
    function($scope,cityServices,$window,loadingUtil,checkUtil,$state,$ionicPopup,
             loginServices,planServices,planData,addServices,getProjectServices,userService,planData) {
        $scope.stayCostIf = false;
        $scope.sendState = false;
        var planDepartureTime,planDepartureDate;
        $scope.$on('$ionicView.beforeEnter',function(){
            planData.setBusinessTripData($scope.businessTrip);
            $scope.businessTripId = planData.getPlanId();
            $scope.plans = planData.getPlan($scope.businessTripId);
            console.log($scope.plans);
            for(var i = 0;i< $scope.plans.length;i++){
                if($scope.plans[i].planType == 0){
                    $scope.plans[i].planTypeName = '飞机';
                }
                if($scope.plans[i].planType == 1){
                    $scope.plans[i].planTypeName = '火车';
                }
                if($scope.plans[i].planType == 2){
                    $scope.plans[i].planTypeName = '汽车';
                }
                if($scope.plans[i].planType == 3){
                    $scope.plans[i].planTypeName = '轮船';
                }
                $scope.plans[i].planDepartureDate = $scope.plans[i].departDate.substring(0,10);
                $scope.plans[i].planDepartureTime = $scope.plans[i].departDate.substring(11,19);
            }

        });

        $scope.saveBusinessTripData = function(){
            planData.setBusinessTripData($scope.businessTrip);
            $state.go('businessTripAddPlan',{id : '涉河'});
        };
        $scope.businessTrip = {
            userId : '',
            userName : '',
            applyProjectId : '', //所属项目id
            applyProject : '',  //所属项目
            startDate : '',  //出差开始时间
            endDate : '',  //出差结束时间
            applyReason : '', //出差事由
            stayType : '', //住宿
            stayCost : '', //费用
            period : '' //出差天数
        };
        $scope.businessTrip = planData.getBusinessTripData();
        $scope.periodCount = function(){
            if($scope.businessTrip.startDate == undefined || $scope.businessTrip.endDate == undefined
                || $scope.businessTrip.startDate == '' || $scope.businessTrip.endDate == ''
                || $scope.businessTrip.startDate == null || $scope.businessTrip.endDate == null
                || $scope.businessTrip.endDate - $scope.businessTrip.startDate == ''
                || $scope.businessTrip.endDate - $scope.businessTrip.startDate == null
                || $scope.businessTrip.endDate - $scope.businessTrip.startDate == undefined
                || $scope.businessTrip.endDate - $scope.businessTrip.startDate <= 0){
                $scope.businessTrip.period = 0;
            }else{
                var startDate = Date.parse($scope.businessTrip.startDate);
                var endDate = Date.parse($scope.businessTrip.endDate);
                $scope.businessTrip.period = (endDate - startDate)/(60*60*24*1000) + 1;
            }
        };

        $scope.$watch('businessTrip.stayType',function(newVal,oldVal){
            if(newVal == 1){
                $scope.stayCostIf = false;
            }else if(newVal == 0){
                $scope.stayCostIf = true;
            }else{
                $scope.stayCostIf = false;
            }
        });

        $scope.submit = function() {
            $scope.businessTrip.applyProject = getProjectServices.getById($scope.businessTrip.applyProjectId);
            $scope.businessTrip.userId = userService.getUserId();
            $scope.businessTrip.userName = userService.getUserName();
            //弹出警告对话框
            $scope.f_alert = function (alertInfo) {
                var alertPopup = $ionicPopup.alert({
                    title: '提示',
                    template: alertInfo
                });
            };
            console.log($scope.businessTrip.applyProjectId);
            var data={
                projectId : $scope.businessTrip.applyProjectId
            }
            planData.setPlan(data);
            $scope.flag = false;
            if (checkUtil.f_check_project_empty($scope.businessTrip.applyProjectId)) {
                if (checkUtil.f_check_date_empty($scope.businessTrip.startDate)) {
                    if (checkUtil.f_check_date_empty($scope.businessTrip.endDate)) {
                        if (checkUtil.f_check_applyReason_empty($scope.businessTrip.applyReason)) {
                            if (checkUtil.f_check_stayType_empty($scope.businessTrip.stayType)) {

                                if($scope.businessTrip.stayType != 1){
                                    if (checkUtil.f_check_stayCost($scope.businessTrip.stayCost)) {
                                        if ($scope.plans.length > 0) {
                                            $scope.flag = true;
                                        }else{
                                            $scope.f_alert('至少添加一项交通计划');
                                        }
                                    }
                                }else{
                                    if ($scope.plans.length > 0) {
                                        $scope.flag = true;
                                    }else{
                                        $scope.f_alert('至少添加一项交通计划');
                                    }
                                }
                            }
                        }
                    }
                }
            }
            var applyProjectId = $scope.businessTrip.applyProjectId;
            console.log(applyProjectId);
            if ($scope.flag == true) {
                $scope.addBusinessTripData = {
                    userId : $scope.businessTrip.userId,
                    userName : $scope.businessTrip.userName,
                    applyProjectId : $scope.businessTrip.applyProjectId, //所属项目id
                    applyProject : $scope.businessTrip.applyProject,  //所属项目
                    startDate : $scope.businessTrip.startDate,  //出差开始时间
                    endDate : $scope.businessTrip.endDate,  //出差结束时间
                    applyReason : $scope.businessTrip.applyReason, //出差事由
                    stayType : $scope.businessTrip.stayType, //住宿
                    stayCost : $scope.businessTrip.stayCost //费用
                };
                if($scope.addBusinessTripData.stayCost == '' || $scope.addBusinessTripData.stayCost == null){
                    $scope.addBusinessTripData.stayCost = 0;
                }
                if($scope.addBusinessTripData.startDate>$scope.addBusinessTripData.endDate){
                    $scope.f_alert('开始日期不能大于结束日期');
                }else{
                    loadingUtil.showLoading('提交中');
                    addServices.get(JSON.stringify($scope.addBusinessTripData), JSON
                        .stringify($scope.plans),applyProjectId).then(function (data) {
                        //$window.setTimeout("$scope.failure();",5000);   //设置等待时间
                        if (data == "success") {
                            $scope.sendState = true;
                            loadingUtil.hide();
                            $scope.f_alert('添加成功');
                            $state.go('tab.businessTrip');
                            $scope.clear();
                        }else{
                            $scope.f_alert('添加失败，请重试');
                        }
                    })
                }
            }
        };

        //$scope.failure = function(){  //设置等待失败情况
        //    if(!$scope.sendState){
        //        loadingUtil.hide();
        //        $scope.f_alert('添加失败，请重试');
        //    }
        //}

        $scope.clear = function () {    //清楚页面数据
            $scope.businessTrip.applyProject = '';
            $scope.businessTrip.applyProjectId = '';
            $scope.businessTrip.applyReason = '';
            $scope.businessTrip.endDate = '';
            $scope.businessTrip.startDate = '';
            $scope.businessTrip.stayCost = '';
            $scope.businessTrip.stayType = '';
            $scope.businessTrip.period = '';
            $scope.sendState = false;
            $scope.stayCostIf = false;
            cityServices.setLocationCity('');   //返回到主页面，地理位置将被清除
        }
    }]);
/**
 * 初始化所属项目信息
 * 张俊辉
 * 2015-07-27 13:53
 */
bomApp.controller('projectCtrl',['$scope','getProjectServices',function($scope,getProjectServices){
    $scope.projects=[];
    getProjectServices.get().then(function(data){
        for(var i=0;i<data.length;i++){
            $scope.projects.push({
                id : data[i].id,
                name : data[i].name
            })
        }
    });
}]);

/**
 *初始化住宿信息
 * 张俊辉
 * 2015-07-28 17:38
 */
bomApp.controller('stayCtrl',['$scope',function($scope){
    $scope.stay = [
        {
            id : "0",
            name : "酒店"
        },{
            id : "1",
            name : "租房"
        }
    ];
}]);