/********************************

 creater:maliwei@cdfg.com.cn
 create time:2015/06/19
 describe：购物车
 modify time:2015/06/19

 ********************************/
/**
 State 模块路由
 **/

/**
 State 指令
 **/

/**
 State 过滤器
 **/

/**
 *  Service 模块服务
 **/

/**
 *  Service 指令
 **/

/**
 *   controller 控制器信息
 *
 * **/

cdfgApp.controller('PaytypeController', ['$scope', '$http', '$state', '$stateParams', 'CartService','UrlService','$location','$ionicPopup','PopupService','$filter','payWapService','$q','$ionicLoading',function ($scope, $http, $state, $stateParams, CartService,UrlService,$location,$ionicPopup,PopupService,$filter,payWapService,$q,$ionicLoading) {

    $scope.orderId=$stateParams.orderId;
    var orderData={};
    //获取订单信息
    $http.post(UrlService.getUrl('GET_ORDER_INFO'),{id:$scope.orderId}).success(function(d){
        if(d.code==1){
           var data= d.data;
           orderData={
               orderCode:data.id,
                orderId: data.code,
                orderTime:$filter('date')(data.createdDate,'yyyy-MM-dd HH:mm:ss'),
                payAmt: data.realChargeFee,
                orderName: data.prodName,
                orderTotal: data.quantity   //件数
            };
            $scope.order=orderData;
        }
    });
    //去支付
    $scope.pay=function(type){
        //拼接支付参数
        var data={
            "payChannelId":type,
            "orderId": orderData.orderId,
            "orderCode":orderData.orderCode,
           // "payAmt":orderData.payAmt,
            "payAmt":0.01,
            "orderTime":orderData.orderTime,
            "orderNote":orderData.orderName,
            "mallId":"app",
            "customUrl":"http://124.200.177.190/payment/paysuccess",
            "type":"2"
        }
        var param = function(obj) {
            var query = '', name, value, fullSubName, subName, subValue, innerObj, i;

            for(name in obj) {
                value = obj[name];

                if(value instanceof Array) {
                    for(i=0; i<value.length; ++i) {
                        subValue = value[i];
                        //modify by maliwei 数组合并成a=0&a=1这种格式，旧的格式是a[0]=1&a[1]=2
                        //fullSubName = name + '[' + i + ']';
                        fullSubName=name;
                        innerObj = {};
                        innerObj[fullSubName] = subValue;
                        query += param(innerObj) + '&';
                    }
                }
                else if(value instanceof Object) {
                    for(subName in value) {
                        subValue = value[subName];
                        fullSubName = name + '[' + subName + ']';
                        innerObj = {};
                        innerObj[fullSubName] = subValue;
                        query += param(innerObj) + '&';
                    }
                }
                else if(value !== undefined && value !== null)
                    query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
            }

            return query.length ? query.substr(0, query.length - 1) : query;
        };
        // 确认弹出框
        var showConfirm=function(){
            $ionicPopup.show({
                title: "您的支付完成了吗",
                scope: $scope,
                buttons: [
                    { text: "重选支付方式" },
                    {
                        text: "支付完成",
                        type: "button-assertive",
                        onTap: function(e) {
                            //检查订单状态：是否已支付完成
                           $http.get(UrlService.getUrl('PAY_QUERY'),{params:data}).success(function(d){
                                console.log(d);
                                if(d.sucCode==200){
                                    $state.go('pay-success',{orderid:orderData.orderId,orderTotal:orderData.orderTotal});
                                }else{
                                    PopupService.alertPopup('订单提示', '支付失败');
                                }

                            })
                        }
                    }
                ]
            });
        }
        //跳转到支付
        var defer=$q.defer();
       payWapService.payWap(UrlService.getUrl('PAY_REQUEST')+param(data),defer);
       //payWapService.payWap('http://192.168.103.137:8080/payment/testPaysuccess',defer);
        defer.promise.then(function(d){
            $state.go('pay-success',{orderid:data.orderCode,orderTotal:orderData.orderTotal});
        },function(){
            showConfirm();
        });
    }

}]);


























