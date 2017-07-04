/**
 * @fileoverview 获取调用 api 返回 json 数据
 * @author liyifei
 * @date 2017/07
 */
var globalConfig = require('../config/global');
var apiResJson = globalConfig.apiResJson;

var getApiResJson = function(code, data) {
    apiResJson.code = code;
    switch (code) {
        case 200:
            apiResJson.data = data;
            apiResJson.message = 'success';
            break;
        case 401:
            apiResJson.message = 'no args';
            break;
        default:
            break;
    }
    return apiResJson;
};

module.exports = getApiResJson;
