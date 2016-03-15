/**
 * Created by 11150421050181 on 2015/8/5.
 */
/**
 * 消息跳转服务
 * 张俊辉
 * 2015-08-05 10:42
 */
bomApp.factory('messageState', ['$state', function ($state) {
    return {
        url: function (type, files) {
            console.log(type + " :" + files);
            //出差申请
            if(type == '1'){
                $state.go('businessTripDetails',{businessTripId:files})
            }
            //出差审核
            else if(type == '4'){
                $state.go('businessTripApproval',{businessTripId:files})
            }
        }
    }
}]);