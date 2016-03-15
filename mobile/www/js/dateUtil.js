/**
 * 显示年/月/日的日期选择控件
 */
function dateId(obj) {
    var currYear = (new Date()).getFullYear();
    var opt={};
    opt.date = {preset : 'date'};
    opt.datetime = {preset : 'datetime'};
    opt.time = {preset : 'time'};
    opt.default = {
        theme: 'android-ics light', //皮肤样式
        display: 'modal', //显示方式
        mode: 'scroller', //日期选择模式
        lang:'zh',
        startYear:currYear - 10, //开始年份
        endYear:currYear + 10 //结束年份
    };
    $("#"+obj).val('').scroller('destroy').scroller($.extend(opt['date'], opt['default']));
    var optDateTime = $.extend(opt['datetime'], opt['default']);
    var optTime = $.extend(opt['time'], opt['default']);
    $("#appDateTime").mobiscroll(optDateTime).datetime(optDateTime);
    $("#appTime").mobiscroll(optTime).time(optTime);
}

/*显示年/月/日/时/分的日期选择控件
* 王爽
* 交通计划页面
* */
function dateTimeId(obj) {
    var currYear = (new Date()).getFullYear();
    var opt={};
    opt.datetime = {preset : 'datetime'};
    opt.default = {
        theme: 'android-ics light', //皮肤样式
        display: 'modal', //显示方式
        mode: 'scroller', //日期选择模式
        lang:'zh',
        startYear:currYear - 10, //开始年份
        endYear:currYear + 10 //结束年份
    };
    $("#"+obj).val('').scroller('destroy').scroller($.extend(opt['datetime'], opt['default']));
    var optDateTime = $.extend(opt['datetime'], opt['default']);
    $("#appDateTime").mobiscroll(optDateTime).datetime(optDateTime);
}