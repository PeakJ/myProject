/**
 * Created by ZCP on 2015/7/1.
 */
cdfgApp.controller('SettingController', ['$scope', 'UserService', '$state', '$cordovaAppVersion', '$ionicHistory', 'PopupService',
    function ($scope, UserService, $state, $cordovaAppVersion, $ionicHistory, PopupService) {
        /* ADD START BY 葛硕20150808：[APP-95] bug:部分标题会显示样式错乱 -------------------------------*/
        $scope.goBack = goBack;
        //返回上一页
        function goBack() {
            $ionicHistory.goBack();
        }

        /* ADD END   BY 葛硕20150808：[APP-95] bug:部分标题会显示样式错乱 -------------------------------*/
        if (window.codova) {
            //console.log(ionic.Platform);
            $scope.version = AppVersion.version;
        }
        //alert(AppVersion.version + 'verson');
        //alert(AppVersion.build + 'build');

        $scope.logout = function () {
            PopupService.showPrompt('退出登录成功！');

            UserService.clearUser();
            $state.go('home');
        };

    }]);

