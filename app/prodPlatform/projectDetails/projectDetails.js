/**
 * Created by xuyanan on 2017/6/13.
 */
'use strict';
angular.module('newApp').service('projectService', ['$rootScope', '$http', function($rootScope, $http) {

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
                $("#projectTable").attr("pageIndex", response.data.page.pageIndex);
                $("#projectTable").attr("pageSize", response.data.page.pageSize);
                service.searchData = response.data.page;
                service.virtualShop = response.data.virtualShop ? response.data.virtualShop.deviceDetailList : null;
                service.virtualShopId = response.data.virtualShop ? response.data.virtualShop.shopEntityId : '';
                $rootScope.$broadcast('projectService.search');
            });
        },
        edit: function(params, callback) {

        }
    };
    return service;
}]).controller('projectCtrl', ['$scope', '$http','ConfigurationProduct','Configuration','projectService','pluginsService','Upload','$location','$routeParams','$timeout', function($scope, $http, ConfigurationProduct,Configuration,projectService,pluginsService,Upload,$location,$routeParams,$timeout) {
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
    $scope.projectTableConfig = {
        bsTableId: '',
        add: '',
        del: null,
        edit: null,
        search: {
            callback: projectService.search,
            url: ConfigurationProduct.API + '/shopEntityInfo/page.do',
            method: 'GET',
            params: {
                sso_token: ConfigurationProduct.token,
                pageIndex: 1,
                pageSize: 20,
                orgId: $routeParams.orgId,              //机构名称
                shopEntityName: '',                     //商铺名称
                periods: '',                            //期别
                process: '',                            //实施进度
                mac: ''                                 //mac
            }
        },
        inmport: '',
        reset: '',
        see: '',
        picture: ''
    };
    //初始化
    $scope.params = {
        page: {
            name: $routeParams.name,     //机构名称
            periodsList: [],             //期别列表
            periods: '',                 //期别
            process: '',                 //实施进度
            mac: '',                     //mac
            shopEntityName: '',          //商户名称
            "total": '',                 //总数
            "projectManager": '',        //项目经理
            "preInstall": '',            //待安装
            "installed": '',             //已安装
            "configured": '',            //已配置
            "checked": '',               //已核对
            "delivered": '',             //已交付
            "stoped": '',                //已停止
            "closed": '',                //已撤店
            "softDeviceCount": '',       //软截数量
            "hardDeviceCount": '',       //硬结数量
            "transDeviceCount": '',      //交换
            "allDeviceCount": '',        //总数
            "printDeviceCount": '',      //已追码
            "allProcess": ''             //总进度
        },
        modal: {
            shopInfo: {
                data: {
                    areaDivision: [],
                    floorDivision: [],
                    shopTypesRoot: [],
                    shopTypesLeaf: [],
                },
                selected: {
                    addType: '',            //保存类型
                    id: '',                 //店铺id
                    shopEntityType: [],     //商户类型
                    shopId: $routeParams.orgId, //机构id
                    version: '',            //版本
                    storey: '',             //楼层
                    softMac: [''],          //软截MAC
                    redirectMac: [''],      //转发器MAC
                    hardwareMac: [''],      //硬件MAC
                    shopEntityTypeRoot: '', //一级业态
                    shopEntityTypeLeaf: '', //二级业态
                    shopEntityName: '',     //店铺名称
                    printModel: '',         //打印机型号
                    printInterface: '',     //电脑连接打印机接口
                    printCount: '',         //销售小票打印机数量
                    printBrand: '',         //打印机品牌
                    phone: '',              //店铺电话
                    periods: '',            //隶属分期
                    operateSystem: '',      //操作系统
                    openTime: '08:00',           //营业开门时间
                    closeTime: '22:00',          //营业关门时间
                    leasingResource: '',    //店铺号
                    isNormalPrint: 'Y',     //是否正常打印小票
                    isExtranet: 'Y',        //收银电脑外网连接情况
                    inAera: '',             //区域
                    count: '',              //数量
                    checkoutSoftName: '',   //收银软件名称
                    checkoutNum: '',        //收银机数量
                    contractArea: '',            //营业面积
                    isInstall: '',          //适合安装
                    numberId: '',           //营业执照号码
                    representative: '',     //法人代表
                    representativeCardId: '',//法人身份证
                    representativePhone: '',//联系电话
                    shopManager: '',        //店面负责人
                    shopManagerCardId: '',  //身份证
                    shopManagerPhone: '',   //联系电话
                    devPerson: '',          //发展人
                    devPhone: '',           //发展人电话
                    billhint: '',               //二维码上方文字
                    qrCodeLogoUrl: '',          //追打二维码
                    scanUrl: '',                //扫码链接
                    fileImage: '',              //上传图片暂存
                    marketingImage: '',         //追打图片
                    marketingCopywriter: ''     //追打固定文字
                }
            },
            gave: {
                selected: {
                    deviceType: '1',        //设备类型 0:转发器，1:软采，2:硬件采集器
                    previous: 'AAAA',       //MAC前辍 MAC开头4个字符
                    useBy: '1',            //设备用途 0:数据采集 1:发票专用
                    total: ''               //申领设备数 最小值 1,最大值 1000
                }
            },
            deviceStatus: {
                data: {
                    macList: [
                        {
                            softMacList: []//软截1
                        },
                        {
                            hardwareMacList: []//硬件2
                        },
                        {
                            redirectMacList: []//转发器0
                        }
                    ]
                }
            },
            setMarks: {
                selected: {
                    problemType: '',
                    problemText: '',
                    shopEntityId: '',
                    process: ''
                }
            },
            markHistory: {
                marks: []
            }
        }
    };

    $scope.$on('projectService.search', function(event) {
        $scope.projectControl.options.data = projectService.searchData;
        $scope.virtualShop = projectService.virtualShop;
        $scope.virtualShopId = projectService.virtualShopId;
        $scope.searchS = false;
        $scope.$applyAsync();
    });
    $scope.$on('$viewContentLoaded', function() {
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
                    login();
                    return;
                }
                shadowShowText('提示', res.msg);
            })
            .error(function () {
                shadowShowText(window.serveErr);
            });

        //输入非0数字
        $scope.testNum = function () {
            if ($scope.params.modal.gave.selected.total.length == 1) {
                if (/[0]/.test($scope.params.modal.gave.selected.total)) {
                    $scope.params.modal.gave.selected.total = '';
                    shadowShowText('提示', '单次申领数量必须大于0小于1000');
                    return
                } else if (!/[1-9]/.test($scope.params.modal.gave.selected.total)){
                    $scope.params.modal.gave.selected.total = '';
                    return
                }
            } else {
                if (/\D/.test($scope.params.modal.gave.selected.total)) {
                    //$scope.params.modal.gave.selected.total.replace(/\D/g,'');
                    $scope.params.modal.gave.selected.total = '';
                }
                return
            }
        };

        //获取机构详情
        function getProjectDetails () {
            if (!$scope.params.page.periods) {
                var periods = '';
            } else {
                var index = $scope.params.page.periods.indexOf('期');
                var periods = $scope.params.page.periods.split('').slice(0,index).join('');
            }
            $http({
                method: 'GET',
                url: ConfigurationProduct.API + '/projectOrganization/getOrganizationInfoById.do',
                params: {
                    sso_token: ConfigurationProduct.token,
                    orgId: $routeParams.orgId,
                    periods: periods
                }
            })
                .success(function (res) {
                    if (res.status == 'S') {
                        $scope.params.page.total = res.data.organiztion.total;
                        $scope.params.page.projectManager = res.data.organiztion.projectManager;
                        $scope.params.page.preInstall = res.data.organiztion.preInstall;
                        $scope.params.page.installed = res.data.organiztion.installed;
                        $scope.params.page.configured = res.data.organiztion.configured;
                        $scope.params.page.checked = res.data.organiztion.checked;
                        $scope.params.page.delivered = res.data.organiztion.delivered;
                        $scope.params.page.stoped = res.data.organiztion.stoped;
                        $scope.params.page.closed = res.data.organiztion.closed;
                        $scope.params.page.softDeviceCount = res.data.organiztion.softDeviceCount;
                        $scope.params.page.hardDeviceCount = res.data.organiztion.hardDeviceCount;
                        $scope.params.page.transDeviceCount = res.data.organiztion.transDeviceCount;
                        $scope.params.page.allDeviceCount = res.data.organiztion.allDeviceCount;
                        $scope.params.page.printDeviceCount = res.data.organiztion.printDeviceCount;
                        $scope.params.page.allProcess = res.data.organiztion.allProcess;

                        $scope.params.page.periodsList = res.data.priodsList;
                        return;
                    }
                    if (res.status == "T") {
                        login();
                        return;
                    }
                    shadowShowText('提示',res.msg);
                    return;
                })
                .error(function () {
                    shadowShowText('提示',window.serveErr);
                });
        }
        //获取区域楼层
        function getAreaFloor () {
            $http({
                method: 'GET',
                url: ConfigurationProduct.API + '/shopEntityInfo/getAreaAndFloorByOrg.json',
                params: {
                    sso_token: ConfigurationProduct.token,
                    orgId: $routeParams.orgId
                }
            })
                .success(function (res) {
                    if (res.status == 'S') {
                        $scope.params.modal.shopInfo.data.floorDivision = angular.isArray(res.data.floorDivision) ? res.data.floorDivision : [];
                        $scope.params.modal.shopInfo.data.areaDivision = angular.isArray(res.data.areaDivision) ? res.data.areaDivision : [];
                        return;
                    }
                    if (res.status == "T") {
                        login();
                        return;
                    }
                    shadowShowText('提示',res.msg);
                    return;
                })
                .error(function () {
                    shadowShowText('提示',window.serveErr);
                });
        }
        //获取一二级业态
        function getShopType () {
            $http({
                method: 'GET',
                url: ConfigurationProduct.API + '/shopEntityInfo/getShopType.json',
                params: {
                    sso_token: ConfigurationProduct.token,
                    orgId: $routeParams.orgId
                }
            })
                .success(function (res) {
                    if (res.status == 'S') {
                        $scope.params.modal.shopInfo.data.shopTypesRoot = angular.isArray(res.data.shopTypes) ? listTree(res.data.shopTypes) : [];
                        return;
                    }
                    if (res.status == "T") {
                        login();
                        return;
                    }
                    shadowShowText('提示',res.msg);
                    return;
                })
                .error(function () {
                    shadowShowText('提示',window.serveErr);
                });
        }
        //根据选择的一级业态，获取二级业态
        $scope.getShopTypesLeaf = function () {
            if (!$scope.params.modal.shopInfo.selected.shopEntityTypeRoot) {
                $scope.params.modal.shopInfo.selected.shopEntityTypeLeaf = '';
                $scope.params.modal.shopInfo.data.shopTypesLeaf = [];
                return;
            }
            if ($scope.params.modal.shopInfo.data.shopTypesRoot.length > 0) {
                var count = $scope.params.modal.shopInfo.data.shopTypesRoot.length;
                for (var i = 0; i < count; i++) {
                    if ($scope.params.modal.shopInfo.data.shopTypesRoot[i].id == $scope.params.modal.shopInfo.selected.shopEntityTypeRoot) {
                        $scope.params.modal.shopInfo.data.shopTypesLeaf = $scope.params.modal.shopInfo.data.shopTypesRoot[i].children;
                        $scope.params.modal.shopInfo.selected.shopEntityTypeLeaf = '';
                        break;
                    } else {
                        $scope.params.modal.shopInfo.selected.shopEntityTypeLeaf = '';
                    }
                }
            }
        };

        getProjectDetails();
        getAreaFloor();
        getShopType();

        $scope.toobarEvent = {
            //查询
            search: function (type) {
                $scope.searchS = true;
                if (!$scope.params.page.periods) {
                    var periods = '';
                } else {
                    var index = $scope.params.page.periods.indexOf('期');
                    var periods = $scope.params.page.periods.split('').slice(0,index).join('');
                }
                $scope.params.page.process = type;
                if (!type) {
                    $('.tabar').children().removeClass('tabarClick');
                }
                var listNum = $("#projectTable").bootstrapTable('getData').length;
                var index = parseInt($("#projectTable").attr("pageIndex"));
                if (listNum > 0) {
                    $scope.projectTableConfig.search.params.orgId = $routeParams.orgId;
                    $scope.projectTableConfig.search.params.shopEntityName = $scope.params.page.shopEntityName;
                    $scope.projectTableConfig.search.params.periods = periods;
                    $scope.projectTableConfig.search.params.process = $scope.params.page.process;
                    $scope.projectTableConfig.search.params.mac = $scope.params.page.mac;
                    $scope.projectTableConfig.search.params.pageIndex = index;
                    $("#projectTable").bootstrapTable('selectPage', 1);//该方法第二参数必须是数字！！
                } else {
                    projectService.search({
                        search: {
                            callback: projectService.search,
                            url: ConfigurationProduct.API + '/shopEntityInfo/page.do',
                            method: 'GET',
                            params: {
                                sso_token: ConfigurationProduct.token,
                                pageIndex: 1,
                                pageSize: 20,
                                orgId: $routeParams.orgId,                          //机构名称
                                shopEntityName: $scope.params.page.shopEntityName,  //商铺名称
                                periods: periods,                                   //期别
                                process: $scope.params.page.process,                //实施进度
                                mac: $scope.params.page.mac                         //mac
                            }
                        }
                    });
                }
                getProjectDetails();
            },
            //新增
            add: function () {
                $scope.addOrEdit = 'add';
                $scope.params.modal.shopInfo = {
                    data: {
                        areaDivision: $scope.params.modal.shopInfo.data.areaDivision || [],
                        floorDivision: $scope.params.modal.shopInfo.data.floorDivision || [],
                        shopTypesRoot: $scope.params.modal.shopInfo.data.shopTypesRoot || [],
                        shopTypesLeaf: $scope.params.modal.shopInfo.data.shopTypesLeaf || [],
                    },
                    selected: {
                        addType: 'S',           //保存类型
                        id: '',                 //店铺id
                        shopEntityType: [],     //商户类型
                        shopId: $routeParams.orgId, //机构id
                        version: '',            //版本
                        storey: '',             //楼层
                        softMac: [''],          //软截MAC
                        redirectMac: [''],      //转发器MAC
                        hardwareMac: [''],      //硬件MAC
                        shopEntityTypeRoot: '', //一级业态
                        shopEntityTypeLeaf: '', //二级业态
                        shopEntityName: '',     //店铺名称
                        printModel: '',         //打印机型号
                        printInterface: '',     //电脑连接打印机接口
                        printCount: '',         //销售小票打印机数量
                        printBrand: '',         //打印机品牌
                        phone: '',              //店铺电话
                        periods: '',            //隶属分期
                        operateSystem: '',      //操作系统
                        openTime: '08:00',           //营业开门时间
                        closeTime: '22:00',          //营业关门时间
                        leasingResource: '',    //店铺号
                        isNormalPrint: '',      //是否正常打印小票
                        isExtranet: '',         //收银电脑外网连接情况
                        inAera: '',             //区域
                        count: '',              //数量
                        checkoutSoftName: '',   //收银软件名称
                        checkoutNum: '',        //收银机数量
                        contractArea: '',            //营业面积
                        isInstall: '',          //适合安装
                        numberId: '',           //营业执照号码
                        representative: '',     //法人代表
                        representativeCardId: '',//法人身份证
                        representativePhone: '',//联系电话
                        shopManager: '',        //店面负责人
                        shopManagerCardId: '',  //身份证
                        shopManagerPhone: '',   //联系电话
                        devPerson: '',          //发展人
                        devPhone: '',           //发展人电话
                        billhint: '',               //二维码上方文字
                        qrCodeLogoUrl: '',          //追打二维码
                        scanUrl: '',                //扫码链接
                        fileImage: '',              //上传图片暂存
                        marketingImage: '',         //追打图片
                        marketingCopywriter: ''     //追打固定文字
                    }
                };
                $("input[name='softMac']").val('');
                $("input[name='hardwareMac']").val('');
                $("input[name='redirectMac']").val('');

                $("input[name='print'][value='Y']").parent().click();
                $("input[name='pcNet'][value='Y']").parent().click();
            },
            //授权
            gave: function () {
                $scope.params.modal.gave.selected = {
                    deviceType: '1',        //设备类型 0:转发器，1:软采，2:硬件采集器
                    previous: 'AAAA',       //MAC前辍 MAC开头4个字符
                    useBy:  '1',            //设备用途 0:数据采集 1:发票专用
                    total: ''               //申领设备数 最小值 1,最大值 1000
                }
            },
            //mall稽核
            toMall: function () {
                window.open('http://mc' + window.gooagoodomain);
            },
            //数据图谱
            toData: function () {
                // http://pd.test.goago.cn/#/chain-related/机构名称/机构ID
               window.open('http://pd' + window.gooagoodomain + '/#/chain-related/' + $routeParams.name + '/' + $routeParams.orgId) ;
            }

        };

        //是否选择商户属性
        $scope.ischeckDuty = function (type) {
            var index = $scope.params.modal.shopInfo.selected.shopEntityType.indexOf(type);
            if (index == -1) {
                return false;
            }
            return true;
        };
        //选择商户属性
        $scope.selectDuty = function (type,ev) {
            var status = ev.target.checked;
            var index = $scope.params.modal.shopInfo.selected.shopEntityType.indexOf(type);
            if (status) {
                if (index == -1) {
                    $scope.params.modal.shopInfo.selected.shopEntityType.push(type);
                }
            } else {
                $scope.params.modal.shopInfo.selected.shopEntityType.splice(index,1);
            }
        };
        //添加mac
        $scope.addMac = function (type) {
            $scope.params.modal.shopInfo.selected[type].push('');
        };
        //删除mac
        $scope.delMac = function (type,i) {
            $scope.params.modal.shopInfo.selected[type].splice(i,1);
        };
        //填写mac值
        $scope.changeValue = function (type,i,ev) {
            $scope.params.modal.shopInfo.selected[type][i] = ev.target.value;
        };
        //商户信息保存
        $scope.shopInfoSave = function () {
            $scope.params.modal.shopInfo.selected.softMac = $scope.params.modal.shopInfo.selected.softMac.filter(function (item) {
                return item || ' ';
            });
            $scope.params.modal.shopInfo.selected.redirectMac = $scope.params.modal.shopInfo.selected.redirectMac.filter(function (item) {
                return item || ' ';
            });
            $scope.params.modal.shopInfo.selected.hardwareMac = $scope.params.modal.shopInfo.selected.hardwareMac.filter(function (item) {
                return item || ' ';
            });
            $scope.params.modal.shopInfo.selected.isNormalPrint = $("input[name='print']:checked").val();
            $scope.params.modal.shopInfo.selected.isExtranet = $("input[name='pcNet']:checked").val();

            if ($scope.params.modal.shopInfo.selected.periods) {
                var index = $scope.params.modal.shopInfo.selected.periods.indexOf('期');
                $scope.params.modal.shopInfo.selected.periods = $scope.params.modal.shopInfo.selected.periods.split('').slice(0,index).join('');
            } else {
                $scope.params.modal.shopInfo.selected.periods = '';
            }

            if ($scope.params.modal.shopInfo.selected.periods == 'undefined' || $scope.params.modal.shopInfo.selected.periods == 'undefine' || $scope.params.modal.shopInfo.selected.periods == 'undefin' || $scope.params.modal.shopInfo.selected.periods == 'undefi' || $scope.params.modal.shopInfo.selected.periods == 'undef' || $scope.params.modal.shopInfo.selected.periods == 'unde' || $scope.params.modal.shopInfo.selected.periods == 'und'  || $scope.params.modal.shopInfo.selected.periods == 'un' || $scope.params.modal.shopInfo.selected.periods == 'u') {
                $scope.params.modal.shopInfo.selected.periods = '';
            }

            if ($scope.params.modal.shopInfo.selected.shopEntityType.length == 0) {
                $scope.params.modal.shopInfo.selected.shopEntityType = '';
            }

            $http({
                method: 'POST',
                url: ConfigurationProduct.API + '/shopEntityInfo/addShopEntity.do',
                params: {
                    sso_token: ConfigurationProduct.token
                },
                data: $scope.params.modal.shopInfo.selected
            })
                .success(function (res) {
                    if (res.status == "T") {
                        login();
                        return;
                    }
                    if (res.status == 'S') {
                        $('.modal').modal('hide');
                        $scope.toobarEvent.search($scope.params.page.process);
                    }
                    shadowShowText('提示',res.msg);
                    return;
                })
                .error(function () {
                    shadowShowText('提示',window.serveErr);
                });
        };
        //申领授权保存
        $scope.gaveSave = function () {
            var editFrom = $('<form></form>');
            editFrom.attr("target", "");
            editFrom.attr("method", "get");
            editFrom.attr("action", ConfigurationProduct.API + '/device/apply.do?');
            editFrom.attr("style", "display:none");

            var sso_token = $('<input name="sso_token"/>');
            var shopId = $('<input name="shopId"/>');
            var deviceType = $('<input name="deviceType"/>');
            var previous = $('<input name="previous"/>');
            var useBy = $('<input name="useBy"/>');
            var total = $('<input name="total"/>');

            sso_token.attr("value", ConfigurationProduct.token);
            shopId.attr("value", $routeParams.orgId);
            deviceType.attr("value", $scope.params.modal.gave.selected.deviceType);
            previous.attr("value", $scope.params.modal.gave.selected.previous);
            useBy.attr("value", $scope.params.modal.gave.selected.useBy);
            total.attr("value", $scope.params.modal.gave.selected.total);


            editFrom.append(sso_token);
            editFrom.append(shopId);
            editFrom.append(deviceType);
            editFrom.append(previous);
            editFrom.append(useBy);
            editFrom.append(total);

            $("body").append(editFrom);
            editFrom.submit();
            editFrom.remove();
            /*$scope.toobarEvent.search($scope.params.page.process);
            getProjectDetails();*/
        };
        //查看可用设备
        $scope.checkDevice = function () {
            $scope.params.modal.deviceStatus = {
                data: {
                    macList: [
                        {
                            name: '软截MAC',
                            list: []//软截1
                        },
                        {
                            name: '硬件MAC',
                            list: []//硬件2
                        },
                        {
                            name: '转发器MAC',
                            list: []//转发器0
                        }
                    ]
                }
            };
            $scope.resmsg = '';
            $scope.isVirtual = 'Y';
            $http({
                method: 'GET',
                url: ConfigurationProduct.API + '/device/get-virtual-devices.json',
                params: {
                    sso_token: ConfigurationProduct.token,
                    shopId: $routeParams.orgId
                }
            })
                .success(function (res) {
                    if (res.status == 'S') {
                        var devices = angular.isArray(res.data.devices) ? res.data.devices : [];
                        if (devices.length != 0) {
                            devices.forEach(function (item,i) {
                                if (!item.printQRCodeType) {
                                    item.printQRCodeType = 'notPrint';
                                }
                                item.printQRCodeType += '';
                                if (item.deviceType == '1') {
                                    $scope.params.modal.deviceStatus.data.macList[0].list.push(item);
                                }
                                if (item.deviceType == '2') {
                                    $scope.params.modal.deviceStatus.data.macList[1].list.push(item);
                                }
                                if (item.deviceType == '0') {
                                    $scope.params.modal.deviceStatus.data.macList[2].list.push(item);
                                }
                            });
                        }
                        return;
                    }
                    if (res.status == "T") {
                        login();
                        return;
                    }
                    shadowShowText('提示',res.msg);
                })
                .error(function () {
                    shadowShowText('提示',window.serveErr);
                });
        };

        //表格事件
        //设备状态
        $scope.projectTableConfig.deviceStatus = {
            callback: function (params,row) {
                $scope.params.modal.deviceStatus = {
                    data: {
                        macList: [
                            {
                                name: '软截MAC',
                                list: []//软截1
                            },
                            {
                                name: '硬件MAC',
                                list: []//硬件2
                            },
                            {
                                name: '转发器MAC',
                                list: []//转发器0
                            }
                        ]
                    }
                };

                $scope.resmsg = '';
                $scope.isVirtual = row.isVirtual;

                $http({
                    method: 'GET',
                    url: ConfigurationProduct.API + '/device/devices.json',
                    params: {
                        sso_token: ConfigurationProduct.token,
                        shopEntityId: row.id
                    }
                })
                    .success(function (res) {
                        if (res.status == 'S') {
                            var devices = angular.isArray(res.data.devices) ? res.data.devices : [];
                            if (devices.length != 0) {
                                devices.forEach(function (item,i) {
                                    if (!item.printQRCodeType) {
                                        item.printQRCodeType = 'notPrint';
                                    }
                                    item.printQRCodeType += '';
                                    if (item.deviceType == '1') {
                                        $scope.params.modal.deviceStatus.data.macList[0].list.push(item);
                                    }
                                    if (item.deviceType == '2') {
                                        $scope.params.modal.deviceStatus.data.macList[1].list.push(item);
                                    }
                                    if (item.deviceType == '0') {
                                        $scope.params.modal.deviceStatus.data.macList[2].list.push(item);
                                    }
                                });
                            }
                            return;
                        }
                        if (res.status == "T") {
                            login();
                            return;
                        }
                        shadowShowText('提示',res.msg);
                    })
                    .error(function () {
                        shadowShowText('提示',window.serveErr);
                    });
            }
        };
        //改变设备状态
        $scope.changeDeviceStatus = function (id,printCode,status) {
            $scope.resmsg = '';
            $http({
                method: 'GET',
                url: ConfigurationProduct.API + '/device/update-device-status.do',
                params: {
                    sso_token: ConfigurationProduct.token,
                    status: status,
                    printQRCodeType: printCode,
                    mac: id
                }
            })
                .success(function (res) {
                    if (res.status == "T") {
                        login();
                        return;
                    }
                    if (res.status == "S") {
                        getProjectDetails();
                    }

                    $scope.resmsg = '设备' + id + res.msg;
                })
                .error(function () {
                    shadowShowText('提示',window.serveErr);
                });
        };
        //监控平台
        $scope.projectTableConfig.match = {
            callback: function (params,row) {
                var url = 'http://match' + window.gooagoodomain + '/#/device-state/' + $routeParams.orgId + '/' + $routeParams.name + '/' +  row.shopEntityName;
                window.open(encodeURI(url));
                //window.open(url);
            }
        };
        //设置备注
        $scope.projectTableConfig.setMarks = {
            callback: function (params,row) {
                $scope.$apply(function () {
                    $scope.params.modal.setMarks = {
                        selected: {
                            problemType: '',
                            problemText: '',
                            shopEntityId: '',
                            process: ''
                        }
                    };
                    $scope.params.modal.markHistory = {
                        marks: []
                    };
                    $scope.params.modal.setMarks.selected.problemType = 'Normal';
                    /*if (!row.shopEntityMark) {
                        $scope.params.modal.setMarks.selected.problemType = 'Normal';
                    } else {
                        $scope.params.modal.setMarks.selected.problemType = row.shopEntityMark.problemType;
                    }*/
                    $scope.params.modal.setMarks.selected.shopEntityId = row.id;
                    $scope.params.modal.setMarks.selected.process = row.process || '';
                    /*if ($scope.params.modal.setMarks.selected.process == 'ConfiguredDevice' && !row.shopEntityMark) {
                        $scope.params.modal.setMarks.selected.problemType = 'Normal';
                    }*/
                    $http({
                        method: 'GET',
                        url: ConfigurationProduct.API + '/shop-entity/get-marks.json',
                        params: {
                            sso_token: ConfigurationProduct.token,
                            shopEntityId: row.id,
                        }
                    })
                        .success(function (res) {
                            if (res.status == "T") {
                                login();
                                return;
                            }
                            if (res.status == 'S') {
                                $scope.params.modal.markHistory.marks = angular.isArray(res.data.marks) ? res.data.marks : [];
                                $scope.params.modal.markHistory.marks.forEach(function (item) {
                                    switch (item.process) {
                                        case 'UnInstallDevice' : item.process = '待安装';break;
                                        case 'InstalledDevice' : item.process = '已安装';break;
                                        case 'ConfiguredDevice' : item.process = '已配置';break;
                                        case 'Checked' : item.process = '已核对';break;
                                        case 'Serving' : item.process = '已交付';break;
                                        case 'Stoped' : item.process = '已停用';break;
                                        case 'Exited' : item.process = '已撤店';break;
                                        default : item.process = '';
                                    }
                                });
                                return;
                            }
                            shadowShowText('提示',res.msg);
                            return;
                        })
                        .error(function () {
                            shadowShowText('提示',window.serveErr);
                        });
                });
            }
        };
        //保存备注
        $scope.saveMark = function () {
            var problemType = '';
            if ($scope.params.modal.setMarks.selected.process != 'ConfiguredDevice') {
                problemType = 'Other';
            } else {
                problemType = $scope.params.modal.setMarks.selected.problemType;
            }
            $http({
                method: 'POST',
                url: ConfigurationProduct.API + '/shop-entity/mark.do',
                data: {
                    sso_token: ConfigurationProduct.token,
                    shopEntityId: $scope.params.modal.setMarks.selected.shopEntityId,
                    problemType: problemType,
                    process: $scope.params.modal.setMarks.selected.process,
                    problemText: $scope.params.modal.setMarks.selected.problemText,
                }
            })
                .success(function (res) {
                    if (res.status == "T") {
                        login();
                        return;
                    }
                    if (res.status == 'S') {
                        $('#setMarks').modal('hide');
                        $scope.toobarEvent.search($scope.params.page.process);
                    }
                    shadowShowText('提示',res.msg);
                    return;
                })
                .error(function () {
                    shadowShowText('提示',window.serveErr);
                });
        };
        //编辑
        $scope.projectTableConfig.edit = {
            callback: function (params,row) {
                $scope.addOrEdit = 'edit';
                $scope.params.modal.shopInfo = {
                    data: {
                        areaDivision: $scope.params.modal.shopInfo.data.areaDivision || [],
                        floorDivision: $scope.params.modal.shopInfo.data.floorDivision || [],
                        shopTypesRoot: $scope.params.modal.shopInfo.data.shopTypesRoot || [],
                        shopTypesLeaf: $scope.params.modal.shopInfo.data.shopTypesLeaf || [],
                    },
                    selected: {
                        shopEntityType: [],     //商户类型
                        version: '',            //版本
                        storey: '',             //楼层
                        softMac: [' '],          //软截MAC
                        redirectMac: [' '],      //转发器MAC
                        hardwareMac: [' '],      //硬件MAC
                        shopEntityTypeRoot: '', //一级业态
                        shopEntityTypeLeaf: '', //二级业态
                        shopEntityName: '',     //店铺名称
                        printModel: '',         //打印机型号
                        printInterface: '',     //电脑连接打印机接口
                        printCount: '',         //销售小票打印机数量
                        printBrand: '',         //打印机品牌
                        phone: '',              //店铺电话
                        periods: '',            //隶属分期
                        operateSystem: '',      //操作系统
                        openTime: '',           //营业开门时间
                        leasingResource: '',    //店铺号
                        isNormalPrint: 'Y',      //是否正常打印小票
                        isExtranet: 'Y',         //收银电脑外网连接情况
                        inAera: '',             //区域
                        count: '',              //数量
                        closeTime: '',          //营业关门时间
                        checkoutSoftName: '',   //收银软件名称
                        checkoutNum: '',        //收银机数量
                        contractArea: '',            //营业面积
                        isInstall: '',          //适合安装
                        numberId: '',           //营业执照号码
                        representative: '',     //法人代表
                        representativeCardId: '',//法人身份证
                        representativePhone: '',//联系电话
                        shopManager: '',        //店面负责人
                        shopManagerCardId: '',  //身份证
                        shopManagerPhone: '',   //联系电话
                        devPerson: '',          //发展人
                        devPhone: '',           //发展人电话
                        billhint: '',               //二维码上方文字
                        qrCodeLogoUrl: '',          //追打二维码
                        scanUrl: '',                //扫码链接
                        fileImage: '',              //上传图片暂存
                        marketingImage: '',         //追打图片
                        marketingCopywriter: ''     //追打固定文字
                    }
                };
                $("input[name='softMac']").val('');
                $("input[name='hardwareMac']").val('');
                $("input[name='redirectMac']").val('');

                $("input[name='print'][value='Y']").parent().click();
                $("input[name='pcNet'][value='Y']").parent().click();

                function getShopEntityInfo () {
                    $http({
                        method: 'GET',
                        url: ConfigurationProduct.API + '/shopEntityInfo/findShopEntityById.do',
                        params: {
                            sso_token: ConfigurationProduct.token,
                            id: row.id
                        }
                    })
                        .success(function (res) {
                            if (res.status == 'S') {
                                $scope.params.modal.shopInfo.selected = res.data.page;
                                $scope.params.modal.shopInfo.selected.shopEntityType = res.data.page.shopEntityType ? res.data.page.shopEntityType : [];
                                $scope.params.modal.shopInfo.selected.addType = 'E';


                                $scope.params.modal.shopInfo.selected.periods = $scope.params.modal.shopInfo.selected.periods ? $scope.params.modal.shopInfo.selected.periods + '期' : '';
                                $scope.params.modal.shopInfo.selected.id = row.id;
                                $scope.params.modal.shopInfo.selected.shopId = $routeParams.orgId;
                                if (!$scope.params.modal.shopInfo.selected.softMac || $scope.params.modal.shopInfo.selected.softMac.length == 0) {
                                    $scope.params.modal.shopInfo.selected.softMac = [''];
                                }
                                if (!$scope.params.modal.shopInfo.selected.redirectMac || $scope.params.modal.shopInfo.selected.redirectMac.length == 0) {
                                    $scope.params.modal.shopInfo.selected.redirectMac = [''];
                                }
                                if (!$scope.params.modal.shopInfo.selected.hardwareMac || $scope.params.modal.shopInfo.selected.hardwareMac.length == 0) {
                                    $scope.params.modal.shopInfo.selected.hardwareMac = [''];
                                }
                                if($scope.params.modal.shopInfo.selected.isNormalPrint == 'N'){
                                    $("input[name='print'][value='N']").parent().click();
                                }
                                if($scope.params.modal.shopInfo.selected.isExtranet == 'N'){
                                    $("input[name='pcNet'][value='N']").parent().click();
                                }

                                var shopEntityTypeLeaf = $scope.params.modal.shopInfo.selected.shopEntityTypeLeaf;

                                if ($scope.params.modal.shopInfo.data.shopTypesRoot.length > 0) {
                                    var count = $scope.params.modal.shopInfo.data.shopTypesRoot.length;
                                    for (var i = 0; i < count; i++) {
                                        if ($scope.params.modal.shopInfo.data.shopTypesRoot[i].id == $scope.params.modal.shopInfo.selected.shopEntityTypeRoot) {
                                            $scope.params.modal.shopInfo.data.shopTypesLeaf = $scope.params.modal.shopInfo.data.shopTypesRoot[i].children;
                                            $scope.params.modal.shopInfo.selected.shopEntityTypeLeaf = shopEntityTypeLeaf;
                                            break;
                                        } else {
                                            $scope.params.modal.shopInfo.selected.shopEntityTypeLeaf = '';
                                        }
                                    }
                                }

                                return;
                            }
                            if (res.status == "T") {
                                login();
                                return;
                            }
                            shadowShowText('提示',res.msg);
                            return;
                        })
                        .error(function () {
                            shadowShowText('提示',window.serveErr);
                        });
                }
                getShopEntityInfo();
            }
        };
        //修改商家状态
        $scope.projectTableConfig.changeShopProcess = {
            callback: function (params, row) {
                $http({
                    method: 'POST',
                    url: ConfigurationProduct.API + '/shop-entity/update-process.do',
                    data: {
                        sso_token: ConfigurationProduct.token,
                        shopEntityId: row.id,
                        process: $('#shopProcess' + row.id).val()
                    }
                })
                    .success(function (res) {
                        if (res.status == "T") {
                            login();
                            return;
                        }
                        if (res.status == "F") {
                            $('#shopProcess' + row.id).val(row.process);
                        }
                        $scope.toobarEvent.search($scope.params.page.process);
                        shadowShowText('提示',res.msg);
                    })
                    .error(function () {
                        shadowShowText('提示',window.serveErr);
                    });
            }
        };
        //图片上传
        $scope.imgUpload = function (type) {
            if (type == 'qrCodeLogoUrl') {
                if($scope.params.modal.shopInfo.selected.fileImage.name.indexOf('.bmp') > -1 || $scope.params.modal.shopInfo.selected.fileImage.name.indexOf('.BMP') > -1){
                    var img = new Image();
                    var reader = new FileReader();
                    reader.readAsDataURL($scope.params.modal.shopInfo.selected.fileImage);
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

                if ($scope.params.modal.shopInfo.selected.fileImage.name.indexOf('.jpg') > -1 || $scope.params.modal.shopInfo.selected.fileImage.name.indexOf('.jpeg') > -1 || $scope.params.modal.shopInfo.selected.fileImage.name.indexOf('.png') > -1 || $scope.params.modal.shopInfo.selected.fileImage.name.indexOf('.bmp') > -1  || $scope.params.modal.shopInfo.selected.fileImage.name.indexOf('.JPG') > -1 || $scope.params.modal.shopInfo.selected.fileImage.name.indexOf('.JPEG') > -1  ||$scope.params.modal.shopInfo.selected.fileImage.name.indexOf('.PNG') > -1 || $scope.params.modal.shopInfo.selected.fileImage.name.indexOf('.BMP') > -1) {
                    var size = parseInt(parseInt($scope.params.modal.shopInfo.selected.fileImage.size) / 1024);
                    if(size > 500){
                        shadowShowText("提示", "文件大小超过500k");
                        return;
                    }
                    var reader = new FileReader();
                    reader.readAsDataURL($scope.params.modal.shopInfo.selected.fileImage);
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
                        $scope.params.modal.shopInfo.selected[type] = res.data.imgUrl;
                        return;
                    }
                    shadowShowText('提示',res.msg);
                })
                .error(function () {
                    shadowShowText('提示',window.serveErr);
                });
        };
        //删除图片
        $scope.removeImg = function (type) {
            $scope.params.modal.shopInfo.selected[type] = '';
        };

        //导入
        $scope.fileShopEntity = "";

        $scope.importSuccess = false;

        $scope.importStart = false;

        $scope.importProgress = 0;

        $scope.importSuccessInfo = "导入成功";

        $scope.timerOne = "";

        $scope.timerTwo = "";

        $scope.importModal = function() {
            $scope.fileShopEntity = "";
            $scope.importSuccess = false;
            $scope.importStart = false;
            $scope.iimportProgress = 0;
            $("#importError").html("");
            $scope.fileUpdate = "";
            $("#pathShopEntity").val("");
            $scope.timerOne = "";
            $scope.timerTwo = "";

            $scope.downLoadDemo = function (type) {
                $http({
                    method: 'GET',
                    url: ConfigurationProduct.API + '/shopEntityInfo/downLoadDemo.do',
                    params: {
                        sso_token: ConfigurationProduct.token,
                        type: type
                    }
                })
                .success(function (res) {
                    if (res.status == 'S') {
                        window.open(res.data.downLoad);
                        return;
                    }
                    if (res.status == "T") {
                        login();
                        return;
                    }
                    shadowShowText('提示',res.msg);
                })
                .error(function () {
                    shadowShowText('提示',window.serveErr);
                });
            };
        };

        $scope.importUpdate = function(type) {

            $scope.importSuccess = false;
            $scope.importStart = false;
            $scope.importProgress = 0;
            $("#importError").html("");

            if ($scope.fileShopEntity != null && $scope.fileShopEntity != "") {

                var size = parseInt(parseInt($scope.fileShopEntity.size) / 1024);

                if (size <= 1024) {

                    if ($scope.fileShopEntity.name.indexOf('.xls') > -1) {
                        $scope.importStart = true;
                        $scope.timerOne = $timeout(function() {
                            $scope.importProgress = 40;
                        }, 500);

                        $scope.timerOne.then(function() {
                            $scope.timerTwo = $timeout(function() {
                                $scope.importProgress = 70;
                            }, 500);
                        });

                        $scope.upload($scope.fileShopEntity, ConfigurationProduct.API +
                            '/shopEntityInfo/uploadShopEntityInfo.do?sso_token=' + ConfigurationProduct.token + '&type=' + type + '&orgId=' + $routeParams.orgId);

                    } else {

                        $scope.importStart = false;
                        $scope.importSuccess = false;
                        $("#importError").html("<div style='color:red;' >文件格式不支持，请上传 xls|xlsx 格式的文件</div>");

                    }
                } else {

                    $scope.importStart = false;
                    $scope.importSuccess = false;
                    $("#importError").html("<div style='color:red;' >文件：" + $("#pathShopEntity").val() + "超过1M.</div>");
                }
            } else {

                $scope.importStart = false;
                $scope.importSuccess = false;
                $("#importError").html("<div style='color:red;' >请先选择导入文件.</div>");
                $("#pathShopEntity").val("");
            }
        };
        $scope.upload = function(file, url) {

            Upload.upload({
                url: url,
                data: { file: file }
            }).then(function(response) {

                if (response.data.status == "T") {
                    login();
                    return;
                }

                if (response.data.status == "S") {
                    $scope.importSuccess = true;
                    $timeout.cancel($scope.timerOne);
                    $timeout.cancel($scope.timerTwo);
                    $scope.importProgress = 100;
                    $scope.importSuccessInfo = response.data.msg.replace("<br/>", "");
                    shadowShowText('提示', response.data.msg);
                    $scope.toobarEvent.search($scope.params.page.process);

                } else if (response.data.status == "F") {

                    $scope.importStart = false;
                    $scope.importSuccess = false;
                    $timeout.cancel($scope.timerOne);
                    $timeout.cancel($scope.timerTwo);
                    var messages = JSON.parse(response.data.msg);
                    var html = "";
                    $.each(messages, function(i, value) {
                        html = html + "<div style='color:red;' >" + messages[i] + "</div>";
                    });
                    $("#importError").html(html);
                }

            });
        };
        //导出
        $scope.exportShopEntityInfo = function(type) {
            if (!$scope.params.page.periods) {
                var periods = '';
            } else {
                var index = $scope.params.page.periods.indexOf('期');
                var periods = $scope.params.page.periods.split('').slice(0,index).join('');
            }
            $http({
                method: 'GET',
                url: ConfigurationProduct.API + '/shopEntityInfo/exportShopEntityInfo.do?sso_token=' + ConfigurationProduct.token,
                params: {
                    shopEntityName: $scope.params.page.shopEntityName,
                    periods: periods,
                    orgId: $routeParams.orgId,
                    type: type,
                    process: $scope.params.page.process
                }
            }).success(function(res) {
                if (res.status == "T") {
                    login();
                    return;
                }
                if (res.status == "S") {
                    window.open(res.data.downLoadPath);
                    shadowShowText("提示", res.msg);
                } else if (res.status == "F"){
                    shadowShowText("提示", res.msg);
                }
            });

        };
        //跳转配置
        $scope.projectTableConfig.configLink = {
            callback: function (params,row) {
                var link = 'http://admin.rps' + window.gooagoodomain + '/index/config.html#/headfoot/' + $routeParams.name + '/' + $routeParams.orgId + '/' + row.shopEntityName + '/' + row.shopEntityId + '/';
                window.open(encodeURI(link));
            }
        };
        //表格数据配置
        $scope.projectControl = {
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
                    width: '4%',
                    formatter: function(value, row, index) {
                        var pageIndex = $("#projectTable").attr("pageIndex");
                        return (pageIndex - 1) * 20 + index + 1;
                    },
                }, {
                    field: 'shopEntityName',
                    title: '商户名称',
                    align: 'left',
                    valign: 'middle',
                    sortable: false,
                    width: '18%',
                }, {
                    field: 'cTimeStamp',
                    title: '更新时间',
                    align: 'left',
                    valign: 'middle',
                    width: '15%',
                    sortable: false,
                    formatter: function (value,row) {
                        if (row.isVirtual == 'Y') {
                            return '';
                        }
                        return formatDate(value, "yyyy-MM-dd HH:mm:ss");
                    }
                }, {
                    field: 'updater',
                    title: '更新人',
                    align: 'left',
                    valign: 'middle',
                    width: '10%',
                    sortable: false
                }, {
                    field: 'preProcess',
                    title: '',
                    align: 'left',
                    valign: 'middle',
                    width: '5%',
                    sortable: false,
                    formatter: function (value) {
                        var res = '';
                        switch (value) {
                            case "UnInstallDevice" : res = '待安装';break;
                            case 'InstalledDevice' : res = '已安装';break;
                            case 'ConfiguredDevice' : res = '已配置';break;
                            // case 'Checked' : res = '已核对';break;
                            case 'Serving' : res = '已交付';break;
                            case 'Stoped' : res = '已停用';break;
                            case 'Exited' : res = '已撤店';break;
                            default : res = '';
                        }
                        return res;
                    }
                }, {
                    field: '',
                    title: '状态变更',
                    align: 'left',
                    valign: 'middle',
                    width: '6%',
                    sortable: false,
                    formatter: function (value) {
                        return '<div style="text-align: center">'+
                                    '→'+
                                '</div>'    ;
                    }
                }, {
                    field: 'process',
                    title: '',
                    align: 'left',
                    valign: 'middle',
                    width: '5%',
                    sortable: false,
                    formatter: function (value) {
                        var res = '';
                        switch (value) {
                            case 'UnInstallDevice' : res = '待安装';break;
                            case 'InstalledDevice' : res = '已安装';break;
                            case 'ConfiguredDevice' : res = '已配置';break;
                            // case 'Checked' : res = '已核对';break;
                            case 'Serving' : res = '已交付';break;
                            case 'Stoped' : res = '已停用';break;
                            case 'Exited' : res = '已撤店';break;
                            default : res = '';
                        }
                        return res;
                    }
                }, {
                    field: 'deviceDetailList',
                    title: '设备情况',
                    align: 'left',
                    valign: 'middle',
                    width: '11%',
                    sortable: false,
                    formatter: function (value,row) {
                        if (!value || row.isVirtual == 'Y') {
                            return '';
                        }
                        var str = '';
                        value.forEach(function (item,i) {
                            str += '<div>' + item.id + '</div>';
                        });
                        return str;
                    }
                }, {
                    field: 'deviceDetailList',
                    title: '',
                    align: 'left',
                    valign: 'middle',
                    width: '3%',
                    sortable: false,
                    formatter: function (value,row) {
                        var str =
                            '<div>'+
                                ' <i class="glyphicon glyphicon-info-sign pointer" data-rowid="' + row.id + '" data-toggle="modal" data-target="#setting" title="设备状态"></i> '+
                            '</div>';
                        return str;
                    }
                }, {
                    field: 'process',
                    title: '商户状态',
                    align: 'left',
                    valign: 'middle',
                    width: '9%',
                    sortable: false,
                    formatter: function (val,row) {
                        if (!val) {
                            return '';
                        }
                        var disabled = '';
                        if (!$scope.authority[4] || row.isVirtual == 'Y') {
                            disabled = "disabled = true";
                        }
                        var str =
                            '<select class="form-control shopProcess" id="shopProcess'+ row.id +'" style="width: 100%" ' + disabled + ' data-rowid="'+row.id+'" >'+
                                '<option value="">请选择</option>'+
                                '<option value="UnInstallDevice">待安装</option>'+
                                '<option value="InstalledDevice">已安装</option>'+
                                '<option value="ConfiguredDevice">已配置</option>'+
                                // '<option value="Checked">已核对</option>'+
                                '<option value="Serving">已交付</option>'+
                                '<option value="Stoped">已停用</option>'+
                                '<option value="Exited">已撤店</option>'+
                            '</select>';
                        setTimeout(function () {
                            $('#shopProcess' + row.id).find("option[value = " + val + "]").attr('selected', true);
                        },0);

                        return str;
                    }
                }, {
                    field: 'shopEntityMark',
                    title: '商户备注',
                    align: 'left',
                    valign: 'middle',
                    width: '6%',
                    sortable: false,
                    formatter: function (val,row) {
                        return  '<div>'+
                                    ' <i class="glyphicon glyphicon-tags pointer" style="padding-left: 12px;" data-rowid="' + row.id + '" data-toggle="modal" data-target="#setMarks" title="设置备注"></i> '+
                                '</div>';
                    }
                }, {
                    field: '',
                    title: '操作',
                    align: 'left',
                    valign: 'middle',
                    width: '8%',
                    sortable: false,
                    formatter: function (value, row, index) {
                        var str = "";
                        if ($scope.authority['10']) {

                            str += ' <i class="glyphicon glyphicon-compressed pointer" data-rowid="' + row.id + '" title="配置"></i> '
                        }
                        if ($scope.authority['18']) {
                            str += ' <i class="glyphicon glyphicon-facetime-video pointer" data-rowid="' + row.id + '" title="监测"></i> '
                        }
                        if ($scope.authority['8']) {
                            str += ' <i class="glyphicon glyphicon-pencil pointer" data-rowid="' + row.id + '" data-toggle="modal" data-target="#prodShopInfo" title="编辑"></i>'

                        }
                        if (row.isVirtual == 'Y') {
                            str = '';
                        }
                        return str;
                    }
                }]

            }
        };
    })
}]);
