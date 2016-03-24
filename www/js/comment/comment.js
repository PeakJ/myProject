/********************************

 creater:haosijia@cdfg.com.cn
 create time:2015/07/09
 describe：单品详情页
 modify time:2015/07/09

 ********************************/

/*
 Service 服务
 */
cdfgApp.factory('CommentServices',['$http','UrlService',function($http,UrlService){
    var urlSum = UrlService.getUrl('COMMENT_SUMMARY'),urlGet = UrlService.getUrl('COMMENT_GET');
    return {
        //商品好评数和评价数
        commentTotal: function(prodId){
            /*return $http.post(UrlService.getUrl('COMMENT_SUMMARY'), {
                    prodId:prodId,
                    channel:1
                });*/
            return $http.post(urlSum, {//103.122:8080/if4app/comment/summary
                prodId:prodId,
                channel:1
            });
        },
        //商品评价列表
        commentList: function(params){
            return $http.post(urlGet, params);
            //return $http.post(UrlService.getUrl('COMMENT_GET'), params);

        }
    };
}]);

/*
 directive模块指令
 */
//商品评分
cdfgApp.directive('starNumber', [function factory() {
    return {
        restrict: 'A',
        scope: false,
        link: function($scope, $el, $attrs){
            var element = $el[0],
                number = $attrs.starNumber;
            for(var i=0;i<5;i++){
                if(i<$attrs.starNumber){
                    element.innerHTML += '<i class="icon ion-ios-star assertive"></i>';
                }else{
                    element.innerHTML += '<i class="icon ion-ios-star general-sub"></i>';
                }

            }
        }
    };
}]);

/*
 Controller 模块控制器
 */
cdfgApp.controller('CommentController', ['$scope','$stateParams','CommentServices','$ionicModal','$timeout', '$ionicHistory',
    function ($scope,$stateParams,CommentServices,$ionicModal,$timeout, $ionicHistory) {

    /* ADD START BY 葛硕20150808：[APP-95] bug:部分标题会显示样式错乱 -------------------------------*/
    $scope.goBack = goBack;
    //返回上一页
    function goBack(){
        $ionicHistory.goBack();
    }
    /* ADD END   BY 葛硕20150808：[APP-95] bug:部分标题会显示样式错乱 -------------------------------*/

    var prodId = $stateParams.prodId;

    angular.extend($scope, {
        commentNumber: null,
        commentTotal: function(){
            var me = $scope;
            CommentServices.commentTotal(prodId).success(function (data) {
                console.log('summury');
                if(data.code == 1){
                    me.commentNumber = data.data;
                }
            }).error(function (data, status, headers, config) {
                PopupService.alertPopup(CDFG_NETWORK_ERROR);
            });
        },
        params: {
            pageNo: 1,
            pageSize: CDFG_PAGE_SIZE * 2,
            status: '0',  //评论类型   0(全部评价)   1（好评数）2（中评）3(差评)
            prodId:prodId,
            channel:1
        },
        commentDate: null,
        startMax: 1,
        hideInfinite: false, //初次加载隐藏上拉加载
        networkError: false,//不显示网络错误
        commentList: function(){//获得各种评论类型的评价
            var me = $scope;
            console.log(me.params);
            CommentServices.commentList(me.params).success(function (data) {
                //网络异常、服务器出错
                if(!data || data == CDFG_NETWORK_ERROR){
                    $scope.networkError = true;
                    return;
                }
                $scope.networkError = false;
                if(data.code == 1){
                    me.commentDate = data.data.data;
                    me.startMax = Math.ceil(data.total / me.params.pageSize);
                    $timeout(function () {
                        me.hideInfinite = true;
                    }, 500);
                }
            }).error(function (data, status, headers, config) {
                PopupService.alertPopup(CDFG_NETWORK_ERROR);
            });
        },
        zoomPic: function(picUrl){
            var me = $scope;
            me.zoomPicUrl = picUrl;
            $scope.zoomPicModal.show();
        },
        hidePic: function(){
            $scope.zoomPicModal.hide();
        },
        //上拉加载
        loadMore: function () {
            var me = $scope;
            if (!me.hasMore) {
                me.$broadcast('scroll.infiniteScrollComplete');
                return;
            }
            $timeout(function () {
                me.params.pageNo++;
                me.commentList();
                me.$broadcast('scroll.infiniteScrollComplete');
            }, 500);
        },
        //下拉刷新
        doRefresh: function () {
            var me = $scope;
            me.params.start = 0;
            me.commentList();
            me.$broadcast('scroll.refreshComplete');
        },
        hasMore: function () {
            var me = $scope;
            if(!me.hideInfinite){
                return false;
            }
            return me.startMax > me.params.pageNo;
        },
        restartPage: function(){
            $scope.commentList();
            $scope.commentTotal();
        },
        statusToggle: function(status){
            var me = $scope;

            me.params.status = status;
            me.commentList();
        }


    });

    $scope.commentList();
    $scope.commentTotal();

}]);