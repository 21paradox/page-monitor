import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AMisRenderer } from '../../utils/AMisRenderer';
/* eslint no-underscore-dangle: 0 */

class InviteCodeDashboard extends Component {
  render() {
    const crudBody = {
      type: 'crud',
      name: 'pageList',
      initFetch: true,
      syncLocation: false,
      perPageField: 'limit',
      headerToolbar: [],
      source: '$items',
      defaultParams: {
        limit: 10,
      },
      api: {
        url: '/api-restql/page',
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
      quickSaveItemApi: {
        url: '/api-restql/page',
        method: 'put',
        data: {
          url: '$url',
          alias: '$alias',
          id: '$id',
        },
      },
      columns: [
        {
          name: 'url',
          label: 'url',
          type: 'text',
          // "quickEdit": {
          //   saveImmediately: true,
          // },
        },
        {
          name: 'alias',
          label: '别名',
          type: 'text',
          // "quickEdit": {
          //   saveImmediately: true,
          // },
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
                  api: {
                    url: '/api-restql/page',
                    method: 'put',
                    data: {
                      url: '$url',
                      alias: '$alias',
                      id: '$id',
                    },
                  },
                  controls: [
                    {
                      type: 'text',
                      name: 'url',
                      label: 'url',
                      required: true,
                    },
                    {
                      type: 'divider',
                    },
                    {
                      type: 'text',
                      name: 'alias',
                      label: 'alias',
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
                body: '确定删除 ${url} 吗',
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
                    reload: 'pageList',
                    actionType: 'ajax',
                    label: '确定',
                    api: {
                      url: '/api-restql/page/$id',
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
      ],
    };

    const schema = {
      title: '链接配置',
      body: [
        {
          type: 'button',
          actionType: 'dialog',
          label: '新增url',
          icon: 'fa fa-plus pull-left',
          primary: true,
          dialog: {
            title: '新增url',
            body: {
              type: 'form',
              // reload: 'pageList',
              api: {
                url: '/api-restql/page',
                method: 'post',
                data: {
                  url: '$url',
                  alias: '$alias',
                },
              },
              controls: [
                {
                  type: 'text',
                  name: 'url',
                  label: 'url',
                  required: true,
                },
                {
                  type: 'divider',
                },
                {
                  type: 'text',
                  name: 'alias',
                  label: 'alias',
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

export default connect()(InviteCodeDashboard);
