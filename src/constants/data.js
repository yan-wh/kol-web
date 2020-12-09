import React from 'react';
import { fromJS, List } from 'immutable';
import { Modal, Alert, message } from 'antd';

export const PREVIEW_LIMIT_SIZE = 10;
export const UPLOAD_LIMIT_SIZE = 100;
export const DOWNLOAD_LIMIT_SIZE = 100;
export const PREVIEW_LIMIT_EXTENSION = [
  'pdf',
  'png',
  'svg',
  'txt',
  'vcf',
  'csv',
  'bed',
  'ini',
  'log',
];

export function checkDataName(name) {
  return (
    name !== undefined &&
    name.length >= 1 &&
    name.length <= 256 &&
    !/^\.+|[\s~?:*$|&/\\()"\[\]{}<>]+|\.+$/g.test(name)
  );
}

function checkFullAuth(authorized, necessary) {
  authorized = authorized.authorized_methods;
  necessary = necessary.toArray();
  for (let nece in necessary) {
    if (authorized.indexOf(necessary[nece]) == -1) {
      return false;
    }
  }
  return true;
}

export function checkButtonActiveRule(rule, selectData) {
  selectData = new List(selectData);
  rule = fromJS(rule).filterNot((value, method) => {
    switch (method) {
      case 'radio':
        return new List(selectData).size === 1;
      case 'multiple':
        return new List(selectData).size >= 1;
      case 'admin':
        // FIXME: 使用 auth.isAdmin()
        return GeneDockGlobal.userName === 'admin';
      case 'owner':
        return GeneDockGlobal.accountName === value;
      case 'status':
        return selectData.filterNot(data => value.includes(data.status)).size === 0;
      case 'unstates':
        return selectData.filter(data => value.includes(data.status)).size === 0;
      case 'type':
        return selectData.filterNot(data => value.includes(data.type)).size === 0;
      case 'auth':
        return selectData.filter(data => checkFullAuth(data, value)).size == selectData.size;

      default:
        return false;
    }
  });
  return rule.size === 0;
}

function showClientDownloadCMD(account, path, name, hint) {
  Modal.confirm({
    maskClosable: true,
    iconType: 'jinggao',
    content: (
      <div>
        {hint}
        <Alert
          type="warning"
          style={{ marginTop: '10px' }}
          message={`genedock download /${account}${path}${name}`}
        />
      </div>
    ),
    okText: '确认',
    cancelText: '取消',
    className: 'gd-modal gd-confirm-danger',
  });
}
export function downloadData(account, path, name, entityId, size) {
  if (size >>> 20 >= DOWNLOAD_LIMIT_SIZE) {
    showClientDownloadCMD(account, path, name, '该数据大小超过100MB, 请通过数据客户端下载:');
    return Promise.reject();
  }

  // return getDataDownloadProcess(account, entityId).then(res => {
  //   if (res.blocks.length === 1 && !res.compression_type) {
  //     // return getDownloadUrl(account, entityId, name).then(url => {
  //     //   location.href = url;
  //     //   return url;
  //     // }, err => {
  //     //   message.error(err.error_message_chs, 5);
  //     //   return Promise.reject();
  //     // });
  //   }
  //
  //   showClientDownloadCMD(
  //     account,
  //     path,
  //     name,
  //     '该数据已经过客户端优化压缩处理, 请通过数据客户端下载:');
  //   return Promise.reject();
  // }, err => {
  //   message.error(err.error_message_chs, 5);
  //   return Promise.reject();
  // });
}

// 文件大小转化
export function stringToData(fileSize) {
  const size = parseFloat(fileSize);
  const type = fileSize.replace(/.\d+/g, '');
  // console.log('type', type);

  // console.log('type', size);
  let total = 0;
  switch (type) {
    case 'B':
      total = size;
      break;
    case 'KB':
      total = size * 1024;
      break;
    case 'M':
      total = size * 1024 * 1024;
      break;
    case 'G':
      total = size * 1024 * 1024 * 1024;
      break;
    case 'T':
      total = size * 1024 * 1024 * 1024 * 1024;
      break;
    default:
      total = 0;
      break;
  }

  return total;
}

// 判断浏览器
export function browser() {
  const userAgent = navigator.userAgent;
  const isOpera = userAgent.indexOf('Opera') > -1;
  const isMaxthon = userAgent.indexOf('Maxthon') > -1;
  const isIE = userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE') > -1 && !isOpera;
  const isFF = userAgent.indexOf('Firefox') > -1;
  const isSafari = userAgent.indexOf('Safari') > -1 && userAgent.indexOf('Chrome') < 1;
  const isChrome = userAgent.indexOf('Chrome') > -1;

  if (isOpera) {
    return 'Opera';
  } else if (isMaxthon) {
    return 'Maxthon';
  } else if (isIE) {
    return 'IE';
  } else if (isFF) {
    return 'Firefox';
  } else if (isSafari) {
    return 'Safari';
  } else if (isChrome) {
    return 'Chrome';
  }
}

export function numberToData(fileSize = 0) {
  if (fileSize === 0) {
    return;
  }
  const size = Number(fileSize);
  let total = 0;
  let type = '';
  if (size < 1024) {
    total = size;
    type = 'B';
  } else if (size < 1024 * 1024) {
    total = size / 1024;
    type = 'KB';
  } else if (size < 1024 * 1024 * 1024) {
    total = size / (1024 * 1024);
    type = 'MB';
  } else {
    total = size / (1024 * 1024 * 1024);
    type = 'G';
  }

  return total.toFixed(2) + type;
}
