/**
 * Created by zhangyuanyuan150923 on 2015/10/28.
 */

define(["config/controllerConfig","config/directiveConfig","config/filterConfig","config/serviceConfig","config/moduleConfig","jquery"], function (controller,directive,filter,service,module) {
    if( !module.length ){
        throw new Error("模板不能为空");
    }else{
        var names=[],pathes=[];
        $.each(module, function (index, item) {
            names.push(item.name);
            pathes.push(item.path);
        });

        //    探臭配制模板名称不能重复
        (function (arr) {
            for(var i= 0,len = arr.length ;i <len;i++){
                var  item=arr[i];
                for(var j=i+ 1;j < len;j++){
                    if(arr[j] === item){
                        throw  new Error("Main依赖模板名称有重名!");
                    }
                }
            }
        })(names);

        return {
            mainConfig:controller.concat(directive).concat(filter).concat(service),
            moduleName:names,
            modulePath:pathes
        };
    }



});