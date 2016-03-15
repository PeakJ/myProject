/**
 * Created by 11150421050181 on 2015/7/20.
 */
//初始化执行
bomApp.controller('LoginCtrl',['$scope','$state','userService',function($scope,$state,userService){
    /*if(userService.getUserId() != "-1"){
        $state.go('home');
    }*/
}]);
/**
 * 登录页面 controller
 * 张俊辉
 * 2015-07-22 17:41
 */
bomApp.controller('loginController',['$scope','loginServices','$state','userService','loadingUtil',
    function($scope,loginServices,$state,userService,loadingUtil){
    $scope.userNo = '';
    $scope.userPassword = '';
    var urlParameter = "";
    $scope.Submit=function(){
        $scope.prompt='';
        loadingUtil.show();
        if($scope.userNo.length == 0 || $scope.userPassword.length == 0){
            $scope.prompt = "员工号或密码不能为空！";
        }else {
            urlParameter = "username="+$scope.userNo+"&password="+$scope.userPassword+"&appMobile=true";
            console.log(urlParameter);
            loginServices.get(urlParameter).then(function(data){
                if(data != undefined){
                    if(data.id == "-1"){
                        $scope.prompt = "员工号或密码不正确！";
                    }else{
                        var userinfo ={userId:data.id,userName:data.name,loginName:data.loginName,userLevel:data.userType,userState:0};
                        userService.setUserInfo(userinfo);
                        $state.go('home');
                    }
                }else{
                    $scope.prompt = "服务器连接失败请稍后重试！";
                }
            })
        }
        loadingUtil.hide();
    }

}]);