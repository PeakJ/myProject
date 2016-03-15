/**
 * Created by 11150421050181 on 2015/7/23.
 */
/**
 * 出差管理路由
 * 张俊辉
 * 2015-07-23 10:45
 */
bomApp.config(['$stateProvider', function ($stateProvider) {
    $stateProvider
        //出差管理 出差添加
        .state('businessTripAdd', {
            url: '/businessTripAdd',
            templateUrl: 'modules/businessTrip/view/add.html',
            controller: 'businessTripAddCtrl'
        })
        //出差管理 出差详情
        .state('businessTripDetails', {
            url: '/businessTripDetails/:businessTripId',
            templateUrl: 'modules/businessTrip/view/details.html',
            controller: 'businessTripDetailsCtrl'
        })
        //出差管理 出差计划
        .state('businessTripAddPlan', {
            //params: ['whichPlace','cityData'],
            url: '/businessTripAddPlan/:whichTab/:whichPlace/:cityId/:cityName/:planId',
            // abstract:true,
            templateUrl: 'modules/businessTrip/view/plan.html',
            controller: 'businessTripAddPlanCtrl'
        })
        //城市页面路由
        .state('businessTripAddPlanCity', {
            //params: ['getwhichPlace'],
            url: "/businessTripAddPlanCity/:whichTab/:whichPlace/:planId",
            templateUrl: "modules/businessTrip/view/templates/city.html",
            controller: 'businessTripAddPlanCityCtrl'
        })
        //出差管理 出差审核
        .state('businessTripApproval', {
            url: "/businessTripApproval/:businessTripId",
            templateUrl: "modules/businessTrip/view/approval.html",
            controller: 'businessTripApprovalCtrl'
        })
        //出差管理 知会给我的出差
        .state('tellMeBusinessTripApproval',{
            url:"/tellMeBusinessTripApproval/:businessTripId",
            templateUrl: "modules/businessTrip/view/tellme.html",
            controller: 'tellMeBusinessTripApprovalCtrl'
        })

        /*出差申请列表
            姜峰*/
        .state('businessTripApply',{
            url:'/businessTripApply',
            templateUrl:'modules/businessTrip/view/mybusinesstripapply.html',
            controller: 'businessTripApplyCtrl'
        })

        /*待我审核的出差列表
        姜峰*/
        .state('waitingCheck',{
            url:'/waitingCheck',
            templateUrl:'modules/businessTrip/view/waitingcheck.html',
            controller: 'waitingCheckCtrl'
        })
       /* 我审核过的出差列表
        姜峰*/
        .state('haveChecked',{
            url:'/haveChecked',
            templateUrl:'modules/businessTrip/view/havechecked.html',
            controller: 'haveCheckedCtrl'
        })
        /*抄送给我的出差列表
        姜峰*/
        .state('sendCopy',{
            url:'/sendCopy/:id/：name',
            templateUrl:'modules/businessTrip/view/sendcopybusinesstrip.html',
            controller: 'sendCopyCtrl'
        });
        /*返回列表页
        姜峰*/
       /* .state('tripList',{
            url:'/tripList',
            templateUrl:'modules/businessTrip/view/list.html',
            controller: 'businessTripListCtrl'
        })*/
}]);