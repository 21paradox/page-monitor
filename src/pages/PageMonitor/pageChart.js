import React, { Component } from 'react';
import { connect } from 'react-redux';
import qs from 'querystring';
import moment from 'moment';
import { AMisRenderer } from '../../utils/AMisRenderer';
/* eslint no-underscore-dangle: 0 */

class CronJobPanel extends Component {
  constructor(...args) {
    super(...args);
    this.query = qs.parse(window.location.search.replace('?', ''));
  }

  render() {
    // console.log(thi)
    const { location } = this.props;
    console.log(this.query, 'location');

    const chartBOdy = {
      type: 'panel',
      title: 'url 访问时间分布',
      name: 'chart-local',
      style: {
        minHeight: '500px',
      },
      body: {
        type: 'chart',
        config: {},
      },
      // perPageField: 'limit',
      // defaultParams: {
      //   limit: 10,
      // },
      api: {
        url: '/api/queryRaw',
        method: 'post',
        data: {
        },
        requestAdaptor: (api) => {
          console.log(api);
          const apiNew = { ...api };
          apiNew.data.sqlQuery = `
          select 
            count(CASE WHEN allTime >= 500 THEN 1 END) as time_le_500,
            count(CASE WHEN allTime >= 200 AND allTIme < 500 THEN 1 END) as time_200_500,
            count(CASE WHEN allTime >= 100 AND allTIme < 200 THEN 1 END) as time_100_200,
            count(CASE WHEN allTime < 100 THEN 1 END) as time_lt_100,
            count(allTime) as allTimeCount,
            avg(allTime), pageId, roundId , runningAt
            from performances 
            left join rounds on performances.roundId = rounds.id
            where pageId = ${this.query.pageId} 
              group by roundId order by roundId desc limit 20 offset 0;
          `;

          return apiNew;
        },
        adaptor(payload) {
          console.log({ payload });
          const dataRaw = payload.data.results.reverse();
          const xAxisData = dataRaw.map(v => moment(v.runningAt).format('MM/DD HH:mm'));
          const getByName = name => dataRaw.map(v => v[name]);


          return {
            ...payload,
            data: {
              color: ['#c23531', '#d48265', '#61a0a8', '#91c7ae'].reverse(),
              tooltip: {
                trigger: 'axis',
                axisPointer: { // 坐标轴指示器，坐标轴触发有效
                  type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
                },
              },
              legend: {
                data: ['0-100ms', '100-200ms', '200-500ms', '>500ms'],
              },
              grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true,
              },
              xAxis: {
                type: 'category',
                data: xAxisData,
              },
              yAxis: {
                type: 'value',
              },
              series: [
                {
                  name: '0-100ms',
                  type: 'bar',
                  stack: '总量',
                  label: {
                    show: true,
                    position: 'insideTop',
                  },
                  barMinHeight: 30,
                  data: getByName('time_lt_100'),
                },
                {
                  name: '100-200ms',
                  type: 'bar',
                  stack: '总量',
                  label: {
                    show: true,
                    position: 'insideTop',
                  },
                  barMinHeight: 30,
                  data: getByName('time_100_200'),
                },
                {
                  name: '200-500ms',
                  type: 'bar',
                  stack: '总量',
                  label: {
                    show: true,
                    position: 'insideTop',
                  },
                  barMinHeight: 30,
                  data: getByName('time_200_500'),
                },
                {
                  name: '>500ms',
                  type: 'bar',
                  stack: '总量',
                  label: {
                    show: true,
                    // position: 'insideTop'
                  },
                  barMinHeight: 30,
                  data: getByName('time_le_500'),
                },
              ],
            },
          };
        },
      },
    };

    const schema = {
      body: [
        chartBOdy,
        {
          type: 'service',
          api: {
            url: '/api/queryRaw',
            method: 'post',
            data: {
            },
            requestAdaptor: (api) => {
              console.log(api);
              const apiNew = { ...api };

              apiNew.data.sqlQuery = `
              select 
               count(CASE WHEN allTime >= 500 THEN 1 END) as time_le_500,
               count(CASE WHEN allTime >= 200 AND allTIme < 500 THEN 1 END) as time_200_500,
               count(CASE WHEN allTime >= 100 AND allTIme < 200 THEN 1 END) as time_100_200,
               count(CASE WHEN allTime < 100 THEN 1 END) as time_lt_100,
               count(allTime) as allTimeCount,
                avg(allTime), 
                pageId, 
                roundId, 
                runningAt, 
                pages.alias as pageName,
                pages.url as pageUrl

             
              from performances 
              left join rounds on performances.roundId = rounds.id
              left join pages on performances.pageId = pages.id
              where pageId = ${this.query.pageId} 
                group by roundId order by roundId desc limit 20 offset 0;
              `;

              return apiNew;
            },
            adaptor(payload) {
              console.log({ payload });

              return {
                ...payload,
              };
            },
          },
          body: [
            {
              type: 'tpl',
              tpl: '<h3>$results.0.pageName</h3>',
            },
            {
              type: 'tpl',
              tpl: '<h4>$results.0.pageUrl</h4>',
            },
            {
              type: 'table',
              // "title": "$results.0.pageName + $results.0.pageUrl",
              source: '$results',
              columns: [
                {
                  type: 'datetime',
                  name: 'runningAt',
                  label: '监控时间',
                },
                {
                  name: 'avg(allTime)',
                  label: '平均时常',
                },
                {
                  name: 'time_lt_100',
                  label: '<100ms次数',
                },
                {
                  name: 'time_100_200',
                  label: '100-200ms次数',
                },
                {
                  name: 'time_200_500',
                  label: '200-500ms次数',
                },
                {
                  name: 'time_le_500',
                  label: '>500ms次数',
                },
              ],
            },
          ],
        },

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
