/********************************

 creater:haosijia@cdfg.com.cn
 create time:2015/06/07
 describe：弹框
 modify time:2015/07/16

 ********************************/

cdfgApp.factory('PopupService', ['$ionicPopup', '$timeout', '$ionicLoading', function ($ionicPopup, $timeout, $ionicLoading) {
    var popupDialog = null;

    return {
        // 弹出提示窗口
        alertPopup: function (title, template) {
            return $ionicPopup.alert({
                title: title ? title : null,
                template: template,
                okType: 'button-assertive',
                cssClass: 'popup-alert'
            });
        },

        // 弹出确认窗口
        confirmPopup: function (title, template, okText, cancelText) {
            return $ionicPopup.confirm({
                title: title ? title : null,
                template: template,
                okText: okText ? okText : '确定',
                okType: 'button-assertive',
                cancelText: cancelText ? cancelText : '取消',
                cancelType: 'button-light button-line'
            });
        },

        //弹出定制弹出框  无按钮提示
        //error ==>失败按钮  hide ==>无按钮  不传默认成功按钮
        promptPopup: function (template, iconType) {
            var icon;
            if (iconType == 'error') {
                icon = '<i class="icon ion-ios-close-outline"></i>';
            } else if (iconType == 'hide') {
                icon = '';
            } else {
                icon = '<i class="icon ion-ios-checkmark-outline"></i>';
            }

            return $ionicLoading.show({
                template: icon + template,
                duration: 2000  //持续时间2ms后调用hide()
            });
        },

        //弹出定制弹出框  无按钮提示
        //showPrompt: function(message){

        //}
        showPrompt: function (message, success, error) {
            //如果是ios或者android系统，开启toast功能。避免网页报错
            if (window.plugins && (ionic.Platform.isIOS() || ionic.Platform.isAndroid()) && window.plugins.toast) {
                window.plugins.toast.showShortCenter(message, success, error);
            }
            //如果是网页调试，则用弹窗代替
            else {
                //if (null == popupDialog) {//当前无对话框显示
                //    // An elaborate, custom popup
                //    //var title = '<i class="icon ion-ios-checkmark-outline" ></i><br><br>'
                //    //    + '<div style="width: 100%;text-align: center">'
                //    //    + message
                //    //    + '</div>';
                //    var title =  '<div style="width: 100%;text-align: center">'
                //                    + message
                //                    + '</div>';
                //    popupDialog = $ionicPopup.show({
                //        title: title,
                //        cssClass: 'cdfg-message-popup-width'
                //    });
                //    $timeout(function () {
                //        popupDialog.close(); //close the popup after 3 seconds for some reason
                //        popupDialog = null;//关闭后清空
                //    }, 1000);
                //}
            }
        }

    };
}]);


