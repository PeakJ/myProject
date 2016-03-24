/**
 * 个人中心-->中免卡
 * Created by geshuo on 2015/07/09.
 */
cdfgApp.controller('CardListController', ['$scope', '$ionicHistory', '$state', '$ionicLoading',
        '$ionicViewSwitcher', 'UserService', 'UrlService', 'PopupService', '$timeout', '$http',
        '$ionicScrollDelegate', '$rootScope',
        function ($scope, $ionicHistory, $state, $ionicLoading, $ionicViewSwitcher,
                  UserService, UrlService, PopupService, $timeout, $http, $ionicScrollDelegate, $rootScope) {
            var length = 10;
            $scope.cardPayList = [];//消费记录
            $scope.rechargeList = [];//充值记录
            $scope.cardData = {};//中免卡余额、验证码数据
            $scope.rechargeParams = {};//充值参数
            $scope.indexObj = {};

            /*方法定义*/
            $scope.loadData = loadData;
            $scope.changeValidate = changeValidate;//更换验证码
            $scope.recharge = rechargeCard;//中免卡充值
            $scope.toOrderDetail = toOrderDetail;//跳转到订单详情

            $scope.payListBack = false;
            $scope.payListError = false;
            $scope.getPayList = getPayList;//获取消费记录列表
            $scope.scrollPayToTop = scrollPayToTop;//消费记录--返回顶部
            $scope.onPayListScroll = onPayListScroll;//消费记录--列表滚动
            $scope.showPayTopImage = false;//消费记录--显示返回顶部标志位

            $scope.rechargeListBack = false;
            $scope.rechargeListError = false;
            $scope.getRechargeList = getRechargeList;//获取充值记录列表
            $scope.scrollRechargeToTop = scrollRechargeToTop;//充值记录--返回顶部
            $scope.onRechargeListScroll = onRechargeListScroll;//充值记录--列表滚动中
            $scope.showRechargeTopImage = false;//充值记录--显示返回顶部标志位


            var payIndex = 1;//获取消费记录索引
            var rechargeIndex = 1;//充值记录索引

            /*返回上一页*/
            $scope.goBack = function () {
                $ionicViewSwitcher.nextDirection('back');
                $ionicHistory.goBack();
            };

            loadData();
            /*页面初始化*/
            function loadData() {
                //获取余额
                $http.post(UrlService.getUrl('GET_CARD_MONEY')).success(function (response) {
                    console.log('获取中免卡余额  response == ' + JSON.stringify(response));
                    $scope.$broadcast('scroll.refreshComplete');
                    //网络异常、服务器出错
                    if (!response || response == CDFG_NETWORK_ERROR) {
                        return;
                    }

                    switch (response.code) {
                        case '1':
                            $scope.cardData.cardMoney = response.data.balance;//中免卡余额
                            break;
                        case '-30':
                            //PopupService.alertPopup('当前账户存在异常，请重新登录');
                            break;
                        case '0':
                            PopupService.alertPopup('系统错误');
                            break;
                        case '-40':
                            //PopupService.alertPopup('您还没有绑定手机号码，请先绑定手机号码');
                            break;
                        case '-50':
                            //PopupService.alertPopup('您还没有设置支付密码，请先设置支付密码');
                            break;
                        default :
                            var errorText = response.data ? response.data : '获取数据失败';
                            PopupService.alertPopup(errorText);
                            break;
                    }

                }).error(function (response) {
                    $scope.$broadcast('scroll.refreshComplete');
                    PopupService.alertPopup(CDFG_NETWORK_ERROR);
                });

                changeValidate();
                getPayList(false);
                getRechargeList(false);
            }

            //查看订单详情
            function toOrderDetail(orderId) {
                console.log('中免卡-->查看订单详情 orderId = ' + orderId);
                $state.go('order-detail', {'orderId': orderId});
            }

            /*获取消费记录*/
            function getPayList(loadMore) {
                console.log('getPayList-----------loadmore = ' + loadMore);
                payIndex = loadMore ? (payIndex + 1) : 1;
                var payListParams = {
                    pageNo: payIndex,
                    pageSize: length
                };

                $scope.payListBack = false;
                $scope.payListError = false;
                //var debugUrl = 'datas/cardList.json';//debug用：本地数据
                $http.post(UrlService.getUrl('GET_PAY_LIST'), payListParams).success(function (response) {
                    finish(loadMore);
                    console.log('获取消费记录  response == ' + JSON.stringify(response));
                    $scope.payListBack = true;
                    //网络异常、服务器出错
                    if (!response || response == CDFG_NETWORK_ERROR) {
                        $scope.payListError = true;
                        return;
                    }

                    if (response.code == 1) {
                        var payList = response.data.result;

                        if (loadMore) {
                            $scope.cardPayList = $scope.cardPayList.concat(payList);
                        } else {
                            $scope.cardPayList = [];
                            $scope.cardPayList = payList;
                        }

                        $timeout(function () {
                            console.log('payIndex*length = ' + (payIndex * length) + ' response.data.totalRecord = ' + response.data.totalRecord);
                            $scope.hasMorePayData = (payIndex * length < response.data.totalRecord);
                        }, 500);
                    } else {
                        if ($scope.indexObj.index == 1) {
                            var errorText = response.data ? response.data : '获取数据失败';
                            PopupService.alertPopup(errorText);
                        }
                    }
                }).error(function (response) {
                    finish(loadMore);
                    $scope.payListBack = true;
                    $scope.payListError = true;
                    if ($scope.indexObj.index == 2) {
                        PopupService.alertPopup(CDFG_NETWORK_ERROR);
                    }
                });
            }

            /* 消费记录--返回顶部 */
            function scrollPayToTop(){
                $ionicScrollDelegate.$getByHandle('payHandle').scrollTop();
            }

            /* 消费记录滚动中 */
            function onPayListScroll(){
                var position = $ionicScrollDelegate.$getByHandle('payHandle').getScrollPosition();//获取滚动位置

                $scope.$apply(function(){
                    $scope.showPayTopImage = position.top > $rootScope.deviceHeight / 3.0;
                });
            }

            //加载完成，通知页面隐藏进度条
            function finish(loadMore){
                if(loadMore){
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                } else {
                    $scope.$broadcast('scroll.refreshComplete');
                }
            }

            /*获取充值记录*/
            function getRechargeList(loadMore) {
                console.log('获取更多充值记录   getRechargeList start');
                rechargeIndex = loadMore ? (rechargeIndex + 1) : 1;
                var rechargeListParams = {
                    pageNo: rechargeIndex,
                    pageSize: length
                };

                $scope.rechargeListBack = false;
                $scope.rechargeListError = false;
                //var debugUrl = 'datas/cardRechargeList.json';//debug用：本地数据
                $http.post(UrlService.getUrl('GET_RECHARGE_LIST'), rechargeListParams).success(function (response) {
                    finish(loadMore);
                    console.log('中免卡充值记录  response == ' + JSON.stringify(response));
                    $scope.rechargeListBack = true;
                    //网络异常、服务器出错
                    if (!response || response == CDFG_NETWORK_ERROR) {
                        $scope.rechargeListError = true;
                        return;
                    }
                    if (response.code == 1) {

                        if (loadMore) {
                            $scope.rechargeList = $scope.rechargeList.concat(response.data.result);
                        } else {
                            $scope.rechargeList = [];
                            $scope.rechargeList = response.data.result;
                        }

                        $timeout(function () {
                            $scope.hasMoreRechargeData = (rechargeIndex * length < response.data.totalRecord);
                        }, 500);

                    } else {
                        if ($scope.indexObj.index == 2) {
                            //当前页面为 充值记录页面
                            var errorText = response.data ? response.data : '获取数据失败';
                            PopupService.alertPopup(errorText);
                        }
                    }
                }).error(function (response) {
                    finish(loadMore);
                    $scope.rechargeListBack = true;
                    $scope.rechargeListError = true;
                    if ($scope.indexObj.index == 2) {
                        PopupService.alertPopup(CDFG_NETWORK_ERROR);
                    }
                });
            }

            /* 充值记录--返回顶部 */
            function scrollRechargeToTop(){
                $ionicScrollDelegate.$getByHandle('rechargeHandle').scrollTop();
            }

            /* 消费记录滚动中 */
            function onRechargeListScroll(){
                var position = $ionicScrollDelegate.$getByHandle('rechargeHandle').getScrollPosition();//获取滚动位置

                $scope.$apply(function(){
                    $scope.showRechargeTopImage = position.top > $rootScope.deviceHeight / 3.0;
                });
            }

            /*提交充值请求*/
            function rechargeCard() {
                var str = "充值卡号：" + $scope.rechargeParams.cardNo +
                    " 密码:" + $scope.rechargeParams.password +
                    " 验证码：" + $scope.rechargeParams.validateCode;
                console.log('提交充值  ' + str);
                if (!$scope.rechargeParams.cardNo) {
                    PopupService.alertPopup('充值卡号不能为空');
                } else if (!$scope.rechargeParams.password) {
                    PopupService.alertPopup('中免卡密码不能为空');
                } else if (!$scope.rechargeParams.validateCode) {
                    PopupService.alertPopup('验证码不能为空');
                } else {
                    var rechargeParams = {
                        cardCode: $scope.rechargeParams.cardNo,
                        pwd: $scope.rechargeParams.password,
                        validCode: $scope.rechargeParams.validateCode
                    };
                    $http.post(UrlService.getUrl('RECHARGE_CARD'), rechargeParams).success(function (response) {
                        console.log('中免卡充值 response == ' + JSON.stringify(response));

                        changeValidate();//刷新验证码
                        $scope.rechargeParams.validateCode = '';

                        //网络异常、服务器出错
                        if (!response || response == CDFG_NETWORK_ERROR) {
                            return;
                        }

                        switch (response.code) {
                            // 1：成功，-10图片验证失败 -20卡号错了 -30没生成过验证码 -1系统异常
                            case '1':
                                $scope.cardData.cardMoney = response.data.balance;
                                //response.data.recharge;充入金额
                                console.log('充值成功');
                                PopupService.showPrompt('充值成功');
                                $scope.rechargeParams = {};
                                getRechargeList(false);//重新加载充值记录列表

                                break;
                            case '-10':
                                //验证码错误
                                PopupService.alertPopup('验证码错误');
                                break;
                            case '-20':
                                //卡号或密码错误
                                PopupService.alertPopup('卡号或密码错误');
                                break;
                            case '-30':
                                //没生成过验证码
                                PopupService.alertPopup('验证码已失效，请重试');
                                break;
                            case '-1':
                                PopupService.alertPopup('系统异常，请联系客服');
                                break;
                            case '-50':
                                //提示用户设置支付密码
                                PopupService.confirmPopup('充值失败', '为了您的帐户安全，请您设置支付密码').then(function (res) {
                                    if (res) {
                                        console.log('设置支付密码');
                                        $state.go('payPassword');
                                    }
                                });
                                break;
                            default :
                                var errorText = response.data ? response.data : '充值失败';
                                PopupService.alertPopup(errorText);
                                break;
                        }
                    }).error(function (response) {
                        PopupService.alertPopup(CDFG_NETWORK_ERROR);
                    });
                }
            }

            //更换验证码
            function changeValidate() {
                console.log('更换验证码');
                //更换验证码
                $timeout(function () {
                    $scope.cardData.validateCode = '';
                    $scope.cardData.validateCode = UrlService.getUrl('GET_VALIDATE_CODE') +
                        '?userId=' + UserService.getUser().userId +
                        '&userInfo=' + UserService.getUser().userInfo +
                        '&ticket=' + UserService.getUser().ticket +
                        '&random=' + Math.random();
                }, 500);
            }
        }]
);