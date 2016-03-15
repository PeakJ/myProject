/**
 * Created by 11150421040204 on 2015/8/17.
 */

/**
 * 知会我的出差
 * 韩旭
 */
bomApp.controller("tellMeBusinessTripApprovalCtrl", ['$scope', 'setMessageReadService', '$stateParams', 'detailsServices',
    '$ionicViewSwitcher', '$ionicHistory', 'loadingUtil', '$ionicPopup', 'checkResultServices', 'userService', 'photoService', 'UrlService', 'checkUtil',
    function ($scope, setMessageReadService, $stateParams, detailsServices, $ionicViewSwitcher, $ionicHistory,
              loadingUtil, $ionicPopup, checkResultServices, userService, photoService, UrlService, checkUtil) {
        $scope.businessTripId = $stateParams.businessTripId;
        var _userId = userService.getUserId();
        var _userLevel = userService.getUserLevel();
        var urlParameter = "businessTripId=" + $scope.businessTripId;
        console.log(urlParameter);
        $scope.tripapplys = [];
        $scope.judge = true;
        loadingUtil.show();
        detailsServices.get(urlParameter).then(function (data) {
            console.log(data);
            /*显示从后台传过来的数据*/
            if (data.length != 0) {
                var trafficIds = '';
                var userLevel = '';
                var status = '';
                /*出差基本信息*/
                if (data.businessTripApplys.length == 1) {
                    $scope.name = data.businessTripApplys[0].userName;
                    //$scope.id=data.businessTripApplys[0].userId;
                    $scope.reason = data.businessTripApplys[0].applyReason;
                    $scope.project = data.businessTripApplys[0].applyProject;
                    $scope.no = data.users[0].no;
                    $scope.startdate = data.businessTripApplys[0].startDate.substring(0, 10);
                    $scope.enddate = data.businessTripApplys[0].endDate.substring(0, 10);
                    $scope.createdate = data.businessTripApplys[0].createDate.substring(0, 16);
                    $scope.showdate = data.businessTripApplys[0].createDate.substring(5, 16);
                    $scope.sumdate = ",共" + GetDateDiff($scope.startdate, $scope.enddate) + "天";
                    $scope.userId = data.businessTripApplys[0].userId;
                    var photo = '';
                    var userId ="userId="+$scope.userId;
                    photoService.get(userId).then(function (data) {
                        if (!checkUtil.f_check_empty_no(data.photo)) {
                            photo = 'img/user-logo.png';
                        } else {
                            photo = UrlService.getImageUrl() + data.photo;
                        }
                        $scope.photo = photo;
                        console.log($scope.photo);
                    });
                    /*计算日期的差*/
                    function GetDateDiff(startDate, endDate) {
                        var startTime = new Date(Date.parse(startDate.replace(/-/g, "/"))).getTime();
                        var endTime = new Date(Date.parse(endDate.replace(/-/g, "/"))).getTime();
                        var dates = Math.abs((startTime - endTime)) / (1000 * 60 * 60 * 24) + 1;
                        return dates;
                    }
                }
                /*展示审核结果*/
                for (var i = 0; i < data.tripApplyChecks.length; i++) {
                    if (data.businessTripApplys[0].status == '2' || _userLevel == "5") {
                        $scope.judge = false;
                    }
                    /*一级审核结果*/
                    if (data.tripApplyChecks[i].userLevel == '4') {
                        if (data.tripApplyChecks[i].checkStatus == "0") {
                            $scope.pm_sign_color = {color: 'green'};
                            $scope.pmphoto = "ion-clock";
                            $scope.pmcheckstatus = "待审核";
                        }
                        else if (data.tripApplyChecks[i].checkStatus == "1") {
                            $scope.pm_sign_color = {color: 'green'};
                            $scope.pmphoto = "ion-checkmark";
                            $scope.pmcheckstatus = "已审核通过";
                        }
                        else if (data.tripApplyChecks[i].checkStatus == "2") {
                            $scope.pm_sign_color = {color: 'red'};
                            $scope.pmphoto = "ion-close";
                            $scope.pmcheckstatus = "未审核通过";
                        }
                        $scope.pmname = data.tripApplyChecks[i].userName;
                        if (data.tripApplyChecks[i].checkDate != null) {
                            $scope.pmcheckdate = data.tripApplyChecks[i].checkDate.substring(0, 16);
                        } else {
                            $scope.pmcheckdate = null;
                        }
                        $scope.pmreason = data.tripApplyChecks[i].checkReason;
                    }
                    /*二级审核结果*/
                    if (data.tripApplyChecks[i].userLevel == '3') {
                        if (data.tripApplyChecks[i].checkStatus == "0") {
                            $scope.bll_sign_color = {color: 'green'};
                            $scope.bllphoto = "ion-clock";
                            $scope.bllcheckstatus = "待审核";
                        }
                        else if (data.tripApplyChecks[i].checkStatus == "1") {
                            $scope.bll_sign_color = {color: 'green'};
                            $scope.bllphoto = "ion-checkmark";
                            $scope.bllcheckstatus = "已审核通过";
                        }
                        else if (data.tripApplyChecks[i].checkStatus == "2") {
                            $scope.bll_sign_color = {color: 'red'};
                            $scope.bllphoto = "ion-close";
                            $scope.bllcheckstatus = "未审核通过";
                        }
                        $scope.bllname = data.tripApplyChecks[i].userName;
                        if (data.tripApplyChecks[i].checkDate != null) {
                            $scope.bllcheckdate = data.tripApplyChecks[i].checkDate.substring(0, 16);
                        } else {
                            $scope.bllcheckdate = null;
                        }
                        $scope.bllreason = data.tripApplyChecks[i].checkReason;
                    }
                    /*一键驳回*/
                    $scope.onclick = function (index) {
                        status = data.businessTripApplys[0].status;
                        $scope.agree = {};
                        /*弹出填写审核理由的文本框*/
                        var confirmPopup = $ionicPopup.confirm({
                            title: '请输入理由（非必填）',
                            scope: $scope,
                            template: "<input type='text' ng-model='agree.reason'>",
                            buttons: [
                                {
                                    text: "<b>确定</b>",
                                    type: "button-positive",
                                    onTap: function (e) {
                                        confirmPopup.then(function (res) {
                                            console.log('理由：', res);
                                            $scope.check = {
                                                userId: _userId,
                                                businesstripId: data.businessTripApplys[0].id,
                                                reason: res,
                                                checkStatus: index,
                                                status: status,
                                                id: id,
                                                userLevel: userLevel,
                                                trafficIds: trafficIds
                                            };
                                            /*输出需要去数据库里更新的数据*/
                                            console.log($scope.check);
                                            checkResultServices.get($scope.check).then(function (data) {
                                                console.log(data);
                                                /*审核完成后跳转到上一个页面*/
                                                $ionicViewSwitcher.nextDirection('back');
                                                $ionicHistory.goBack();
                                            })
                                        });
                                        console.log($scope.agree.reason);
                                        return $scope.agree.reason;
                                    }
                                },
                                {
                                    text: "取消"
                                }
                            ]
                        });
                    };
                    if (data.tripApplyChecks[i].userId == _userId) {
                        id = data.tripApplyChecks[i].id;
                        userLevel = data.tripApplyChecks[i].userLevel;
                    }

                }
                /*显示出差计划数据*/
                for (var j = 0; j < data.traffics.length; j++) {
                    trafficIds = data.traffics[j].id + ',';
                    trafficIds = trafficIds.substring(0, trafficIds.length - 1);
                    var traffictype = 0;
                    if (data.traffics[j].type == 0)
                        traffictype = "飞机";
                    else if (data.traffics[j].type == 1)
                        traffictype = "火车";
                    else if (data.traffics[j].type == 2)
                        traffictype = "汽车";
                    else if (data.traffics[j].type == 3)
                        traffictype = "轮船";

                    $scope.tripapplys.push({
                        traffictype: traffictype,
                        number: data.traffics[j].trafficNumber,
                        departureplace: data.traffics[j].departurePlace,
                        destination: data.traffics[j].destination,
                        discount: data.traffics[j].discount + "折",
                        plancreatedate: data.traffics[j].createDate.substring(0, 10),
                        plancreateclock: data.traffics[j].createDate.substring(11, 16),
                        price: data.traffics[j].price + "元"
                    });
                }
            }
            loadingUtil.hide();
        });
    }]);
