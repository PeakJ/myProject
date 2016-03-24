/**
 * Created by ZCP on 2015/6/30.
 */
cdfgApp.controller('CommonEditController', ['$scope', '$stateParams', '$rootScope', 'EditService', '$ionicHistory', 'PopupService',
        function ($scope, $stateParams, $rootScope, EditService, $ionicHistory, PopupService) {
            /* ADD START BY 葛硕20150808：[APP-95] bug:部分标题会显示样式错乱 -------------------------------*/
            $scope.goBack = goBack;
            //返回上一页
            function goBack() {
                $ionicHistory.goBack();
            }

            /* ADD END   BY 葛硕20150808：[APP-95] bug:部分标题会显示样式错乱 -------------------------------*/

            $scope.init = function () {
                console.log($stateParams.selectMode);
                $scope.validate = false;//校验标志字段
                $scope.editData = {
                    title: '默认标题',
                    hint: '默认提示',
                    info: '0',
                    warnMsg: '默认警告',
                    pattern:''
                };
                var temp = EditService.getEditData($stateParams.selectMode);
                $scope.editData = angular.extend({}, $scope.editData, temp);
                $scope.editData.info = $stateParams.defaultValue;
                console.log($scope.editData);
            };


            $scope.clearText = function () {
                $scope.editData.info = "";
            };

            $scope.submitText = function () {
                //用户昵称长度校验
                $scope.validate = true;
                if ($scope.editData.info) {
                    $rootScope.$broadcast($stateParams.selectMode, $scope.editData.info);
                    $scope.$ionicGoBack();
                } else {
                    PopupService.alertPopup('提示', $scope.editData.warnMsg);
                }
            };
            $scope.init();
        }]
)
;

/**
 * EditService
 * Created by ZCP on 2015/8/12.
 */
cdfgApp.service('EditService', [function () {
    this.getEditData = function (key) {
        var obj = {
            'USER_NAME': {
                title: '昵称',
                hint: '起一个昵称吧',
                warnMsg: '昵称长度应由4～10个汉字，字母，数字,下划线组成。',
                min:4,
                max:20,
                pattern:'[a-zA-Z0-9_\u4e00-\u9fa5]+$'
            }
        };
        if (key) {
            return obj[key];
        }
    }

}]);
