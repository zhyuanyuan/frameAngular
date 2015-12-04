/**
 * Created by zhangyuanyuan150923 on 2015/11/27.
 */
define(["config/common/modules"], function (modules) {
    //封装日历控件
    modules.directive("datePicker", function () {
        return {
            restrict: "A",
            replace: false,
            scope: {
                dateMonths: '@',
                dateToNode: '=',
                dateFromNode: '='
            },
            link: function (scope, ele, attr, con) {

                var dateMonths = scope.dateMonths;
                if (!dateMonths) {
                    dateMonths = 1;
                } else {
                    dateMonths = parseInt(dateMonths);
                }
                //设置公共的参数
                var dateCommon = {
                    showOtherMonths: true,
                    selectOtherMonths: true,
                    changeYear: true,
                    changeMonth: true,
                    prevText: "上月",
                    nextText: "下月",
                    showAnim: "slideDown",
                    showButtonPanel: false,
                    showOptions: {direction: "up"},
                    numberOfMonths: dateMonths
                };

                if (scope.dateToNode && scope.dateFromNode) {
                    throw new Error("date-to-node和date-from-node不能同时设置");
                } else if (scope.dateToNode) {
                    dateCommon.onClose = function (selectDate) {
                        scope.dateToNode.datepicker("option", "minDate", selectDate);
                    };
                    ele.datepicker(dateCommon);
                } else if (scope.dateFromNode) {
                    dateCommon.onClose = function (selectDate) {
                        scope.dateFromNode.datepicker("option", "maxDate", selectDate);
                    };
                    ele.datepicker(dateCommon);
                } else { //两个属性都没设置
                    ele.datepicker(dateCommon);
                }
            }
        }
    });

/*    modules.directive("setTable", ["gridService", function (gridService) {
        return {
            restrict: "A",
            replace: false,
            scope: {
                tableParam: "="
            },
            link: function (scope, element, attr, controller) {
                var param = scope.tableParam;
                var val=gridService(param, $(element));
                val.getSelectIds();
                //gridService.getSelect();
            }

        }
    }]);*/

});





