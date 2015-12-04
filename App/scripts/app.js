/**
 * Created by zhyuanyuan on 2015/10/27.
 */

//换肤接口
var cssStyle = {};
cssStyle.jqueryUi = "css!../framworks/jquery_ui/jquery-ui.css";
cssStyle.bootStrap = "css!../framworks/bootstrap_3/css/bootstrap.min.css";
cssStyle.ztree="css!../framworks/ztree/zTreeStyle.css";
cssStyle.jqGrid="css!../framworks/jqGrid/ui.jqgrid.css";


require.config({
    baseUrl: "./scripts",
    paths: {
        "jquery": "../framworks/jquery",
        "angular": "../framworks/angular1_3/angular",
        "angular-ui-router": "../framworks/angular-ui-router",
        "angular-resource": "../framworks/angular1_3/angular-resource",
        "domReady": "../framworks/domReady",
        "jquery-ui": "../framworks/jquery_ui/jquery-ui",
        "bootstrap": "../framworks/bootstrap_3/js/bootstrap.min",
        "jquery-validate": "../framworks/jquery.validate",
        "mock": "../framworks/mock-min",
        "mock-module": "config/common/mockModule",
        "ztree":"../framworks/ztree/jquery.ztree.all-3.5.min",
        "jqGrid-cn":"../framworks/jqGrid/i18n/grid.locale-cn",
        "grid.base":"../framworks/jqGrid/grid.base",
        "jqGrid":"../framworks/jqGrid/jquery.jqGrid",
        "angular-aminate":"../framworks/angular1_3/angular-animate"
    },
    waitSeconds: 15,
    map: {
        "*": {
            css: "../framworks/css.min"
        }
    },
    shim: {
        "angular": {
            deps: ["jquery"],
            exports: "angular"
        },
        "angular-ui-router": {
            deps: ["angular"],
            exports: "angular-ui-router"
        },
        "angular-resource": {
            deps: ["angular"],
            exports: "angular-resource"
        },
        "jquery-ui": {
            deps: ["jquery", cssStyle.jqueryUi],
            exports: "jquery-ui"
        },
        "bootstrap": {
            deps: ["jquery", cssStyle.bootStrap],
            exports: "bootstrap"
        },
        "jquery-validate": ["jquery"],
        "mock-module": ["mock"],
        "ztree":{
            deps:["jquery",cssStyle.ztree],
            exports:"ztree"
        },
        "jqGrid":{
            deps:["jquery","jquery-ui","jqGrid-cn",cssStyle.jqGrid],
            exports:"jqGrid"
        },
        "angular-aminate":["jquery","angular"]
    }
});

var frameConfig = {};

//配制需要的框架
frameConfig.paths = ["angular", "angular-ui-router", "angular-resource"];

//模板接口名称
frameConfig.interfaceName = ["ui.router", "ngResource"];

require(["config/config"], function (config) {
    var mainConfig = ["angular", "main", "domReady"].concat(config.mainConfig),
        moduleName = frameConfig.interfaceName.concat(config.moduleName),
        modulePath = frameConfig.paths.concat(config.modulePath);

    define("main", modulePath, function (angular) {
        return angular.module("Main", moduleName);
    });

    require(mainConfig, function (angular, app, domReady) {

        app.config(["$stateProvider", "$urlRouterProvider", function ($stateProvider, $urlRouterProvider) {
            $urlRouterProvider.otherwise("/login");
            $stateProvider.state("login", {
                url: "/login",
                templateUrl: "views/login.html",
                controller: "loginController"
            }).state("home", {
                url: "/home",
                templateUrl: "views/home.html",
                controller: "homeController"
            }).state("404", {
                url: "/404",
                templateUrl: "views/404.html"
            });
        }]);

        //模块加载完成后
        domReady(function () {
            angular.bootstrap(document, ["Main"]);
        });
    });
});
