/**
 * CommonSelectController
 * Created by ZCP
 * 2015/6/30.
 */
cdfgApp.controller('CommonSelectController', ['$scope', '$stateParams', '$state', '$rootScope', 'LocationService',
        'CommonSelectService', '$ionicHistory',
        function ($scope, $stateParams, $state, $rootScope, LocationService,CommonSelectService, $ionicHistory) {
            /* ADD START BY 葛硕20150808：[APP-95] bug:部分标题会显示样式错乱 -------------------------------*/
            $scope.goBack = goBack;
            //返回上一页
            function goBack(){
                $ionicHistory.goBack();
            }
            /* ADD END   BY 葛硕20150808：[APP-95] bug:部分标题会显示样式错乱 -------------------------------*/
            var selectMode = $stateParams.selectMode;//选择模式，根据不同的选择模式，绑定不同的数据
            $scope.defaultValue = $stateParams.defaultValue;//默认值，非必需，新增则没有，编辑则有
            $scope.children = $stateParams.children;//接受连续选择模式中传来的数据

            var localData = {};
            //判断是否有子类
            if ($scope.children) {
                //有则为连续选择模式，绑定传来的子类数据
                console.log($scope.children);
                localData = JSON.parse($scope.children);
            } else {
                //没有，则为单次选择，绑定固定数据
                localData = CommonSelectService.getSelectData(selectMode);
            }
                //初始化：根据选择类型来选择数据、设定标题
            $scope.title = localData.title;
            $scope.selectData = localData.selectData;
            $scope.level = localData.level;

            $scope.selectItem = function (val) {

                $scope.defaultValue = val.value;//选择效果，让选择的项目为当前选择项

                //判断是否是连续选择
                if (val.children) {
                    //如果是多重选择，则继续选。
                    var childrenData = LocationService.formatData($scope.level, val.children);
                    $state.go('commonSelect', {
                        //把子选择数据以Jsong形式发送到子页面。
                        selectMode: $stateParams.selectMode,
                        children: JSON.stringify(childrenData)
                    });
                    //向父页面发送广播，传递数据
                    $rootScope.$broadcast(selectMode + $scope.level, val);
                }
                //如果选完了，就返回。
                else {
                    if ($scope.level) {
                        console.log($scope.level);
                        $rootScope.$broadcast(selectMode + $scope.level, val);
                        $scope.$ionicGoBack(0 - $scope.level);
                    }
                    $rootScope.$broadcast(selectMode, val);
                    //history.back(0);
                    $scope.$ionicGoBack();
                }
            };
        }]
)
;


/**
 *  选择数据服务
 *  created by zcp
 *  2015-07-29
 */
cdfgApp.service('CommonSelectService', ['LocationService',function (LocationService) {
    var obj = {
        'SEX': {
            title: '选择性别',
            selectData: [{
                'text': '男',
                'value': 1
            }, {
                'text': '女',
                'value': 2
            }, {
                'text': '保密',
                'value': 0
            }]
        },
        'PAYTYPE': {
            title: '付款方式',
            selectData: [{
                text: '在线支付',
                value: 0,
                checked: true
            }, {
                text: '货到付款',
                value: 1

            }]
        },
        'DELIVERYTIME': {
            title: '送货时间',
            selectData: [{
                text: '所有日期均可送达',
                value: 0,
                checked: true
            }, {
                text: '休息日送达',
                value: 1
            }, {
                text: '工作日送达',
                value: 2
            }]
        },
        'LOCATION': LocationService.getLocationData()
    };
    this.getSelectData = function(tag){
        return obj[tag];
    }
}]);