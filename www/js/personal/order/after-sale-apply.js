/**
 * 个人中心-->申请售后服务
 * Created by 葛硕 on 2015/07/07.
 */
cdfgApp.controller('AfterSaleApplyController', ['$scope', '$ionicHistory', '$state', '$stateParams', '$ionicLoading',
        '$cordovaImagePicker', '$cordovaCamera', '$ionicActionSheet', '$rootScope', 'PopupService', 'UrlService',
        '$http','UserService',
        function ($scope, $ionicHistory, $state, $stateParams, $ionicLoading, $cordovaImagePicker, $cordovaCamera,
                  $ionicActionSheet, $rootScope, PopupService, UrlService, $http,UserService) {
            var uploadImageUrl = UrlService.getUrl('AFTER_SALE_UPLOAD');
            var orderGoodsCount = $stateParams.goodsCount;
            var imageSuccessCount = 0;
            var isUploadSuccess = true;
            $scope.imageList = [];
            $scope.evidencePicUrl = '';
            //接收上个页面的参数
            $scope.orderId = $stateParams.orderId;
            $scope.afterSaleGoods = JSON.parse($stateParams.goodsData);

            $scope.pickImage = pickImage;//从本地相册选择图片
            $scope.submitApply = submitApply;//提交售后申请
            $scope.takePicture = takePicture;//拍照
            $scope.toApplyImages = toApplyImages;//查看图片
            $scope.toOrderDetail = toOrderDetail;//查看订单详情
            $scope.addCount = addCount;//修改数量
            $scope.checkBill = checkBill;//选择申请凭证

            $scope.applyParams = {
                serviceType: 2,//目前只有退货一种，以后扩展  服务类型  1:维修,2:退货,3:换货'
                count: 1,
                hasBill: 0,
                reasons: [
                    {'id': 0, 'value': '选择退货原因'},
                    {'id': 1, 'value': '尺码问题'},
                    {'id': 2, 'value': '质量问题'},
                    {'id': 3, 'value': '与实际描述不符合'},
                    {'id': 4, 'value': '七天无理由退款'},
                    {'id': 5, 'value': '其他'}
                ],
                reasonDetail: ''
            };
            $scope.applyParams.reasons.selectVal = $scope.applyParams.reasons[0];

            /*返回上一页*/
            $scope.goBack = function () {
                $ionicHistory.goBack();
            };

            //跳转到订单详情
            function toOrderDetail(orderId) {
                console.log('申请售后服务-->查看订单详情 orderId = ' + orderId);
                $state.go('order-detail', {'orderId': orderId});
            }

            //数量加减
            function addCount(number) {
                var countResult = $scope.applyParams.count + number;
                if (countResult > 0 && countResult <= $scope.afterSaleGoods.num) {
                    $scope.applyParams.count = countResult;
                }
            }

            //单选按钮选择
            function checkBill(hasBill) {
                $scope.applyParams.hasBill = hasBill;
            }

            //提交申请
            function submitApply() {
                if ($scope.applyParams.reasons.selectVal.id == 0) {
                    PopupService.alertPopup('请选择退货原因');
                } else if ($scope.applyParams.reasonDetail.length > 150) {
                    PopupService.alertPopup('问题描述不能大于150个字');
                } else if ($scope.applyParams.reasonDetail.length < 10) {
                    PopupService.alertPopup('问题描述不能少于10个字！');
                } else {
                    console.log('提交售后申请 ');
                    if($scope.imageList.length == 0){
                        //提交售后服务申请
                        submitApplyInfo();
                    } else {
                        isUploadSuccess = true;
                        $ionicLoading.show({template:'正在上传图片...'} );
                        //上传图片
                        for (var i = 0, len = $scope.imageList.length; i < len; i++) {
                            if(isUploadSuccess){
                                uploadImage($scope.imageList[i].url);
                            }
                        }
                    }
                }
            }


            /*上传图片*/
            $scope.addImage = function () {
                console.log('用户中心-->申请售后-->上传图片');

                //debug start
                //addToList('img/test.png');
                //debug end

                // Show the action sheet
                var hideSheet = $ionicActionSheet.show({
                    titleText: '<b>上传图片</b>',
                    buttons: [
                        {text: '拍摄照片'},
                        {text: '从相册中选择'}
                    ],
                    buttonClicked: function (index) {
                        switch (index) {
                            case 0:
                                $scope.takePicture();
                                break;
                            case 1:
                                $scope.pickImage();
                                break;
                        }
                        return true;
                    },
                    cancelText: '取消',
                    cancel: function () {
                        // add cancel code..
                    }
                });


            };

            //从本地相册选择图片
            function pickImage() {
                console.log('选择图片');
                var options = {
                    maximumImagesCount: 3,
                    width: 800,
                    height: 800,
                    quality: 80
                };
                $cordovaImagePicker.getPictures(options).then(function (results) {
                    console.log(results);
                    for (var i = 0, len = results.length; i < len; i++) {
                        addToList(results[i]);
                    }
                }, function (error) {
                    PopupService.alertPopup('获取图片失败！');
                });
            }


            //拍照
            function takePicture() {
                $cordovaCamera.cleanup();
                var options = {
                    quality: 100,
                    destinationType: Camera.DestinationType.FILE_URI,
                    encodingType: Camera.EncodingType.JPEG
                };

                $cordovaCamera.getPicture(options).then(function (imageUrl) {
                    // Success! Image data is here
                    //alert(imageData);
                    addToList(imageUrl);
                }, function (err) {
                    // An error occured. Show a message to the user
                    PopupService.alertPopup('获取照片失败！');
                });

            }

            //添加到图片数组
            function addToList(imageUrl) {
                var imageData = {};
                imageData.url = imageUrl;

                var imageLoad = new Image();
                imageLoad.src = imageUrl;
                imageLoad.onload = function () {
                    //alert('size ready: width=' + img.width + '; height=' + img.height);
                    $scope.$apply(function () {
                        imageData.isVertical = imageLoad.width < imageLoad.height;
                    });
                };
                $scope.imageList.push(imageData);
            }

            // 将图片上传到服务器
            function uploadImage(imageURI) {
                console.log('售后申请-->上传图片到服务器');

                var fileOptions = new FileUploadOptions(); //文件参数选项
                fileOptions.fileKey = "file";//向服务端传递的file参数的parameter name
                fileOptions.fileName = imageURI.substr(imageURI.lastIndexOf('/') + 1);//文件名
                fileOptions.mimeType = "image/jpeg";//文件格式，默认为image/jpeg

                var fileTransfer = new FileTransfer();//文件上传类
                fileTransfer.onprogress = function (progressEvt) {//显示上传进度条

                };
                fileTransfer.upload(imageURI, encodeURI(uploadImageUrl), uploadSuccess, uploadFail, fileOptions);
            }

            //图片上传成功
            function uploadSuccess(result) {
                isUploadSuccess = true;
                var response = JSON.parse(result.response);
                if (response.code == 1) {
                    if($scope.evidencePicUrl == ''){
                        $scope.evidencePicUrl += response.rid;
                    } else {
                        $scope.evidencePicUrl += ('|' + response.rid);
                    }
                    imageSuccessCount++;

                    //最后一个图片成功提交后
                    if (imageSuccessCount == $scope.imageList.length) {
                        $ionicLoading.hide();
                        submitApplyInfo();
                    }
                } else {
                    PopupService.alertPopup('图片上传失败');
                }
            }

            //图片上传失败
            function uploadFail(error) {
                isUploadSuccess = false;
                $ionicLoading.hide();
                PopupService.alertPopup('图片上传失败');
            }

            //跳转到图片查看页面
            function toApplyImages(index) {
                console.log('申请售后-->图片查看');
                $state.go('apply-images', {'imageList': JSON.stringify($scope.imageList), 'index': index});
            }

            //提交申请信息
            function submitApplyInfo(){
                //1.提交申请
                var applyUrl = UrlService.getUrl('AFTER_SALE_APPLY');

                var hasProof = ($scope.applyParams.hasBill==0) ? 2 : 4;// '申请凭证 2:有发票  4：没有

                var returnType;//退货类型：1全部退货，2部分退货
                if(orderGoodsCount == 1 && $scope.applyParams.count == $scope.afterSaleGoods.num){
                    returnType = 1;//全部退货
                } else {
                    returnType = 2;
                }

                var formData = {
                    userId:UserService.getUser().userId,
                    orderId: $scope.orderId,
                    serviceType: $scope.applyParams.serviceType,
                    returnType: returnType,
                    reasonType: $scope.applyParams.reasons.selectVal.id,
                    returnReason: $scope.applyParams.reasonDetail,
                    evidencePicUrl: $scope.evidencePicUrl,
                    quantity: $scope.applyParams.count,
                    applicationVoucher: hasProof,
                    items: [
                        {
                            itemId: $scope.afterSaleGoods.id,
                            skuId: $scope.afterSaleGoods.skuId,
                            returnQuan: $scope.applyParams.count
                        }
                    ]
                };
                var applyParams = {
                    param: JSON.stringify(formData)
                    //param: formData
                };

                console.log('提交售后申请 url = '+ applyUrl + '  request = ' + JSON.stringify(applyParams));
                $http.post(applyUrl,applyParams).success(function(response){
                    console.log('提交售后申请  response = ' + JSON.stringify(response));

                    //网络异常、服务器出错
                    if(!response || response == CDFG_NETWORK_ERROR){
                        return;
                    }

                    if(response.code == 1){
                        PopupService.showPrompt('售后申请已提交');

                        $rootScope.$broadcast("RefreshAfterSaleList");//刷新订单列表
                        $rootScope.$broadcast("RefreshOrderList");//刷新订单列表

                        $scope.goBack();
                    } else {
                        var errorText = response.data?response.data:'申请提交失败';
                        PopupService.alertPopup(errorText);
                    }
                }).error(function(response){
                    PopupService.alertPopup(CDFG_NETWORK_ERROR);
                });
            }

            //接受数据改变的广播
            $rootScope.$on('ApplyImagesChange', function (event, data) {
                console.log('接收广播');
                $scope.imageList = [];
                $scope.imageList = data;
            });
        }]
);