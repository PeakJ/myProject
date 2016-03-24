//搜索指令
cdfgApp.directive('cdfgSearch',['$http','$state','SearchService','PopupService',
    'LocalCacheService',function($http,$state,SearchService,PopupService,LocalCacheService){
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

                $scope.initData = function(){
                    SearchService.getPopularWord().then(function(d){
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
                };
                $scope.popular = [];
                $scope.results = [];//搜索关键字补全
                $scope.shl = LocalCacheService.getObject('shl');
                //  $scope.formPage = $stateParams.fromPage;
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
                //验证搜索关键字非空
                function validate (si){
                    if(!si || si===''){
                        return false;
                    }
                    return true;
                }
                //搜索实体构造函数
                function SearchObj(user,date,keyWord){
                    this.user = user;
                    this.date = date;
                    this.keyWord = keyWord;
                    return this;
                }
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
                //搜索关键词补全
                $scope.queryList = function(word){
                    if(!word||word===''){
                        $scope.results = [];
                        return ;
                    }
                    SearchService.queryList(word).then(function(d){
                        $scope.results = d.data;
                    });
                };
                //回车键触发搜索
                $scope.doSearch = function(e){
                    var keycode = window.event?e.keyCode:e.which;
                    if(keycode==13){
                        $scope.closeSearchAndGo( $scope.query.tag);
                    }
                };
                //搜索跳转到 商品列表页
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
                    $state.go('productList.view',{'query':query,'fromPage':'shop'});
                    $state.go('productList.search.rr.rr.rr.'+query+'.view');
                    // 每次搜索 存入搜索记录
                };

                $scope.clearSearch = function(){
                    $scope.query.tag = "";
                    $scope.results = [];
                };
                //清除搜索栏
                $scope.clear = function(){
                    $scope.query.tag = "";
                    $scope.results = [];
                };
                //清空最近搜索历史
                $scope.clear = function(){
                    $scope.shl = new Array();
                    LocalCacheService.setObject("shl", $scope.shl);
                };

            },
            link:function($scope, $el, $attrs){


            }
        }
    }
]);