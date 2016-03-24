/********************************

 creater:haosijia@cdfg.com.cn
 create time:2015/07/09
 describe：会员注册
 modify time:2015/07/09

 ********************************/

/*
 Service 模块服务
 */
cdfgApp.factory('RegValidateService', [function() {

    var reg = {
        // 手机号
        mobile: /^1(3|4|5|7|8|9)\d{9}$/,
        // 密码
        password: /^(?!\D+$)(?![^a-z]+$)[a-zA-Z\d]{6,20}$/,
        // 短信验证码
        mobileCode: /^\d{6}$/,
        //邮箱
        email:/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/,
        //验证是数字
        number: /^[1-9][0-9]*$/
    };

    var _check = function (key, text) {
        return reg[key].test(text);
    };

    return {
        // 获取表单校验正则表达式
        getRegExp: function (key) {
            return reg[key];
        },
        // 校验是否为手机格式
        isMobile: function (text) {
            return _check('mobile', text);
        },
        // 校验是否为验证码格式
        isMobileCode: function (text) {
            return _check('mobileCode', text);
        },
        // 校验是否为密码格式
        isPasswordCode: function (text) {
            return _check('password', text);
        }

    };
}]);

/*
 directive模块指令  监测俩次密码是否一致
 */
/*cdfgApp.directive('cdfgValidate', ['$compile',function($compile){
    return {
        require : '^form',
        link : function($scope,$el,$attrs,formCtrl){
            $el.addClass('validate-block')
                .append('<p class="help-block font-mini opacity-hide"></p>');

            var input = $el.find('input'),
                helpBlock = angular.element($el[0].querySelector('.help-block')),
                name = input.attr('name'),
                target = $attrs.compareTarget;


            //俩次密码输入验证
            if(target && $attrs.compareTip){

                helpBlock.append($compile('<span class="tip" ng-show="!form.' + name +'.$error.required && !form.'+ name +'.$error.pattern && form.'+ name + '.$error.compare">' + $attrs.compareTip + '</span>')($scope));

                var watchVal =  $scope.$watch(function(){
                        return formCtrl[name].$viewValue == formCtrl[target].$viewValue;
                    },function(newState, oldState){
                        formCtrl[name].$setValidity('compare', newState);
                    });
            }

            // 第一次失去焦点时显示提示信息
            input.one('blue', function (e) {
                helpBlock.removeClass('opacity-hide');
            });

            $scope.$on('$destroy', function() {
                if (watchVal) {
                    watchVal();
                }
            });

        }
    }
}]);*/

/*
 Controller 模块控制器
 */
cdfgApp.controller('RegisterController',['$scope','$http','$state','RegValidateService',
    'PopupService','ValidateService','SmsService','UserService','$timeout','$ionicHistory', '$stateParams','UrlService','$ionicModal',
    function($scope,$http,$state,RegValidateService,PopupService,ValidateService,SmsService,
             UserService,$timeout,$ionicHistory, $stateParams,UrlService,$ionicModal){

    /* ADD START BY 葛硕20150809：[APP-99] 注册和返回图标重叠 -------------------------------*/
    $scope.goBack = goBack;
    //返回上一页
    function goBack(){
        lastMobile = $scope.data.phone;
        $ionicHistory.goBack();
    }
        var lastPage = $stateParams.last;

    /* ADD END   BY 葛硕20150809：[APP-99] 注册和返回图标重叠 -------------------------------*/

    var states  = ['start', 'code', 'finish'],
        btnText = {};
    btnText[states[0]] = btnText[states[1]] = '下一步';
    btnText[states[2]] = '注册';

    /* ADD START BY 葛硕20150809：[APP-110] 注册时退出再进入时重新发送按钮不正确 -------------------------------*/
    var lastMobile = '';
    $scope.$on('$ionicView.beforeEnter',function(){
        $scope.state = states[0];
    });
    /* ADD END   BY 葛硕20150809：[APP-110] 注册时退出再进入时重新发送按钮不正确 -------------------------------*/

    angular.extend($scope, {
        states: states,
        state: states[0],
        data: {
            phone: '',
            invitationCode: '',  //邀请码
            validateCode: '',
            mobileCode: '',  //手机验证码
            password: '',
            repassword: '',
            accept: true
        },
        submitBtn: {
            text: btnText[states[0]],
            disabled: false
        },
        // 获取校验正则表达式
        getRegExp: RegValidateService.getRegExp,
        // 短信验证码发送计时
        counter: 0,
        // 提交表单
        submit: function () {
            $scope[$scope.state]();
        },
        // 发送短信验证码
        sendRegisterVcode: function (mobile) {
            SmsService.sendSMS(mobile)
                .success(function(data, status, headers, config){
                    console.log(data);
                    if(data.code==1){

                        startTimer();

                    }else if(data.code<0){
                        PopupService.alertPopup('发送失败', '验证码发送过于频繁，请60秒后重试');
                    }

                });

            //startTimer();
        }
    });


    /*ADD COMMENT BY 葛硕 20150809：填写手机号页面*/
    // states[0]表单提交处理
    $scope[states[0]] = function () {

        var mobile = $scope.data.phone;

        ValidateService.uniqueMobile(mobile)
            .success(function(data, status, headers, config) {
                //console.log(data);
                if(data.code==1){

                    $scope.state = states[1];/*ADD COMMENT BY 葛硕 20150809：跳转到发送验证码页面*/
                    $scope.submitBtn.text = btnText[states[1]];

                    /*ADD START BY 葛硕 20150809:与上次手机号相同，不再重新发送-------------------------------*/
                    if(mobile == lastMobile){
                        return;
                    } else {
                        clearInterval();//与上一次的号码不同，清除上一次的timer
                    }
                    /*ADD END   BY 葛硕 20150809:与上次手机号相同，不再重新发送-------------------------------*/
                    $scope.sendRegisterVcode(mobile);

                }else if(data.code==0){
                    PopupService.confirmPopup('提示', '手机号<span class="tel">' + mobile + '</span>已注册，请更换手机号或登录','登录')
                        .then(function (res) {
                            if(res) {
                                /*CHG START BY 葛硕 20150809：*/
                                //$state.go('login');
                                $ionicHistory.goBack();
                                /*CHG END   BY 葛硕 20150809：*/
                            }else{
                                $scope.data.phone = '';
                            }
                        });
                }
            })
            .error(function(e){
                PopupService.promptPopup('请检查网络设备','error');
            });

    };

    /*ADD COMMENT BY 葛硕 20150809：发送手机验证码页面*/
    // 发送短信验证码后,倒计时60秒
    var startTimer = function (phoneVal) {

        $scope.counter = CDFG_WAITING_TIME;//倒计时秒数

        var decrease = function () {
            $scope.$apply(function() {
                $scope.counter -= 1;
                if ($scope.counter > 0) {
                    setTimeout(decrease, 1000);
                } else {
                    $scope.counter = 0;//ADD BY 葛硕 20150809，避免出现-1的情况
                }
            });
        };
        setTimeout(decrease, 1000);
    };

    // states[1]表单提交处理
    $scope[states[1]] = function () {

        var mobile = $scope.data.phone,
            validCode = $scope.data.validCode;

        SmsService.validCode(mobile,validCode)
            .success(function(data, status, headers, config){
                console.log(data);
                if(data.code==1){

                    $scope.state = states[2];
                    $scope.submitBtn.text = btnText[states[2]];

                }else if(data.code <= 0){
                    PopupService.promptPopup('输入的验证码不正确!','error');
                }
            });

    };
    // states[2]表单提交处理
    $scope[states[2]] = function () {

        var inviteCode = $scope.data.inviteCode ? $scope.data.inviteCode : null,
            mobile = $scope.data.phone,
            validCode = $scope.data.validCode,  //
            pwd = $scope.data.password;

        if(!RegValidateService.isPasswordCode(pwd)){
            PopupService.promptPopup('密码为6-20位字母数字组合','error');
            $scope.data.password = '';
            $scope.data.repassword = '';
            return;
        }
        if($scope.data.repassword != pwd){
            PopupService.promptPopup('两次输入密码不同!','error');
            $scope.data.repassword = '';
            return;
        }

        if(inviteCode != null){
            ValidateService.checkInvitationCode(inviteCode)
                .success(function(data, status, headers, config){
                    if(data.code==1){

                        $scope.doRegister(mobile,validCode,pwd,inviteCode);

                    }else if(data.code <= 0){
                        PopupService.alertPopup('提示', data.data);
                    }
                }).error(function(e){
                    PopupService.alertPopup('验证失败', '失败了！请检查网络设备');
                });

        }else{
            $scope.doRegister(mobile,validCode,pwd,null);
        }

        //console.log('注册成功');
    }
    //注册功能
    $scope.doRegister = function(mobile,validCode,pwd,inviteCode){
        ValidateService.doRegister(mobile,validCode,pwd,inviteCode)
            .success(function(data, status, headers, config){
                //alert(data.code +'-'+data.data);
                if(data.code==1){
                    var userObj = {userId:data.data.userId,loginName:data.data.loginName,ticket:data.data.ticket,userInfo:data.data.userInfo};
                    UserService.setUser(userObj);  //设置用户信息
                    //console.log(UserService.getUser());

                    if(data.data.couponPrice != '' && data.data.couponPrice){
                        PopupService.promptPopup('<br />恭喜，获得一张'+ data.data.couponPrice +'元优惠券');
                    }else{
                        PopupService.promptPopup('注册成功!');
                    }
                    $timeout(function () {
                        if(lastPage){
                            if(lastPage.indexOf('=') != -1){
                                $state.go('product.detail',{
                                    type:'sku',
                                    id:lastPage.substr(lastPage.indexOf('=')+1)
                                });
                            }else{
                                $state.go(lastPage);
                            }
                        }else{
                            $state.go('personal');
                        }
                    }, 2500);

                }else if(data.code == -10){
                    PopupService.alertPopup('注册失败','验证码错误'+validCode);
                }else if(data.code==-50){
                    PopupService.alertPopup('注册失败','邀请码错误');
                }
            }).error(function(e){
                if(data.code==500){
                    PopupService.alertPopup('您提交遇到困难', '攻城狮已快马加鞭赶来解决,再注册一次把');
                }else{
                    PopupService.alertPopup('注册失败', '网络请求失败，请重新尝试');
                }
            });
    };

    //注册协议
    $http.post(UrlService.getUrl('GET_PROTOCOL')).success(function(data){
        $scope.protocolInfo = data;
    }).error(function(){
        PopupService.showPrompt('加载失败');
    });

    // 用户服务协议 Modal 指向页面
    $ionicModal.fromTemplateUrl('templates/register/protocol.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.protocolModal = modal;
    });

    //当我们用完模型时，清除它！
    $scope.$on('$destroy', function () {
        $scope.protocolModal.remove();
    });

    $scope.protocolShow = function(){
        $scope.protocolModal.show();
    }
    $scope.closeModal = function(){
        $scope.protocolModal.hide();
    }

}]);

