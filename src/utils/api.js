/**
 * @fileOverview admin api
 * @name api.js
 */
import { sendRequest } from './index';

export const reqCheckLogin = param => sendRequest({
  url: '/api/login/check',
  body: param,
}).then(res => res.body);

export const ApiLogin = '/api/login';
