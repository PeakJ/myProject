/*
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

                $scope.results = [];//搜索关键字补全

                //清除搜索栏
                $scope.clear = function(){
                    $scope.query.tag = "";
                    $scope.results = [];
                };

                $scope.closeSearchAndGo = function(word){
                    //console.log("--->shopId---"+$scope.query.urlParam.shopId);
                    $scope.query.urlParam.query = word; //为路由参数添加 搜索关键字
                    $scope.query.tag = word;//搜索后，搜索词保存在query.tag中
                    $state.go("shopProductList",$scope.query.urlParam);
                };
                $scope.doSearch = function(e,tag){
                    var keycode = window.event?e.keyCode:e.which;
                    if(keycode==13){
                        $scope.closeSearchAndGo( tag);
                    }
                };
            },
            link:function($scope, $el, $attrs){


            }
        }
    }
]);