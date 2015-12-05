/**
 * Created by zhangyuanyuan150923 on 2015/11/16.
 */
define(["modules/homeModule"], function (homeModule) {
    /**
     * 首页 home页面 DashBoard 的controller
     */
    homeModule.controller("homeController", ["$scope", "$state", function ($scope, $state) {
        $("div.sidebar-title").next().hide();
        $.each($("div.sidebar-title"), function (index, item) {
            var $item = $(item);
            $item.click(function (ev) {
                arguments.callee.flag = !arguments.callee.flag;
                if (arguments.callee.flag) {
                    $item.next().show();
                } else {
                    $item.next().hide();
                }
            });
        });
        $("div.sidebar-title").eq(0).click();


        if (window.localStorage) {
            var isOpen = window.localStorage.getItem("hc-sidebar-open");
            if (isOpen != null && isOpen == "true") {
                $("div.viewFramework-body").addClass("viewFramework-sidebar-full");
            } else {
                $("div.viewFramework-body").removeClass("viewFramework-sidebar-full");
            }
        }

        $scope.toolBarLogo = function () {
            if ($("div.viewFramework-body").hasClass("viewFramework-sidebar-full")) {
                $("div.viewFramework-body").removeClass("viewFramework-sidebar-full");
                window.localStorage.setItem("hc-sidebar-open", "false");
            } else {
                window.localStorage.setItem("hc-sidebar-open", "true");
                $("div.viewFramework-body").addClass("viewFramework-sidebar-full");
            }
        };

        $state.go("home.addCutomer");
    }]);

    /**
     * tab 选项卡的controller
     */
    homeModule.controller("testTabController", ["$scope", function ($scope) {
        $scope.dataList = [{
            title: "1",
            content: "test1"
        }, {
            title: "2",
            content: "test2"
        }, {
            title: "3",
            content: "test3"
        }, {
            title: "4",
            content: "test4"
        }];

        $scope.initDate = "2015-11-27";

        $scope.oneNode = $("#nodeone");
        $scope.twonode = $("#nodetwo");

        $scope.arr = ["2015-10-10", "2014-12-12", "2013-12-10", "2015-09-08"];

    }]);

    //dragcontroller
    homeModule.controller("dragController", ["$scope", function ($scope) {
        var setting = {
            data: {
                simpleData: {
                    enable: true
                }
            }
        };
        var data = [
            {id: 1, pId: 0, name: "父节点1", open: true, icon: "./framworks/ztree/img/diy/1_close.png"},
            {id: 11, pId: 1, name: "子节点1"},
            {id: 12, pId: 1, name: "子节点2"}
        ];

        $.fn.zTree.init($("#ztreeDemo"), setting, data)

    }]);

    //testCURD DEMO
    homeModule.controller("testCURDController", ["$scope", "testCRUDService", "$state", "$rootScope", "$filter",
        function ($scope, testCRUDService, $state, $rootScope, $filter) {
            var dataGet;

            testCRUDService.invoke({hello: "hello", data: "123"}).then(function (data) {
                dataGet = data;
                $scope.dataList = $filter("orderBy")(data, "id", false);
            }, function () {
                throw new Error("没获取到数据");
            });

            //    查询功能
            $scope.search = function () {
                //$scope.dataList = $filter("filter")(dataGet,$scope.searchById); //可以按所有字段查询
                $scope.dataList = $filter("filter")(dataGet, {id: $scope.searchById}); //按id查询
                $scope.dataList = $filter("orderBy")($scope.dataList, "id", false);
            };

            //删除方法
            $scope.remove = function () {
                var ids = testCRUDService.getIds();
                if (ids.length > 0) {
                    if (confirm("您确定要删除数据")) {
                        // testCRUDService.resource.delete({jsonName: "xxxx.do", ids: ids.join(",")});
                        //模拟删除成功
                        $scope.dataList = testCRUDService.delArrByIDS(dataGet, ids);
                    }
                } else {
                    alert("请选择您要删除的数据");
                }
            };

            //    增加
            $scope.add = function () {
                $state.go("home.eidt", {flag: "add"});
            };

            //    修改
            $scope.edit = function () {
                var ids = testCRUDService.getIds();
                if (ids.length == 1) {
                    $rootScope.editId = ids.join("");
                    $state.go("home.eidt", {flag: "edit"});
                } else {
                    alert("您只能选择一条数据");
                }
            };

            //    排序
            $scope.soft = function (arg) {
                arguments.callee["soft" + arg] = !arguments.callee["soft" + arg];
                $scope.dataList = $filter("orderBy")($scope.dataList, arg, arguments.callee["soft" + arg]);
            };
        }]);

    //编辑页面
    homeModule.controller("testCURDEditController", ["$scope", "testCRUDService", "$stateParams", "$rootScope", "$state", function ($scope, testCRUDService, $stateParams, $rootScope, $state) {
        var flag = $stateParams.flag;
        if (flag !== 'add') {
            //得到id要编辑的id
            var id = $rootScope.editId;
            testCRUDService.resource.get({jsonName: "entityData", id: id}, function (entity) {
                $scope.id = entity.id;
                $scope.age = entity.age;
                $scope.name = entity.name;
                $scope.snippet = entity.snippet
            });
        }

        $scope.save = function () {
            var myeidt = {
                id: $scope.id,
                age: $scope.age,
                name: $scope.name,
                snippet: $scope.snippet
            };
            //做保存
            //testCRUDService.save({jsonName:"entityData",entity:myeidt});
            $state.go("home.CRUD");
        };
        $scope.cancel = function () {
            $state.go("home.CRUD");
        };
    }]);


    homeModule.controller("home.addCustomerController", ["$scope", function ($scope) {

        $("#list").jqGrid({
            url: '../interface/needData.json',
            datatype: "json",
            colNames: ['Inv No', 'Date', 'Client', 'Amount', 'Tax', 'Total', 'Notes'],
            colModel: [
                {name: 'id', index: 'id', width: 55},
                {name: 'invdate', index: 'invdate', width: 90},
                {name: 'name', index: 'name asc, invdate', width: 100},
                {name: 'amount', index: 'amount', width: 80, align: "right"},
                {name: 'tax', index: 'tax', width: 80, align: "right"},
                {name: 'total', index: 'total', width: 80, align: "right"},
                {name: 'note', index: 'note', width: 700, sortable: false}
            ],
            rowNum: 10,
            rowList: [10, 20, 30,50],
            pager: '#pageList',
            sortname: 'id',
            mtype: "get",
            viewrecords: true,
            sortorder: "desc",
            multiselect: true,
            autowidth: true,
            //loadonce: true,
            width: 1000,
            height: "100%",
            rownumbers:true,
            caption: "JSON 实例"
        });

        jQuery("#list").jqGrid('navGrid', '#pageList', {edit: false, add: false, del: false, search: false});
    }]);

    //查询客户的控制器
    homeModule.controller("home.searchCustomerController",["$scope","$compile","gridService" ,function ($scope,$compile,gridService) {
        var setOptions={
            url:"../interface/needData.json?commit=update",
            colModel:[
                {name: 'id',align:"left",sortable:true},
                {name: 'invdate' ,sortable:true},
                {name: 'name',sortable:true},
                {name: 'amount',sortable:true},
                {name: 'tax'},
                {name: 'total',sortable:true},
                {name: 'note', align:"right", sortable: false},
                {name:"button",algin:"center",formatter:function(cellval,rowObj){
                    var id=rowObj.id;
                    return "<a ng-click='update(\""+id+"\")'>修改</a>、<a ng-click='delete(\""+id+"\")'>修改</a>、<a ng-click='detail(\""+id+"\")'>修改</a>、<a ng-click='serviceConfig(\""+id+"\")'>修改</a>";
                }}
            ],
            rowNum:10,
            rowList:[10,20,50,100],
         /*   sortname:"id",
            softorder:"desc",
            mtype:"get",
            rownumbers:true,
            multiselect:true,*/
            gridComplete:function($table,data){
                $compile($table.find("a"))($scope);
            }
        };
        var grid=gridService(setOptions,$("#checkgrid"));

        $scope.getChecked= function () {
          var ids=  grid.getSelectIds();
            console.log(ids);
        };

        $scope.update= function (id) {
            console.log(id);
        };
        $scope.delete= function (id) {
            console.log(id);
        };
        $scope.detail= function (id) {
            console.log(id);
        };
        $scope.serviceConfig= function (id) {
            console.log(id);
        };



    }]);
});










