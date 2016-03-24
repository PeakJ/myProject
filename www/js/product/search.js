/********************************

 creater: xuf
 create time:2015/06/27
 describe：分类列表页
 modify time:2015/06/29

 ********************************/
//响应多平台样式服务类
cdfgApp.factory('StyleForPlatform',[function(){ //利用ionic判断平台
    function myBrowser(){
        var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
        var isOpera = userAgent.indexOf("Opera") > -1;
        if (isOpera){return "Opera"}; //判断是否Opera浏览器
        if (userAgent.indexOf("Firefox") > -1){return "FF";} //判断是否Firefox浏览器
        if (userAgent.indexOf("Safari") > -1){return "Safari";} //判断是否Safari浏览器
        if (userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera){return "IE";} ; //判断是否IE浏览器
    }
    var platform = ionic.Platform.platform(),  //判断ios or android  ios返回 ios  ；android 返回 android:85
        browser = myBrowser(),styleList;
        if(!window.cordova){//如果是浏览器访问  chrome 和 safari 使用统一内核
            var chrome = {
                    leftArrow:{},
                    clearHistoryImg:{},
                    searchSubBar:{}
                },
                ff = {
                    leftArrow:{},
                    clearHistoryImg:{},
                    searchSubBar:{}
                },
                ie ={
                    leftArrow:{},
                    clearHistoryImg:{},
                    searchSubBar:{}
                },
                opera ={
                    leftArrow:{},
                    clearHistoryImg:{},
                    searchSubBar:{}
                },
                styleList = chrome;  //默认是 chrome内核
            /**
             * to do 以后出现别的内核 需要加 if（browser == ‘内核名’）
             */
        }else {
            ios = {
                leftArrow: {},
                clearHistoryImg: {},
                searchSubBar: {}

            },
                android = {
                    leftArrow: {'margin-top': '-8px'},
                    clearHistoryImg: {},
                    searchSubBar: {}
                },
                windowsPhone = {
                    leftArrow: {},
                    clearHistoryImg: {},
                    searchSubBar: {}
                },
                styleList = ios;//默认是 苹果手机

            if (platform.indexOf('android') >= 0) {
                styleList = android;
            }
            else if (platform.indexOf('windowsPhone') >= 0) {
                styleList = windowsPhone;
            }
        }
    return {
        getStyle:function(key){
              return styleList[key];
        }
    }
}]);


//搜索服务
cdfgApp.factory('SearchService',['$http','UrlService',function($http,UrlService){
    return {
        getPopularWord:function(){
            return $http.get(UrlService.getUrl('GET_HOT_WORDS'));
        },
        getSeachHistory:function(){
            return $http.get('datas/searchHistory.json');
        },
        queryList:function(input){

            return $http.get(UrlService.getUrl('GET_QUERY_COMPLETE')+'?word='+input+'');
        }

    };
}]);
//搜索控制器
cdfgApp.controller('SearchController',['$scope','SearchService','PopupService',
    '$state','LocalCacheService','$stateParams','$ionicHistory','StyleConfig','StyleForPlatform',
    function($scope,SearchService,PopupService,$state,LocalCacheService,$stateParams,$ionicHistory,StyleConfig,StyleForPlatform){
    //搜索控制器

    $scope.headerStyle = StyleConfig.header;
    $scope.searchInputStyle = StyleConfig.searchInput;
    $scope.headerLeftArrowStyle = StyleConfig.headerLeftArrow;

        $scope.leftArrow = StyleForPlatform.getStyle('leftArrow');
 //  console.log($scope.bId+"-----从品牌页面商品列表发起的搜索有bId") ;
    // 获得最近搜索数据
    //初始化搜索历史

    $scope.shl = LocalCacheService.getObject('shl');
  //  $scope.formPage = $stateParams.fromPage;
    console.log("从本地存储中得到的历史记录" +ionic.Platform.platform());
    console.log( $scope.shl);
    $scope.placeholder = '';
    //判断空对象的工具类
    function isEmptyObject(obj){
        for(var n in obj){return false}
        return true;
    };
    //本地存储的工具方法 如果没有key对应的值，返回的是{}
    if(isEmptyObject($scope.shl) && !angular.isArray($scope.shl) ) {//如果不存在 新建一个array
        LocalCacheService.setObject("shl",new Array());
        $scope.shl =  LocalCacheService.getObject("shl");
    }
    Array.prototype.elremove = function(m){
        if(isNaN(m)||m>this.length){return false;}
        this.splice(m,1);
    };
    //向历史搜索数组中
    function insertIntoShl(searchObj,shl,maxLength,uniqueProp ){
        if(!searchObj  || !angular.isArray(shl) ||  isNaN(maxLength) ){
            console.error('向固定长度数组插入数据工具函数出错，传入的参数不合法');
            return;
        }
        var length = $scope.shl.length;
        if(length<maxLength && !uniqueProp){//当不需要去除相同值的时候直接插入
         //   $scope.shl.push(searchObj);//修改为 从 头 压入数组
            $scope.shl.splice(0,0,searchObj);
        }
        else if(length<maxLength && uniqueProp){
            var temp = searchObj[uniqueProp];
            for(var i=0;i<length;i++){
               if( $scope.shl[i][uniqueProp] == temp ){
                   $scope.shl.elremove(i);
                   break;
               }
            }
        //    $scope.shl.push(searchObj);
            $scope.shl.splice(0,0,searchObj);
        }
        else if(length>=maxLength && !uniqueProp){
            $scope.shl.elremove(maxLength-1);//删除最后一个
        //    $scope.shl.push(searchObj);
            $scope.shl.splice(0,0,searchObj);
        }
        else if(length>=maxLength && angular.isString(uniqueProp)){
            var temp = searchObj[uniqueProp];
            for(var i=0;i<length;i++){
                if( $scope.shl[i][uniqueProp] == temp ){
                    $scope.shl.elremove(i);
                    break;
                }
            }

              //  $scope.shl.push(searchObj);
                $scope.shl.splice(0,0,searchObj);
            if($scope.shl.length>maxLength) {
                $scope.shl.elremove($scope.shl.elremove(length - 1));//删除最后一个
                //    $scope.shl.push(searchObj);
            }

        //    $scope.shl.push(searchObj);
        }
        else{
            console.error("向固定长度数组插入数据工具函数出错,uniqueProp参数必须是字符串");
        }
    }
    //搜索实体构造函数
    function SearchObj(user,date,keyWord){
       this.user = user;
        this.date = date;
        this.keyWord = keyWord;
        return this;
    }
    //SearchService.getSeachHistory().then(function(d){
    //    $scope.history = d.data;
    //
    //});
    $scope.history = $scope.shl;
    //获得最近热门数据
    SearchService .getPopularWord().then(function(d){
        if(d.code == -1){
            $scope.popular = undefined;
            console.log("搜索热门词列表获取失败");
            return ;
        }
        $scope.popular = d.data;
        if(d.data ){
            $scope.placeholder = d.data[0]
        }
    });
    //搜索关键字补全数组
    $scope.results = [];
    $scope.queryList = function(word){
        if(!word||word===''){
            $scope.results = [];
            return ;
        }
        SearchService.queryList(word).then(function(d){
            $scope.results = d.data;
        });

    };
        $scope.clearSearch = function(){
            $scope.query.tag = "";
            $scope.results = [];
        }
            //触发搜索
        $scope.closeSearchAndGo = function(query,$event){
        String.prototype.trim=function(){
            return this.replace(/(^\s*)|(\s*$)/g, "");
        }
        query = query.trim();
        if(!validate(query)){//非空判断
            if($scope.popular && $scope.popular[0]) {
                query = $scope.popular[0];
            }
            else {
                if (window.cordova) {
                    cordova.plugins.Keyboard.close();
                }
                PopupService.alertPopup('提示', '搜索关键字不能为空。');
                $scope.query.tag = "";
                return;
            }
        }
            //  $scope.formPage = $stateParams.fromPage;
        $scope.query.tag = query;
            $scope.results = [];
        insertIntoShl(new SearchObj("username",new Date(),query),$scope.shl,20,"keyWord");
        //本地存储只能存储字符串
        LocalCacheService.setObject("shl",$scope.shl);
        if($event){
            $event.stopPropagation();
        }
            $scope.closeSearch();//调用父scope的closeSearch 方法 隐藏 搜索页面
        $state.go('productList.view',{'query':query,'fromPage':'search'});
    //    $state.go('productList.search.rr.rr.rr.'+query+'.view');
       //每次搜索 存入搜索记录

    };
    //清空最近搜索历史
    $scope.clear = function(){
        $scope.shl = new Array();
        LocalCacheService.setObject("shl", $scope.shl);
    };
    $scope.doSearch = function(e){
        var keycode = window.event?e.keyCode:e.which;
        if(keycode==13){
          $scope.closeSearchAndGo( $scope.query.tag);
        }
    };

    function validate (si){
        if(!si || si===''){
            return false;
        }
        return true;
    }

}]);

cdfgApp.controller('TestController',function(){


});