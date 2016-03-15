/**
 * Created by 11150421040206 on 2015/8/13.
 */
/**
 * 用户修改密码
 * 张帅
 */
bomApp.controller('resetController',['$scope','$state','resetService','$ionicPopup','userService',
    function($scope,$state,resetService,$ionicPopup,userService) {
        $scope.password = {
            original: '',
            new: '',
            renew: ''
        };
        $scope.flag==false;
        $scope.submit = function () {
            $scope.flag = false;
            console.log($scope.password.new);
            //客户端检验密码
            if ($scope.password.original == null || $scope.password.original == "") {
                var message = $ionicPopup.alert({
                    title: '提示',
                    template: '初始密码不能为空'
                })
            } else if (($scope.password.new == null) || ($scope.password.new == '')) {
                var comPassword = $ionicPopup.alert({
                    title: '提示',
                    template: '新密码不能为空'

                })
            } else if ($scope.password.renew == null || ($scope.password.renew == '')) {
                var message = $ionicPopup.alert({
                    title: '提示',
                    template: '确认密码不能为空'
                })
            }
            else if ($scope.password.new != $scope.password.renew) {
                var comPassword = $ionicPopup.alert({
                    title: '提示',
                    template: '两次密码输入必须一致'

                }).then(function (res) {
                    $scope.state = '请重新确认密码'
                });

            } else {
                //服务端判断初始密码是否正确
                var userId = userService.getUserId();
                $scope.userInfo = {
                    userId: userId,
                    oldPassword: $scope.password.original,
                    password: $scope.password.new,
                };
                var oldpassword = $scope.password.original;
                resetService.get(JSON.stringify($scope.userInfo))
                    .then(function (data) {
                        if (data=="true") {
                            var message = $ionicPopup.alert({
                                title: '提示',
                                template: '密码更改成功'
                            });
                            $state.go('homeUser');
                        } else if(data=="false1"){
                            var message = $ionicPopup.alert({
                                title: '提示',
                                template: '初始密码错误'
                            })
                        }
                        else if(data=="false2"){
                            var message = $ionicPopup.alert({
                                title: '提示',
                                template: '当前用户为空，请重新登录'
                            })
                        }
                        else if(data=="false3"){
                            var message = $ionicPopup.alert({
                                title: '提示',
                                template: '新旧密码不能相同'
                            })
                        }
                    })
            }
        }
}]);

