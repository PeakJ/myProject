/**
 * 时间控件
 * by wangshuang 20160218
 */
function showDate(obj) {
    var currYear = (new Date()).getFullYear();
    var opt={};
    opt.date = {preset : 'date'};
    opt.default = {
        theme: 'android-ics light', //皮肤样式
        display: 'modal', //显示方式
        mode: 'scroller', //日期选择模式
        lang:'zh',
        startYear:currYear - 10, //开始年份
        endYear:currYear + 10 //结束年份
    };
    $("#"+obj).val('').scroller('destroy').scroller($.extend(opt['date'], opt['default']));
}