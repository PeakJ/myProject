/********************************

 creater:maliwei@cdfg.com.cn and xuf
 create time:2015/06/17
 describe：首页
 modify time:2015/06/17

 ********************************/
/*
    服务
*/

/* directive模块指令 */
/*
cdfgApp.directive('compile', function($compile) {
    // directive factory creates a link function
    return function(scope, element, attrs) {
        scope.$watch(
            function(scope) {
                // watch the 'compile' expression for changes
                return scope.$eval(attrs.compile);
            },
            function(value) {
                // when the 'compile' expression changes
                // assign it into the current DOM
                element.html(value);
                // compile the new DOM and link it to the current
                // scope.
                // NOTE: we only compile .childNodes so that
                // we don't get into infinite loop compiling ourselves
                $compile(element.contents())(scope);
            }
        );
    };
});
*/

cdfgApp.directive('moduleType',function(){
    // type 0搜索，1单张图片, 2 一行多列, 3 左1右2, 4 左2右1, 5轮播, 6固定多个商品,  7新品,  8热销,  9平台推荐 10自定义
    var tpl=['','imgad','imgad-1-many','imgad-3-1','imgad-3-2','mdslide','prolist','prolist','prolist','prolist','custom'];
                                                                                        //6        7             8         9
    return {
        restrict:'A',
        //  replace:true,
        template : '<ng:include src="tpl"></ng:include>',
        link : function(scope, iElement, iAttrs) {

            var moduleType=iAttrs.moduleType;
            if(moduleType!=0){
                scope.tpl=  "templates/home/"+tpl[moduleType]+'.html';
            }

        }

    }

});
/* directive模块指令 */
cdfgApp.controller('HomeController',['$scope','$http','$ionicModal','$state','$location','UrlService','$window','StyleConfig','CartService',
    function($scope,$http,$ionicModal,$state,$location,UrlService,$window,StyleConfig,CartService){

        var url=UrlService.getUrl('HOME_LAYOUT');
        $scope.isOnLine = true;
        function init(){
            $http.get(url,{cache:false}).success(function(d){
                $scope.$broadcast('scroll.refreshComplete');

                //处理自定义模块数据,将“替换成&quot;
                angular.forEach(d.data,function(v,key){
                    if(v.type=='10'){
                        var str=v.rows[0].html.replace(/"/g,'&quot;' )
                        v.rows[0].html=str;
                    }
                });

                $scope.data= d.data;

            }).then(function(res){

                if(!res){  //网络未连接

                    $scope.isOnLine = false;
                }
            });
        }
        $scope.headerStyle = StyleConfig.header;
        //图片尺寸的配置 首页中的图片宽高在此配置，宽度一般由屏幕宽度除以本行图片数获得
        $scope.imgConfig ={
            imgH:182,//从设计稿psd中量出
            productPicH:182,
            imgW_half:$window.innerWidth/2,
            imgH_half:91
        };
        //高亮当前nav导航
        $scope.tabNav={curNav:'home'};
        //下拉刷新
        $scope.refresh=function(){
            init();
        }
        //每次进入首页刷新购物车数字
        $scope.$on('$ionicView.enter', function () {
            //导航购物车数字
            $scope.cartInfo=CartService.getCartTotal();
        });
        init();

        $scope.fromPage = 'home';
        //搜索指令的设置
        $scope.query = {tag:'',
            isShowSearch:false,
            hasPopularDiv:true,
            hasHistoryDiv:true,
            urlParam:{
               fromPage:'homePage'
            },
            varInDirective:{

            },
            goTo:'productList.view'
        };
        $scope.showSearch=function(){
            $scope.query.isShowSearch = true;
        };
        var platform = ionic.Platform.platform();
        console.log('**------操作平台是-----》'+platform);  // **------操作平台是-----》android:85

        $scope.closeSearch=function(){
            // $ionicHistory.goBack();
            $scope.query.isShowSearch = false;
        };

}]);

//页面样式的一些配置属性，例如header高度，header 内字体样式等

cdfgApp.constant('StyleConfig',{
    header:{height:44},
    headerFont:{font:'12px #3e3e3e'},
    searchInput:{'margin-top':4},
    headerLeftArrow:{'margin-top':0},
    headerTitle:{top:0},
    contentBkg:{'background-color':'#e5e5e5'},
    sInput:{height:28}

});