import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Link,
} from 'react-router-dom';
import { AMisRenderer } from '../../utils/AMisRenderer';
import * as constant from '../../constants';

const { PATH_PREFIX } = constant;
/* eslint no-underscore-dangle: 0 */

class CronJobPanel extends Component {
  render() {
    const crudBody = {
      type: 'crud',
      name: 'cronJobList',
      initFetch: true,
      syncLocation: false,
      perPageField: 'limit',
      headerToolbar: [],
      source: '$items',
      defaultParams: {
        limit: 10,
      },
      api: {
        url: '/api/restql/cron?_include=page',
        method: 'get',
        qsOptions: {
          arrayFormat: 'repeat',
          encodeValuesOnly: true,
        },
        data: {
          _limit: '$limit',
          _offset: '${page | pageToOffset:10}',
        },
      },
      columns: [
        {
          name: 'jobName',
          label: '任务名字',
          type: 'text',
        },
        {
          name: 'jobState',
          label: '任务状态',
          type: 'text',
        },
        {
          name: 'runningInterval',
          label: '运行间隔',
          type: 'text',
        },
        {
          name: 'page.url',
          label: 'pageUrl',
          type: 'text',
        },
        {
          type: 'operation',
          name: 'del',
          label: '操作',
          buttons: [
            {
              type: 'button',
              icon: 'fa fa-pencil',
              tooltip: '编辑',
              actionType: 'drawer',
              drawer: {
                position: 'left',
                size: 'lg',
                title: '编辑',
                body: {
                  type: 'form',
                  // reload: 'pageList',
                  api: {
                    url: '/api/restql/cron',
                    method: 'put',
                    data: {
                      id: '$id',
                      pageId: '$pageId',
                      jobName: '$jobName',
                      runningInterval: '$runningInterval',
                      jobState: '$jobState',
                    },
                  },
                  controls: [
                    {
                      type: 'select',
                      name: 'pageId',
                      label: '监控url',
                      clearable: true,
                      required: true,
                      value: 'page.id',
                      source: {
                        url: '/api/restql/page',
                        method: 'get',
                        qsOptions: {
                          arrayFormat: 'repeat',
                          encodeValuesOnly: true,
                        },
                        adaptor(payload) {
                          return {
                            status: 0,
                            msg: '',
                            data: {
                              options: payload.data.items.map(v => ({
                                value: v.id,
                                label: v.url,
                              })),
                            },
                          };
                        },
                      },
                    },
                    {
                      type: 'text',
                      name: 'jobName',
                      label: '任务名',
                      required: true,
                    },
                    {
                      type: 'select',
                      name: 'jobState',
                      label: '任务状态',
                      clearable: true,
                      required: true,
                      options: [
                        {
                          value: 'running',
                          label: 'running',
                        },
                        {
                          value: 'stopped',
                          label: 'stopped',
                        },
                      ],
                    },
                    {
                      type: 'select',
                      name: 'runningInterval',
                      label: '周期',
                      clearable: true,
                      required: true,
                      options: [
                        {
                          value: '1hour',
                          label: '1hour',
                        },
                        {
                          value: '1day',
                          label: '1day',
                        },
                      ],
                      value: '1hour',
                    },
                  ],
                },
              },
            },
            {
              type: 'button',
              icon: 'fa fa-times text-danger',
              actionType: 'dialog',
              dialog: {
                title: '提示',
                closeOnEsc: true,
                body: '确定删除 ${jobName} 吗',
                actions: [
                  {
                    type: 'button',
                    actionType: 'cancel',
                    close: true,
                    level: 'secondary',
                    label: '取消',
                  },
                  {
                    type: 'button',
                    level: 'primary',
                    reload: 'cronJobList',
                    actionType: 'ajax',
                    label: '确定',
                    api: {
                      url: '/api/restql/cron/$id',
                      method: 'delete',
                      data: {
                        where: {
                          id: '$id',
                        },
                      },
                    },
                    messages: {
                      success: '删除成功',
                    },
                    close: true,
                  },
                ],
              },
            },
          ],
        },
        {
          type: 'text',
          name: '',
          label: '详情',
          children($props) {
            return (
              <td>
                <span className="a-PlainField">
                  <Link to={`${PATH_PREFIX}/page-chart?pageId=${$props.data.pageId}`}>
                  详情
                  </Link>
                </span>
              </td>
            );
          },
        },
      ],
    };

    const schema = {
      title: '定时任务配置',
      body: [
        {
          type: 'button',
          actionType: 'dialog',
          label: '新增定时任务',
          icon: 'fa fa-plus pull-left',
          primary: true,
          dialog: {
            title: '新增定时任务',
            body: {
              type: 'form',
              // reload: 'pageList',
              api: {
                url: '/api/restql/cron',
                method: 'post',
                data: {
                  pageId: '$pageId',
                  jobName: '$jobName',
                  runningInterval: '$runningInterval',
                  jobState: 'running',
                },
              },
              controls: [
                {
                  type: 'select',
                  name: 'pageId',
                  label: '监控url',
                  clearable: true,
                  required: true,
                  source: {
                    url: '/api/restql/page',
                    method: 'get',
                    qsOptions: {
                      arrayFormat: 'repeat',
                      encodeValuesOnly: true,
                    },
                    adaptor(payload) {
                      console.log(payload, 'payload');
                      return {
                        status: 0,
                        msg: '',
                        data: {
                          options: payload.data.items.map(v => ({
                            value: v.id,
                            label: v.url,
                          })),
                          // "value": "值" // 默认值，可以获取列表的同时设置默认值。
                        },
                      };
                    },
                  },
                },
                {
                  type: 'text',
                  name: 'jobName',
                  label: '任务名',
                  required: true,
                },
                {
                  type: 'select',
                  name: 'runningInterval',
                  label: '周期',
                  clearable: true,
                  required: true,
                  options: [
                    {
                      value: '1hour',
                      label: '1hour',
                    },
                    {
                      value: '1day',
                      label: '1day',
                    },
                  ],
                  value: '1hour',
                },
              ],
            },
          },
        },

        {
          children() {
            return <div style={{ height: 20 }} />;
          },
        },
        crudBody,
      ],
    };

    return (
      <div>
        <AMisRenderer schema={schema} />
      </div>
    );
  }
}

export default connect()(CronJobPanel);
