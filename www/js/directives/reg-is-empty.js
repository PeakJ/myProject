/********************************

 creater:haosijia@cdfg.com.cn
 create time:2015/08/27
 describe：监测文本框
 modify time:2015/08/27

 ********************************/

/*
 directive模块指令  文字聚焦时交互效果
 */
cdfgApp.directive('regIsEmpty', [function factory() {
    return {
        restrict: "A",
        scope: false,
        link: function ($scope, $el, $attrs) {
            $el.append('<i class="cdfg-icon-empty icon ion-ios-close-outline"></i>');
            var input = $el.find('input')[0],
                icon = angular.element($el[0].querySelector('.cdfg-icon-empty'));
            $scope.flag = false;
            var watchVal = $scope.$watch(function () {
                return input.value;
            }, function (newValue, oldValue, scope) {

                if ($scope.flag && ((newValue != oldValue && newValue.length > 0) || (newValue != '' && oldValue.length > 0))) {
                    icon.addClass('has-content');
                    console.log('ADD');
                } else {
                    icon.removeClass('has-content');
                    console.log('REMOVE');
                }
            }, true);
            icon.on('click', function () {
                input.value = '';
                icon.removeClass('has-content');
                console.log('CLICK');
            });
            $el.find('input').on('blur', function () {
                $scope.flag = false;
                icon.removeClass('has-content');
                console.log('BLUR');
            });
            $el.find('input').on('focus', function () {
                console.log('FOCUS');
                $scope.flag = true;
                if (input.value != 0) {
                    icon.addClass('has-content');
                }
            });
            /*$scope.$on('$destroy', function () {
             watchVal();
             });*/

        }
    }
}]);