/********************************

 creater:maliwei@cdfg.com.cn
 create time:2015/07/07
 describe：登陆
 modify time:2015/07/07

 ********************************/

/*
 Service 模块服务
 */

/*
 directive模块指令
 */
/*
 Controller 模块控制器
 */
cdfgApp.controller('LoginController', ['$scope', '$http', '$state', '$ionicPopup', 'RegValidateService', '$window',
    'UserService', '$stateParams', '$rootScope', 'UrlService', 'CartService', 'PopupService', '$ionicHistory','$timeout',
    function ($scope, $http, $state, $ionicPopup, RegValidateService, $window, UserService, $stateParams,
              $rootScope, UrlService, CartService, PopupService, $ionicHistory,$timeout) {
    //是否需要验证码
    $scope.validCodeObj={needIdentifyingCode:false};
    /* ADD START BY 葛硕20150808：[APP-95] bug:部分标题会显示样式错乱 -------------------------------*/
    $scope.goBack = goBack;

    //返回上一页
    function goBack(){
        $ionicHistory.goBack();
    }
    /* ADD END   BY 葛硕20150808：[APP-95] bug:部分标题会显示样式错乱 -------------------------------*/
    /* ADD START BY 葛硕20150809： -------------------------------*/
    $scope.toRegister = toRegister;
    function toRegister(){
        $state.go('register', $stateParams);
    }
    /* ADD END   BY 葛硕20150809： -------------------------------*/

    //更换验证码
    $scope.code='';
    $scope.changeValidate=changeValidate;
    function changeValidate() {
        console.log('更换验证码');
        //更换验证码
        $timeout(function () {
            $scope.validateCode = '';
            $scope.validateCode = UrlService.getUrl('GET_VERIFICATION_CODE') +
            '?loginName=' + $scope.data.loginName +
            '&random=' + Math.random();
        }, 500);
    }

    var boradcastKey = $stateParams.fncallback;
    $scope.data = {
        loginName:'' ,
        pwd:'',
        channel: '0',
        validCode:''

    };
    //密码可见|不可见
    $scope.showPwd = {show: true, type: 'password'};
    $scope.togglePwdShow = function () {
        if ($scope.showPwd.show) {
            $scope.showPwd = {show: false, type: 'text'}
        } else {
            $scope.showPwd = {show: true, type: 'password'}
        }

    };
    //显示验证码
    function showValideCode(){
        $scope.validCodeObj.needIdentifyingCode=true;
        //显示验证码
        changeValidate();
    }
    //正则
    var emailFilter=RegValidateService.getRegExp('email');
    var mobileFilter=RegValidateService.getRegExp('mobile');
    //登录成功
    $scope.login = function (form) {
        //验证
        var error=[];
        var data=$scope.data;
        if(!emailFilter.test(data.loginName)&&!mobileFilter.test(data.loginName)){
           error.push('账户格式错误');
        }
        //console.log(form.password);
        if(form.password.$invalid){
            error.push('密码错误');
        }
        //console.log(form.validCode);
        if($scope.validCodeObj.needIdentifyingCode&&form.validCode.$invalid){
            error.push('验证码错误');
        }
       // console.log(error);
        if(error.length>0){
            PopupService.showPrompt(error.join(','));
            return false;
        }

        //登录
        var url = UrlService.getUrl('LOGIN');
        $http.post(url, $scope.data).success(function (d) {
            if (d.code == 1) {
                //登录成功
                UserService.setUser(d.data);
                //合并购物车
                //CartService.joinLocalCart();
                //console.log(UserService.getUser());
                PopupService.promptPopup('登录成功');
                $rootScope.$broadcast("LoginSuccess", $stateParams.params);
                var lastPage=$stateParams.last;
                if (lastPage) {
                    if(lastPage.indexOf('=') != -1){
                        $state.go('product.detail',{
                            type:'sku',
                            id:lastPage.substr(lastPage.indexOf('=')+1)
                        });
                    }else{
                        /*CHG START BY 葛硕 20150827：JSON参数格式修正--------------------------*/
                        //$state.go($stateParams.last, $stateParams.params);
                        $state.go($stateParams.last, JSON.parse($stateParams.params));
                        /*CHG END   BY 葛硕 20150827：JSON参数格式修正--------------------------*/
                    }

                } else {
                        //如果有上级则跳回到上级，否则跳回到首页
                        if($ionicHistory.backView()){
                            $ionicHistory.goBack();
                        }else{
                            $state.go('home');
                        }

                }
            } else if(d.code==-50){
                PopupService.promptPopup('登录失败, 验证码错误');
                showValideCode();
            }else{
                PopupService.promptPopup('登录失败, ' + (d.code == -30 ? '对不起，该用户已被冻结' : '用户名或密码错误'));

                //密码三次错误 输入验证码
                var loginTimeOver=false;
                if(d.data&& d.data.loginTime>=3){
                    loginTimeOver=true;
                }
                if(d.code==-40||loginTimeOver){
                    showValideCode();
                }
            }
        }).error(function () {
            PopupService.promptPopup('登录失败，' + '无法访问服务器，请检查网络');
        });


    }
    //第三方登录
    var CM = {};
    $scope.loginthird = function (thirdType) {
        if(thirdType == 'alipay') {
            var url = CDFG_IP_LOGIN+'plt.payment/unionLogin?type=3';
            window.embed = window.open(url, '_blank', 'location=no,enableViewportScale=no,suppressesIncrementalRendering=yes,closebuttoncaption=返回,disallowoverscroll=yes');
            window.embed.addEventListener('loadstart', function(event) {
                var url = event.url;

                if (/.*\/payment\/unionLoginSuc/.test(url)) {
                    window.embed.close();
                    var index = url.indexOf('?json=');
                    var param = decodeURIComponent(url.substr(index + 6));
                    alert(JSON.parse(param).uuid);
                }
            });
            window.embed.addEventListener('exit', function(event) {
                window.embed = undefined;
            });
        } else if (window.umeng) {
            window.umeng.login(thirdType,
                function (data) {
                    alert(data);
                    //data = JSON.parse(data);
                },
                function (data) {
                    alert('error');
                }
            );
        }
    }


    /* $scope.login = function(thirdType) {
     if (!$scope.loading) {
     if ("alipay" == thirdType) {
     var o = CM.info.service + "/user/login/web?type=alipay&AppKey=" + CM.info.appkey;
     return window.embed = (o, "_blank", "location=no,enableViewportScale=no,suppressesIncrementalRendering=yes,closebuttoncaption=返回,disallowoverscroll=yes"), window.embed.addEventListener("loadstart", function(e) {
     var o = e.url;
     if (/.*\/app\/loginsuccess/.test(o)) {
     window.embed.close();
     var n = JSON.parse(decodeURIComponent(o.substr(o.indexOf("&data=") + 6)));
     l(t, n.userid, n.realname)
     }
     if (/.*\/app\/loginrror/.test(o)) {
     window.embed.close();
     var r = decodeURIComponent(o.substr(o.indexOf("&data=") + 5));
     a.alertPopup("登录失败", r)
     }
     }), void window.embed.addEventListener("exit", function() {
     window.embed = void 0
     })
     }
     window.umeng && ($scope.loading = !0, window.umeng.login(t, function(e) {
     e = JSON.parse(e), l(t, e.uid, e.name, e.gender)
     }, function(t) {
     a.alertPopup("登录失败", t), e.loading = !1
     }))
     }
     }*/


}]);