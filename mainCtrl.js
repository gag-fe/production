angular.module('newApp').controller('mainCtrl', ['$scope', '$http', 'applicationService', 'quickViewService', 'builderService', 'pluginsService', '$location', 'Configuration','ConfigurationPassport', '$routeParams',
    function($scope, $http, applicationService, quickViewService, builderService, pluginsService, $location, Configuration, ConfigurationPassport,$routeParams) {
        $(document).ready(function() {
            applicationService.authorizationService().checkLogin();
            applicationService.init();
            quickViewService.init();
            builderService.init();
            pluginsService.init();
            Dropzone.autoDiscover = false;
        });

        $scope.$on('$viewContentLoaded', function() {
            if ($('.tipContent')) {
                $('.tipContent').remove();
            }
            $scope.domaingooagoo = window.gooagoodomain;
            $scope.copyright = window.copyright;
            $scope.logoutSystem = function(argument) {
                $http({
                    url: 'https://passport' + window.gooagoodomain + '/logout.do',
                    method: 'GET',
                    params: {
                        token: Configuration.token
                    }
                }).success(function(back) {
                    if (back.status == 'OK') {
                        login('out');
                        return;
                    } else if (back.status == 'timeout') {
                        login();
                        return;
                    } else {
                        shadowShowText('提示', back.message);
                    }

                });

            };
            $scope.changePsd = function () {
                window.location.href = 'https://passport'+window.gooagoodomain+'/change_psd.html';
            };
            // if ($.cookie('user_data')) {
            //     $scope.misMenu = JSON.parse($.cookie('user_data')).source;
            //     $scope.userName = JSON.parse($.cookie('user_data')).userName;
            //     if ($location.$$path == '/' || $location.$$path == '/layout-api') {
            //         // $('.nav.nav-sidebar .nav-parent').removeClass('nav-active active');
            //         // $('.nav.nav-sidebar .nav-parent .children').removeClass('nav-active active');
            //         // if ($('body').hasClass('sidebar-collapsed') && !$('body').hasClass('sidebar-hover')) return;
            //         // if ($('body').hasClass('submenu-hover')) return;
            //         // $('.nav.nav-sidebar .nav-parent .children').slideUp(200);
            //         // $('.nav-sidebar .arrow').removeClass('active');
            //         $scope.$$postDigestQueue.push(function() {
            //             var count = $("a").length;
            //             for (var i = 0; i < count; i++) {
            //                 if ($("a")[i].href.indexOf('#') > -1 && ($("a")[i].href.length - $("a")[i].href.indexOf('#')) > 2) {
            //                     $("a")[i].click();
            //                     applicationService.navHover();
            //                     break;
            //                 }
            //             }
            //         });
            //     } else {
            //         $scope.$$postDigestQueue.push(function() {
            //             applicationService.navHover();
            //         });
            //     }
            // } else {
                $http({
                    url: Configuration.API + '/common/findFuncAuthByUser.do',
                    method: 'GET',
                    params: {
                        sso_token: Configuration.token
                    }
                }).success(function(back) {

                    if (back.status == 'success') {
                        var source = {};
                        for (var i = 0; i < back.data.source.length; i++) {
                            var key = back.data.source[i].authorityId;
                            source[key] = back.data.source[i];
                        }

                        back.data.source = source;
                        $scope.misMenu = source;
                        $scope.userName = back.data.userName;
                        $.cookie('user_data', JSON.stringify(back.data));
                        if ($location.$$path == '/' || $location.$$path == '/layout-api') {
                            // $('.nav.nav-sidebar .nav-parent').removeClass('nav-active active');
                            // $('.nav.nav-sidebar .nav-parent .children').removeClass('nav-active active');
                            // if ($('body').hasClass('sidebar-collapsed') && !$('body').hasClass('sidebar-hover')) return;
                            // if ($('body').hasClass('submenu-hover')) return;
                            // $('.nav.nav-sidebar .nav-parent .children').slideUp(200);
                            // $('.nav-sidebar .arrow').removeClass('active');
                            $scope.$$postDigestQueue.push(function() {
                                var count = $("a").length;
                                for (var i = 0; i < count; i++) {
                                    if ($("a")[i].href.indexOf('passport') == -1 && $("a")[i].href.indexOf('#') > -1 && ($("a")[i].href.length - $("a")[i].href.indexOf('#')) > 2) {
                                        $("a")[i].click();
                                        applicationService.navHover();
                                        break;
                                    }
                                }

                            });
                        } else {
                            $scope.$$postDigestQueue.push(function() {
                                applicationService.navHover();
                            });
                        }

                    } else if (back.status == 'timeout') {
                        login();
                        return;
                    } else {
                        shadowShowText('提示', back.msg);
                    }

                });
            var isClose = sessionStorage.getItem('closeNotice');
            if (isClose == null || isClose == 'false'){
                $http({
                    method: 'get',
                    url: Configuration.passportAPI + '/notify/getNotify.do',
                    // url: 'http://192.168.9.147:8080/notify/getEntryList.do',
                    params: {
                        sso_token: Configuration.token,
                        entryId: '11'
                    }
                })
                    .success(function (res) {
                        if (res.status == 'success') {
                            if (res.data.msg) {
                                $('.noticeContainer').append(
                                    '<div class="tipContent" style="position:absolute;bottom:-30px;width:100%;z-index:100;height:30px;line-height:30px;overflow:hidden;background-color:#FCF8E3">'+
                                    '<div class="removerTip" style="position:absolute;top:0;left:0;z-index:101;color: #333;background-color:#FCF8E3">'+
                                    '<i class="glyphicon glyphicon-remove"></i>'+
                                    '</div>'+
                                    '<div>'+
                                    '<div style="color:#000;font-weight:bolder;position:relative;height: 30px;">'+
                                    '<span class="noticeContent" style="white-space: nowrap;">' + res.data.msg +
                                    '</span>'+
                                    '</div>'+
                                    '</div>'+
                                    '</div>'
                                );
                                $('.removerTip').off('click').on('click', function(){
                                    $('.tipContent').remove();
                                    sessionStorage.setItem('closeNotice','true');
                                });
                                $('.noticeContent').css('width',$('.noticeContent').outerWidth() + 1);
                            }
                            sessionStorage.setItem('closeNotice','false');
                        }
                    });
            }
            // }



            pluginsService.init();
            applicationService.customScroll();
            applicationService.handlePanelAction();

            if ($location.$$path.indexOf('/add') < 0 && $location.$$path.indexOf('/edit/') < 0) {
                $('.nav.nav-sidebar .nav-active').removeClass('nav-active active');
                setTimeout(function(argument) {
                    $('.nav.nav-sidebar .active:not(.nav-parent)').closest('.nav-parent').addClass('nav-active active');
                }, 0);
            }


            // if ($location.$$path == '/add') {
            //     $("#busiManage").addClass("nav-active  active");
            // }
            // if ($location.$$path == '/edit/' + $routeParams.id) {
            //     $("#busiManage").addClass("nav-active  active");
            // }

            // if ($location.$$path == '/') {
            //     $('body').addClass('dashboard');
            // } else {
            //     $('body').removeClass('dashboard');
            // }


            $.material.init();

            $(document).on('click.card', '.card', function(e) {
                if ($(this).find('.card-reveal').length) {
                    if ($(e.target).is($('.card-reveal .card-title')) || $(e.target).is($('.card-reveal .card-title i'))) {
                        $(this).find('.card-reveal').velocity({
                            translateY: 0
                        }, {
                            duration: 225,
                            queue: false,
                            easing: 'easeInOutQuad',
                            complete: function() {
                                $(this).css({
                                    display: 'none'
                                })
                            }
                        });
                    } else if ($(e.target).is($('.card .activator')) ||
                        $(e.target).is($('.card .activator i'))) {
                        $(this).find('.card-reveal').css({
                            display: 'block'
                        }).velocity("stop", false).velocity({
                            translateY: '-100%'
                        }, {
                            duration: 300,
                            queue: false,
                            easing: 'easeInOutQuad'
                        });
                    }
                }
            });

        });

        $scope.isActive = function(viewLocation) {
            return viewLocation === $location.path();
        };

    }
]);
