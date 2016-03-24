//����ָ��
cdfgApp.directive('cdfgSearch',['$http','$state','SearchService','PopupService',
    'LocalCacheService',function($http,$state,SearchService,PopupService,LocalCacheService){
        return{
            restrict:'A',
            replace:false,
            scope:{
                query:'=cdfgSearch'
            },
            templateUrl:'templates/shop/shop-search-template.html',
            controller:function($scope){
                $scope.closeSearch = function(){
                    $scope.query.isShowSearch = false;
                };

                $scope.initData = function(){
                    SearchService.getPopularWord().then(function(d){
                        if(d.code == -1){
                            $scope.popular = undefined;
                            console.log("�������Ŵ��б��ȡʧ��");
                            return ;
                        }
                        $scope.popular = d.data;
                        if(d.data ){
                            $scope.placeholder = d.data[0]
                        }
                    });
                };
                $scope.popular = [];
                $scope.results = [];//�����ؼ��ֲ�ȫ
                $scope.shl = LocalCacheService.getObject('shl');
                //  $scope.formPage = $stateParams.fromPage;
                $scope.placeholder = '';
                //�жϿն���Ĺ�����
                function isEmptyObject(obj){
                    for(var n in obj){return false}
                    return true;
                };
                //���ش洢�Ĺ��߷��� ���û��key��Ӧ��ֵ�����ص���{}
                if(isEmptyObject($scope.shl) && !angular.isArray($scope.shl) ) {//��������� �½�һ��array
                    LocalCacheService.setObject("shl",new Array());
                    $scope.shl =  LocalCacheService.getObject("shl");
                }
                Array.prototype.elremove = function(m){
                    if(isNaN(m)||m>this.length){return false;}
                    this.splice(m,1);
                };
                //��֤�����ؼ��ַǿ�
                function validate (si){
                    if(!si || si===''){
                        return false;
                    }
                    return true;
                }
                //����ʵ�幹�캯��
                function SearchObj(user,date,keyWord){
                    this.user = user;
                    this.date = date;
                    this.keyWord = keyWord;
                    return this;
                }
                //����ʷ����������
                function insertIntoShl(searchObj,shl,maxLength,uniqueProp ){
                    if(!searchObj  || !angular.isArray(shl) ||  isNaN(maxLength) ){
                        console.error('��̶���������������ݹ��ߺ�����������Ĳ������Ϸ�');
                        return;
                    }
                    var length = $scope.shl.length;
                    if(length<maxLength && !uniqueProp){//������Ҫȥ����ֵͬ��ʱ��ֱ�Ӳ���
                        //   $scope.shl.push(searchObj);//�޸�Ϊ �� ͷ ѹ������
                        $scope.shl.splice(0,0,searchObj);
                    }
                    else if(length<maxLength && uniqueProp){
                        var temp = searchObj[uniqueProp];
                        for(var i=0;i<length;i++){
                            if( $scope.shl[i][uniqueProp] == temp ){
                                $scope.shl.elremove(i);
                                break;
                            }
                        }
                        //    $scope.shl.push(searchObj);
                        $scope.shl.splice(0,0,searchObj);
                    }
                    else if(length>=maxLength && !uniqueProp){
                        $scope.shl.elremove(maxLength-1);//ɾ�����һ��
                        //    $scope.shl.push(searchObj);
                        $scope.shl.splice(0,0,searchObj);
                    }
                    else if(length>=maxLength && angular.isString(uniqueProp)){
                        var temp = searchObj[uniqueProp];
                        for(var i=0;i<length;i++){
                            if( $scope.shl[i][uniqueProp] == temp ){
                                $scope.shl.elremove(i);
                                break;
                            }
                        }

                        //  $scope.shl.push(searchObj);
                        $scope.shl.splice(0,0,searchObj);
                        if($scope.shl.length>maxLength) {
                            $scope.shl.elremove($scope.shl.elremove(length - 1));//ɾ�����һ��
                            //    $scope.shl.push(searchObj);
                        }

                        //    $scope.shl.push(searchObj);
                    }
                    else{
                        console.error("��̶���������������ݹ��ߺ�������,uniqueProp�����������ַ���");
                    }
                }
                //�����ؼ��ʲ�ȫ
                $scope.queryList = function(word){
                    if(!word||word===''){
                        $scope.results = [];
                        return ;
                    }
                    SearchService.queryList(word).then(function(d){
                        $scope.results = d.data;
                    });
                };
                //�س�����������
                $scope.doSearch = function(e){
                    var keycode = window.event?e.keyCode:e.which;
                    if(keycode==13){
                        $scope.closeSearchAndGo( $scope.query.tag);
                    }
                };
                //������ת�� ��Ʒ�б�ҳ
                $scope.closeSearchAndGo = function(query,$event){
                    String.prototype.trim=function(){
                        return this.replace(/(^\s*)|(\s*$)/g, "");
                    }
                    query = query.trim();

                    if(!validate(query)){//�ǿ��ж�
                        if($scope.popular && $scope.popular[0]) {
                            query = $scope.popular[0];
                        }
                        else {
                            if (window.cordova) {
                                cordova.plugins.Keyboard.close();
                            }
                            PopupService.alertPopup('��ʾ', '�����ؼ��ֲ���Ϊ�ա�');
                            $scope.query.tag = "";
                            return;
                        }
                    }
                    //  $scope.formPage = $stateParams.fromPage;
                    $scope.query.tag = query;
                    $scope.results = [];
                    insertIntoShl(new SearchObj("username",new Date(),query),$scope.shl,20,"keyWord");
                    //���ش洢ֻ�ܴ洢�ַ���
                    LocalCacheService.setObject("shl",$scope.shl);
                    if($event){
                        $event.stopPropagation();
                    }
                    $scope.closeSearch();//���ø�scope��closeSearch ���� ���� ����ҳ��
                    $state.go('productList.view',{'query':query,'fromPage':'shop'});
                    $state.go('productList.search.rr.rr.rr.'+query+'.view');
                    // ÿ������ ����������¼
                };

                $scope.clearSearch = function(){
                    $scope.query.tag = "";
                    $scope.results = [];
                };
                //���������
                $scope.clear = function(){
                    $scope.query.tag = "";
                    $scope.results = [];
                };
                //������������ʷ
                $scope.clear = function(){
                    $scope.shl = new Array();
                    LocalCacheService.setObject("shl", $scope.shl);
                };

            },
            link:function($scope, $el, $attrs){


            }
        }
    }
]);