/**
 * Created by 11150421050181 on 2015/7/23.
 */
/**
 * home
 */
bomApp.config(['$stateProvider',function($stateProvider){
    $stateProvider
    //首页管理 用户管理
    .state('homeUser', {
        url: "/homeUser",
        templateUrl: "modules/home/view/user.html",
        controller: 'homeUserCtrl'
    })
    //修改密码
    .state('reset', {
        url: "/reset",
        templateUrl: "modules/home/view/reset.html",
        controller: 'resetController'
    })
    //头像照片
    .state('userImage', {
        url: "/userImage/:imageUrl",
        templateUrl: "modules/home/view/userImage.html",
        controller: 'userImageCtrl'
    })
}]);
