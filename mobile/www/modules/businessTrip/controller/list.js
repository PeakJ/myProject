/**
 * Created by dhc-jiangfeng on 2015/8/11.
 */
/**
 * 出差首页
 * 姜峰
 */
bomApp.controller("businessTripListCtrl",['$scope','$state','planData','userService','typeService','planListCountService','loadingUtil',
        function($scope,$state,planData,userService,typeService,planListCountService,loadingUtil){

            var userId= "userId=" + userService.getUserId();
            var userLevel = userService.getUserLevel();
            var flag1=false;
            var flag2=true;
            $scope.userInfo = {};
            loadingUtil.show();
            typeService.get(userId).then(function (data) {

                $scope.userInfo = {
                    userType: data.userType
                };
                /*console.log(data);
                console.log($scope.userInfo.userType);*/
                if(($scope.userInfo.userType=='2')||($scope.userInfo.userType=='5')){
                    flag1=true;
                }else{
                    flag1=false;
                }
                if(($scope.userInfo.userType=='3')||($scope.userInfo.userType=='4')){
                    flag2=true;
                }else{
                    flag2=false;
                }
                $scope.userInfo={
                    userType1 : flag1,
                    userType2 : flag2
                };
                loadingUtil.hide();
            });
            $scope.myApply = function(){
                $state.go('businessTripApply')
            };

            $scope.waitingCheck = function(){
                $state.go('waitingCheck')
            };

            $scope.sendCopy = function(){
                $state.go('sendCopy')
            };

            $scope.haveChecked = function(){
                $state.go('haveChecked')
            };
            /*返回上一页*/
            $scope.goBack = function(){
                $scope.needReflesh = true;
                $state.go('home');
            };
            //新增按钮
            $scope.addBtu = function(){
                planData.setPlanId();
                $scope.needReflesh = true;
                $state.go('businessTripAdd');
            };
            $scope.noPlanListCountNumber=true;
            planListCountService.get(  userId + "&userLevel=" + userLevel).then(function (data) {
                if (data == 0) {
                    $scope.noPlanListCountNumber = false;
                }
                $scope.planListCountNumber = data;
            });
}]);