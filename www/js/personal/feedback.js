/**
 * Created by ZCP on 2015/7/1.
 */
cdfgApp.controller('FeedbackController', ['$scope', 'FeedbackService', '$ionicHistory', '$state', 'PopupService',
    function ($scope, FeedbackService, $ionicHistory, $state, PopupService) {
        /* CHG START BY 葛硕20150808：[APP-95] bug:部分标题会显示样式错乱 -------------------------------*/
        $scope.goBackToHome = goBackToHome;
        //返回上一页
        function goBackToHome() {
            $ionicHistory.goBack();
        }

        /* CHG END   BY 葛硕20150808：[APP-95] bug:部分标题会显示样式错乱 -------------------------------*/
        $scope.param = {
            content: '',
            mobile: ''
        };

        $scope.commitFeedback = function () {

            FeedbackService.addFeedback($scope.param)
                .success(function (response, status, headers, config) {
                    if (response.code == 1) {

                        console.log(response);

                        PopupService.alertPopup('提示', '反馈意见提交成功！')
                            .then(function () {
                                $ionicHistory.goBack();
                            });
                    } else {
                        PopupService.alertPopup('提示', '提交失败，请稍后再次尝试！')
                    }
                })
        };
    }]);


/**
 * FeedbackService
 * Created by ZCP on 2015/8/1.
 */
cdfgApp.service('FeedbackService', ['$http', 'UrlService', function ($http, UrlService) {
    this.addFeedback = function (param) {
        return $http.post(UrlService.getUrl('PERSONAL_FEEDBACK'), param)
    };
}]);