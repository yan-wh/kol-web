
const url = localStorage.getItem('region') || 'shenzhen';

let apiUrl = '';

switch (url) {
  case 'shenzhen':
    apiUrl = 'sz-api';
    break;
  case 'beijing':
    apiUrl = 'bj-api';
    break;
  default:
    apiUrl = 'sz-api';
}

export default apiUrl;
