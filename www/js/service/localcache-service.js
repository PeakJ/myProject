/**
 * Created by xuzunyuan on 2015/7/29.
 */

/* 本地存存取服务 */
cdfgApp.factory('LocalCacheService', ['$window', function ($window) {
    return {
        set: function (key, value) {
            $window.localStorage[key] = value;
        },
        get: function (key, defaultValue) {
            return $window.localStorage[key] || defaultValue;
        },
        setObject: function (key, value) {
            $window.localStorage[key] = JSON.stringify(value);
        },
        getObject: function (key) {
            var value = $window.localStorage[key];

            return value ? JSON.parse(value) : {};
        },
        remove: function (key) {
            $window.localStorage.removeItem(key);
        }
    }
}]);