import env from '../../build/env';

let baseUrl;
switch (env) {
    case 'development':
        baseUrl = 'http://127.0.0.1:8001/';
        break;
    case 'production':
        baseUrl = 'http://39.105.125.189:8001/';
        break;
    default:
        baseUrl = 'https://debug.url.com';
        break;
}

export {
    baseUrl
};
