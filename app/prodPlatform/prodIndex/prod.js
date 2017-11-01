/**
 * Created by xuyanan on 2017/5/23.
 */
'use strict';
angular.module('newApp')
.controller('prodCtrl', ['$scope', '$http','ConfigurationProduct','Configuration','pluginsService','Upload','$location','$routeParams', function($scope, $http, ConfigurationProduct,Configuration,pluginsService,Upload,$location,$routeParams) {
    $scope.$on('$viewContentLoaded', function() {
        //权限
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
        };
        //初始化数据
        $scope.params = {
            page: {
                orgName: '',
                treeOrg: [],
                orgList: [],
                gatherInfo: null
            },
            modal: {
                task: {
                    id: '',
                    type: '',
                    memberArr: [],
                    members: []
                },
                project: {
                    data: {
                        orgPropertys: [],
                        treeOrg: [],
                        provinceList: [],
                        city: [],
                        county: [],
                        implementTag: [],
                    },
                    selected: {
                        id: '',             //编辑时的机构id
                        name: '',           //机构名称
                        type: '200',        //机构类型
                        parentId: '',       //所属父机构id
                        parentName: '',     //所属父机构名称
                        province: '',       //省
                        city: '',           //市
                        county: '',         //县
                        areaDivision: '',   //区域
                        floorDivision: '',  //楼层
                        implementTag: '',   //项目类型
                        projectManager: '',  //项目管理员
                        billhint: '',               //二维码上方文字
                        qrCodeLogoUrl: '',          //追打二维码
                        scanUrl: '',                //扫码链接
                        fileImage: '',              //上传图片暂存
                        marketingImage: '',         //追打图片
                        marketingCopywriter: ''     //追打固定文字
                    }
                }
            }
        };
        $scope.isCheckAll = false;//是否全选

        $scope.isChangeOrgType = false;
        //$scope.addEditClick = 0;


        //获取权限
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
                    //login();
                    return;
                }
                shadowShowText('提示', res.msg);
            })
            .error(function () {
                shadowShowText(window.serveErr);
            });
        $scope.toTask = function () {
            window.open('http://pro' + window.gooagoodomain + '/#/task');
        };

        //页面表格加载，查询
        $scope.tablePage = function () {
            $http({
                method: 'GET',
                url: ConfigurationProduct.API + '/projectOrganization/page.do',
                params: {
                    sso_token: ConfigurationProduct.token,
                    name: $scope.params.page.orgName,
                    pageIndex: 1,
                    pageSize: 3
                }
            })
                .success(function (res) {
                    if (res.status  == 'S') {
                        var treeOrg = angular.isArray(res.data.treeOrg) ? res.data.treeOrg : [],
                            index = 0,
                            indent = "　　　　　　　　　",
                            result = [];
                        famaterOrg(treeOrg, index,indent,result);
                        $scope.params.page.treeOrg = result;
                        $scope.params.page.orgList = convertTree(res.data.orgList);
                        $scope.params.page.gatherInfo = res.data.gatherInfo || ' ';
                        return;
                    }
                    if (res.status == 'T') {
                        login();
                        return;
                    }
                    shadowShowText('提示',res.msg);

                })
                .error(function () {
                    shadowShowText('提示',window.serveErr);
                })

        };
        function famaterOrg(treeOrg, index,indent,result) {
            var length = treeOrg.length;
            if (length == 0) {
                return result;
            }
            for (var i = 0; i < length; i++) {
                var rowData = treeOrg[i];
                rowData.name = indent.substring(0, (index) * 4) + rowData.name;
                var childData = rowData.children;
                result.push(rowData);
                if (childData != null && childData.length > 0) {
                    famaterOrg(childData, index + 1,indent,result);
                }
            }
            index++;
        }
        $scope.tablePage();
        //新增项目
        $scope.addProject = function () {
            $scope.addOrEdit = 'add';
            //$scope.addEditClick++;
            $scope.params.modal.project = {
                data: {
                    orgPropertys: $scope.params.modal.project.data.orgPropertys || [],
                    treeOrg: $scope.params.modal.project.data.defaultTreeOrg || [],
                    provinceList: $scope.params.modal.project.data.provinceList || [],
                    city: [],
                    county: [],
                    implementTag: $scope.params.modal.project.data.implementTag || [],
                },
                selected: {
                    id: '',             //编辑时的机构id
                    name: '',           //机构名称
                    type: '200',        //机构类型
                    parentId: '',       //所属父机构id
                    parentName: '',     //所属父机构名称
                    province: '',       //省
                    city: '',           //市
                    county: '',         //县
                    areaDivision: '',   //区域
                    floorDivision: '',  //楼层
                    implementTag: '',   //项目类型
                    projectManager: '',  //项目管理员
                    billhint: '',               //二维码上方文字
                    qrCodeLogoUrl: '',          //追打二维码
                    scanUrl: '',                //扫码链接
                    fileImage: '',              //上传图片暂存
                    marketingImage: '',         //追打图片
                    marketingCopywriter: ''     //追打固定文字
                }

            };
            if ($scope.params.modal.project.selected.type == 500 || $scope.params.modal.project.selected.type == 600) {
                $scope.orgHide = false;
                $scope.otherHide = true;
            } else if ($scope.params.modal.project.selected.type == 400) {
                $scope.orgHide = true;
                $scope.otherHide = true;
            } else if ($scope.params.modal.project.selected.type == 200) {
                $scope.orgHide = false;
                $scope.otherHide = false;
            }
            projectParams ();
            $scope.isChangeOrgType = false;

        };
        //非mall属性时，不可点击
        var prodrightRoleTab = document.getElementById('prodrightRoleTab');
        prodrightRoleTab.addEventListener('click',function (ev) {
            if ($scope.params.modal.project.selected.type != 200){
                shadowShowText('提示', "机构属性非‘MALL’时不可点击");
                ev.stopPropagation();
                ev.preventDefault();
            }
        },true);
        //获取新增、编辑默认下拉框数据
        function projectParams () {
            $http({
                method: 'GET',
                url: ConfigurationProduct.API + '/projectOrganization/add.do',
                params: {
                    sso_token: ConfigurationProduct.token,
                }
            })
                .success(function (res) {
                    if (res.status  == 'S') {
                        $scope.params.modal.project.data.orgPropertys = angular.isArray(res.data.orgPropertys) ? res.data.orgPropertys : [];
                        $scope.params.modal.project.data.treeOrg = angular.isArray(res.data.orgList) ? convertTree(res.data.orgList) : [];
                        $scope.params.modal.project.data.provinceList = angular.isArray(res.data.provinceList) ? res.data.provinceList : [];
                        $scope.params.modal.project.data.implementTag = angular.isArray(res.data.implementTag) ? res.data.implementTag : [];
                        $scope.params.modal.project.selected.scanUrl = res.data.scanUrl;
                        //console.log($scope.params.modal.project);
                        return;
                    }
                    if (res.status == 'T') {
                        login();
                        return;
                    }
                    shadowShowText('提示',res.msg);

                })
                .error(function () {
                    shadowShowText('提示',window.serveErr);
                });

        }
        //切换机构类型，获取机构列表
        $scope.changeOrg = function () {
            $scope.params.modal.project.selected.parentName = '';
            $scope.params.modal.project.selected.parentId = '';
            if ($scope.params.modal.project.selected.type == 500 || $scope.params.modal.project.selected.type == 600) {
                $scope.orgHide = false;
                $scope.otherHide = true;
            } else if ($scope.params.modal.project.selected.type == 400) {
                $scope.orgHide = true;
                $scope.otherHide = true;
            } else if ($scope.params.modal.project.selected.type == 200) {
                $scope.orgHide = false;
                $scope.otherHide = false;
            }
            $http({
                method: 'GET',
                url: ConfigurationProduct.API + '/projectOrganization/getOrganizationInfoByType.json',
                params: {
                    sso_token: ConfigurationProduct.token,
                    type: $scope.params.modal.project.selected.type
                }
            })
                .success(function (res) {
                    if (res.status  == 'S') {
                        $scope.params.modal.project.data.treeOrg = angular.isArray(res.data.orgList) ? convertTree(res.data.orgList) : [];
                        return;
                    }
                    if (res.status == 'T') {
                        login();
                        return;
                    }
                    shadowShowText('提示',res.msg);

                })
                .error(function () {
                    shadowShowText('提示',window.serveErr);
                });
        };
        //删除上级机构
        $scope.isDel = function () {
            if ($scope.params.modal.project.selected.parentName == '') {
                $scope.params.modal.project.selected.parentId = '';
            }
        };
        //获取市区县
        $scope.getCityCounty = function (type) {
            var parent = '';
            if (type == 'city') {
                parent = $scope.params.modal.project.selected.province;
                $scope.params.modal.project.selected.city = '';
                $scope.params.modal.project.selected.county = '';
            } else {
                parent = $scope.params.modal.project.selected.city;
                $scope.params.modal.project.selected.county = '';
            }
            $http({
                method: 'GET',
                url: ConfigurationProduct.API + '/projectOrganization/getAreaInfo.json',
                params: {
                    sso_token: ConfigurationProduct.token,
                    parentId: parent
                }
            })
                .success(function (res) {
                    if (res.status  == 'S') {
                        if (type == 'city') {
                            $scope.params.modal.project.data.city = angular.isArray(res.data.areas) ? res.data.areas : [];
                        } else {
                            $scope.params.modal.project.data.county = angular.isArray(res.data.areas) ? res.data.areas : [];
                        }
                        return;
                    }
                    if (res.status == 'T') {
                        login();
                        return;
                    }
                    shadowShowText('提示',res.msg);

                })
                .error(function () {
                    shadowShowText('提示',window.serveErr);
                });
        };

        //图片上传
        $scope.imgUpload = function (type) {
            if (type == 'qrCodeLogoUrl') {
                if($scope.params.modal.project.selected.fileImage.name.indexOf('.bmp') > -1 || $scope.params.modal.project.selected.fileImage.name.indexOf('.BMP') > -1){
                    var img = new Image();
                    var reader = new FileReader();
                    reader.readAsDataURL($scope.params.modal.project.selected.fileImage);
                    reader.onloadend = function(){
                        img.src = reader.result;
                        img.onload = function () {
                            if(img.height <= 200 || img.width <= 200){
                                $scope.afterUp(reader.result,type);
                            } else {
                                shadowShowText("提示", "文件大小超过200*200");
                            }
                            img = null;
                        };
                    };
                } else {
                    shadowShowText("提示", "请上传格式为bmp的图片");
                }
                return;
            }
            if (type == 'marketingImage') {
                if ($scope.params.modal.project.selected.fileImage.name.indexOf('.jpg') > -1 || $scope.params.modal.project.selected.fileImage.name.indexOf('.jpeg') > -1 || $scope.params.modal.project.selected.fileImage.name.indexOf('.png') > -1 || $scope.params.modal.project.selected.fileImage.name.indexOf('.bmp') > -1  || $scope.params.modal.project.selected.fileImage.name.indexOf('.JPG') > -1 || $scope.params.modal.project.selected.fileImage.name.indexOf('.JPEG') > -1  ||$scope.params.modal.project.selected.fileImage.name.indexOf('.PNG') > -1 || $scope.params.modal.project.selected.fileImage.name.indexOf('.BMP') > -1) {
                    var size = parseInt(parseInt($scope.params.modal.project.selected.fileImage.size) / 1024);
                    if(size > 500){
                        shadowShowText("提示", "文件大小超过500k");
                        return;
                    }
                    var reader = new FileReader();
                    reader.readAsDataURL($scope.params.modal.project.selected.fileImage);
                    reader.onloadend = function () {
                        $scope.afterUp(reader.result,type);
                    };
                } else {
                    shadowShowText("提示", "请上传格式为jpg|jpeg|png|bmp的图片");
                }
            }
        };
        $scope.afterUp = function (img,type) {
            $http({
                method: 'POST',
                url: ConfigurationProduct.API + '/common/uplodifyImg.json',
                data: {
                    sso_token: ConfigurationProduct.token,
                    file: img
                }
            })
                .success(function (res) {
                    if (res.status == "T") {
                        login();
                        return;
                    }
                    if (res.status == "S") {
                        $scope.params.modal.project.selected[type] = res.data.imgUrl;
                        return
                    }
                    shadowShowText('提示',res.msg);
                })
                .error(function () {
                    shadowShowText('提示',window.serveErr);
                });
        };
        //删除图片
        $scope.removeImg = function (type) {
            $scope.params.modal.project.selected[type] = '';
        };

        //新增保存，编辑保存
        $scope.projectSave = function () {
            //console.log($scope.params.modal.project.selected);
            var ajaxUrl = '';
            if ($scope.addOrEdit == 'add') {
                ajaxUrl = '/projectOrganization/add.do';
            } else {
                ajaxUrl = '/projectOrganization/update.do';
            }
            $http({
                method: 'POST',
                url: ConfigurationProduct.API + ajaxUrl,
                params: {
                    sso_token: ConfigurationProduct.token
                },
                data: $scope.params.modal.project.selected
            })
                .success(function (res) {
                    if (res.status == 'S') {
                        $scope.params.modal.project.data.orgPropertys = angular.isArray(res.data.orgPropertys) ? res.data.orgPropertys : [];
                        $scope.params.modal.project.data.treeOrg = angular.isArray(res.data.treeOrg) ? convertTree(res.data.treeOrg) : [];
                        $scope.params.modal.project.data.defaultTreeOrg = angular.isArray(res.data.treeOrg) ? convertTree(res.data.treeOrg) : [];
                        $scope.params.modal.project.data.provinceList = angular.isArray(res.data.provinceList) ? res.data.provinceList : [];
                        $scope.params.modal.project.data.implementTag = angular.isArray(res.data.implementTag) ? res.data.implementTag : [];
                        $('.modal').modal('hide');
                        shadowShowText('提示',res.msg);
                        $scope.tablePage();
                        return;
                    }
                    if (res.status == 'T') {
                        login();
                        return;
                    }
                    shadowShowText('提示',res.msg);
                })
                .error(function () {
                    shadowShowText('提示',window.serveErr);
                });
        };

//页面表格事件
        //编辑
        $scope.toEdit = function (id) {

            $scope.params.modal.project = {
                data: {
                    orgPropertys: $scope.params.modal.project.data.orgPropertys || [],
                    treeOrg: $scope.params.modal.project.data.defaultTreeOrg || [],
                    provinceList: $scope.params.modal.project.data.provinceList || [],
                    city: [],
                    county: [],
                    implementTag: $scope.params.modal.project.data.implementTag || [],
                },
                selected: {
                    id: '',             //编辑时的机构id
                    name: '',           //机构名称
                    type: '200',        //机构类型
                    parentId: '',       //所属父机构id
                    parentName: '',     //所属父机构名称
                    province: '',       //省
                    city: '',           //市
                    county: '',         //县
                    areaDivision: '',   //区域
                    floorDivision: '',  //楼层
                    implementTag: '',   //项目类型
                    projectManager: '',  //项目管理员
                    billhint: '',               //二维码上方文字
                    qrCodeLogoUrl: '',          //追打二维码
                    scanUrl: '',                //扫码链接
                    fileImage: '',              //上传图片暂存
                    marketingImage: '',         //追打图片
                    marketingCopywriter: ''     //追打固定文字
                }

            };

            $scope.addOrEdit = 'edit';
            $scope.isChangeOrgType = true;
            $http({
                method: 'GET',
                url: ConfigurationProduct.API + '/projectOrganization/update.do',
                params: {
                    sso_token: ConfigurationProduct.token,
                    orgId: id
                }
            })
                .success(function (res) {
                    if (res.status == 'S') {
                        $scope.params.modal.project.data.orgPropertys = angular.isArray(res.data.orgPropertys) ? res.data.orgPropertys : [];
                        $scope.params.modal.project.data.treeOrg = angular.isArray(res.data.orgList) ? convertTree(res.data.orgList) : [];
                        $scope.params.modal.project.data.provinceList = angular.isArray(res.data.provinceList) ? res.data.provinceList : [];
                        $scope.params.modal.project.data.implementTag = angular.isArray(res.data.implementTag) ? res.data.implementTag : [];
                        $scope.params.modal.project.data.city = angular.isArray(res.data.cityList) ? res.data.cityList : [];
                        $scope.params.modal.project.data.county = angular.isArray(res.data.countyList) ? res.data.countyList : [];

                        $scope.params.modal.project.selected.id = id;
                        $scope.params.modal.project.selected.name = res.data.organiztion.name;
                        $scope.params.modal.project.selected.type = res.data.organiztion.type;
                        $scope.params.modal.project.selected.parentId = res.data.organiztion.parentId;
                        $scope.params.modal.project.selected.parentName = res.data.organiztion.parentName;
                        $scope.params.modal.project.selected.province = res.data.organiztion.province;
                        $scope.params.modal.project.selected.city = res.data.organiztion.city;
                        $scope.params.modal.project.selected.county = res.data.organiztion.county;
                        $scope.params.modal.project.selected.areaDivision = res.data.organiztion.areaDivision;
                        $scope.params.modal.project.selected.floorDivision = res.data.organiztion.floorDivision;
                        $scope.params.modal.project.selected.implementTag = res.data.organiztion.implementTag;
                        $scope.params.modal.project.selected.projectManager = res.data.organiztion.projectManager;

                        $scope.params.modal.project.selected.billhint = res.data.organiztion.billhint;
                        $scope.params.modal.project.selected.scanUrl = res.data.organiztion.scanUrl;
                        $scope.params.modal.project.selected.marketingCopywriter = res.data.organiztion.marketingCopywriter;
                        $scope.params.modal.project.selected.qrCodeLogoUrl = res.data.organiztion.qrCodeLogoUrl;
                        $scope.params.modal.project.selected.marketingImage = res.data.organiztion.marketingImage;

                        if ($scope.params.modal.project.selected.type == 500 || $scope.params.modal.project.selected.type == 600) {
                            $scope.orgHide = false;
                            $scope.otherHide = true;
                        } else if ($scope.params.modal.project.selected.type == 400) {
                            $scope.orgHide = true;
                            $scope.otherHide = true;
                        } else if ($scope.params.modal.project.selected.type == 200) {
                            $scope.orgHide = false;
                            $scope.otherHide = false;
                        }
                        return;
                    }
                    if (res.status == 'T') {
                        login();
                        return;
                    }
                    shadowShowText('提示',res.msg);
                })
                .error(function () {
                    shadowShowText('提示',window.serveErr);
                });


        };
        //分配任务
        $scope.roleTask = function (id) {
            $scope.params.modal.task = {
                id: id,
                memberArr: [],
                members: []
            };
            $http({
                method: 'POST',
                url: ConfigurationProduct.API + '/group/list.do',
                data: {
                    sso_token: ConfigurationProduct.token,
                    pageIndex: 1,
                    pageSize: 50,
                    name: '',
                    shopId: id
                }
            })
                .success(function (res) {
                    if (res.status  == 'S') {
                        $scope.params.modal.task.memberArr = angular.isArray(res.data.page.rows) ? res.data.page.rows : [];

                        $scope.params.modal.task.memberArr.forEach(function (ms) {
                            ms.memebers.forEach(function (m) {
                                $scope.params.modal.task.members.push({id: m.id,inShop: m.inShop});
                                /*if (m.inShop) {
                                    if ($scope.params.modal.task.members.indexOf(m.id) == -1) {
                                        $scope.params.modal.task.members.push(m.id);
                                    }
                                }*/
                            });
                        });
                        //console.log($scope.params.modal.task.members);
                        return;
                    }
                    if (res.status == 'T') {
                        login();
                        return;
                    }
                    shadowShowText('提示',res.msg);

                })
                .error(function () {
                    shadowShowText('提示',window.serveErr);
                })
        };
//模态框事件
//分配权限
        //回显时，是否全选
        $scope.editCheckedAll = function (members) {
            var result = true;
            members.forEach(function (item) {
                if (!item.inShop) {
                    result = false;
                }
            });
            return result;
        };
        //选择功能角色
        $scope.selectMember = function (ev,id) {
            var isCheck = ev.target.checked;
            var evParents = $(ev.target).parents('.memberTd');
            $scope.params.modal.task.members.forEach(function (item,i) {
                if (item.id == id) {
                    item.inShop = isCheck;
                }
            });
            if (isCheck) {
                //$scope.params.modal.task.members.push({id: id});
                evParents.siblings('.nameTd').find('.checkall').prop('checked','checked');
                evParents.find('.checkitem').each(function (i,item) {
                    if (!item.checked) {
                        evParents.siblings('.nameTd').find('.checkall').removeProp('checked');
                    }
                });
            } else {
                /*var index = $scope.params.modal.task.members.indexOf(id);
                if (index > -1) {
                    $scope.params.modal.task.members.splice(index,1);
                }*/
                evParents.siblings('.nameTd').find('.checkall').removeProp('checked');
            }
            //console.log($scope.params.modal.task.members);
        };
        //全选、全不选
        $scope.checkAllMember = function (ev,memberGroup) {
            var checkItem = $(ev.target).parents('.nameTd').siblings('.memberTd').find('.checkitem');
            var isCheckedAll = ev.target.checked;
            var ilength = $scope.params.modal.task.members.length;
            var jlength = memberGroup.length;
            for (var i = 0; i < ilength; i++) {
                for (var j = 0; j < jlength; j++) {
                    if ($scope.params.modal.task.members[i].id == memberGroup[j].id) {
                        $scope.params.modal.task.members[i].inShop = isCheckedAll;
                        break;
                    }
                }

            }
            if (isCheckedAll) {
                checkItem.each(function (i,el) {
                    if (!el.checked) {
                        //$scope.params.modal.task.members.push(el.value);
                        el.checked = true;
                    }
                });
            } else {
                checkItem.each(function (i,el) {
                    //var index = $scope.params.modal.task.members.indexOf(el.value);
                    //if (index > -1) {
                        //$scope.params.modal.task.members.splice(index,1);
                        el.checked = false;
                   // }
                });
            }
            //console.log($scope.params.modal.task.members);
        };
        //保存
        $scope.taskSave = function () {
            var data = JSON.stringify({"shopId": $scope.params.modal.task.id,"members": $scope.params.modal.task.members});
            $http({
                method: 'POST',
                url: ConfigurationProduct.API + '/group/join-project.do',
                params: {
                    sso_token: ConfigurationProduct.token
                },
                data: {
                    json: data
                }
            })
                .success(function (res) {
                    if (res.status == 'S') {
                        $('.modal').modal('hide');
                    }
                    if (res.status == 'T') {
                        login();
                        return;
                    }
                    shadowShowText('提示',res.msg);

                })
                .error(function (err) {
                    shadowShowText('提示',window.serveErr);
                })
        };
    })
}]);
