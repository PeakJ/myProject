/********************************

 creater: xuf
 create time:2015/06/27
 describe：分类列表页
 modify time:2015/06/29

 ********************************/

//搜索控制器
cdfgApp.controller('SearchInProductListController',['$scope','SearchService','PopupService',
    '$state','LocalCacheService','$stateParams','$ionicHistory','StyleConfig','StyleForPlatform',
    function($scope,SearchService,PopupService,$state,LocalCacheService,$stateParams,$ionicHistory,StyleConfig,StyleForPlatform){
        //搜索控制器
        $scope.headerStyle = StyleConfig.header;
        $scope.searchInputStyle = StyleConfig.searchInput;
        $scope.headerLeftArrowStyle = StyleConfig.headerLeftArrow;

        $scope.leftArrow = StyleForPlatform.getStyle('leftArrow');

        //搜索合并
        //     $scope.query = {tag:$stateParams.query };

        //  console.log($scope.bId+"-----从品牌页面商品列表发起的搜索有bId") ;
        // 获得最近搜索数据
        //初始化搜索历史

        $scope.shl = LocalCacheService.getObject('shl');
        //  $scope.formPage = $stateParams.fromPage;
        console.log($scope.fromPage);
        console.log("从本地存储中得到的历史记录" +ionic.Platform.platform());
        console.log( $scope.shl);
        $scope.placeholder = '输入搜索词';
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
            $scope.placeholder = d.data[0]
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
        };
        //触发搜索
        $scope.closeSearchAndGoIsExpired = function(query,$event){

        };
        //清空最近搜索历史
        $scope.clear = function(){
            $scope.shl = new Array();
            LocalCacheService.setObject("shl", $scope.shl);
        };
        $scope.doSearch = function(e){
            var keycode = window.event?e.keyCode:e.which;
            if(keycode==13){
                $scope.closeSearchAndGo( $scope.query.tag,$scope.popular);
            }
        };

        function validate (si){
            if(!si || si===''){
                return false;
            }
            return true;
        }

    }]);
