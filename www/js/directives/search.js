/*
       *** 搜索指令  by xuf  ***
 *  query 相当与搜索指令的配置核心对象，
 * 可以变化的都放在query 中，query 是从包含该指令的页面的controller的scope提供的
 * {
 * tag:'' 搜索关键字
 * isShowSearch; 搜索页面是否显示
 * hasPopularDiv  是否有 热门词区域
 * hasHistoryDiv  是否有 搜索历史记录区域
 * goTo  ： “” 转到 路由 地址
 * urlParam:  路由附加参数
 * {
 * shopId:$scope.query.shopId  //需要传给下个页面的参数
 * },
 *varInDirective{  //需要在directive中使用的变量
 *   shipId :
 *
 * }
 */

//搜索指令
cdfgApp.directive('cdfgSearch',['$http','$state','SearchService','PopupService','LocalCacheService',
    'LocalCacheService','StyleForPlatform','$timeout','$rootScope','$timeout',
    function($http,$state,SearchService,PopupService,LocalCacheService,LocalCacheService,StyleForPlatform
    ,$timeout,$rootScope,$timeout){
        return{
            restrict:'A',
            replace:false,
            scope:{
                query:'=cdfgSearch'
            },
            templateUrl:'templates/shop/shop-search-template.html',
            controller:function($scope){
                $scope.closeSearch = function(){
                    $scope.query.isShowSearch = false;
                };

                $scope.results = [];//搜索关键字补全

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
                //验证搜索字符串 判断 非空，和 html标签
                //返回 的是错误 信息， 返回undefined 说明搜索字符合法
                function validate (si){
                    var reg = new RegExp('^<([^>\s]+)[^>]*>(.*?<\/\\1>)?$');
                    if(!si || si===''){
                        return {code:1 ,msg:"搜索关键字不能为空。"};
                    }
                    //else if(reg.test(si)){
                    //    si= si.replace(/</g,'') ;
                    //    si=si.replace(/>/g,'') ;
                    //    return {code:2,msg:"搜索关键字不能含有<,>。"};
                    //}
                    return undefined;
                }
                $scope.history = $scope.shl;
                //获得最近热门数据
                if($scope.query.hasPopularDiv) {
                    SearchService.getPopularWord().then(function (d) {
                        if (d.code == -1) {
                            $scope.popular = undefined;
                            console.log("搜索热门词列表获取失败");
                            return;
                        }
                        $scope.popular = d.data;
                        if (d.data) {
                            $scope.placeholder = d.data[0]
                        }
                    });
                }

                //清除搜索栏
                $scope.clear = function(){
                    $scope.query.tag = "";
                    $scope.results = [];
                };

                $scope.closeSearchAndGo = function(query,$event){
                    String.prototype.trim=function(){
                        return this.replace(/(^\s*)|(\s*$)/g, "");
                    };
                    query = query.trim();
                    var validateObj = validate(query);
                    if(validateObj){
                        if($scope.popular && $scope.popular[0] && validateObj.code ==1) {//当搜索关键词为空时，且有热门词时
                            query = $scope.popular[0];
                        }
                        else if( validateObj.code ==1 && (!$scope.popular|| !$scope.popular[0])){
                            if (window.cordova) {
                                cordova.plugins.Keyboard.close();
                            }
                            PopupService.alertPopup('提示', '搜索关键字不能为空。');
                            $scope.query.tag = "";
                            return;
                        }
                    }
                    $scope.results = [];
                    insertIntoShl(new SearchObj("username",new Date(),query),$scope.shl,20,"keyWord");
                    //本地存储只能存储字符串
                    LocalCacheService.setObject("shl",$scope.shl);
                    //if($event){
                    //    $event.stopPropagation();
                    //}
                    //    $state.go('productList.search.rr.rr.rr.'+query+'.view'); shopProductList
                    //每次搜索 存入搜索记录

                    $scope.query.urlParam.query = query; //为路由参数添加 搜索关键字
                    $scope.query.tag = query;//搜索后，搜索词保存在query.tag中
                   // $state.go("productList.view",{fromPage:'home',query:'#$%'});

                    if($scope.query.isBroadCast){ //是子页面 无需跳转 发送广播

                        $rootScope.$broadcast('searchInShop',{word:query});
                        $scope.closeSearch();
                    }else {
                        $state.go($scope.query.goTo, $scope.query.urlParam);
                        $scope.query.tag ='';//搜索后清空 input
                      //   $scope.closeSearch();//搜索页跳转后不自动关闭
                    }
                    // 隐藏搜索页面
                };
                $scope.doSearch = function(e,tag){
                    var keycode = window.event?e.keyCode:e.which;
                    if(keycode==13){
                        $scope.closeSearchAndGo(tag);
                    }
                };
                $scope.clearSearch =function(){
                    $scope.query.tag ="";
                }
            },
            link:function($scope, $el, $attrs){
                var attrs = $attrs;
                var input = $el.find("input");//修改
                $timeout(function(){//使input获得焦点
                    input[0].focus();
                },1);

            }
        }
    }
]);