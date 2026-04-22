export const HttpErrorType = {
	URL_NOT_FOUND: 404,
	INTERNAL_SERVER_ERROR: 500,
	BAD_REQUEST: 400,
	FORBIDDEN: 403,
	NOT_FOUND: 404,
	INVALID_ARGUMENTS: 400,
	UNAUTHORIZED: 401,
	BE_LOGOUT: 401,
	REQUEST_TIMEOUT: 408,
	TOO_MANY_REQUESTS: 429
} as const;


// @ts-ignore
export const ErrorCode: { [K in keyof typeof HttpErrorType]: K } = {} as const;

for (const key in HttpErrorType) {

	// @ts-ignore
	ErrorCode[key] = key;
}


/**
 * @api {Error} error_code 错误码释义
 * @apiSampleRequest off
 * @apiName error_code
 * @apiGroup 错误码
 * @apiVersion 1.0.0
 * @apiQuery {string} INTERNAL_SERVER_ERROR 服务器内部错误
 */

/**
 * @api {Error} error_response_example 接口报错返回示例
 * @apiSampleRequest off
 * @apiName error_response_example
 * @apiGroup 错误码
 * @apiVersion 1.0.0
 * @apiErrorExample {json} Response(example):
 * {
 *   "status": 500,
 *   "code": "INTERNAL_SERVER_ERROR",
 *   "message": "user (name: %s) is invalid",
 *   "reason": ["admin"],
 *   "source": ["cpp_build"]
 * }
 * @apiError {number} status=500 http状态码
 * @apiError {string} code 错误类型/错误码
 * @apiError {string} message 错误提示信息
 * @apiError {array} reason 错误信息中的变量(如有)信息
 * @apiError {array} source 错误源追踪信息
 */


/**
 * @apiDefine loginRequiredRequest
 * @apiDescription 需要已登录参数
 * @apiHeader {string="adela", "devcenter"} x-sensetime-platform 登录用户的平台
 * @apiHeader {string} x-sensetime-userid 登录用户的userid
 * @apiHeader {string} x-sensetime-user 登录用户的用户名
 * @apiHeader {string} x-sensetime-token 登录用户的token
 */

/**
 * @apiDefine betweenServerRequest
 * @apiDescription 需要微服务之间请求校验参数
 * @apiHeader {string} authorization 鉴权数据，取值：Bearer {JWT}
 */
