/**
 * ValidationController
 * Created by dhc on 2015/7/13.
 */
cdfgApp.controller('ValidationController', ['$scope', 'PasswordService', 'PopupService', '$ionicHistory', 'UserService',
    function ($scope, PasswordService, PopupService, $ionicHistory, UserService) {
        $scope.goBack = goBack;
        //返回上一页
        function goBack() {
            //$ionicHistory.goBack();
            $scope.$broadcast('cdfg-password-back');
        }

        $scope.step = 'check';//check or bind or done
        $scope.phoneOrPay = 'phone';//phone or pay
        $scope.phone = {
            locker: false,
            timer: 0,
            buttonText: '获取短信验证码',
            timerId: 0,
            text: '无',
            inputCode: ''//验证码输入框
        };
        $scope.init = function () {

            $scope.validate = false;
            $scope.step = 'check';//check or bind or done
            $scope.phoneOrPay = 'phone';//phone or pay
            $scope.phone = {
                locker: false,
                timer: 0,
                buttonText: '获取短信验证码',
                timerId: 0,
                text: '无',
                inputCode: ''//验证码输入框
            };
            $scope.pay = {
                imgCode: 'img/getVerificationCode.jpg',
                inputCode: '',
                payPassword: ''
            };
            $scope.newPhone = {
                locker: false,
                timer: 0,
                buttonText: '获取短信验证码',
                timerId: 0,
                text: '无',
                inputCode: '',//验证码输入框
                newNumber: '',
                newCode: ''
            };

            PasswordService.getPhoneEmail()
                .success(function (response, status, headers, config) {
                    console.log(response);
                    $scope.phone.text = response.data.mobile;
                    if ($scope.phone.text) {
                        $scope.step = 'check';
                    } else {
                        $scope.step = 'bind';
                    }
                })
        };

        $scope.$on('cdfg-password-back', function () {
            if ($scope.step == 'check') {
                $ionicHistory.goBack();
            } else if ($scope.step == 'bind') {
                $scope.step = 'check';
            } else if ($scope.step == 'done') {
                $scope.step = 'bind';
            }
        });
        //倒计时
        $scope.startTimer = function (object) {
            object.timer = CDFG_WAITING_TIME;//倒计时秒数
            object.buttonText = '重新获取';
            object.locker = true;//锁定
            //返回当前setInterval的ID，用于停止用。
            return setInterval(function () {
                $scope.$apply(
                    function () {
                        if (object.timer > 0) {
                            object.timer = object.timer - 1;
                            console.log(object.timer);
                        } else {
                            console.log(object.timer);
                            console.log(object.timerId);
                            clearInterval(object.timerId);//停止计时
                            object.locker = false;//解锁
                            console.log(object);
                        }
                    }
                )
            }, 1000);
        };

        $scope.$on('$ionicView.enter', function () {
            $scope.init();
        });

        //获得旧手机验证码
        $scope.getPassCode = function () {
            PasswordService.getPhoneCode()
                .success(function (response, status, headers, config) {
                    console.log(response);
                });
            $scope.phone.timerId = $scope.startTimer($scope.phone);
        };
        //验证旧手机验证码
        $scope.checkCode = function () {
            $scope.validate = true;
            PasswordService.checkPhoneCode($scope.phone.inputCode)
                .success(function (response, status, headers, config) {
                    console.log(response);
                    //跳转
                    if (response.code == 1) {
                        $scope.step = 'bind';
                        $scope.validate = false;
                        $scope.newPhone.newNumber = '';
                        $scope.newPhone.newCode = '';
                    } else if (response.code == -0) {
                        PopupService.alertPopup('', '验证码错误！');
                    } else if (response.code == -40) {
                        PopupService.alertPopup('', '验证码未发送或已过期，请重新验证！');
                    } else {
                        PopupService.alertPopup('', '服务器错误，请稍后再试！');
                    }
                })
        };

        //检查支付密码
        $scope.checkByPay = function () {
            PasswordService.hasPayPassword()
                .success(function (response, status, headers, config) {
                    console.log(response);
                    if (response.code == 1 && response.data.payPwd) {
                        $scope.phoneOrPay = 'pay';
                        $scope.reflashCode();
                    } else {
                        PopupService.alertPopup('', '没有设置过支付密码', 'error');
                    }
                })
        };

        //刷新验证码
        $scope.reflashCode = function () {
            $scope.pay.imgCode = PasswordService.getVerificationCode() +
                '?userId=' + UserService.getUser().userId +
                '&userInfo=' + UserService.getUser().userInfo +
                '&ticket=' + UserService.getUser().ticket +
                '&random=' + Math.random();
        };

        //检查支付密码
        $scope.checkPhonePayCode = function () {
            PasswordService.checkPhonePayCode($scope.pay.payPassword, $scope.pay.inputCode)
                .success(function (response, status, headers, config) {
                    console.log(response);
                    //跳转
                    if (response.code == 1) {
                        $scope.step = 'bind';
                        $scope.validate = false;
                    } else if (response.code == 0) {
                        PopupService.alertPopup('', '支付密码验证失败！');
                    } else if (response.code == -10) {
                        PopupService.alertPopup('', '验证码错误或已过期，请刷新验证码。');
                    } else if (response.code == -20) {
                        PopupService.alertPopup('', '验证码错误或已过期，请刷新验证码。');
                    } else {
                        PopupService.alertPopup('', '服务器错误，请稍后再试！');
                    }
                })
        };

        //获得新手机验证码
        $scope.getNewPhoneCode = function () {
            PasswordService.getNewPhoneCode($scope.newPhone.newNumber)
                .success(function (response, status, headers, config) {
                    console.log(response);
                });
            $scope.newPhone.timerId = $scope.startTimer($scope.newPhone);
        };
        //验证新手机验证码
        $scope.checkNewPhoneCode = function () {
            if ($scope.phoneOrPay == 'phone') {

                PasswordService.checkNewPhoneCode($scope.newPhone.newCode, $scope.phone.inputCode)
                    .success(function (response, status, headers, config) {
                        console.log(response);
                        if (response.code == 1) {
                            $scope.step = 'done';
                            PopupService.alertPopup('', '更换绑定成功！')
                                .then(function () {
                                    $scope.$ionicGoBack();
                                })
                        } else if (response.code == -40) {
                            PopupService.alertPopup('', '验证码未发送或已过期，请重新验证！');
                            $scope.step = 'check';
                        } else if (response.code == 0) {
                            PopupService.alertPopup('', '服务器错误，请稍后再试！');
                            $scope.step = 'check';
                        }
                    })

            } else if ($scope.phoneOrPay == 'pay') {

                PasswordService.saveByPay($scope.pay.payPassword, $scope.newPhone.newCode)
                    .success(function (response, status, headers, config) {
                        console.log(response);
                        if (response.code == 1) {
                            $scope.step = 'done';
                            PopupService.alertPopup('', '更换绑定成功！')
                                .then(function () {
                                    $scope.$ionicGoBack();
                                })
                        } else if (response.code == -40) {
                            PopupService.alertPopup('', '验证码错误或超时。');
                            $scope.step = 'check';
                        } else if (response.code == -10) {
                            PopupService.alertPopup('', '支付密码不匹配。');
                            $scope.step = 'check';
                        } else if (response.code == 0) {
                            PopupService.alertPopup('', '系统异常，请稍后再试...');
                            $scope.step = 'check';
                        }
                    })
            }
        };

    }])
;
