/**
 * 个人中心-->申请售后->图片
 * Created by 葛硕 on 2015/07/13.
 */
cdfgApp.controller('ApplyImagesController',
    ['$scope','$ionicHistory','$state','$stateParams','$ionicLoading','$rootScope','$ionicSlideBoxDelegate','$ionicScrollDelegate','$timeout',
        function($scope,$ionicHistory,$state,$stateParams,$ionicLoading,$rootScope,$ionicSlideBoxDelegate,$ionicScrollDelegate,$timeout){
            $scope.isZoomIn = [false,false,false];//是否处于放大状态
            //接收上个页面的参数
            $scope.imageList = JSON.parse($stateParams.imageList);
            $scope.indexObj = {'index':parseInt($stateParams.index)};
            $scope.fromProgress = !!$stateParams.fromProgress;//是否从 售后进度 页面跳转过来
            var slideBox = $ionicSlideBoxDelegate.$getByHandle('applyImgHandle');//幻灯片对象

            $scope.onTap = onTap;//tap事件监听
            $scope.slideChange = slideChange;//翻页时间监听
            $scope.dragToLeft = dragToLeft;//向左拖拽
            $scope.dragToRight = dragToRight;//向右拖拽
            $scope.zoomImage = zoomImage;//放大缩小图片
            $scope.deleteImg = deleteImg;//删除图片

            $scope.$on('$ionicView.beforeEnter',function(){
                ionic.Platform.fullScreen();//全屏显示
            });
            $scope.$on('$ionicView.leave',function(){
                //退出全屏
                ionic.Platform.fullScreen(false,true);//参数：是否全屏，是否显示状态栏
            });

            /*返回上一页*/
            $scope.goBack = function(){
                ionic.Platform.fullScreen(false,true);
                $ionicHistory.goBack();
            };

            // 通过判断参数 clearDel == true    ==>  隐藏删除按钮
            if(!!$stateParams.clearDel){
                $scope.clearDel = true;
            }

            /*删除图片*/
            function deleteImg(index){
                console.log('删除图片');
                $scope.imageList.splice(index,1);
                if($scope.indexObj.index >= $scope.imageList.length){
                    $scope.indexObj.index = $scope.imageList.length - 1;
                }

                //发送广播，通知数据已改变
                $rootScope.$broadcast("ApplyImagesChange", $scope.imageList);
                if($scope.imageList.length == 0){
                    $scope.goBack();
                }
            };

            //放大/缩小图片
            function zoomImage(handle){
                console.log('放大/缩小图片 handle = ' + handle);
                var index = parseInt(handle.substring(handle.length-1,handle.length));
                $scope.isZoomIn[index] = !$scope.isZoomIn[index];
                var scrollObj = $ionicScrollDelegate.$getByHandle(handle);

                if($scope.isZoomIn[index]){
                    scrollObj.zoomTo(3,true);
                    slideBox.enableSlide(false);
                } else {
                    scrollObj.zoomTo(1,true);
                    slideBox.enableSlide(true);
                }
                $scope.enableSlideFlag = slideBox.enableSlide();
                console.log(scrollObj.getScrollPosition());
            }

            var firstTap = '';
            var isClick = true;
            // 点触事件
            function onTap(handle){

                if(!!$stateParams.clearDel){
                    //发送广播，通知数据已改变
                    $scope.imageList = null;
                    $rootScope.$broadcast("ApplyImagesChange", $scope.imageList);
                    $scope.goBack();
                }else{
                    console.log('点触事件 handle = ' + handle);
                    var scrollObj = $ionicScrollDelegate.$getByHandle(handle);
                    if(firstTap == ''){
                        console.log('first tap');
                        firstTap = new Date().getTime();
                        isClick = true;
                        $timeout(function() {
                            if(isClick){
                                //如果为点击事件，返回上一页
                                $scope.isZoomIn = [false,false,false];
                                firstTap = '';
                            }
                        }, 400);
                    } else {
                        console.log('second tap');
                        var secondTap = new Date().getTime();
                        if(secondTap - firstTap < 400){
                            console.log(secondTap - firstTap);
                            isClick = false;
                            $scope.zoomImage(handle);
                        }
                        firstTap = '';
                    }
                }

            };

            //翻页动作监听
            function slideChange(index){
                console.log('slideChange index = ' +index);
                var scrollObj = $ionicScrollDelegate.$getByHandle('scrollHandle' + index);
                slideBox.enableSlide(scrollObj.getScrollPosition().zoom == 1);
                $scope.enableSlideFlag = slideBox.enableSlide();
            }

            //向左滑动
            function dragToLeft(index){
                //console.log('swipe left index = ' + index);
                var scrollObj = $ionicScrollDelegate.$getByHandle('scrollHandle' + index);
                if(scrollObj.getScrollPosition().zoom == 1){
                    slideBox.enableSlide(true);
                } else{
                    var zoomLevel = scrollObj.getScrollPosition().zoom - 1;//放大倍数
                    var left = Math.round(scrollObj.getScrollPosition().left);

                    var imageId = $scope.fromProgress?('#idProgressImage' + index):('#idImage' + index);
                    var image = document.querySelector(imageId);//获取图片对象
                    var boundWidth = Math.round(image.width*zoomLevel);
                    $scope.left = left;
                    $scope.imageWidth = zoomLevel + ' ' + boundWidth;
                    console.log('left = ' + left);
                    switch (index){
                        case 0:
                            slideBox.enableSlide(left>= boundWidth);
                            break;
                        case 1:
                            slideBox.enableSlide(left < 0 || left >= boundWidth);
                            break;
                        case 2:
                            slideBox.enableSlide(false);
                            break;
                    }
                }
                $scope.enableSlideFlag = slideBox.enableSlide();
            }

            //向右滑动
            function dragToRight(index){
                console.log('drag to right index = ' + index );
                var scrollObj = $ionicScrollDelegate.$getByHandle('scrollHandle' + index);
                if(scrollObj.getScrollPosition().zoom == 1){
                    slideBox.enableSlide(true);
                } else{
                    var zoomLevel = scrollObj.getScrollPosition().zoom - 1;
                    var left = Math.round(scrollObj.getScrollPosition().left);

                    var imageId = $scope.fromProgress?('#idProgressImage' + index):('#idImage' + index);
                    var image = document.querySelector(imageId);
                    var boundWidth = Math.round(image.width*zoomLevel);
                    $scope.left = left;
                    $scope.imageWidth = zoomLevel + ' ' + boundWidth;
                    console.log('left = ' + left);
                    switch (index){
                        case 0:
                            slideBox.enableSlide(left> boundWidth);
                            break;
                        case 1:
                            slideBox.enableSlide(left <= 0 || left > boundWidth);
                            break;
                        case 2:
                            slideBox.enableSlide(left <= 0);
                            break;
                    }
                }
                $scope.enableSlideFlag = slideBox.enableSlide();
            }
        }]
);