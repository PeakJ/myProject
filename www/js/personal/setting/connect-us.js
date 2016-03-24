/**
 * Created by 葛硕 20150808.
 * 联系我们
 */
cdfgApp.controller('ConnectUsController', ['$scope','$ionicHistory',
    function ($scope, $ionicHistory) {
        /* ADD START BY 葛硕20150808：[APP-95] bug:部分标题会显示样式错乱 -------------------------------*/
        $scope.goBack = goBack;
        //返回上一页
        function goBack(){
            $ionicHistory.goBack();
        }
        /* ADD END   BY 葛硕20150808：[APP-95] bug:部分标题会显示样式错乱 -------------------------------*/
    }]);

