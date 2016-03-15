/**
 * Created by 11150421050181 on 2015/7/23.
 */
/**
 *出差计划
 * 张俊辉
 * 2015-07-23 10:31
 */
bomApp.controller('businessTripAddPlanCtrl', ['$scope', '$ionicTabsDelegate', 'planData', '$stateParams', '$state', 'checkUtil',
    function ($scope, $ionicTabsDelegate, planData, $stateParams, $state, checkUtil) {
        $scope.$on('$ionicView.beforeEnter', function () {
            console.log($stateParams.planId + ":planId");
            console.log(planData.getPlanById($stateParams.planId));
            $scope.whichTab = $stateParams.whichTab;
            $scope.whichPlace = $stateParams.whichPlace;
            //从选择城市返回的情况
            if ($scope.whichPlace != '' && $scope.whichPlace != undefined && $scope.whichPlace != null) {
                $ionicTabsDelegate.$getByHandle('trafficTabs').select(parseInt($scope.whichTab));
                $scope.tabSelect($scope.whichTab);
                //从添加出差进入的情况
            } else if ($scope.whichPlace == '' || $scope.whichPlace == undefined || $scope.whichPlace == null) {
             //从添加出差的交通计划模块进入
                $scope.planId = $stateParams.planId;
                if ($scope.planId != '' && $scope.planId != undefined && $scope.planId != null) {
                    $ionicTabsDelegate.$getByHandle('trafficTabs').select(parseInt($scope.plansDetail.planType));
                    $scope.tabSelect(parseInt($scope.plansDetail.planType));
                } else {
                //直接从添加出差进入
                    $ionicTabsDelegate.$getByHandle('trafficTabs').select(0);
                    $scope.tabSelect(0);
                }
            }
        });

        $scope.plandata = {
            businessTripId: '',
            planType: '',
            departurePlace: '',
            departurePlaceId: '',
            destination: '',
            destinationId: '',
            departDate: '',
            trafficNumber: '',
            discount: '',
            price: ''
        };
        /*从申请出差已有信息进入到交通计划进行修改删除的页面显示*/
        $scope.planId = $stateParams.planId;
        /*判断是否是修改删除页面*/
        if ($scope.planId != '' && $scope.planId != undefined && $scope.planId != null) {
            /*按钮隐藏*/
            if ( $scope.planId  != null) {
                $scope.editTrafficplan = true;
            } else {
                $scope.editTrafficplan = false;
            }
            $scope.plansDetail = planData.getPlanById($scope.planId);
            $scope.plandata.planType = $scope.plansDetail.planType;
            $scope.plandata.planTypeName = $scope.plansDetail.planTypeName;
            $scope.plandata.departurePlace = $scope.plansDetail.departurePlace;
            $scope.plandata.departurePlaceId = $scope.plansDetail.departurePlaceId;
            $scope.plandata.destination = $scope.plansDetail.destination;
            $scope.plandata.destinationId = $scope.plansDetail.destinationId;
            $scope.plandata.departDate = $scope.plansDetail.departDate;
            $scope.plandata.trafficNumber = $scope.plansDetail.trafficNumber;
            $scope.plandata.discount = $scope.plansDetail.discount;
            $scope.plandata.price = $scope.plansDetail.price;
        }
        $scope.whichTab = $stateParams.whichTab;
        $scope.whichPlace = $stateParams.whichPlace;
        $scope.businessTripId = planData.getPlanId();
        if ($scope.whichPlace != '' && $scope.whichPlace != undefined && $scope.whichPlace != null) {

            $scope.plandata = planData.getPlanCache();
            var departurePlaceId = '';
            var departurePlace = '';
            var destinationId = '';
            var destination = '';
            if ($scope.whichPlace == 'departure' && $stateParams.cityId != '') {
                departurePlaceId = $stateParams.cityId;
                departurePlace = $stateParams.cityName;
                $scope.plandata.departurePlace = departurePlace;
                $scope.plandata.departurePlaceId = departurePlaceId;
            } else if ($scope.whichPlace == 'destination' && $stateParams.cityId != '') {
                destinationId = $stateParams.cityId;
                destination = $stateParams.cityName;
                $scope.plandata.destination = destination;
                $scope.plandata.destinationId = destinationId;
            }
        }

        $scope.onclick = function () {
            //文本校验
            var flag = true;
            if (!checkUtil.f_check_chinese($scope.plandata.departurePlace)) {
                checkUtil.f_alert_test("请选择出发地");
                flag = false;
            }
            else if (!checkUtil.f_check_chinese($scope.plandata.destination)) {
                checkUtil.f_alert_test("请选择目的地");
                flag = false;
            }
            else if (!checkUtil.f_check_empty($scope.plandata.departDate)) {
                checkUtil.f_alert_test("请选择出发时间");
                flag = false;
            }
            else if ($scope.plandata.planType != '3' && !checkUtil.f_check_numberletter($scope.plandata.trafficNumber)) {
                checkUtil.f_alert($scope.trafficname,"请输入字母、数字或其组合");
                flag = false;
            }
            else if ($scope.plandata.planType == '3' && !checkUtil.f_check_empty($scope.plandata.trafficNumber)) {
                checkUtil.f_alert_test("请填写船名");
                flag = false;
            }
            else if ($scope.plandata.planType == '0' &&!checkUtil.f_check_numberlimit($scope.plandata.discount)) {
                checkUtil.f_alert_test("折扣请输入1～10");
                flag = false;
            }
            else if (!checkUtil.f_check_float($scope.plandata.price)) {
                checkUtil.f_alert_test("价格请输入数字");
                flag = false;
            }
            else {
                flag = true;
            }
            var data = {
                planId:$scope.planId,
                businessTripId: $scope.businessTripId,
                planType: $scope.plandata.planType,
                departurePlace: $scope.plandata.departurePlace,
                departurePlaceId: $scope.plandata.departurePlaceId,
                destination: $scope.plandata.destination,
                destinationId: $scope.plandata.destinationId,
                departDate: $scope.plandata.departDate,
                trafficNumber: $scope.plandata.trafficNumber,
                discount: $scope.plandata.discount,
                price: $scope.plandata.price
            };
            //页面间数据传递
            if (flag) {
                /*判断是否是从已有信息进入修改*/
                if ( $scope.planId  != null) {
                    planData.deletePlanById($scope.planId);
                }
                planData.setPlan(data);
                $state.go('businessTripAdd');
                $scope.clearPage();
            };
        };

        //tabs选择方法
        $scope.tabSelect = function (index) {

            $scope.discountHide = false;
            if (index == 1) {
                $scope.whichTab = 1;
                $scope.trafficname = '车次';
                $scope.plandata.planType = '1 ';
                $scope.plandata.discount = '10';
            } else if (index == 2) {
                $scope.whichTab = 2;
                $scope.trafficname = '班次';
                $scope.plandata.planType = '2';
                $scope.plandata.discount = '10';
            } else if (index == 3) {
                $scope.whichTab = 3;
                $scope.trafficname = '船名';
                $scope.plandata.planType = '3';
                $scope.plandata.discount = '10';
            } else if (index == 0) {
            //判断是否为修改时折扣
                if($stateParams.planId != '' && $stateParams.planId != undefined && $stateParams.planId != null){
                    $scope.plandata.discount = $scope.plansDetail.discount;
                }else{
                    //
                    $scope.plandata.discount = '';
                }
                $scope.whichTab = 0;
                $scope.discountHide = true;
                $scope.trafficname = '航班';
                $scope.plandata.planType = '0';
            }
        };
        /*出发地信息*/
        $scope.getDeparture = function () {
            $scope.data = {
                planId:$stateParams.planId,
                businessTripId: $scope.businessTripId,
                planType: $scope.plandata.planType,
                departurePlace: $scope.plandata.departurePlace,
                departurePlaceId: $scope.plandata.departurePlaceId,
                destination: $scope.plandata.destination,
                destinationId: $scope.plandata.destinationId,
                departDate: $scope.plandata.departDate,
                trafficNumber: $scope.plandata.trafficNumber,
                discount: $scope.plandata.discount,
                price: $scope.plandata.price
            };
            planData.setPlanCache($scope.data);
            $state.go('businessTripAddPlanCity', {whichTab: $scope.whichTab, whichPlace: 'departure',planId:$stateParams.planId});
        };
        /*目的地信息*/
        $scope.getDestination = function () {
            $scope.data = {
                planId:$stateParams.planId,
                businessTripId: $scope.businessTripId,
                planType: $scope.plandata.planType,
                departurePlace: $scope.plandata.departurePlace,
                departurePlaceId: $scope.plandata.departurePlaceId,
                destination: $scope.plandata.destination,
                destinationId: $scope.plandata.destinationId,
                departDate: $scope.plandata.departDate,
                trafficNumber: $scope.plandata.trafficNumber,
                discount: $scope.plandata.discount,
                price: $scope.plandata.price
            };
            planData.setPlanCache($scope.data);
            $state.go('businessTripAddPlanCity', {whichTab: $scope.whichTab, whichPlace: 'destination',planId:$stateParams.planId});
        };
        /*清除页面显示*/
        $scope.clearAll = function () {
            $scope.plandata.businessTripId = '';
            $scope.plandata.departDate = '';
            $scope.plandata.departurePlace = '';
            $scope.plandata.departurePlaceId = '';
            $scope.plandata.destination = '';
            $scope.plandata.destinationId = '';
            $scope.plandata.discount = '';
            $scope.plandata.planType = '';
            $scope.plandata.price = '';
            $scope.plandata.trafficNumber = '';
        };

        $scope.clearPage = function(){
            $scope.plandata.businessTripId = '';
            $scope.plandata.departDate = '';
            $scope.plandata.departurePlace = '';
            $scope.plandata.departurePlaceId = '';
            $scope.plandata.destination = '';
            $scope.plandata.destinationId = '';
            $scope.plandata.discount = '';
            $scope.plandata.planType = '';
            $scope.plandata.price = '';
            $scope.plandata.trafficNumber = '';
        };
        /*删除交通计划*/
        $scope.removePlan = function () {
            planData.deletePlanById($scope.planId);
            $state.go('businessTripAdd');
        };
    }]);