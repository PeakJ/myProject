/**
 * PasswordController
 * Created by dhc on 2015/7/13.
 */
cdfgApp.controller('PasswordController', ['$scope', 'PasswordService', 'PopupService', '$ionicHistory',
    function ($scope, PasswordService, PopupService, $ionicHistory) {
        $scope.goBack = goBack;
        //返回上一页
        function goBack() {
            //$ionicHistory.goBack();
            $scope.$broadcast('cdfg-password-back');
        }

    }]);


cdfgApp.controller('PasswordFormController', ['$scope', 'PasswordService', 'PopupService', '$ionicHistory',
    function ($scope, PasswordService, PopupService, $ionicHistory) {
        $scope.init = function () {
            $scope.validate = false;//是否校验数据变量，控制显示校验样式
            $scope.mode = {
                //控制显示验证选择模块 为‘check’、‘password’、‘done’
                step: 'check',
                //手机校验或者emial校验 为‘phone’、‘email’
                phoneOrEmail: 'phone'
            };
            $scope.phone = {
                buttonText: '获取短信验证码',//‘获取验证码’按钮文案
                timer: 0,//锁定 刷新时间
                timerId: 0,//计时器id
                locker: true,//锁定标志位
                text: '无',//电话号码input绑定的model
                inputCode: '',//验证码
                password: '',//密码model
                repassword: ''//重复输入密码
            };
            $scope.email = {
                buttonText: '发送验证邮件',
                timer: 0,
                timerId: 0,
                locker: true,
                text: '无'
            };

            PasswordService.getPhoneEmail()
                .success(function (response, status, headers, config) {
                    console.log(response);
                    if (response.code == 1) {

                        if (response.data.mobile) {
                            $scope.phone.text = response.data.mobile;//获取绑定的手机号，显示出来
                            $scope.phone.locker = false;//解锁获取验证码按钮
                        }
                        if (response.data.email) {
                            $scope.email.text = response.data.email;//获取绑定邮箱
                            $scope.email.locker = false;//解锁email按钮
                        }
                    } else if (response.code == -101) {
                        $state.go('login', {last: 'password'});
                    }
                })
        };

        /**
         * 覆盖返回按钮逻辑。步骤的返回，如果
         */
        $scope.$on('cdfg-password-back', function () {
            if ($scope.mode.step == 'check') {
                if ($scope.mode.phoneOrPay == 'pay') {
                    $scope.init();
                } else {
                    $ionicHistory.goBack();
                }
            } else if ($scope.mode.step == 'password') {
                $scope.mode.step = 'check';
            } else if ($scope.mode.step == 'done') {
                $scope.mode.step = 'password';
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

        //点击获取验证码按钮
        $scope.getPassCode = function () {
            console.log('发送验证码');
            PasswordService.getValidateCode()
                .success(function (response, status, headers, config) {
                    console.log(response);
                });
            $scope.phone.timerId = $scope.startTimer($scope.phone);
        };
        //点击发送邮件
        $scope.getPassEmail = function () {
            console.log('发送验邮件');
            PasswordService.sendValidateEmail()
                .success(function (response, status, headers, config) {
                    console.log(response);
                });
            $scope.email.timerId = $scope.startTimer($scope.email);
        };

        //联网校验数据
        $scope.goNextStep = function () {
            console.log($scope.phone.inputCode);
            if ($scope.mode.phoneOrEmail == 'phone') {

                $scope.validate = true;
                PasswordService.validateCode($scope.phone.inputCode)
                    .success(function (response, status, headers, config) {
                        console.log(response);
                        //跳转
                        if (response.code == 1) {
                            $scope.mode.step = 'password';
                            $scope.phone.repassword = '';
                            $scope.validate = false;//重置验证标记
                        } else if (response.code == -40) {
                            PopupService.alertPopup('', '验证码错误！');
                        } else {
                            PopupService.alertPopup('', '服务器错误！');
                        }
                    })
            } else if ($scope.mode.phoneOrEmail == 'email') {
                //发送Email
                $scope.mode.step = 'password';
                $scope.validate = false;//重置验证标记
            }
        };

        //联网提交密码
        $scope.submitPassword = function () {
            $scope.validate = true;//重置验证标记

            console.log($scope.passwordForm.$valid);
            if ($scope.passwordForm.$valid) {
                //校验成功发送密码
                PasswordService.setPassword($scope.phone.password, $scope.phone.inputCode)
                    .success(function (response, status, headers, config) {
                        console.log(response);
                        //跳转
                        if (response.code == 1) {
                            $scope.mode.step = 'done';
                            PopupService.alertPopup('', '密码修改成功！')
                                .then(function () {
                                    $ionicHistory.goBack();
                                });
                        } else if (response.code == 0) {
                            PopupService.alertPopup('', '验证码已过期');
                            $scope.step = 'check';
                        } else {
                            PopupService.alertPopup('', '系统异常，请稍后再试...');
                            $scope.step = 'check';
                        }
                    })
            } else if (!$scope.passwordForm.password.$valid) {
                PopupService.alertPopup('', '密码为6位以上的数字和字母组成');
            } else if (!$scope.passwordForm.repassword.$valid) {
                PopupService.alertPopup('', '两次密码输入不一致');
            } else {
                PopupService.alertPopup('', '校验失败');
            }
        };

        $scope.init();
    }])
;
/**
 * PasswordController
 * Created by dhc on 2015/7/13.
 */
cdfgApp.service('PasswordService', ['$http', 'UserService', 'UrlService', function ($http, UserService, UrlService) {
    /** 登录密码用 **/
        //获取验证码
    this.getValidateCode = function () {
        return $http.post(UrlService.getUrl('SECURITY_PASSWORD_GETVALIDATEPHONE'));
    };
    //校验验证码是否正确
    this.validateCode = function (code) {
        var param = {
            validCode: code
        };
        return $http.post(UrlService.getUrl('SECURITY_PASSWORD_VALIDATE'), param);
    };
    //发送验证邮件
    this.sendValidateEmail = function () {
        return $http.post(UrlService.getUrl('SECURITY_PASSWORD_GETVALIDATEEMAIL'));
    };
    //设置密码（新密码/修改密码）
    this.setPassword = function (password, validateCode) {
        var param = {
            validCode: validateCode,
            newPwd: password
        };
        return $http.post(UrlService.getUrl('SECURITY_PASSWORD_SAVE'), param);
    };
    //获取已验证的手机和邮箱
    this.getPhoneEmail = function () {
        return $http.post(UrlService.getUrl('SECURITY_PASSWORD_PHONEEMAIL'));
    };


    /** 绑定手机 **/
        //获取旧手机验证码
    this.getPhoneCode = function () {
        return $http.post(UrlService.getUrl('SECURITY_VALIDATION_GETCODE'));
    };
    //校验验证码是否正确
    this.checkPhoneCode = function (validCode) {
        var param = {
            validCode: validCode
        };
        return $http.post(UrlService.getUrl('SECURITY_VALIDATION_CHECKCODE'), param);
    };
    //发送新校验码
    this.getNewPhoneCode = function (mobile) {
        var param = {
            mobile: mobile
        };
        return $http.post(UrlService.getUrl('SECURITY_VALIDATION_GETNEWCODE'), param);
    };
    //校验新手机验证码是否正确
    this.checkNewPhoneCode = function (validCode, oldValidCode) {
        var param = {
            validCode: validCode,
            oldValidCode: oldValidCode
        };
        return $http.post(UrlService.getUrl('SECURITY_VALIDATION_CHECKNEWCODE'), param);
    };
    //生成验证码图片
    this.getVerificationCode = function () {
        return UrlService.getUrl('SECURITY_VALIDATION_PAYIMGCODE');
    };
    //检验验证码，和支付密码
    this.checkPhonePayCode = function (payPwd, validCode) {
        var param = {
            payPwd: payPwd,
            validCode: validCode
        };
        return $http.post(UrlService.getUrl('SECURITY_VALIDATION_CHECKPAY'), param);
    };
    //通过支付密码充值
    this.saveByPay = function (payPwd, validCode) {
        var param = {
            payPwd: payPwd,
            validCode: validCode
        };
        return $http.post(UrlService.getUrl('SECURITY_VALIDATION_SAVEBYPAY'), param);
    };


    /** 支付密码用 **/
        //是否有旧密码(决定是新密码还是修改密码）
    this.hasPayPassword = function () {
        return $http.post(UrlService.getUrl('SECURITY_PAY_HASPAYPASSWORD'));
    };
    //获取验证码
    this.getPayCode = function () {
        return $http.post(UrlService.getUrl('SECURITY_PAY_GETCODE'));
    };
    //验证手机
    this.checkPayCode = function (validCode, payPwd) {
        var param = {
            validCode: validCode,
            payPwd: payPwd
        };
        return $http.post(UrlService.getUrl('SECURITY_PAY_CHECKCODE'), param)
    };
    //验证手机
    this.savePayPassword = function (password, validCode) {
        var param = {
            payPwd: password,
            validCode: validCode
        };
        return $http.post(UrlService.getUrl('SECURITY_PAY_SAVEPASSWORD'), param)
    }

}]);
