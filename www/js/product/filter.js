//暂时废弃
cdfgApp.factory('FilterService', function ($http) {


    var getFilter = function(id ,fromPage){

        return $http.get('datas/typeList.json', {id:id,formPage:fromPage})
            .then(function (object) {
                data = object.data;
                return data;
            });

    };

    return {
        getFilter:getFilter
    }
});
