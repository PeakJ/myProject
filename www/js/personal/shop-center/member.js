/*
 * 会员信息Controller
 * wangshuang 20160218
 **/

CYXApp.controller('memberController', ['$scope', 'MemberService', '$state', '$ionicHistory',
    function ($scope, MemberService, $state, $ionicHistory) {
      $scope.hasMoreData=false;//默认不加载下拉刷新
      var upDataFlag=false;//是否加载更多
        //筛选条件
        $scope.search = {
            memberTel: ''//会员编号筛选
        };
        //分页
        $scope.memberNo = 1;
        $scope.pageSize = 10;
        $scope.subTotal = 0;
        //下拉加载
        $scope.loadMore = function () {
          $scope.pageNo++;
          var params = {
            mobile: $scope.search.memberTel,
            displayCount: $scope.pageSize,//每页数据条数（必填）
            pageNo: 1//页码（必填）
          };
          loadData( true,params);
          console.log('more ....pageNo--'+ $scope.pageNo);
        };
        //加载数据
         function loadData (upDataFlag,param) {
            MemberService.getMemberList(param).then(function (response) {
                var result = response.data;
                if (result.code == 0) {
                  console.log('会员信息 response = ' + JSON.stringify(response.data));
                  if(upDataFlag){
                    $scope.memberList =  $scope.memberList.concat(result.data);

                  }else{
                    $scope.pageNo=1;
                    $scope.hasData=true;
                    $scope.memberList = result.data;
                  }
                  $scope.sumTotal=result.sumTotal;
                  console.log(" $scope.sumTotal:"+ $scope.sumTotal+";;"+($scope.sumTotal/$scope.pageSize));
                  if($scope.sumTotal/$scope.pageSize>=$scope.pageNo ){
                    $timeout(function(){
                      $scope.hasMoreData=true;
                    },1000);

                  }else{
                    $scope.hasMoreData=false;
                    console.log("没有更多数据了");
                  }
                  console.log("是否还有更多数据"+$scope.hasMoreData);
                }
              if(upDataFlag){
                $scope.$broadcast('scroll.infiniteScrollComplete');
              }
            });

        };
        //转到会员消费记录页面
        $scope.goConsumption = function (memberId,memberAccount) {
            $state.go('consumption', {memberId: memberId,memberAccount:memberAccount});
        };
        //根据会员手机号码筛选
        $scope.screenByMemberID = function () {
          console.log("根据会员手机号码筛选"+$scope.search.memberTel);

                var params = {
                  mobile:$scope.search.memberTel,
                  displayCount: $scope.pageSize,//每页数据条数（必填）
                  pageNo: 1//页码（必填）
                };
              loadData( false,params);
                console.log(params);

        };
        //返回
        $scope.goBack = function () {
            //$ionicHistory.goBack();
            //判断wap是否能获取到上一页路由 没有则返回首页
            if (!$ionicHistory.backView()) {
                $state.go('home');
                return;
            }
            ($ionicHistory.backView() && $ionicHistory.backView().url.indexOf('login') > 0) ? $ionicHistory.goBack(-2) : $ionicHistory.goBack();
        };
        $scope.$on('$ionicView.beforeEnter', function (e, v) {
          $scope.search.memberTel='';
          var params = {
            mobile:$scope.search.memberTel,
            displayCount: $scope.pageSize,//每页数据条数（必填）
            pageNo: 1//页码（必填）
          };
          loadData( false,params);
        });
    }]);


/**
 * 会员信息Service
 * by wangshuang 20160218
 */
CYXApp.service('MemberService', ['$http', 'UrlService', function ($http, UrlService) {
    this.getMemberList = function (requestParams) {
        var url = UrlService.getUrl('MEMBER');
        console.log('url = ' + url);
        return $http.post(url, requestParams);
    };
}]);
