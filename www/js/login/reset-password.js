/**
 * Controller 模块控制器
 * created by ZCP 2015-08-09
 */
cdfgApp.controller('ResetPasswordController', ['$scope', '$ionicHistory',
    function ($scope, $ionicHistory) {
        $scope.goBack = goBack;
        //返回上一页
        function goBack() {
            $ionicHistory.goBack();
        }
    }]);
cdfgApp.controller('ResetFormController', ['$scope', 'ResetPasswordService', 'PopupService',
    function ($scope, ResetPasswordService, PopupService) {

        $scope.init = function () {
            $scope.validate = false;//是否校验数据变量，控制显示校验样式
            $scope.mode = {
                //控制显示验证选择模块 为‘check’、‘password’、‘done’
                step: 'check',
                //手机校验或者emial校验 为‘phone’、‘email’
                phoneOrEmail: 'phone'
            };
            $scope.phone = {
                buttonText: '获取短信验证码',
                timer: 0,
                timerId: 0,
                locker: false,
                text: '',
                inputCode: '',
                password: '',
                repassword: ''
            };
            $scope.email = {
                buttonText: '发送验证邮件',
                timer: 0,
                timerId: 0,
                locker: false,
                text: ''
            };
        };
        $scope.init();

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
            ResetPasswordService.getValidateCode($scope.phone.text)
                .success(function (response, status, headers, config) {
                    console.log(response);
                    if (response && response.code == -60) {
                        PopupService.promptPopup('此用户不存在', 'error');

                    } else {
                        $scope.phone.timerId = $scope.startTimer($scope.phone);
                    }
                });
        };
        //点击发送邮件
        $scope.getPassEmail = function () {
            console.log('发送验邮件');
            ResetPasswordService.sendValidateEmail($scope.email.text)
                .success(function (response, status, headers, config) {
                    console.log(response);
                })
            $scope.email.timerId = $scope.startTimer($scope.email);
        };

        //联网校验数据
        $scope.goNextStep = function () {
            console.log($scope.phone.inputCode);
            if ($scope.mode.phoneOrEmail == 'phone') {

                $scope.validate = true;
                ResetPasswordService.validateCode($scope.phone.text, $scope.phone.inputCode)
                    .success(function (response, status, headers, config) {
                        console.log(response);
                        //跳转
                        if (response.code == 1) {
                            $scope.mode.step = 'password';
                            $scope.validate = false;//重置验证标记
                        } else {
                            PopupService.promptPopup('验证码错误');
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

            //校验成功发送密码
            ResetPasswordService.setPassword($scope.phone.text, $scope.phone.inputCode, $scope.phone.password)
                .success(function (response, status, headers, config) {
                    console.log(response);
                    //跳转
                    if (response.code == 1) {
                        $scope.setp = 'done';
                        PopupService.alertPopup('提示', '密码修改成功，下次使用新密码登录。')
                            .then(function () {
                                $scope.$ionicGoBack();
                            });
                    } else if (response.code == 0) {
                        PopupService.alertPopup('提示', '验证码错误，请返回输入正确验证码。');
                        $scope.$ionicGoBack();
                    }
                })
        }
        ;
    }
])
;
/**
 * Service 模块服务
 * created by ZCP 2015-08-09
 */

cdfgApp.service('ResetPasswordService', ['$http', 'UserService', 'UrlService', function ($http, UserService, UrlService) {
    /** 找回密码 **/
        //获取验证码
    this.getValidateCode = function (mobile) {
        var param = {
            mobile: mobile
        };
        return $http.post(UrlService.getUrl('LOGIN_SEND_SMS'), param);
    };
    //发送邮件
    this.sendValidateEmail = function (mail) {
        var param = {
            mail: mail
        };
        return $http.post(UrlService.getUrl('LOGIN_SEND_MAIL'), param);
    };
    //修改密码
    this.setPassword = function (mobile, validCode, pwd) {
        var param = {
            mobile: mobile,
            validCode: validCode ? validCode : '888888',
            pwd: pwd
        };
        return $http.post(UrlService.getUrl('LOGIN_FIND_PASSWORD'), param);
    };

    //修改密码
    this.validateCode = function (mobile, validCode) {
        var param = {
            mobile: mobile,
            validCode: validCode ? validCode : '888888'
        };
        return $http.post(UrlService.getUrl('LOGIN_CHECK_SMS'), param);
    };

}]);
