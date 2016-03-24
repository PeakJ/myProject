/**
 * ValidationController
 * Created by dhc on 2015/7/13.
 */
cdfgApp.controller('SecurityController', ['$scope', 'PasswordService', 'PopupService', '$ionicHistory', '$state',
    function ($scope, PasswordService, PopupService, $ionicHistory, $state) {
        $scope.goBack = goBack;
        $scope.loadSuccess = false;
        $scope.bindWarnning = true;
        //返回上一页
        function goBack() {
            $ionicHistory.goBack();
        }

        $scope.init = function () {
            PasswordService.getPhoneEmail()
                .success(function (response, status, headers, config) {
                    console.log(response);
                    if (response.code == 1) {
                        $scope.loadSuccess = true;
                        $scope.bindWarnning = response.data.mobile;
                    } else if (response.code == -101) {
                        $scope.loadSuccess = false;
                        $state.go('login', {last: 'security'});
                    }

                })
        };

        $scope.goBindOrVali = function () {
            if ($scope.loadSuccess && !$scope.bindWarnning) {
                $state.go('bind');
            } else if ($scope.loadSuccess) {
                $state.go('validation');

            }
        };

        $scope.$on('$ionicView.enter', function () {
            $scope.init();
        });
    }])
;
