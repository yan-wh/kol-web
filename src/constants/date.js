import moment from 'moment';

// 从时间戳 转化为年月日
export function timeToDate(time = 0) {
  if (Number(time) === 0) {
    return '--';
  }
  const nowTime = new Date(time);
  return moment(nowTime).format('YYYY-MM-DD HH:mm:ss');
}

// 从时间戳 转化为年月日
export function strToDate(time) {
  const nowTime = new Date(time);
  return moment(nowTime).format('YYYY-MM-DD');
}

// 从时间戳 转化为年月日
export function strToDatetime(time) {
  const nowTime = new Date(time);
  return moment(nowTime).format('YYYY-MM-DD HH:mm:ss');
}
