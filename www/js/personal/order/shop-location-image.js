/**
 * 个人中心-->免税店地理位置-->大图
 * Created by geshuo on 2015/07/15.
 */
cdfgApp.controller('ShopLocationImageController',['$scope','$ionicHistory','$http','$state','$ionicScrollDelegate',
        '$timeout', '$stateParams',
        function($scope,$ionicHistory,$http,$state,$ionicScrollDelegate,$timeout, $stateParams){

        var firstTap = '';
        var isClick = true;
        //var locationImg = document.querySelector('#id_location_img');
        //var scrollHandle = $ionicScrollDelegate.$getByHandle('locationHandle');
        //var deviceHeight = document.body.clientHeight;
        //var imageHeight = locationImg.height;

        loadData();

        /*获取图片地址*/
        function loadData(){
            $scope.imageUrl = $stateParams.imageUrl;
        }

        $scope.$on('$ionicView.beforeEnter',function(){
            ionic.Platform.fullScreen();
        });
        $scope.$on('$ionicView.leave',function(){
            ionic.Platform.fullScreen(false,true);//参数：是否全屏，是否显示状态栏
        });

        /*返回上一页*/
        $scope.goBack = function(){
            ionic.Platform.fullScreen(false,true);
            $ionicHistory.goBack();
        };

        $scope.isZoomIn = false;
        /*双击放大/缩小图片*/
        $scope.zoomImage = function(){
            console.log('放大/缩小图片');
            $scope.isZoomIn = !$scope.isZoomIn;
            if($scope.isZoomIn){
                $ionicScrollDelegate.zoomTo(3,true);
            } else {
                $ionicScrollDelegate.zoomTo(1,true);
            }
            console.log($ionicScrollDelegate.$getByHandle('locationHandle').getScrollPosition());
        };

        //$scope.scrollImg = function(){
        //    var position = scrollHandle.getScrollPosition();
        //    var offsetTop = parseFloat(locationImg.offsetTop.toFixed(2));
        //    var zoomLevel = parseFloat(position.zoom.toFixed(2));
        //    var positionTop = parseFloat(position.top.toFixed(2));
        //    console.log(scrollHandle.getScrollPosition());//001
        //    //console.log(locationImg.offsetTop);//219
        //    console.log('zoomLevel = ' + zoomLevel);//1
        //    //console.log('imageHeight = ' + imageHeight);//203
        //    if(imageHeight*zoomLevel <= deviceHeight){
        //        if(positionTop > offsetTop*zoomLevel){
        //            console.log('0');
        //            scrollHandle.scrollTo(position.left,offsetTop*zoomLevel,false);
        //        }
        //        else if(positionTop > 0 && positionTop < (imageHeight + offsetTop)*zoomLevel-deviceHeight){
        //            console.log('1');
        //            scrollHandle.scrollTo(position.left,(imageHeight + offsetTop)*zoomLevel-deviceHeight,false);
        //        }
        //    } else {
        //        if(positionTop < offsetTop*zoomLevel){
        //            console.log('2');
        //            scrollHandle.scrollTo(position.left,offsetTop*zoomLevel,false);
        //        }
        //        else if(positionTop > (imageHeight + offsetTop)*zoomLevel-deviceHeight){
        //            console.log('3');
        //            scrollHandle.scrollTo(position.left,(imageHeight + offsetTop)*zoomLevel-deviceHeight,false);
        //        }
        //    }
        //};

        // 点触事件
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

    }]
);