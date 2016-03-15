/*
* 获取出差信息
* */
/**
 * 出差列表service
 * 张俊辉
 * 2015-07-22 17:42
 */
bomApp.factory('ListServices',['$http','UrlService',function($http,UrlService){
    //获取服务器地址头部
    var headUrl = UrlService.getUrl();
    return{
        get : function(parameter){
            var url = headUrl+'bom/a/sys/businesstrip/api/businesstripList?'+parameter;
            return $http.post(url)
                .then(function(object){
                    data = object.data;
                    return data;
                });
        }
    };
    /*modules/businessTrip/data/list.json*/
}]);

/**
 * 城市列表service
 * 张俊辉
 * 2015-07-23 11:14
 */
bomApp.factory('cityServices',['$http','$window',function($http,$window){
    return{
        getCity : function(){
            return $http.get('modules/businessTrip/data/plan.json', { cache: true })
                .then(function(object){
                    data = object.data;
                    return data;
                });
        },
        getCityLetter : function(){
            return $http.get('modules/businessTrip/data/city.json')
                .then(function(object){
                    data = object.data;
                    return data;
                });
        },
        setHistory: function (cityHistory) {
            $window.localStorage.setItem('cityHistory',cityHistory);
        },
        getHistory: function () {
            return $window.localStorage.getItem('cityHistory');
        },
        setLocation: function (locationHistory) {
            $window.localStorage.setItem('locationHistory',locationHistory);
        },
        getLocation: function () {
            return $window.localStorage.getItem('locationHistory');
        },
        setLocationCity: function (locationCity) {
            $window.localStorage.setItem('locationCity',locationCity);
        },
        getLocationCity: function () {
            return $window.localStorage.getItem('locationCity');
        }

    }
}]);

/**
 * 获取用户类型services
 * 姜峰
 * 2015-08-07 09：24
 */
bomApp.factory('typeService',['$http','UrlService',function($http,UrlService){
    var headUrl = UrlService.getUrl();
    return{
        get : function(userId){
            return $http.post(headUrl+'bom/a/sys/user/api/userInfo?'+userId)
                .then(function(object){
                    var data = object.data;
                    return data;
                },function(error){
                    console.log("获取用户信息失败。");
                })
        }
    }
}]);


/**
 * 交通计划存储服务
 * 张俊辉
 * 2015-07-23 16:51
 */

bomApp.factory('planData',[function(){
    var businessTripId= 1;
    var planId= 1;
    var plan = [];
    var planCache = [];
    var businessTripData = [];
    return {
        setBusinessTripData : function(data){
            businessTripData.push({
                userId : data.userId,
                userName : data.userName,
                applyProjectId : data.applyProjectId, //所属项目id
                applyProject : data.applyProject,  //所属项目
                startDate : data.startDate,  //出差开始时间
                endDate : data.endDate,  //出差结束时间
                applyReason : data.applyReason, //出差事由
                stayType : data.stayType, //住宿
                stayCost : data.stayCost, //费用
                visible : ''
            })
        },
        getBusinessTripData : function(){
            return businessTripData;
            businessTripData = {
                userId : '',
                userName : '',
                applyProjectId : '', //所属项目id
                applyProject : '',  //所属项目
                startDate : '',  //出差开始时间
                endDate : '',  //出差结束时间
                applyReason : '', //出差事由
                stayType : '', //住宿
                stayCost : '', //费用
                period : '' //出差天数
            }
        },
        setPlan : function(data){
            plan.push({
                id : planId++,
                businessTripId : data.businessTripId,
                planType : data.planType,
                planTypeName : '',
                departurePlace : data.departurePlace,
                departurePlaceId : data.departurePlaceId,
                destination : data.destination,
                destinationId : data.destinationId,
                departDate : data.departDate,
                planDepartureDate : data.planDepartureDate,
                planDepartureTime : data.planDepartureTime,
                trafficNumber : data.trafficNumber,
                discount : data.discount,
                price : data.price,
                project :data.projectId
            });
        },
        setPlanCache : function(data){
            planCache = {
                businessTripId : '',
                planType : '',
                planTypeName : '',
                departurePlace : '',
                departurePlaceId : '',
                destination : '',
                destinationId : '',
                departDate : '',
                trafficNumber : '',
                discount : '',
                price : ''
            };
            planCache.businessTripId = data.businessTripId;
            planCache.planType = data.planType;
            planCache.planTypeName = data.planTypeName;
            planCache.departurePlace = data.departurePlace;
            planCache.departurePlaceId = data.departurePlaceId;
            planCache.destination = data.destination;
            planCache.destinationId = data.destinationId;
            planCache.departDate = data.departDate;
            planCache.trafficNumber =data.trafficNumber;
            planCache.discount = data.discount;
            planCache.price = data.price;
        },
        getPlanCache : function(){
            return planCache;
        },
        getPlan : function(businessTripId){
            var getplan = [];
            for(var i=0 ; i<plan.length ; i++){
                if(plan[i].businessTripId == businessTripId){
                    getplan.push(plan[i]);
                }
            }
            return getplan;
        },
        getPlanFromCity : function(businessTripId){
            return plan[plan.length - 1];
        },
        setPlanId : function(){
            businessTripId++;
        },
        getPlanId : function(){
            return businessTripId;
        },
        //获取交通计划
        getPlanById : function(planId){
            for(var i=0 ; i<plan.length ; i++){
                if(plan[i].id == planId){
                    return plan[i];
                    break;
                }
            }
            return null;
        },
        deletePlanById : function(planId){
            for(var i=0 ; i<plan.length ; i++){
                if(plan[i].id == planId){
                    plan = plan.slice(0,i).concat(plan.slice(i+1,plan.length));
                    return plan;
                }
            }
        }
    }
}]);

/**
 * 出差详情service
 * 张俊辉
 * 2015-07-23 20:00
 */
bomApp.factory('detailsServices',['$http','UrlService',function($http,UrlService){
    var headUrl = UrlService.getUrl();
    return {
        get : function(parameter){
            var url = headUrl+'bom/a/sys/businesstrip/api/businesstripDetails?'+parameter;
            return $http.post(headUrl+'bom/a/sys/businesstrip/api/businesstripDetails?'+parameter)
                .then(function(object){
                    data = object.data;
                    return data;
                });
        }
    }
}]);
/**
 * 交通计划服务端存储服务
 * 张俊辉
 * 2015-07-24 10:44
 */
bomApp.factory('planServices',['$http','UrlService',function($http,UrlService){
    var headUrl = UrlService.getUrl();
    return {
        get : function(parameter,plandata){
            return $http.post(headUrl+'bom/a/sys/businesstrip/api/businesstripDetailsAddPlan?'+parameter,plandata)
                .then(function(object){
                    data = object.data;
                    return data;
                });
        }
    }
}]);

/**
 * 添加出差申请项目名称信息
 * 张俊辉
 * 2015-07-27 16:44
 */
bomApp.factory('getProjectServices',['$http','UrlService',function($http,UrlService){
    var headUrl = UrlService.getUrl();
    var _data;
    return {
        get : function(){
            return $http.post(headUrl+'bom/a/sys/project/api/getProject')
                .then(function(object){
                    _data = object.data;
                    return _data;
                });
        },
        getById : function(id){
            for(var i=0;i<_data.length;i++){
                if(_data[i].id == id){
                    return _data[i].name;
                }
            }
        }
    }
}]);
/**
 * 添加出差和出行计划服务
 * 栾志成
 * 请勿更改
 */
bomApp.factory('addServices',['$http','UrlService',function($http,UrlService){
    var headUrl = UrlService.getUrl();
    return {
        get : function(addData,plans,applyProjectId){
            var transform = function(data){
                return $.param(data);
            };

            return $http.post(headUrl+'bom/a/sys/businesstrip/api/businessTripAdd',{"addData":addData,"planData":plans,"applyProjectId":applyProjectId},{
                headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
                transformRequest: transform })
                .then(function(object){
                    data = object.data;
                    return data;
                });
        }
    }
}]);
/**
 * 审批结果服务
 * 韩旭
 */
bomApp.factory('checkResultServices',['$http','UrlService',function($http,UrlService){
    var headUrl = UrlService.getUrl();
    return {
        get : function(addData){
            var transform = function(data){
                return $.param(data);
            };

            return $http.post(headUrl+'bom/a/sys/tripapplycheck/api/checkInformationAdd',addData,{
                headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
                transformRequest: transform })
                .then(function(object){
                    data = object.data;
                    return data;
                });
        }
    }
}]);
/**
 * 待我审批服务
 */
bomApp.factory('approvalService',['$http','UrlService',function($http,UrlService){
    var headUrl = UrlService.getUrl();
    return{
        //headUrl+'bom/a/sys/businesstrip/api/toBeCheckedInfo?'+parameter
        get : function(parameter){
            return $http.post(headUrl+'bom/a/sys/businesstrip/api/toBeCheckedInfo?'+parameter)
                .then(function(object){
                    return object.data;
                });
        }
    }
}]);
/**
 * 我的审批服务
 * hanxu
 */
bomApp.factory('myApprovalService',['$http','UrlService',function($http,UrlService){
    var headUrl = UrlService.getUrl();
    return{
        //headUrl+'bom/a/sys/businesstrip/api/toBeCheckedInfo?'+parameter
        get : function(parameter){
            //var url = headUrl+'bom/a/sys/businesstrip/api/toBeCheckedInfo?'+parameter;
            return $http.post(headUrl+'bom/a/sys/businesstrip/api/checkInformation?'+parameter)
                .then(function(object){
                    data = object.data;
                    return object.data;
                });
        }
    }
}]);
bomApp.factory('photoService',['$http','UrlService', function ($http, UrlService) {
    var headUrl =UrlService.getUrl();
    return {
        get : function(userId){
            return $http.post(headUrl + 'bom/a/sys/user/api/userInfo?' + userId)
                .then(function (object) {
                    var data = object.data;
                    return data;
                }, function (error) {
                    console.log("服务器连接失败");
                })
        }
    }
}]);
/*显示未处理出差数量*/
bomApp.factory('planListCountService',['$http','UrlService',function($http,UrlService){
    var headUrl = UrlService.getUrl();
    return{
        get : function(parameter){
            return $http.post(headUrl+'bom/a/sys/businesstrip/api/checkInformationCount?' + parameter)
                .then(function(object){
                    data = object.data;
                    return object.data;
                });
        }
    }
}]);