/**
 * 支付wap页差异化文件
 */

cdfgApp.factory('payWapService', function(){

        var payWapService = {

            /**
             * 打开一个webView完成支付流程
             * @param  {String} url      支付接口
             * @param  {promise} deferred 支付结果promise对象
             * @return {void}          空
             */
            payWap: function (url, deferred) {

                window.embed = window.open(url, '_blank', 'location=yes,toolbar=yes');
                window.embed.addEventListener('loadstart', function(event) {
                    var url = event.url;
                    if (/.*\/payment\/paysuccess/.test(url)) {
                        window.embed.close();
                        deferred.resolve();
                    }
                    if (/.*\/payment\/payerror/.test(url)) {
                        window.embed.close();
                        var index = url.indexOf('?msg=');
                        deferred.reject(decodeURIComponent(url.substr(index + 5)));
                    }
                });
                window.embed.addEventListener('exit', function(event) {
                    deferred.reject();
                    window.embed = undefined;
                });
            }
        };

        return payWapService;
    })
;
