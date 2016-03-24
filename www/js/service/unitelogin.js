/**
* app Module
*
* Description
*/
cdfgApp.factory('uniteLoginService', ['$q', function($q){
        return {
            uniteLogin: function (type) {

                var deferred = $q.defer();
                if (type == "alipay") {
                    var url = CM.info.service + "/user/login/web?type=alipay&AppKey=" + CM.info.appkey;
                    window.embed = window.open(url, '_blank', 'location=no,enableViewportScale=no,suppressesIncrementalRendering=yes,closebuttoncaption=返回,disallowoverscroll=yes');
                    window.embed.addEventListener('loadstart', function(event) {
                        var url = event.url;
                        if (/.*\/app\/loginsuccess/.test(url)) {
                            window.embed.close();
                            var data = JSON.parse(decodeURIComponent(url.substr(url.indexOf('&data=') + 6)));
                            data.uid = data.userid;
                            data.name = data.realname;
                            delete data.userid;
                            delete data.realname;
                            deferred.resolve(data);
                        }
                        if (/.*\/app\/loginrror/.test(url)) {
                            window.embed.close();
                            var msg = decodeURIComponent(url.substr(url.indexOf('&data=') + 5));
                            deferred.reject(msg);

                        }
                    });
                    window.embed.addEventListener('exit', function(event) {
                        window.embed = undefined;
                    });
                    return deferred.promise;
                }
                if (window.umeng) {
                    window.umeng.login(type,
                        function (data) {
                            data = JSON.parse(data);
                            deferred.resolve(data);
                        },
                        function (data) {
                            deferred.reject(data);
                        }
                    );
                    return deferred.promise;
                }
                return deferred.promise;
            }
        };
    }])
;
