/**
 * Created by 11150421050181 on 2015/8/12.
 */
bomApp.controller('MainCtrl',['$scope','$state','$ionicViewService','$localStorage',
    function($scope,$state,$ionicViewService,$localStorage){
    $scope.$on('$ionicView.beforeEnter',function(){
        var main = $localStorage.get('main',false);
        console.log(main);
        if(main){
            startApp();
        }else{
            setTimeout(function () {
                //navigator.splashscreen.hide();
                $localStorage.set('main',true);
            }, 750);
        }
    });


    var startApp = function () {
        $ionicViewService.clearHistory();
        $state.go('login');
        $localStorage.set('main',true);
    };

    $scope.gotoMain = function () {
        startApp();
    }
}]);