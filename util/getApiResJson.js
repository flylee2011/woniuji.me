/**
 * @fileoverview 获取调用 api 返回 json 数据
 * @author liyifei
 * @date 2017/07
 */
var apiResJson = {
    code: 500,
    data: null,
    message: 'system error'
};

var getApiResJson = function(code, data) {
    apiResJson.code = code;
    switch (code) {
        case 200:
            // 成功
            apiResJson.data = data;
            apiResJson.message = 'success';
            break;
        case 401:
            // 缺少参数
            apiResJson.message = 'no args';
            break;
        default:
            // 默认，服务器错误
            break;
    }
    return apiResJson;
};

module.exports = getApiResJson;
