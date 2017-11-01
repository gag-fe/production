/**
 * Created by xuyanan on 2017/6/6.
 */
'use strict';
angular.module('newApp').service('contratService', ['$rootScope', '$http', function($rootScope, $http) {
    var service = {
        searchData: '',
        editData: '',
        search: function(params, callback) {
            $http({
                method: params.search.method,
                url: params.search.url,
                params: params.search.params,
                data: params.search.data
            }).success(function(response) {
                if (response.status == "T") {
                    login();
                    return;
                }
                if (response.status == "F") {
                    shadowShowText('提示',response.msg);
                    return;
                }
                $("#contractTb").attr("pageIndex", response.data.page.pageIndex);
                service.searchData = response.data.page;
                $rootScope.$broadcast('contratService.search');
            });
        },
        edit: function(params, callback) {

        }
    };
    return service;

}])
.controller('contractCtrl', ['$scope', '$http', 'ConfigurationProduct','Configuration', 'contratService','$routeParams','$timeout','Upload',
    function($scope, $http, ConfigurationProduct,Configuration, contratService,$routeParams,$timeout,Upload) {
        /*//权限
        $scope.authority = {
            '1': false,//查看机构详情
            '2': false,//机构查询
            '3': false,//商户查询
            '4': false,//修改商户状态
            '5': false,//新增商户
            '6': false,//申领授权
            '7': false,//导入
            '8': false,//商户编辑
            '9': false,//修改设备状态
            '10': false,//配置
            '11': false,//修改商家备注
            '12': false,//MALL稽核
            '13': false,//数据图谱
            '14': false,//新增项目
            '15': false,//合同管理
            '16': false,//编辑机构
            '17': false,//分任务
            '18': false,//检测报警
            '19': false,//商户导出
            '20': false//分组管理
        };*/
        $scope.contratTableConfig = {
            bsTableId: '',
            add: '',
            del: null,
            edit: null,
            search: {
                callback: contratService.search,//默认加载第一次调用函数，如果不行调用，填一个空函数，不填''
                url: ConfigurationProduct.API + '/contractManager/page.do',
                method: 'GET',
                params: {
                    sso_token: ConfigurationProduct.token,
                    pageIndex: 1,
                    pageSize: 10,
                    orgId: $routeParams.orgId,
                    contractId: '',
                    contractType: ''
                }
            },
            inmport: '',
            reset: '',
            see: '',
            picture: ''
        };

        $scope.$on('contratService.search', function(event) {
            $scope.contractCtrl.options.data = contratService.searchData;
            $scope.searchS = false;
            $scope.resetS = false;
            $scope.$applyAsync();
        });


        $scope.$on('$viewContentLoaded', function() {
            //初始化
            $scope.params = {
                page: {
                    name: $routeParams.name,
                    contractTypeList: [],
                    contractType: '',
                    contractNum: ''
                },
                modal: {
                    data: {

                    },
                    selected: {
                        contractType: '1',  //合同类型
                        periods: '',        //期数
                        contractId: '',     //合同编号
                        contractName: '',   //合同名称
                        contractUrl: '',    //合同上传后生成的地址
                    }
                }
            };

            /*//获取权限
            $http.get(ConfigurationProduct.API + '/group/my-duties.json', {
                params: {
                    sso_token: ConfigurationProduct.token
                }
            })
                .success(function(res) {
                    if (res.status == 'S') {
                        $.each(res.data.duties, function(i, value) {
                            $scope.authority[value.id] = true;
                        });
                        return
                    } else if (res.status == 'timeout') {

                        login();
                        return;
                    }
                    shadowShowText('提示', '获取权限失败');
                })
                .error(function (err) {
                    shadowShowText(err);
                });*/
            //查询
            $scope.search = function () {
                $scope.searchS = true;
                var listNum = $("#contractTb").bootstrapTable('getData').length;
                if (listNum > 0) {
                    $scope.contratTableConfig.search.params.orgId = $routeParams.orgId;
                    $scope.contratTableConfig.search.params.contractId = $scope.params.page.contractNum;
                    $scope.contratTableConfig.search.params.contractType = $scope.params.page.contractType;
                    $("#contractTb").bootstrapTable('selectPage', 1);
                } else {
                    contratService.search({
                        search: {
                            callback: contratService.search,//默认加载第一次调用函数，如果不行调用，填一个空函数，不填''
                            url: ConfigurationProduct.API + '/contractManager/page.do',
                            method: 'GET',
                            params: {
                                sso_token: ConfigurationProduct.token,
                                pageIndex: 1,
                                pageSize: 10,
                                orgId: $routeParams.orgId,
                                contractId: $scope.params.page.contractNum,
                                contractType: $scope.params.page.contractType
                            }
                        }
                    });
                }
            };
            //输入非0数字
            $scope.testNum = function () {
                if ($scope.params.modal.selected.periods.length == 1) {
                    if (/[0]/.test($scope.params.modal.selected.periods)) {
                        $scope.params.modal.selected.periods = '';
                    } else if (!/[1-9]/.test($scope.params.modal.selected.periods)){
                        $scope.params.modal.selected.periods = '';
                    }
                } else {
                    if (/\D/.test($scope.params.modal.selected.periods)) {
                        $scope.params.modal.selected.periods = '';
                    }
                }
            };

            //新增
            $scope.add = function () {
                $scope.addOrEdit = 'add';
                $scope.isSee = false;

                $scope.importEntitySuccess = false;
                $scope.importEntityStart = false;
                $scope.importEntityProgress = 0;
                $("#importEntityError").html("");
                $scope.fileShopEntity = "";
                $("#pathShopEntity").val("");

                $scope.params.modal = {
                    data: {

                    },
                    selected: {
                        addType: 'S',
                        contractType: '1',  //合同类型
                        periods: '',        //期数
                        contractId: '',             //合同编号
                        contractName: '',   //合同名称
                        contractUrl: '',    //合同上传后生成的地址
                    }
                }

            };
            //编辑
            $scope.contratTableConfig.edit = {
                callback: function (params,row) {
                    $scope.addOrEdit = 'edit';
                    $scope.isSee = false;

                    $scope.importEntitySuccess = false;
                    $scope.importEntityStart = false;
                    $scope.importEntityProgress = 0;
                    $("#importEntityError").html("");
                    $scope.fileShopEntity = "";
                    $("#pathShopEntity").val("");


                    $scope.params.modal = {
                        data: {

                        },
                        selected: {
                            addType: 'E',
                            contractType: '',   //合同类型
                            periods: '',        //期数
                            contractId: '',     //合同编号
                            contractName: '',   //合同名称
                            contractUrl: '',    //合同上传后生成的地址
                        }
                    };
                    function getEditInfo () {
                        $http({
                            method: 'GET',
                            url: ConfigurationProduct.API + '/contractManager/findById.do',
                            params: {
                                sso_token: ConfigurationProduct.token,
                                id: row.id
                            }
                        })
                            .success(function (res) {
                                if (res.status == 'S') {
                                    $scope.params.modal.selected.contractType = res.data.page.contractType;
                                    $scope.params.modal.selected.periods = !res.data.page.periods ? '' : parseInt(res.data.page.periods);
                                    $scope.params.modal.selected.contractId = res.data.page.contractId;
                                    $scope.params.modal.selected.contractName = res.data.page.contractName;
                                    $scope.params.modal.selected.contractUrl = res.data.page.contractUrl;
                                    $scope.params.modal.selected.id = row.id;

                                    return;
                                }
                                if (res.status == "T") {
                                    login();
                                    return;
                                }
                                shadowShowText('提示',res.msg);
                                return;
                            })
                            .error(function (err) {
                                shadowShowText('提示',err);
                            });
                    }
                    getEditInfo();
                }
            };
            //查看
            $scope.contratTableConfig.see = {
                callback: function (params,row) {
                    $scope.isSee = true;
                    $scope.isDown = row.contractUrl ? true : false;
                    $scope.contractUrl = row.contractUrl;


                    $scope.importEntitySuccess = false;
                    $scope.importEntityStart = false;
                    $scope.importEntityProgress = 0;
                    $("#importEntityError").html("");
                    $scope.fileShopEntity = "";
                    $("#pathShopEntity").val("");


                    $scope.params.modal = {
                        data: {

                        },
                        selected: {
                            addType: 'E',
                            contractType: '',   //合同类型
                            periods: '',        //期数
                            contractId: '',             //合同编号
                            contractName: '',   //合同名称
                            contractUrl: '',    //合同上传后生成的地址
                        }
                    };
                    function getEditInfo () {
                        $http({
                            method: 'GET',
                            url: ConfigurationProduct.API + '/contractManager/findById.do',
                            params: {
                                sso_token: ConfigurationProduct.token,
                                id: row.id
                            }
                        })
                        .success(function (res) {
                            if (res.status == 'S') {
                                $scope.params.modal.selected.contractType = res.data.page.contractType;
                                $scope.params.modal.selected.periods = parseInt(res.data.page.periods);
                                $scope.params.modal.selected.contractId = res.data.page.contractId;
                                $scope.params.modal.selected.contractName = res.data.page.contractName;
                                $scope.params.modal.selected.contractUrl = res.data.page.contractUrl;

                                return;
                            }
                            if (res.status == "T") {
                                login();
                                return;
                            }
                            shadowShowText('提示',res.msg);
                            return;
                        })
                        .error(function (err) {
                            shadowShowText('提示',err);
                        });
                    }
                    getEditInfo();
                }
            };
            //删除
            $scope.contratTableConfig.del =  {
                callback: function (params,row) {
                    showConfirm("提示", "您确定删除[" + row.contractId + "]吗？", function() {
                        $http({
                            method: 'GET',
                            url: ConfigurationProduct.API + '/contractManager/delete.do',
                            params: {
                                sso_token: ConfigurationProduct.token,
                                id: row.id
                            }
                        })
                            .success(function(res) {
                                if (res.status == "S") {
                                    $scope.search();
                                }
                                if (res.status == "T") {
                                    login();
                                    return;
                                }
                                shadowShowText('提示',res.msg);

                            })
                            .error(function (err) {
                                shadowShowText('提示',err);
                            });
                    });
                }
            };
            //保存
            $scope.save = function () {
                $scope.params.modal.selected.orgId = $routeParams.orgId;
                if (!/[1-9]/.test($scope.params.modal.selected.periods) && $scope.params.modal.selected.periods.length != 0) {
                    shadowShowText('提示','请输入大于0的整数');
                    return;
                }
                $http({
                    method: 'POST',
                    url: ConfigurationProduct.API + '/contractManager/add.do',
                    params: {
                        sso_token: ConfigurationProduct.token
                    },
                    data: $scope.params.modal.selected
                })
                    .success(function (res) {
                        if (res.status == "T") {
                            login();
                            return;
                        }
                        if (res.status == 'S') {
                            $('.modal').modal('hide');
                            $scope.search();
                        }
                        shadowShowText('提示',res.msg);
                        return;
                    })
                    .error(function (err) {
                        shadowShowText('提示',err);
                    });

            };


            //导入功能初始配置
            $scope.fileShopEntity = "";

            $scope.importEntitySuccess = false;

            $scope.importEntityStart = false;

            $scope.importEntityProgress = 0;

            $scope.importEntitySuccessInfo = "导入成功";

            $scope.timerOne = "";

            $scope.timerTwo = "";

            //开始导入模板
            $scope.importUpdate = function() {
                $scope.importEntitySuccess = false;
                $scope.importEntityStart = false;
                $scope.importEntityProgress = 0;
                $("#importEntityError").html("");

                var size = parseInt(parseInt($scope.fileShopEntity.size) / 1024);
                //if (size <= 1024) {
                    $scope.importEntityStart = true;
                    $scope.timerOne = $timeout(function() {
                        $scope.importEntityProgress = 40;
                    }, 500);
                    $scope.timerOne.then(function() {
                        $scope.timerTwo = $timeout(function() {
                            $scope.importEntityProgress = 70;
                        }, 500);
                    });
                    $scope.upload($scope.fileShopEntity,ConfigurationProduct.API +
                        '/contractManager/uploadFile.do?sso_token=' + ConfigurationProduct.token);
                // } else {
                //     $scope.importEntityStart = false;
                //     $scope.importEntitySuccess = false;
                //     $("#importEntityError").html("<div style='color:red;' >文件：" + $("#pathShopEntity").val() + "超过1M.</div>");
                // }

            };
            $scope.upload = function(file, url) {
                $scope.params.modal.selected.contractName = file.name;
                Upload.upload({
                    url: url,
                    data: { file: file }
                }).then(function(response) {
                    if (response.data.status == "T") {
                        login();
                        return;
                    }
                    if (response.data.status == "S") {
                        $scope.importEntitySuccess = true;
                        $timeout.cancel($scope.timerOne);
                        $timeout.cancel($scope.timerTwo);
                        $scope.importEntityProgress = 100;
                        $scope.importEntitySuccessInfo = response.data.msg.replace("<br/>", "");

                        $scope.params.modal.selected.contractUrl = response.data.data['urlAndMd5'];

                    } else {
                        $scope.importEntityStart = false;
                        $scope.importEntitySuccess = false;
                        $timeout.cancel($scope.timerOne);
                        $timeout.cancel($scope.timerTwo);
                        var messages = JSON.parse(response.data.msg);
                        var html = "";
                        $.each(messages, function(i, value) {
                            html = html + "<div style='color:red;' >" + messages[i] + "</div>";
                        });
                        $("#importEntityError").html(html);
                    }
                }, function(response) {
                    shadowShowText('提示',response.status);
                    return;
                });
            };
            //表格数据配置
            $scope.contractCtrl = {
                options: {
                    data: '',
                    uniqueId: 'id',
                    cache: false,
                    height: 'auto',
                    striped: true,
                    pagination: true,
                    sidePagination: "server",

                    pageSize: 10,
                    //pageList: [10, 25, 50, 100, 200],
                    search: false,
                    showColumns: false,
                    showRefresh: false,
                    searchAlign: 'left',
                    buttonsAlign: 'left',
                    showExport: true,
                    detailView: false,
                    minimumCountColumns: 2,
                    //clickToSelect: false,
                    undefinedText: '',
                    //queryParamsType: false,
                    showPaginationSwitch: false,
                    // showToggle: true,
                    //smartDisplay: true,
                    toolbar: '#search_button',
                    toolbarAlign: 'right',
                    classes: 'table table-no-bordered table-condensed table-beark',
                    // detailFormatter: function(argument) {
                    //     return 2323;
                    // },
                    clickToSelect: true,
                    singleSelect: true,
                    columns: [{
                        field: 'sortNum',
                        title: '序号',
                        align: 'left',
                        valign: 'middle',
                        width: '5%',
                        formatter: function(value, row, index) {
                            var pageIndex = $("#contractTb").attr("pageIndex");
                            return (pageIndex - 1) * 10 + index + 1;
                        },
                    }, {
                        field: 'contractId',
                        title: '合同编号',
                        align: 'left',
                        valign: 'middle',
                        sortable: false,
                        width: '20%',
                    }, {
                        field: 'orgName',
                        title: '所属项目',
                        align: 'left',
                        valign: 'middle',
                        width: '25%',
                        sortable: false
                    }, {
                        field: 'contractType',
                        title: '合同类型',
                        align: 'left',
                        valign: 'middle',
                        width: '10%',
                        sortable: false,
                        formatter: function (value) {
                            var name = '';
                            switch (value){
                                case '1': name = '整体合同';break;
                                case '2': name = '分期合同';break;
                                case '3': name = '补充合同';break;
                            }
                            return name;
                        }
                    }, {
                        field: 'periods',
                        title: '期别',
                        align: 'left',
                        valign: 'middle',
                        width: '5%',
                        clickToSelect: false
                    }, {
                        field: 'cTimeStamp',
                        title: '更新时间',
                        align: 'left',
                        valign: 'middle',
                        width: '15%',
                        sortable: false,
                        formatter: function (value) {
                            return formatDate(value, "yyyy-MM-dd HH:mm:ss");
                        }
                    }, {
                        field: 'handlers',
                        title: '操作人',
                        align: 'left',
                        valign: 'middle',
                        width: '10%',
                        sortable: false
                    }, {
                        field: '',
                        title: '操作',
                        align: 'left',
                        valign: 'middle',
                        width: '10%',
                        sortable: false,
                        formatter: function (value,row) {
                            var str =
                                '<div>'+
                                ' <i class="glyphicon glyphicon-trash pointer" data-rowid="' + row.id + '" title="删除"></i> '+
                                ' <i class="glyphicon glyphicon-eye-open pointer" data-rowid="' + row.id + '" data-toggle="modal" data-target="#contract" title="查看"></i> '+
                                ' <i class="glyphicon glyphicon-pencil pointer" data-rowid="' + row.id + '" data-toggle="modal" data-target="#contract" title="编辑"></i>'+
                                '</div>';
                            return str;
                        }
                    }]

                }
            };
        });

    }
]);
