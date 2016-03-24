/********************************

 creater: xuf
 create time:2015/07/15
 describe：分类列表页
 modify time:2015/07/15

 ********************************/
cdfgApp.factory('PromotionService',['$http','UrlService',function($http,UrlService){
    var urlPromotion = UrlService.getUrl('GET_PROMOTION_CONFIG_PAGE');
    var urlPromotionList = UrlService.getUrl('GET_PROMOTION_PRODUCT_LIST');
    return {
        getProductList:function(param){
            var params = param;
            return $http.get(urlPromotionList,{params:params});

        },
        getSecondTypeList:function(param,pId){
            return $http.get('datas/secondType'+pId+'.json',param);
        },
        getPromotion:function(topicId){
            var params = {'topicId':topicId}
            return $http.get(urlPromotion,{params:params});
        }

    };
}]);


cdfgApp.controller('PromotionProductListController',['$scope', '$http', '$ionicNavBarDelegate','PromotionService','$stateParams','StyleConfig','$ionicHistory',
    '$ionicScrollDelegate','$state','ChangeAttrsService','$timeout',
    function($scope, $http, $ionicNavBarDelegate,PromotionService,$stateParams,StyleConfig,$ionicHistory,
             $ionicScrollDelegate,$state,ChangeAttrsService,$timeout){

        $scope.myGoBack = function() {
            $ionicHistory.goBack();
        };

        $scope.headerStyle = StyleConfig.header;
        $scope.headerTitleStyle= StyleConfig.headerTitle;
        $scope.headerLeftArrowStyle = StyleConfig.headerLeftArrow;
        $scope.contentBkgStyle = StyleConfig.contentBkg;
        var pageSize = 20,param ={ fromType: "ppl", page: 1, pageSize: pageSize,promotionId: $stateParams.promId},
            oPromotionType = ['','[单品折扣]', '[单品赠品]', '[品类折扣]', '[品类满赠]'];
        $scope.param = param;
       // $scope.param.Id = $stateParams.promId;
        $scope.totolPage = 0;//总页数
        $scope.list={};
        $scope.list.show=false;//商品列表的展现形式默认是grid展示
        $scope.total = 0;  //总记录数
        $scope.pType ='';
        $scope.pDescription = '';

        $scope.initData = function(type){
            PromotionService.getProductList($scope.param).then(function (data) {

                if(!data){
                    console.warn('网络连接失败')
                    return;
                }
                var code = data.status,//状态码
                code_ = data.data.code ;//服务返回的状态吗，0,1，类似
                data = data.data.data;
                if(!data){
                    $scope.pDescription = '你来晚了~亲，活动商品已被抢光了';
                    $scope.title = '活动商品已售罄';
                    return ;
                }
                $scope.total = data.total;
                $scope.totolPage = parseInt(data.total/pageSize);

                $scope.title = data.name;//活动名称
                $scope.pType = oPromotionType[data.promotionType];
                $scope.pDescription = data.description;console.log('--->pDescription'+data.description);
                ChangeAttrsService.changeAttrs(data.products,['prodName','lowestPrice','highestPrice','prodId'],['name','price','mPrice','id']);
                if (type) {

                    $scope.productData ? $scope.productData = $scope.productData.concat(data.products) : $scope.productData = data.products;
                } else {
                    $scope.productData = data.products;
                }

            },function(d){ //请求失败回调函数
                console.log("请求活动商品失败。")
                return ;
            });
        };
        $scope.initData();

        $scope.doRefresh = function(){
            $scope.param.page = 1;
            $scope.initData();
            $scope.$broadcast('scroll.refreshComplete');

        };
        $scope.loadMore = function () {

            $timeout(function () {
                if (!$scope.hasMore()) {
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                    return;
                }
                $scope.param.page++;
                $scope.initData('add');
                $scope.$broadcast('scroll.infiniteScrollComplete');
            }, 500);
        };
        $scope.hasMore = function () {
            return $scope.totolPage > $scope.param.page;
        };
}]);
//活动专题页 controller
cdfgApp.controller('PromotionListController',['$scope','ChangeAttrsService','$window','$timeout','StyleConfig','$ionicHistory','PromotionService',
    '$stateParams','PopupService',function($scope,ChangeAttrsService,$window,$timeout,StyleConfig,$ionicHistory,PromotionService,$stateParams,PopupService){
    //活动页面是由后台配置来的，页面元素现在有4种，0-‘banner’以此类推
    typeIndexOfPromotionModuelType = ['banner','productList','splitBar','custom'];
    //活动核心对象 通过接口获得

    $scope.headerStyle = StyleConfig.header;
    $scope.headerTitleStyle= StyleConfig.headerTitle;
    $scope.headerLeftArrowStyle = StyleConfig.headerLeftArrow;
        $scope.imgConfig ={
            imgH:182,//从设计稿psd中量出
            productPicH:182,
            imgW_half:$window.innerWidth/2,
            imgH_half:91
        };
        $scope.is404 = false;
        $scope.isOnline = true;
        $scope.title = "";

        PromotionService.getPromotion($stateParams.promotionId).then(function(d){
            if(!d){
                console.warn('网络连接失败')
                return;
            }
            //处理自定义模块数据,将“替换成&quot;
            angular.forEach(d.data.data,function(v,key){
                if(v.type=='10'){
                    var str=v.rows[0].html.replace(/"/g,'&quot;' )
                    v.rows[0].html=str;
                }
            });

            var code = d.status; //状态码
            $scope.pcp  = d.data;//从数据库返回的真实数据
            $scope.title = d.data.title;
            $scope.pcp.stopTime = d.data.stopTime;
            $scope.pcp.serverTime = d.data.serverTime; //服务器时间 to do
            if(!d.data.stopTime|| !d.data.serverTime){
                PopupService.alertPopup('哎呀，活动出错了');
                console.log('********活动结束时间 不存在 或格式问题*************');
                return ;
            }
            $scope.pcp.stopTimeMs = Date.parse($scope.pcp.stopTime.replace(/-/g, "/"))-0; //活动结束时间毫秒值

            $scope.pcp.deltaTimeMs = Date.parse($scope.pcp.serverTime.replace(/-/g, "/")) - new Date();//获得本地时间与服务器时间差
            if((new Date()-0 + $scope.pcp.deltaTimeMs)  > $scope.pcp.stopTimeMs ){
                $scope.clockObj.isExpired = true;
                return ;
            }
            clockStart();
        });

    $scope.list={};
    $scope.list.show = false;
    var positionX =  ($window.innerWidth - 189)/2 ;  //179倒计时区域的宽度是固定的
    $scope.positionX = {left:0,right:0,top:0,bottom:0,'margin':'0 auto'};
    $scope.promotionImgConfig ={
        imgH:188
    };
    //页面中的倒计时数据模型
    $scope.clockObj = {
        dayLeft:0,
        timeLeft:"00:00:00",
        expiredMsg:'Sorry,活动已结束。',
        isExpired:false,
        msLeft:0 //剩下的毫秒值
    };
    //为了使页面有数据，使用了promotion假数据对象,promotion中的pageContent中储存页面元素对象数组，第二个元素为商品列表，为了使用productList模板需要属性转换

        //$scope.brandList= ChangeAttrsService.changeAttrs($scope.pcp.pageContent[1].pList,['pId','pName','pPrice','pStatus','pOrignPrice','pImgSrc'],
        //    ['id','name','price','status','orignPrice'],true);
        function clockStart(){
        //取得promotion对象后,变更clockObj
        $scope.clockObj.msLeft = Date.parse($scope.pcp.stopTime.replace(/-/g, "/"))-new Date();  //Date.parse(promotion.serverDatetime.replace(/-/g, "/")
        $scope.clockObj.dayLeft = changeMs2Day($scope.clockObj.msLeft);
        $scope.clockObj.timeLeft = changeMs2Time($scope.clockObj.msLeft);
            //倒计时时钟loop函数
            function clock(){
                $scope.clockObj.msLeft= $scope.clockObj.msLeft -1000;
                $scope.clockObj.dayLeft = changeMs2Day($scope.clockObj.msLeft);
                $scope.clockObj.timeLeft = changeMs2Time($scope.clockObj.msLeft);
                if((new Date()-0 + $scope.pcp.deltaTimeMs)  > $scope.pcp.stopTimeMs ){//过期后不再loop
                    $scope.clockObj.isExpired = true;console.log('exprired');
                    return
                }
                $timeout(clock,1000);
            };
            $timeout(clock,1000);
        }
    // 将毫秒值转换为需要的字符串
    function changeMs2Time(ms){
        ms = ms%(86400000);
        ms = parseInt(ms);
        var hh = '00', h,mm = '00', m,ss= '00',s;
        h = parseInt(ms/3600000);
        if(h<10){
           hh= '0'+h;
        }else{
            hh= new String(h);
        }
        ms = ms-h*3600000;
        m= parseInt(ms/60000);
        if(m<10){
            mm= '0'+m;
        }else{
            mm= new String(m);
        }
        ms = ms - m*60000;
        s= parseInt(ms/1000);
        if(s<10){
            ss= '0'+s;
        }else{
            ss= new String(s);
        }
        return hh+':'+mm+':'+ss;
    };
    //剩余毫秒值转化为剩余天数
    function changeMs2Day(ms){
        ms = parseInt(ms/ 86400000);
        return ms;
    }


    $scope.myGoBack = function() {
        $ionicHistory.goBack();
    }
}]);

cdfgApp.directive('promotionModuleType',function(){
    // type 0 顶部 ，1 ,2商品列表 ，3左一右二 ，4左二右一
    var tpl=[undefined,'imgad','imgad-1-many','imgad-3-1','imgad-3-2','mdslide','prolist','prolist','prolist','prolist','custom'];
//    var tpl=[undefined,'imgad','imgad-1-many','imgad-3-1','imgad-3-2','mdslide','prolist','prolist','prolist','prolist','custom'];
    return {
        restrict:'A',
        //  replace:true,
        template : '<ng:include src="tpl"></ng:include>',
        link : function(scope, iElement, iAttrs) {

            var moduleType=iAttrs.promotionModuleType;
            if( moduleType){
                scope.tpl=  "templates/home/"+tpl[moduleType]+'.html';
            }
            //else{
            //    console.error('促销活动配置页面 指令参数 出错。');
            //}

        }

    }

});