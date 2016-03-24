/**
 * Created by dhc on 2015/7/6.
 */
cdfgApp.controller('GoabroadTrafficController', ['$scope', '$ionicHistory', '$stateParams',
    function ($scope, $ionicHistory, $stateParams) {
        /* ADD START BY 葛硕20150808：[APP-95] bug:部分标题会显示样式错乱 -------------------------------*/
        $scope.goBack = goBack;
        //返回上一页
        function goBack() {
            $ionicHistory.goBack();
        }

        /* ADD END   BY 葛硕20150808：[APP-95] bug:部分标题会显示样式错乱 -------------------------------*/
        $scope.validate = false;//重置验证标记
        $scope.shop = $stateParams.shop;
        $scope.selectedDate = new Date();
        $scope.placeholder = $scope.validate ? '出境时间不能为空' : '选择出境时间或航班起飞时间';
        $scope.flight = {
            fid: '',
            dateTime:''
        };

        $scope.submit = function () {
            $scope.validate = true;//重置验证标记
            console.log($scope.flight);
            if ($scope.flight && $scope.flight.dateTime && $scope.flight.fid) {
                $scope.$broadcast('cdfg-traffic', $scope.flight);
                $scope.$ionicGoBack();
            }else{

            }
        };

        //日期选择方法
        $scope.pickDateTime = function () {
            var options = {
                date: new Date(),
                mode: 'time',
                locale: 'zh-cn',//ios 中文日期
                cancelButtonLabel: '取消',//ios 中文取消
                doneButtonLabel: '选择'//ios 中文选择
            };

            function onSuccess(date) {
                $scope.$apply(function () {
                    $scope.flight.dateTime = date.toLocaleTimeString();
                });

            }

            function onError(error) {
                //alert('Error: ' + error);
            }

            //alert('pickDate Start!');
            //alert(datePicker);
            datePicker.show(options, onSuccess, onError);
        };
    }]);

