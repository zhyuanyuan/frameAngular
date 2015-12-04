/**
 * Created by zhangyuanyuan150923 on 2015/11/16.
 */
define(["angular","angular-ui-router","mock-module","ztree","jqGrid"], function (angular) {
    var  homeModule=angular.module("homeModule",["ui.router","my.mock"]);
    homeModule.config(["$stateProvider", "$urlRouterProvider", function ($stateProvider, $urlRouterProvider) {
        //配制路由
        $stateProvider.state("home.addCutomer",{
            url:"/addCutomer",
            templateUrl:"views/home/customer/addCustomer.html",
            controller:"home.addCustomerController"
        }).state("home.searchCutomer",{
            url:"/searchCutomer",
            templateUrl:"views/home/customer/searchCustomer.html",
            controller:"home.searchCustomerController"
        }).state("home.addServicer",{
            url:"/addServicer",
            templateUrl:"views/home/customerService/addServicer.html"
        }).state("home.searchServicer",{
            url:"/searchServicer",
            templateUrl:"views/home/customerService/searchServicer.html"
        });
    }]);
    return homeModule;
});