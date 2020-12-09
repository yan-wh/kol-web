import { notification } from 'antd';

export function errorReport(status = undefined, message = '') {
  notification.error({
    message: `请求错误 ${status}`,
    description: message,
    duration: 10,
  });
}
