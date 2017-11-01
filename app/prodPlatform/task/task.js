/**
 * Created by xuyanan on 2017/6/6.
 */
'use strict';
angular.module('newApp').service('taskService', ['$rootScope', '$http', function($rootScope, $http) {
    var service = {
        searchData: '',
        editData: '',
        search: function(params, callback) {
            $http({
                method: params.search.method,
                url: params.search.url,
                params: params.search.params,
                data: params.search.data
            }).success(function(res) {
                if (res.status == "T") {
                    login();
                    return;
                }
                if (res.status == "F") {
                    shadowShowText('提示',res.msg);
                    return;
                }
                $("#taskTable").attr("pageIndex", res.data.page.pageIndex);
                service.searchData = res.data.page;
                $rootScope.$broadcast('taskService.search');
            });
        },
        edit: function(params, callback) {

        }
    };
    return service;

}])
.controller('taskCtrl', ['$scope', '$http','ConfigurationProduct','Configuration', 'taskService',
    function($scope, $http, ConfigurationProduct,Configuration, taskService) {
        $scope.taskTableConfig = {
            bsTableId: '',
            add: '',
            del: null,
            edit: null,
            search: {
                callback: taskService.search,//默认加载第一次调用函数，如果不行调用，填一个空函数，不填''
                url: ConfigurationProduct.API + '/group/list.do',
                method: 'post',
                params: {
                    sso_token: ConfigurationProduct.token,
                    pageIndex: 1,
                    pageSize: 20,
                },
                data: {
                    name: ''
                }
            },
            inmport: '',
            reset: '',
            see: '',
            picture: ''
        };

        $scope.$on('taskService.search', function(event) {
            $scope.taskControl.options.data = taskService.searchData;
            $scope.searchS = false;
            $scope.resetS = false;
            $scope.$applyAsync();
        });


        $scope.$on('$viewContentLoaded', function() {
            //初始化
            $scope.params = {
                page: {
                    name: ''
                },
                modal: {
                    id: '',
                    name: '',
                    members: [],
                    duties: []
                },
                modalData: {
                    member: '',
                    membersData: [],
                    dutiesData: []
                }
            };

            $scope.pageNumber = 0;
            //获取功能角色
            $http({
                method: 'POST',
                url: ConfigurationProduct.API + '/group/duties.json',
                params: {
                    sso_token: ConfigurationProduct.token
                }
            })
                .success(function (res) {
                    if (res.status == "T") {
                        login();
                        return;
                    }
                    if (res.status == "F") {
                        shadowShowText('提示',res.msg);
                        return;
                    }
                    $scope.params.modalData.dutiesData = angular.isArray(res.data.duties) ? res.data.duties : [];
                })
                .error(function () {
                    shadowShowText('提示',window.serveErr);
                });

            $scope.searchS = false;
            $scope.resetS = false;

            //是否勾选功能角色
            $scope.ischeckDuty = function (id) {
                var result = false;
                $scope.params.modal.duties.forEach(function (item) {
                    if (item == id) {
                        result = true;
                    }
                });
                return result;
            };
            //选择功能角色
            $scope.selectDuty = function (ev,id) {
                var checkbox = ev.target;
                if (checkbox.checked) {
                    $scope.params.modal.duties.push(id);
                } else {
                    $scope.params.modal.duties.forEach(function (item,i) {
                        if (item == id) {
                            $scope.params.modal.duties.splice(i,1);
                        }
                    });
                }
            };
            //获取组员列表
            $scope.getMembers = function (e,type) {
                if (e.keyCode != 13 && !type) {
                    return;
                }
                $('.select-data').show();
                $http({
                    method: 'POST',
                    url: ConfigurationProduct.API + '/group/members.json',
                    params: {
                        sso_token: ConfigurationProduct.token
                    },
                    data: {
                        member: $scope.params.modalData.member,
                        limit: 10
                    }
                })
                .success(function (res) {
                    if (res.status == "T") {
                        login();
                        return;
                    }
                    if (res.status == "F") {
                        shadowShowText('提示',res.msg);
                        return;
                    }
                    $scope.params.modalData.membersData = res.data.users;

                })
                .error(function () {
                    shadowShowText('提示',window.serveErr);
                });
            };
            //选择组员
            $scope.selectMember = function (m) {
                var isHave = false;
                var ms = $scope.params.modal.members;
                if ($scope.params.modal.members.length == 0) {
                    $scope.params.modal.members.push(m);
                } else {
                    for (var i = 0; i < ms.length; i++) {
                        if (ms[i].id == m.id) {
                            isHave = true;
                            break;
                        } else {
                            isHave = false;
                        }
                    }
                    if (!isHave) {
                        $scope.params.modal.members.push(m);
                    }
                }
                $('.select-data').hide();
                $scope.params.modalData.member = '';
            };
            //删除组员
            $scope.removeMember = function (m) {
                $scope.params.modal.members.forEach(function (item,i) {
                    if (item.id == m.id) {
                        $scope.params.modal.members.splice(i,1);
                    }
                });
            };
            //保存
            $scope.save = function (type) {
                var data = {};
                angular.copy($scope.params.modal,data);
                var newMembers = data.members.map(function (item) {
                    return item.id;
                });
                data.members = newMembers;
                var url = '';
                if (type == 'add') {
                    url = '/group/insert.do';
                } else {
                    url = '/group/update.do';
                }
                $http({
                    method: 'POST',
                    url: ConfigurationProduct.API + url,
                    params: {
                        sso_token: ConfigurationProduct.token
                    },
                    data: data
                })
                .success(function (res) {
                    if (res.status == "T") {
                        login();
                        return;
                    }
                    if (res.status == "F") {
                        shadowShowText('提示',res.msg);
                        return;
                    }
                    if (res.status == "S") {
                        $('.modal').modal('hide');
                    }
                    $scope.toolbarEvent.search();
                    shadowShowText('提示', '操作成功');
                })
                .error(function () {
                    shadowShowText('提示',window.serveErr);
                });
            };
            //toolbar事件
            $scope.toolbarEvent = {
                //新增
                add: function () {
                    $scope.addOrEdit = 'add';
                    $scope.params.modal = {
                        id: '',
                        name: '',
                        members: [],
                        duties: []
                    };
                    $scope.params.modalData = {
                        member: '',
                        membersData: [],
                        dutiesData: $scope.params.modalData.dutiesData
                    };

                },
                //查询
                search: function () {
                    $scope.searchS = true;
                    $scope.pageNumber = $("#taskTable").bootstrapTable('getData').length;
                    $scope.taskTableConfig.search.data = $scope.params.page;
                    if ($scope.pageNumber > 0) {
                        $("#taskTable").bootstrapTable('selectPage', 1);
                    } else {
                        taskService.search({
                            search: {
                                callback: taskService.search,
                                url: ConfigurationProduct.API + '/group/list.do',
                                method: 'post',
                                params: {
                                    sso_token: ConfigurationProduct.token,
                                    pageIndex: 1,
                                    pageSize: 20,
                                },
                                data: $scope.params.page
                            }
                        });
                    }
                },
                //重置
                resetSearch: function () {
                    $scope.params.page = {
                        name: ''
                    };
                    $scope.resetS = true;
                    $scope.toolbarEvent.search();
                }
            };


//表格操作
            //表格-编辑
            $scope.taskTableConfig.edit = {
                callback: function(params, row) {
                    $scope.$apply(function() {
                        $scope.addOrEdit = 'edit';
                        $scope.params.modal = {
                            id: '',
                            name: '',
                            members: [],
                            duties: []
                        };
                        $scope.params.modalData = {
                            member: '',
                            membersData: [],
                            dutiesData: $scope.params.modalData.dutiesData
                        };
                        $http({
                            method: 'GET',
                            url: ConfigurationProduct.API + '/group/update.do',
                            params: {
                                sso_token: ConfigurationProduct.token,
                                id: row.id
                            }
                        })
                            .success(function (res) {
                                if (res.status == "T") {
                                    login();
                                    return;
                                }
                                if (res.status == "F") {
                                    shadowShowText('提示',res.msg);
                                    return;
                                }
                                $scope.params.modal = {
                                    id: row.id,
                                    name: res.data.projectGroup.name,
                                    members: res.data.members,
                                    duties: res.data.duties
                                };

                            })
                            .error(function () {
                                shadowShowText('提示',window.serveErr);
                            });
                    });
                }
            };
            //表格-删除
            $scope.taskTableConfig.del = {
                callback: function(params, row) {
                    showConfirm("提示", "您确定删除[" + row.name + "]项目组吗？", function() {
                        $http({
                            method: 'POST',
                            url: ConfigurationProduct.API + '/group/delete.do',
                            params: {
                                sso_token: ConfigurationProduct.token
                            },
                            data: {
                                ids: row.id
                            }
                        })
                            .success(function(res) {
                                if (res.status == "T") {
                                    login();
                                    return;
                                }
                                if (res.status == "F") {
                                    shadowShowText('提示',res.msg);
                                    return;
                                }
                                shadowShowText("提示", res.msg);
                                $scope.toolbarEvent.search();

                            })
                            .error(function () {
                                shadowShowText('提示',window.serveErr);
                            });
                    });
                }
            };
            function flagFormatter(value, row, index) {
                var buttons = "";
                buttons += '<i class="glyphicon glyphicon-pencil pointer" data-toggle="modal" data-target="#groupModal" data-rowid="' + row.id + '"></i>&nbsp; ';
                buttons += '<i class="glyphicon glyphicon-trash pointer" data-rowid="' + row.id + '"></i>&nbsp; ';
                return buttons;
            }
            $scope.batchTimes=["300","600","1800","3600"];
            //表格数据配置
            $scope.taskControl = {
                options: {
                    data: '',
                    uniqueId: 'id',
                    cache: false,
                    height: 'auto',
                    striped: true,
                    pagination: true,
                    sidePagination: "server",
                    pageSize: 20,
                    search: false,
                    showColumns: false,
                    showRefresh: false,
                    searchAlign: 'left',
                    buttonsAlign: 'left',
                    showExport: true,
                    detailView: false,
                    minimumCountColumns: 2,
                    undefinedText: '',
                    showPaginationSwitch: false,
                    toolbar: '#search_button',
                    toolbarAlign: 'right',
                    classes: 'table table-no-bordered table-condensed table-beark',
                    clickToSelect: true,
                    singleSelect: true,
                    columns: [{
                        field: 'sortNum',
                        title: '序号',
                        align: 'left',
                        valign: 'middle',
                        width: '5%',
                        formatter: function(value, row, index) {
                            var pageIndex = $("#taskTable").attr("pageIndex");
                            return (pageIndex - 1) * 20 + index + 1;
                        },
                    }, {
                        field: 'name',
                        title: '组别',
                        align: 'left',
                        valign: 'middle',
                        sortable: false,
                        width: '25%',
                    }, {
                        field: 'memebers',
                        title: '成员',
                        align: 'left',
                        valign: 'middle',
                        width: '60%',
                        sortable: false,
                        formatter: function (value,row,index) {
                            var data = '';
                            if (value != '' && value.length != 0) {
                                var newArr = [];
                                value.forEach(function (item) {
                                    newArr.push(item.name);
                                });
                                data = newArr.join(',');
                            }
                            return data;
                        }
                    },{
                        field: 'flag',
                        title: '操作',
                        align: 'left',
                        valign: 'middle',
                        width: '10%',
                        clickToSelect: false,
                        formatter: flagFormatter
                    }],

                }
            };
        });

    }
]);
