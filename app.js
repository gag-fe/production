'use strict';

/**
 * @ngdoc overview
 * @name newappApp
 * @description
 * # newappApp
 *
 * Main module of the application.
 */
if (window.location.origin.indexOf('gooagoo.com') > 0) {
    window.gooagoodomain = '.gooagoo.com';
} else if (window.location.origin.indexOf('test.goago.cn') > 0) {
    window.gooagoodomain = '.test.goago.cn';
} else if (window.location.origin.indexOf('pressure.goago.cn') > 0) {
    window.gooagoodomain = '.pressure.goago.cn';
} else {
    window.gooagoodomain = '.dev.goago.cn';
}
window.copyright = new Date().getFullYear();
window.serveErr = '系统服务异常';
var MakeApp = angular
    .module('newApp', [
        'ngAnimate',
        'ngCookies',
        'ngResource',
        'ngRoute',
        'ngSanitize',
        'ngTouch',
        'ui.bootstrap',
        'bsTable',
        'treeGrid',
        'ngFileUpload',
        'jsTree.directive',
        'angular-loading-bar',
        'cfp.loadingBar',
        'ui.select'
    ])
    .config(function($routeProvider, $httpProvider) {
        $httpProvider.defaults.headers.put['Content-Type'] = 'application/x-www-form-urlencoded';
        $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
        $httpProvider.defaults.transformRequest = [function(data) {
            var param = function(obj) {
                var query = '';
                var name, value, fullSubName, subName, subValue, innerObj, i;
                for (name in obj) {
                    value = obj[name];

                    if (value instanceof Array) {
                        for (i = 0; i < value.length; ++i) {
                            subValue = value[i];
                            fullSubName = name;
                            innerObj = {};
                            innerObj[fullSubName] = subValue;
                            query += param(innerObj) + '&';
                        }
                    } else if (value instanceof Object) {
                        for (subName in value) {
                            subValue = value[subName];
                            fullSubName = name + '[' + subName + ']';
                            innerObj = {};
                            innerObj[fullSubName] = subValue;
                            query += param(innerObj) + '&';
                        }
                    } else if (value !== undefined && value !== null) {
                        query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
                    }
                }
                return query.length ? query.substr(0, query.length - 1) : query;
            };
            return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
        }];
        $routeProvider
            .when('/', {
                templateUrl: './app/dashboard/dashboard.html',
                controller: 'dashboardCtrl'
                    // caseInsensitiveMatch: true,
                    // resolve: {
                    //     permission: function (applicationService, $route) {
                    //         return applicationService.authorizationService().permissionCheck(['admin']);
                    //     }
                    // }
            })
            .when('/prod-platform', {
                templateUrl: './app/prodPlatform/prodIndex/prod.html',
                controller: 'prodCtrl'/*,
                caseInsensitiveMatch: true,
                resolve: {
                    permission: function(applicationService, $route) {
                      return applicationService.authorizationService().permissionCheck('pro_1101');
                    }
                }*/
            })
            .when('/contract/:orgId/:name', {
                templateUrl: './app/prodPlatform/contractIndex/contractIndex.html',
                controller: 'contractCtrl'/*,
                caseInsensitiveMatch: true,
                resolve: {
                    permission: function(applicationService, $route) {
                        return applicationService.authorizationService().permissionCheck('pro_11');
                    }
                }*/
            })
            .when('/projectDetails/:orgId/:name', {
                templateUrl: './app/prodPlatform/projectDetails/projectDetailIndex.html',
                controller: 'projectCtrl'/*,
                caseInsensitiveMatch: true,
                resolve: {
                    permission: function(applicationService, $route) {
                        return applicationService.authorizationService().permissionCheck('pro_11');
                    }
                }*/
            })
            .when('/task', {
                templateUrl: './app/prodPlatform/task/task.html',
                controller: 'taskCtrl'/*,
                caseInsensitiveMatch: true,
                resolve: {
                    permission: function(applicationService, $route) {
                        return applicationService.authorizationService().permissionCheck('pro_1001');
                    }
                }*/
            })

        // .when('/system-log', {
        //     templateUrl: './app/operationRecord/systemLog/system-log.html',
        //     controller: 'systemLogCtrl',
        //     caseInsensitiveMatch: true,
        //     resolve: {
        //         permission: function (applicationService, $route) {
        //             return applicationService.authorizationService().permissionCheck('1501');
        //         }
        //     }
        // })
        // .when('/consume-log', {
        //     templateUrl: './app/operationRecord/consumeLog/consume-log.html',
        //     controller: 'consumeLogCtrl',
        //     caseInsensitiveMatch: true,
        //     resolve: {
        //         permission: function (applicationService, $route) {
        //             return applicationService.authorizationService().permissionCheck('1502');
        //         }
        //     }
        // })
        .otherwise({
            redirectTo: '/'
        });

        $httpProvider.interceptors.push('timestampMarker');
    }).service('Configuration', function() {
        var path = '',newPath = '',latestPath = '',passportPath = '';
        if (window.location.host.match(/lvh\.me/)) {
            path = 'http://misi' + window.gooagoodomain;
            newPath = 'http://as' + window.gooagoodomain;
            passportPath = 'https://passport' + gooagoodomain;
            latestPath = 'http://aas' + window.gooagoodomain;//http://aas.dev.goago.cn/<zgw-2017-0324>

        } else {
            path = 'http://misi' + window.gooagoodomain;
            newPath = 'http://as' + window.gooagoodomain;
            passportPath = 'https://passport' + gooagoodomain;
            latestPath = 'http://aas' + window.gooagoodomain;//http://aas.dev.goago.cn/<zgw-2017-0324>
        }
        var service = {
            API: path,
            //API: 'http://192.168.9.133:8080',
            newAPI: newPath,
            latestAPI:latestPath,
            passportAPI: passportPath,
            token: $.cookie('com.gooagoo.passpart.sso.token.name')
        }
        return service;
    }).service('ConfigurationPassport', function() {
        var path = 'http://passport' + window.gooagoodomain;
        var service = {
            API: path,
            token: $.cookie('com.gooagoo.passpart.sso.token.name')
        };
        return service;
    })
    .service('ConfigurationProduct', function() {
        var path = 'http://product' + window.gooagoodomain;
        //var path = 'http://localhost:8888';
        //var path = 'http://192.168.101.101:8080';
        var service = {
            API: path,
            token: $.cookie('com.gooagoo.passpart.sso.token.name')
        };
        return service;
    })
    .service('ConfigurationPmis', function() {
        var path = '';
        if (window.location.host.match(/lvh\.me/)) {
            path = 'http://pmis' + window.gooagoodomain;
        } else {
            path = 'http://pmis' + window.gooagoodomain;
        }
        var service = {
            API: path,
            token: $.cookie('com.gooagoo.passpart.sso.token.name')
        }
        return service;
    })
    .service('ConfigurationQmis', function() {
        var path = '';
        if (window.location.host.match(/lvh\.me/)) {
            path = 'http://qmis' + window.gooagoodomain;
        } else {
            path = 'http://qmis' + window.gooagoodomain;

        }
        var service = {
            API: path,
            token: $.cookie('com.gooagoo.passpart.sso.token.name')
        }
        return service;
    })
    .service('ConfigurationWxmis', function() {
        var path = '';
        if (window.location.host.match(/lvh\.me/)) {
            path = 'http://wxmis' + window.gooagoodomain;
        } else {
            path = 'http://wxmis' + window.gooagoodomain;

        }
        var service = {
            API: path,
            token: $.cookie('com.gooagoo.passpart.sso.token.name')
        }
        return service;
    })
    .service('ConfigurationImis', function() {
        var path = '';
        if (window.location.host.match(/lvh\.me/)) {
            path = 'http://imis' + window.gooagoodomain;
        } else {
            path = 'http://imis' + window.gooagoodomain;
        }
        var service = {
            API: path,
            token: $.cookie('com.gooagoo.passpart.sso.token.name')
        }
        return service;
    });


// Route State Load Spinner(used on page or content load)
MakeApp.directive('ngSpinnerLoader', ['$rootScope',
    function($rootScope) {
        return {
            link: function(scope, element, attrs) {
                // by defult hide the spinner bar
                element.addClass('hide'); // hide spinner bar by default
                // display the spinner bar whenever the route changes(the content part started loading)
                $rootScope.$on('$routeChangeStart', function() {
                    element.removeClass('hide'); // show spinner bar
                });
                // hide the spinner bar on rounte change success(after the content loaded)
                $rootScope.$on('$routeChangeSuccess', function() {
                    setTimeout(function() {
                        element.addClass('hide'); // hide spinner bar
                    }, 500);
                    $("html, body").animate({
                        scrollTop: 0
                    }, 500);
                });
            }
        };
    }
])
MakeApp.factory('timestampMarker', ["$rootScope", function($rootScope) {
    var timestampMarker = {
        request: function(config) {
            $rootScope.loading = true;
            config.requestTimestamp = new Date().getTime();
            return config;
        },
        response: function(response) {
            // $rootScope.loading = false;
            response.config.responseTimestamp = new Date().getTime();
            return response;
        }
    };
    return timestampMarker;
}]);
