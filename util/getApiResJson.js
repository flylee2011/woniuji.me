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
        case 400:
            // 缺少参数
            apiResJson.data = null;
            apiResJson.message = 'no args';
            break;
        case 401:
            // 登录状态失效
            apiResJson.data = null;
            apiResJson.message = 'need login';
            break;
        default:
            // 默认，服务器错误
            apiResJson.data = null;
            apiResJson.message = 'system error';
            break;
    }
    return apiResJson;
};

module.exports = getApiResJson;
