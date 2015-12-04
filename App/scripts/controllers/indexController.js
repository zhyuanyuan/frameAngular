/**
 * Created by zhangyuanyuan150923 on 2015/11/9.
 */
define(["modules/indexModule", "jquery-validate", "bootstrap"], function (indexModule) {
    require(["css!../styles/main.css", "css!../styles/font-awesome.min.css"]);//自定义引入样式文件
    indexModule.controller("loginController", ["$scope", "$state", "$http", function ($scope, $state, $http) {
        $("#form_login").validate({
            rules: {
                emp_no: {
                    required: true,
                    minlength: 3
                },
                password: {
                    required: true,
                    minlength: 3
                }
            },
            messages: {
                emp_no: {
                    required: "<font color='red'>请输入用户名</font>",
                    minlength: "<font color='red'>您的用户名至少3位</font>"
                },
                password: {
                    required: "<font color='red'>请输入密码</font>",
                    minlength: "<font color='red'>您的密码至少3位</font>"
                }
            },
            validClass: "success",
            errorClass: "invalid"
        });

        $scope.submit = function () {
            var username = $scope.username,
                userpwd = $scope.userpwd,
                valid = $("#form_login").valid();//验证是否通过

            //        做成异步提交
            if (valid) {
                $http({
                    url: "../interface/login.json",
                    method: "GET",
                    data: {username: username, userpwd: userpwd}
                }).success(function (data) {
                    if (!$.isEmptyObject(data) && data.username === username && data.userpwd === userpwd) {
                        $state.go("home");
                    } else {
                        alert("当前只有U001用户");
                    }
                });
            }
        };
    }]);
    return {};
});