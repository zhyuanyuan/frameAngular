/**
 * Created by zhangyuanyuan150923 on 2015/11/17.
 */
define(["modules/homeModule"],function (homeModule) {
    require(["css!../styles/tabDirective.css"]);

    homeModule.directive("myTab", function () {
        return {
            restrict:'E',
            templateUrl:"views/demoViews/tabView.html",
            replace: true,
            scope: {
                tabId: "@",
                tabData: "="
                //showFn:"&tabFn"
            },
            link: function (scope, element, attr) {
                element.on("click", "button", function (ev) {
                    $(this).addClass("active").siblings("button").removeClass("active")
                        .siblings("div").eq($(this).index()).show().siblings("div").hide();
                });
            }
        }
    });

    homeModule.directive("myDrag", function () {
        return {
            restrict:"A",
            link: function (scope, element, attr) {
               element.css({position:"absolute",width:100,height:100,background:"red",left:0,top:0});
                element.on("mousedown", function (ev) {
                   var disX=ev.pageX-element.offset().left +180,disY=ev.pageY - element.offset().top + 50;
                    $(document).on("mousemove", function (ev) {
                        element.css({left:ev.pageX - disX,top:ev.pageY - disY});
                    });
                    $(document).on("mouseup", function (ev) {
                        $(document).off();
                    });
                    return false;
                });
            }
        }
    });

    return {};
});