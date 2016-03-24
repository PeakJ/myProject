/**
 * 省市地址数据获取服务
 * Created by dhc on 2015/7/31.
 */
cdfgApp.service('LocationService', [function () {
    //忽略大区，拼接省份信息
    var getData = function (list) {
        if (list && Array.isArray(list)) {
            var l = list.length, i, r = [];
            for (i = 0; i < l; i++) {
                r = r.concat(list[i].children);
            }
            return r;
        }
        else {
            console.error("getProvince 参数出错");
        }
    };

    var result_Data = getData(geo);

    //包装数据
    this.formatData = function (level, list) {
        var result = {};
        switch (level) {
            case 0:
                result.title = "选择省份";
                break;
            case 1:
                result.title = "选择城市";
                break;
            case 2:
                result.title = "选择县区";
                break;
            case 3:
                result.title = "选择街道";
                break;
            default:
                break;

        }
        result.selectData = list;
        result.level = level + 1;
        return result;
    };

    //获取数据方法
    this.getLocationData = function () {
        return this.formatData(0, result_Data);
    };


    /**
     * 递归查找方法
     * list:传入数组
     * value:传入值的数组
     * return 返回需要的省市名称
     */
    var searchObjectFromListByValue = function(list,value){
        for(var j=0;j<value[j];j++){
            var i=0;
            //从list中根据value[j]找object
            for(;i<list.length;i++){
                if(list[i].value == value[j]){
                    //假定已经找到，list[i]则为相应的信息
                    break;
                }
            }
            //如果下一级存在，则继续找，不存在，则把当前返回
            if(j < value.length - 1 && value[j+1] && list[i].hasOwnProperty('children')){

                return searchObjectFromListByValue(list[i].children,value.slice(1));
            }else{
                return list[i].text;
            }

        }
        return undefined;
    }

    this.getLocationTextByValue = function (value) {
        return searchObjectFromListByValue(result_Data,value);

    };
}]);