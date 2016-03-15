/**
 * Created by 11150421050181 on 2015/7/19.
 */
/**
 *出差详情
 * 韩旭
 * 2015-07-20 10:31
 */
bomApp.controller("businessTripDetailsCtrl", ['$scope', 'setMessageReadService', '$stateParams', 'detailsServices',
    '$ionicViewSwitcher', '$ionicHistory', 'loadingUtil', 'photoService', 'UrlService', 'checkUtil', 'userService',
    function ($scope, setMessageReadService, $stateParams, detailsServices, $ionicViewSwitcher,
              $ionicHistory, loadingUtil, photoService, UrlService, checkUtil, userService) {
        $scope.$on('$ionicView.beforeEnter', function () {
            $scope.businessTripId = $stateParams.businessTripId;
            var urlParameter = "businessTripId=" + $scope.businessTripId;
            console.log(urlParameter);
            $scope.tripapplys = [];
            loadingUtil.show();
            //$scope.userInfo={};
            detailsServices.get(urlParameter).then(function (data) {
                console.log(data);
                /*显示从后台传过来的数据*/
                if (data.length != 0) {
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
                        var userId = "userId=" + $scope.userId;
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
                    }
                    /*显示出差计划数据*/
                    for (var j = 0; j < data.traffics.length; j++) {
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
            })
        });
    }])
;