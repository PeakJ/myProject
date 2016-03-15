/**
 * Created by 11150421050181 on 2015/8/18.
 */
bomApp.controller('userImageCtrl', ['$scope','$stateParams','$timeout','$ionicViewSwitcher','$ionicHistory',
    function ($scope,$stateParams,$timeout,$ionicViewSwitcher,$ionicHistory) {
        $scope.name = '';
        $scope.css  = "";
        $scope.imageUrl = $stateParams.imageUrl;
        var firstTap = '';
        //处理点击事件
        $scope.onTap = function(){
            if(firstTap == ''){
                console.log('first tap');
                firstTap = new Date().getTime();
                isClick = true;
                $timeout(function() {
                    if(isClick){
                        //如果为点击事件，返回上一页
                        $scope.goBack();
                        $scope.isZoomIn = false;
                        firstTap = '';
                    }
                }, 400);
            } else {
                console.log('second tap');
                var secondTap = new Date().getTime();
                if(secondTap - firstTap < 400){
                    console.log(secondTap - firstTap);
                    isClick = false;
                    $scope.zoomImage();
                }
                firstTap = '';
            }
        };

        /*返回上一页*/
        $scope.goBack = function(){
            $ionicViewSwitcher.nextDirection('back');
            $ionicHistory.goBack();
        };

    }]);