/**
 * Created by zhangyuanyuan150923 on 2015/11/17.
 */
define(["modules/homeModule"], function (homeModule) {
    require(["./../interface/queryDataInterface.js"]);
    homeModule.factory("testCRUDService", ["ajaxService", function (ajaxService) {
        var getIds = function () {
            var allCheckbox = $("#dataTable tbody input[type=checkbox]"), valueArr = [];
            angular.forEach(allCheckbox, function (item, index) {
                if ($(item).is(":checked")) {
                    valueArr.push($(item).val());
                }
            });
            return valueArr;
        };

      var invoke= function (pars) {
          return ajaxService.get("www.baidu.com",pars);
        };

        var delArrById = function (arr, id) {
            for (var i = 0, len = arr.length; i < len; i++) {
                var item = arr[i];
                if (item.id && item.id == id) {
                    arr.splice(i, 1);
                    break;
                }
            }
        };

        //模拟从数组中删除数据
        var delArrByIDS = function (oralArr, ids) {
            angular.forEach(ids, function (item, index) {
                delArrById(oralArr, item);
            });
            return oralArr;
        };

        return {
            getIds: getIds,
            invoke:invoke,
            delArrByIDS: delArrByIDS
        }

    }]);
});