/**
 * request 网络请求工具
 * 更详细的api文档: https://bigfish.alipay.com/doc/api#request
 */
import { extend } from 'umi-request';
import { notification } from 'antd';
// import router from 'umi/router';

const codeMessage = {
  200: '请求数据成功。', // 以GET方法请求数据的api，若正常返回，响应码为200
  201: '新建数据成功。', // 以POST方法 新增实体数据的api，若正常返回，http的响应码为201
  202: '更新数据成功。', // 以PUT方法更新实体数据的api，若正常返回，http的响应码为202
  204: '删除数据成功。', // 以DELETE方法删除实体，若正常返回，http的响应码为204
  400: '数据表不允许通过HTTP请求添加删除记录。', // 400 的异常状态太多了，通过 code 区分，显示不同的 msg
  403: '请求错误，捕获到异常。', // 若发生捕获到的异常则 http的响应码为403
  // 403: '用户得到授权，但是访问是被禁止的。',
  404: '不存在该记录。', // 404 的异常状态太多了，通过 code 区分，显示不同的 msg
  409: '数据库记录重复。', // 409 的异常状态太多了，通过 code 区分，显示不同的 msg
  500: '服务器发生错误，请检查服务器。', // 若发生未知错误 则http的响应码为500

  // 以下是本系统后端未声明的状态码
  401: '用户没有权限（令牌、用户名、密码错误）。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

/**
 * 异常处理程序
 */
// eslint-disable-next-line consistent-return
const errorHandler = error => {
  const { response = {}, data } = error;
  const { status } = response;

  if (status >= 200 && status < 300) {
    return response;
  }

  if (status === 401) {
    notification.error({
      message: '未登录或登录已过期，请重新登录。',
    });
    // @HACK
    /* eslint-disable no-underscore-dangle */
    window.location.href = `/api/v1/rbac/login?next=${window.location.href}`;
    // window.g_app._store.dispatch({
    //   type: 'user/login',
    // });
    // eslint-disable-next-line consistent-return
    return;
  }

  const message = (data && data.msg) || codeMessage[status] || response.statusText;

  notification.error({ message });

  // throw error;   // 如果throw. 错误将继续抛出.
  // return {some: 'data'}; 如果return, 将值作为返回. 不写则相当于return undefined, 在处理结果时判断response是否有值即可.

  // environment should not be used
  // if (status === 403) {
  //   router.push('/exception/403');
  //   return;
  // }
  // if (status <= 504 && status >= 500) {
  //   router.push('/exception/500');
  //   return;
  // }
  // if (status >= 404 && status < 422) {
  //   router.push('/exception/404');
  // }
};

/**
 * 配置request请求时的默认参数
 */
const request = extend({
  // prefix: '/api/v1',
  errorHandler, // 默认错误处理
  credentials: 'include', // 默认请求是否带上cookie
});

request.interceptors.response.use(async response => {
  if (response.status === 204) {
    // return { code: 0, msg: '删除成功'};
    // return Promise.resolve({ code: 0, msg: '删除成功'});
    // const newResponse = response.clone()
    // newResponse.data = { code: 0, msg: '删除成功'};
    // return Promise.resolve(newResponse);
    // response.data = { code: 0, msg: '删除成功'};
    // response.body = { code: 0, msg: '删除成功'};
    // return response;
  }
  // return { code: 0, msg: '删除成功'};
  return response;
});

// request.interceptors.response.use(async (response) => {
//   const data = await response.clone().json();
//   // const data = await response.json();
//   console.log('333333 async response', data)
//   return response;
// })

export default request;
