/**
 * Created by zhangyuanyuan150923 on 2015/11/17.
 */
define(["config/common/modules"], function (module) {
    /**
     * 封装 常用的ajax
     */
    module.factory("ajaxService", ["$http", "$q", function ($http, $q) {
        /**
         * get方法封装
         * @param url url地址
         * @param param 发送后端参数
         * @returns {deferred.promise|{then, catch, finally}|*|promise.promise|Function|jQuery.promise}
         */
        var get = function (url, param) {
            var defer = $q.defer();
            $http.get(url, {params: param}).success(function (data, status, headers, config) {
                defer.resolve(data, status, headers, config);
            }).error(function (data, status, headers, config) {
                defer.reject(data, status, headers, config);
            });
            return defer.promise;
        };
        /**
         * post 方法封装
         * @param url url地址
         * @param param 发送后端参数
         * @param config 配制参数
         * @returns {deferred.promise|{then, catch, finally}|*|promise.promise|Function|jQuery.promise}
         */
        var post = function (url, param, config) {
            var defer = $q.defer();
            $http.post(url, param, config).success(function (data, status, headers, config) {
                defer.resolve(data, status, headers, config);
            }).error(function (data, status, headers, config) {
                defer.reject(data, status, headers, config);
            });
            return defer.promise;
        };
        /**
         * del 方法封装
         * @param url url地址
         * @param param 发送后端参数
         * @returns {deferred.promise|{then, catch, finally}|*|promise.promise|Function|jQuery.promise}
         */
        var del = function (url, param) {
            var defer = $q.defer();
            $http.delete(url, {params: param}).success(function (data, status, headers, config) {
                defer.resolve(data, status, headers, config);
            }).error(function (data, status, headers, config) {
                defer.reject(data, status, headers, config);
            });
            return defer.promise;
        };
        /**
         * put 方法封装
         * @param url url地址
         * @param param 发送后端参数
         * @param config  配制参数
         * @returns {deferred.promise|{then, catch, finally}|*|promise.promise|Function|jQuery.promise}
         */
        var put = function (url, param, config) {
            var defer = $q.defer();
            $http.put(url, param, config).success(function (data, status, headers, config) {
                defer.resolve(data, status, headers, config);
            }).error(function (data, status, headers, config) {
                defer.reject(data, status, headers, config);
            });
            return defer.promise;
        };
        /**
         * jsonp 方法封装
         * @param url  url地址
         * @param param 发送后端参数
         * @returns {deferred.promise|{then, catch, finally}|*|promise.promise|Function|jQuery.promise}
         */
        var jsonp = function (url, param) {
            var defer = $q.defer();
            url = url.indexOf("=JSON_CALLBACK") > 0 ? (url) : (url.indexOf("?") > 0 ? (url + "&callback=JSON_CALLBACK") : (url + "?callback=JSON_CALLBACK"));
            $http.jsonp(url, {params: param}).success(function (data, status, headers, config) {
                defer.resolve(data, status, headers, config);
            }).error(function (data, status, headers, config) {
                defer.reject(data, status, headers, config);
            });
            return defer.promise;
        };
        return {
            get: get,
            post: post,
            del: del,
            put: put,
            jsonp: jsonp
        };
    }]);


    module.factory("gridService", ["ajaxService", function (ajaxService) {

        function Grid(param, element) {
            //数据接口
            this.param = $.extend({
                url: "",
                colModel: [],
                rowNum: 10,
                rowList: [10, 20, 30],
                sortname: "id",
                softorder: "asc",
                mtype: "get",
                rownumbers: false,
                multiselect: false,
                gridComplete: function () {
                }
            }, param);
            //table表格对象
            this.element = element;
            this.commonColModel = [];
            this.url = this.param.url;
            this.colModel = this.param.colModel;
            this.sortname = this.param.sortname;
            this.softorder = this.param.softorder;
            this.rowNum = this.param.rowNum;
            this.rowList = this.param.rowList;
            this.mtype = this.param.mtype;
            this.multiselect = param.multiselect;
            this.rownumbers = param.rownumbers;
            this.totalCount = null;//记录总页数
            this.firstSendData = {rows: this.rowNum, page: 1, sidx: this.sortname, sord: this.softorder};
            this.init();
        }

        //对象方法
        $.extend(Grid.prototype, {
            init: function () {
                var self = this;
                angular.forEach(this.colModel, function (item, index) {
                    this.push($.extend({
                        name: "", align: "left", sortable: false, formatter: function (cellVale, rowObj) {
                            return cellVale
                        }
                    }, item));
                }, this.commonColModel);

                //加排序
                this.element.find("thead tr").last().find("th").each(function (index, item) {
                    var config = self.commonColModel[index];
                    if (config.sortable) {
                        $(this).on("click", function (ev) {
                            self.sortname = config.name;
                            arguments.callee["flag" + config.name] = !arguments.callee["flag" + config.name];
                            if (arguments.callee["flag" + config.name]) {
                                self.softorder = "desc";
                            } else {
                                self.softorder = "asc";
                            }
                            self.loadData({
                                rows: self.element.find("tfoot select.pagesize").val(),
                                page: self.element.find("tfoot input.page").val(),
                                sidx: self.sortname,
                                sord: self.softorder
                            });
                        });
                    }
                });

                // 对thead处理 是否要多选 和 是否要显示行号
                if (this.rownumbers && this.multiselect) { //在创建两个th
                    this.element.find("thead tr").last().prepend("<th style='width: 30px;'></th><th style='width: 30px;'></th>");
                } else if (this.rownumbers || this.multiselect) { //创建一个th
                    this.element.find("thead tr").last().prepend("<th style='width: 30px;'></th>");
                }
                //处理tfoot
                var selectOptions = [];
                angular.forEach(this.rowList, function (item) {
                    this.push("<option value='" + item + "'>" + item + "</option>");
                }, selectOptions);

                var tfootHtml = '<tr><td colspan="' + this.element.find("thead tr").last().find("th").length + '">\
                <span class="glyphicon glyphicon-fast-backward" style="cursor: pointer; color: #666;"></span>\
                <span class="glyphicon glyphicon-step-backward" style="cursor: pointer; color: #666;"></span>\
                <input style="width: 50px; text-align: center;" type="text" value="1" class="page">共<span class="total"></span>页\
                <span class="glyphicon glyphicon-step-forward" style="cursor: pointer; color: #666;"></span>\
                <span class="glyphicon glyphicon-fast-forward" style="cursor: pointer; color: #666;"></span>\
                <span class="glyphicon glyphicon-refresh" style="float: left;margin-top: 4px;cursor: pointer"></span>\
                <select class="pagesize" style="display: inline-block; width: 50px; height: 26px; vertical-align: middle; padding: 0; border-radius: 0;">' +
                    selectOptions.join("")
                    + '</select>\
                <div style="float: right;margin-top: 4px;">\
                <span class="from"></span>-<span class="to"></span>\
            共<span class="allCount"></span>条\
            </div>\
            </td></tr>';
                this.element.find("tfoot").empty().append(tfootHtml);
                //第一次加数据
                this.loadData(this.firstSendData);

                //    事件操作
                //跳转到第几页
                this.element.find("tfoot").keydown(function (ev) {
                    if (ev.keyCode === 13) {
                        self.loadData({
                            rows: self.element.find("tfoot select.pagesize").val(),
                            page: self.element.find("tfoot input.page").val(),
                            sidx: self.sortname,
                            sord: self.softorder
                        });
                    }
                });

                //选择一页面显示的页数
                this.element.find("tfoot select.pagesize").on("change", function (ev) {
                    self.loadData({
                        rows: self.element.find("tfoot select.pagesize").val(),
                        page: self.element.find("tfoot input.page").val(),
                        sidx: self.sortname,
                        sord: self.softorder
                    });
                });

                //刷新数据
                this.element.find("tfoot span.glyphicon-refresh").on("click", function (ev) {
                    self.loadData(self.firstSendData);
                });

                //跳到第一页
                this.element.find("tfoot").on("click", "span.glyphicon-fast-backward", function (ev) {

                    self.loadData({
                        rows: self.element.find("tfoot select.pagesize").val(),
                        page: 1,
                        sidx: self.sortname,
                        sord: self.softorder
                    });

                });
                //跳到上一页
                this.element.find("tfoot").on("click", "span.glyphicon-step-backward", function (ev) {
                    var nowpage = parseInt(self.element.find("tfoot input.page").val());
                    nowpage--;
                    if (nowpage < 1) nowpage = 1;
                    self.loadData({
                        rows: self.element.find("tfoot select.pagesize").val(),
                        page: nowpage,
                        sidx: self.sortname,
                        sord: self.softorder
                    });
                });
                //跳到下一页
                this.element.find("tfoot").on("click", "span.glyphicon-step-forward", function (ev) {
                    var nowpage = parseInt(self.element.find("tfoot input.page").val());
                    nowpage++;
                    if (nowpage > self.totalCount) nowpage = self.totalCount;
                    self.loadData({
                        rows: element.find("tfoot select.pagesize").val(),
                        page: nowpage,
                        sidx: self.sortname,
                        sord: self.softorder
                    });
                });

                //跳到最后一页
                this.element.find("tfoot").on("click", "span.glyphicon-fast-forward", function (ev) {
                    self.loadData({
                        rows: self.element.find("tfoot select.pagesize").val(),
                        page: self.totalCount,
                        sidx: self.sortname,
                        sord: self.softorder
                    });
                });

                return this;
            },
            //渲染table 内容
            operateDom: function (data) {
                if (!$.isEmptyObject(data)) {
                    this.totalCount = data.total;
                    if (data.rows && data.rows.length > 0) {
                        var rowData = data.rows;
                        //   过滤表格要填充的数据
                        var html = this.filterData(rowData, this.commonColModel);
                        this.element.find("tbody").empty().append(html);
                        var tfoot = this.element.find("tfoot"), pageSize = this.element.find("select.pagesize").val();
                        tfoot.find("input.page").val(data.page);
                        tfoot.find("span.total").text(data.total);
                        tfoot.find("span.from").text((data.page - 1) * pageSize + 1);
                        tfoot.find("span.to").text((data.page - 1) * pageSize + data.rows.length);
                        tfoot.find("span.allCount").text(data.records);
                        $.isFunction(this.param.gridComplete) ? this.param.gridComplete(this.element, data.rows) : "";
                    } else {
                        throw new Error("json格式必须有rows属性并且长度要大于0");
                    }
                }
            },
            filterData: function (rowData, commonColModel) {
                var htmlArr = [], self = this;
                angular.forEach(rowData, function (item, i) {
                    var rowHtml = [], str;
                    if (self.rownumbers && self.multiselect) { //创建 行号和多选
                        str = "<td style='text-align: center'>" + (i + 1) + "</td><td><input type='checkbox' id='" + item.id + "' value='" + item.id + "'></td>";
                    } else if (self.rownumbers && !self.multiselect) {//只创建 行号
                        str = "<td style='text-align: center'>" + (i + 1) + "</td>";
                    } else if (!self.rownumbers && self.multiselect) {//中创建 多选
                        str = "<td><input type='checkbox' id='" + item.id + "' value='" + item.id + "'></td>";
                    }
                    angular.forEach(self.commonColModel, function (every, j) {
                        var cellName = every.name, align = every.align, formatter = every.formatter;
                        if ($.isFunction(formatter)) {
                            this.push("<td style='text-align: " + align + "'>" + formatter(item[cellName], item) + "</td>");
                        } else {
                            throw new Error("formatter必须为函数");
                        }
                    }, rowHtml);
                    this.push("<tr>" + str + rowHtml.join("") + "</tr>");
                }, htmlArr);
                return htmlArr.join("");
            },
            //开始加载数据
            loadData: function (sendData) {
                var self = this;
                sendData.ng = new Date().getTime();
                if (this.mtype && angular.equals(this.mtype.toLowerCase(), "post")) {
                    ajaxService.post(self.url, sendData).then(function (data) {
                        self.operateDom(data);
                    }, function () {
                        throw new Error("请求失败");
                    });
                } else {
                    ajaxService.get(self.url, sendData).then(function (data) {
                        self.operateDom(data);
                    }, function () {
                        throw new Error("请求失败");
                    });
                }
            },
            //得到选中的ids
            getSelectIds: function () {
                var $checkbox = this.element.find("tbody input[type=checkbox]"), checkVal = [];
                $checkbox.each(function (i, item) {
                    var $item = $(item);
                    if ($item.is(":checked")) {
                        checkVal.push($item.val());
                    }
                });
                return checkVal;
            }
        });
        return function (param, element) {
            return new Grid(param, element);
        };
    }]);

});









