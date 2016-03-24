/**
 * PasswordController
 * Created by dhc on 2015/7/13.
 */
cdfgApp.controller('PayPasswordController', ['$scope', 'PasswordService', '$state', 'PopupService', '$ionicHistory',
    function ($scope, PasswordService, $state, PopupService, $ionicHistory) {
        /* ADD START BY 葛硕20150808：[APP-95] bug:部分标题会显示样式错乱 -------------------------------*/
        $scope.goBack = goBack;
        //返回上一页
        function goBack() {
            //$ionicHistory.goBack();
            $scope.$broadcast('cdfg-password-back');
        }

        /* ADD END   BY 葛硕20150808：[APP-95] bug:部分标题会显示样式错乱 -------------------------------*/

    }]);

cdfgApp.controller('PayPasswordFormController', ['$scope', 'PasswordService', '$state', 'PopupService', '$ionicHistory',
    function ($scope, PasswordService, $state, PopupService, $ionicHistory) {
        $scope.init = function () {
            $scope.step = 'check';//check,password,done
            $scope.phone = {
                buttonText: '获取短信验证码',
                timer: 0,
                timerId: 0,
                locker: false,
                text: '无',
                inputCode: '',
                password: '',
                repassword: '',
                hasBindPhone: true

            };
            PasswordService.getPhoneEmail()
                .success(function (response, status, headers, config) {
                    console.log(response);
                    if (response.code == 1) {
                        if (response.data.mobile) {
                            $scope.phone.text = response.data.mobile;
                        }
                    }
                });
            PasswordService.hasPayPassword()
                .success(function (response, status, headers, config) {
                    console.log(response);

                    if (response.code == 1) {//如果获取成功
                        if (response.data.mobile) {//如果有绑定手机，则验证手机
                            $scope.step = 'check';
                            $scope.phone.hasBindPhone = true;
                        } else {//如果没有绑定手机，则去绑定
                            $scope.step = 'password';
                            $scope.phone.hasBindPhone = false;

                            PopupService.confirmPopup('提示', '设置支付密码需要先绑定手机哦！', '去绑定手机', '先不绑定')
                                .then(function (res) {
                                    console.log(res);
                                    if (res) {
                                        $state.go('bind');
                                    } else {
                                        $scope.$ionicGoBack();
                                    }

                                });
                        }
                    }
                })
        };

        $scope.$on('cdfg-password-back', function () {
            if ($scope.step == 'check') {
                $ionicHistory.goBack();
            } else if ($scope.step == 'password') {
                $scope.step = 'check';
            } else if ($scope.step == 'done') {
                $scope.step = 'password';
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

        //点击获取验证码按钮执行
        $scope.getPayPassCode = function () {
            console.log('发送验证码');
            PasswordService.getPayCode()
                .success(function (response, status, headers, config) {
                    console.log(response);
                });
            $scope.phone.timerId = $scope.startTimer($scope.phone);
        };
        //检查数据
        $scope.checkPayCode = function () {
            //联网校验数据
            PasswordService.checkPayCode($scope.phone.inputCode)
                .success(function (response, status, headers, config) {
                    console.log(response);
                    //跳转
                    if (response.code == 1) {
                        $scope.step = 'password';
                        $scope.phone.password = '';
                        $scope.phone.repassword = '';
                        $scope.validate = false;
                    } else {
                        PopupService.alertPopup('', '验证码错误！');
                    }
                })
        };

        $scope.submitPassword = function () {
            $scope.validate = true;
            //修改密码
            if ($scope.payForm.$valid) {
                PasswordService.savePayPassword($scope.phone.password, $scope.phone.inputCode)
                    .success(function (response, status, headers, config) {
                        console.log(response);
                        //跳转
                        if (response.code == 1) {
                            $scope.step = 'done';
                            PopupService.alertPopup('操作成功', '支付密码设置成功！')
                                .then(function () {

                                    $scope.$ionicGoBack();
                                });
                        } else if (response.code == -40) {
                            PopupService.alertPopup('', '验证码已过期');
                            $scope.step = 'check';
                        } else if (response.code == 0) {
                            PopupService.alertPopup('', '系统异常');
                            $scope.step = 'check';
                        }
                    })
            } else if (!$scope.payForm.password.$valid) {
                PopupService.showPrompt('密码为6位以上的字母和数字组成');

            } else if (!$scope.payForm.repassword.$valid) {
                PopupService.showPrompt('两次输入密码不一致');
            } else {
                PopupService.showPrompt('校验失败');
            }
        };
        $scope.init();
    }])
;
