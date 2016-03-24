/********************************

 creater: xuf
 create time:2015/06/27
 describe：分类列表页
 modify time:2015/06/29

 ********************************/


//分类服务   http://192.168.103.218/sc/list?pId=11 接口地址 pid爲父id
cdfgApp.factory('CategoryService',['$http','UrlService',function($http,UrlService){
    //我的接口地址
    var myUrl1 = UrlService.getUrl('GET_FIRST_SC') ;//"http://192.168.100.233:8080/if4app/sc/listsat";
    var myUrl2 = UrlService.getUrl('GET_SAT_SC') ;//"http://192.168.100.233:8080/if4app/sc/list?pId=0";

    return {
        getFirstTypeList:function(param){
            //得到一级列表参数写在地址栏后面
           return $http.get(myUrl1,param);

        },
        //http://192.168.101.44:8080/if4app/sc/listsat?pId=1
        getSecondTypeList:function(param,pId){
            params ={'pId':pId};
            return $http.get(myUrl2,{params:params});
        },
        queryList:function(input){

        }

    };
}]);
cdfgApp.factory('ChangeAttrsService',['$http',function($http){
    return {
        /*
         * 转化属性名的方法,将一个list转化为另一个list list中的元素属性集合aArr，转化后的list中的元素属性集合，isNew是否new个List
         */
        changeAttrs: function (fromList, aArr, bArr, isNew) {
            var toList = [];
            if (!fromList || !Array.isArray(fromList) || !aArr || !bArr || !Array.isArray(aArr) || !Array.isArray(bArr)) {
                alert('属性转化错误');
                return;
            }
            var fl = fromList.length;
            if (isNew) {//如果是新生成个List
                var toList = [];
                for (var k = 0; k < fl; k++) {
                    var obj = {};
                    for (var k1 = 0; k1 < aArr.length; k1++) {
                        var temp = fromList[k][aArr[k1]];
                        obj[bArr[k1]] = temp;
                    }
                    toList.push(obj);
                }
                return toList;
            }
            else {//如果是改变原数组内元素属性
                for (var k = 0; k < fl; k++) {
                    for (var k1 = 0; k1 < aArr.length; k1++) {
                        var temp = fromList[k][aArr[k1]];
                        fromList[k][bArr[k1]] = temp;
                    }
                }
                return fromList;
            }
        }
    };
}]);
/* controller模块指令 */
cdfgApp.controller('CategoryController',['$scope', '$http', '$ionicNavBarDelegate',
    'CategoryService','$stateParams','StyleConfig','$window', '$ionicScrollDelegate','$state',
    'CartService',function($scope, $http, $ionicNavBarDelegate,CategoryService,$stateParams,StyleConfig,
                           $window,$ionicScrollDelegate,$state,CartService){
    //高亮当前nav导航
    $scope.tabNav={curNav:'category'};
    //刷新购物车数字
    $scope.$on('$ionicView.enter', function () {
        //导航购物车数字
        $scope.cartInfo=CartService.getCartTotal();
    });

        
    $scope.goBack = function() {
        $ionicNavBarDelegate.back();
    };

        $scope.headerStyle = StyleConfig.header;
        $scope.searchInputStyle = StyleConfig.searchInput;
        $scope.headerLeftArrowStyle = StyleConfig.headerLeftArrow;

        $scope.rightScrollHeight = ''; //左右可滚动区域的高度需要根据list长度变化
        $scope.leftScrollHeight = '';
        $scope.query={tag:$stateParams.query};
        //将数组填满3的倍数，解决窜行问题
        function to3 (intoList,otl){
            if(intoList && angular.isArray(intoList)){
                var yushu = intoList.length%3;
                if(yushu == 1){
                    intoList.push(otl);
                    intoList.push(otl);
                }
                else if(yushu == 2){
                    intoList.push(otl);
                }
            }
            else{
                console.error('to3 工具函数 参数错误');
            }
        }

        function initCategoryPage() {

       // 获取一级分类列表
        var promise = CategoryService.getFirstTypeList($scope.param).then(function(data){
            if(data.code == -1){//网络连接失败
                $scope.networkError = true;
                return;
            }

            $scope.fistTypeList = data.data;
            for(var i=0;i< $scope.fistTypeList.length;i++){
                if(i==0){
                    $scope.fistTypeList[i].isActive = 'cdfg-category-activated-li';
                }
                else{
                    $scope.fistTypeList[i].isActive = 'cdfg-category-li';
                }
            }

            //获得一级分类成功后再获取二级分类
            if( $scope.fistTypeList.length >0){
                CategoryService.getSecondTypeList($scope.param, $scope.fistTypeList[0].id).then(function(data){

                    data.data.subList = JSON.parse(data.data.subList);
                    $scope.secondTypeList = data.data.subList[0]; //第一个元素是对应的二级分类集合
                    if(!$scope.secondTypeList||$scope.secondTypeList.length ==0){
                        console.log("无二级分类");
                        return ;//当一级分类下无二级分类
                    }
                    for(var i=0;i<$scope.secondTypeList.length;i++){
                        $scope.secondTypeList[i].children = data.data.subList[i+1];
                        var cl =$scope.secondTypeList[i].children.length;
                        for(var j =0;j<cl;j++){
                            $scope.secondTypeList[i].children[j].href ="";//to do 根据三级类型id 搜索商品的url
                            $scope.secondTypeList[i].children[j].isShow = { 'max-width': '29%','margin-right': '3%'};
                         //   $scope.secondTypeList[i].children[j].icon = 'IMG_2015_07_29_29c9bc3490e14d5baf668862c0c63d8a.jpg';
                        }
                        var obj1 = {name:'unvisible',id:'#33',isShow : {visibility:'hidden'},href:''};
                       to3($scope.secondTypeList[i].children,obj1);
                    }
                    var h =  $scope.secondTypeList.length*350?$scope.secondTypeList.length*350:10;
                    /*CHG START BY 葛硕 20150821：右侧滑动区域高度修正--------------------------------------*/
                    //$scope.rightScrollHeight = {'height':h+'px' };//修正前
                    //$scope.rightScrollHeight = {'height':(h+430)+'px' };//修正后
                    /*CHG END   BY 葛硕 20150821：右侧滑动区域高度修正--------------------------------------*/

                });
            }

            var h =  $scope.fistTypeList.length * 55?$scope.fistTypeList.length * 55:10;//若一级类型list长度为0，默认左侧高度10px
            $scope.leftScrollHeight = {'height':h+'px' };
        });


    }
    initCategoryPage();
    //获取二级分类列表  to do  分类的 icon 还没有设置
    function getSecondTypeList(parentId){
        $ionicScrollDelegate.$getByHandle('right').scrollTop();
        CategoryService.getSecondTypeList({},parentId).then(function(data){
        //    console.log(data);
            data.data.subList = JSON.parse(data.data.subList);
            $scope.secondTypeList = data.data.subList[0]; //第一个元素是对应的二级分类集合
            if(!$scope.secondTypeList||$scope.secondTypeList.length ==0){
                console.log("无二级分类");
                return ;//当一级分类下无二级分类
            }
            for(var i=0;i<$scope.secondTypeList.length;i++){
                $scope.secondTypeList[i].children = data.data.subList[i+1];
                var cl =$scope.secondTypeList[i].children.length;
                for(var j =0;j<cl;j++){
                    $scope.secondTypeList[i].children[j].href ="";//to do 根据三级类型id 搜索商品的url
                    $scope.secondTypeList[i].children[j].isShow = {};
              //      $scope.secondTypeList[i].children[j].icon = 'IMG_2015_07_29_29c9bc3490e14d5baf668862c0c63d8a.jpg';
                }
                var obj1 = {name:'unvisible',id:'#33',isShow : {visibility:'hidden'},href:''};
                to3($scope.secondTypeList[i].children,obj1);
            }
            var h = data.data.length*350;

            /*CHG START BY 葛硕 20150821：右侧滑动区域高度修正--------------------------------------*/
            // $scope.rightScrollHeight = {'height':h+'px' };//修正前
            //$scope.rightScrollHeight = {'height':(h+430)+'px' };//修正后
            /*CHG END   BY 葛硕 20150821：右侧滑动区域高度修正--------------------------------------*/

        });
    }
        $scope.getSecondTypeList = getSecondTypeList;
        $scope.getActivated= getActivated;
        //获得选中的一级分类li 改变它的样式
   function getActivated(tid){
       var flist = $scope.fistTypeList;
       for(var i=0;i<flist.length;i++){
           flist[i].isActive = 'cdfg-category-li';
           if(tid==flist[i].id){
               flist[i].isActive = 'cdfg-category-activated-li';
           }
       }
    }

        //搜索页面开始
        $scope.fromPage = 'category';
        //搜索指令的设置
        $scope.query = {tag:'',
            isShowSearch:false,
            hasPopularDiv:true,
            hasHistoryDiv:true,
            urlParam:{
                fromPage:'categorySearch'
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
        $scope.reload = function(){
            $window.location.reload();
        }

}]);