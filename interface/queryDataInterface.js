/**
 * Created by zhangyuanyuan150923 on 2015/11/26.
 */

Mock.mock("www.baidu.com", function () {
    return Mock.mock({
        'list|10-20':[{"id":"@GUID","name":"@CHINESENAME","age|0-100":10,"snippet":"@PARAGRAPH"}]
    }).list;
});