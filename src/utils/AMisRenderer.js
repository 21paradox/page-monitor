/* eslint-disable */
import React, { SuspOense, lazy } from 'react';
import { render as renderSchema, toast, notice } from 'amis';
import { withRouter } from 'react-router-dom';
import * as utils from './index';

class AMisRendererComp extends React.Component {
  componentDidMount() {
    // toast.error('asdad', 'xx', {
    //   timeOut: 40000,
    //   extendedTimeOut: 6000
    // })
    // console.log(toast.error);
  }

  render() {
    const { schema } = this.props;
    return (
      <div>
        {renderSchema(
          {
            ...schema,
          },
          {
            ...this.props,
            // props
          },
          {
            // env
            // 这些是 amis 需要的一些接口实现
            // 可以参考本项目里面的 Demo 部分代码。

            updateLocation: (location /* 目标地址 */, replace /* 是replace，还是push？ */) => {
              // 用来更新地址栏
            },

            jumpTo: (location /* 目标地址 */) => {
              // 页面跳转， actionType:  link、url 都会进来。
            },

            fetcher: ({ url, method, data, config }) => {
              // 用来发送 Ajax 请求，建议使用 axios
              console.log(method, url, data, config);
              let sendBody = {};
              let query = {}
              if (method.toLowerCase() === 'post' || method.toLowerCase() === 'put') {
                sendBody = data;
              } else if (method.toLowerCase() === 'get') {
                query = data;
              }

              const sendParam = {
                showLoading: false,
                url,
                method,
                query,
                body: sendBody,
              }

              return utils
                .sendRequest(sendParam)
                .then(res => {
                  const resHeaders = res.header;
                  let data = res.body;
                  if (resHeaders['x-range']) {
                    const [, offset, offsetNext, total] = resHeaders['x-range'].match(/(\d+)-(\d+)\/(\d+)/)
                    data = {
                      offset,
                      total,
                      items: res.body
                    }
                  }
                  return {
                    data: {
                      status: 0,
                      msg: '',
                      data,
                    },
                  };
                });
            },
            notify: (type /**/, msg /* 提示内容 */) => {
              // 用来提示用户
              toast[type]
                ? toast[type](msg, type === 'error' ? '系统错误' : '系统消息')
                : console.warn('[Notify]', type, msg);
              console.log('[notify]', type, msg);
            },
            alert: (content /* 提示信息 */) => {
              // 另外一种提示，可以直接用系统框
            },
            confirm: (content /* 提示信息 */) => {
              // 确认框。
            },
          }
        )}
      </div>
    );
  }
}

export const AMisRenderer = withRouter(AMisRendererComp);
