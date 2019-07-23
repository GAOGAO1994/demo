import React, { PureComponent } from 'react';
import moment from 'moment';
import echarts from 'echarts/lib/echarts';
import ReactEcharts from './index';

// // import the core library.
// import ReactEchartsCore from './core';

// // then import echarts modules those you have used manually.
// import 'echarts/lib/chart/line';
// import 'echarts/lib/component/title';
// import 'echarts/lib/component/legend';
// import 'echarts/lib/component/tooltip';
// import 'echarts/lib/component/grid';

export default class LineChart extends PureComponent {
  // constructor(props) {
  //   super(props);
  // }

  getOption = () => {
    const { dataset, title, yName, noBorder } = this.props;
    const legendConfig = noBorder
      ? {
          bottom: 10,
        }
      : {
          orient: dataset && dataset.length > 5 ? 'vertical' : 'horizontal',
          right: dataset && dataset.length > 5 ? 10 : '5%',
          top: 25,
          bottom: 50,
          formatter(name) {
            return echarts.format.truncateText(name, 100, '14px Microsoft Yahei', '…');
          },
          tooltip: {
            show: true,
          },
        };
    const titleText = echarts.format.truncateText(title, 350, '14px Microsoft Yahei', '…');

    // 使用多个 dataset，将同一组数据聚合在一个 source 数组，数组里每一个对象代表一个点
    return {
      // color: ['#c23531','#2f4554', '#61a0a8', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3'],
      // color: [ "#516b91", "#59c4e6", "#edafda", "#93b7e3", "#a5e7f0", "#cbb0e3"],
      color: [
        '#F77F5F',
        '#3ECC66',
        '#808BC6',
        '#c6e579',
        '#d7504b',
        '#60c0dd',
        '#f3a43b',
        '#fad860',
        '#9bca63',
        '#fe8463',
        '#b5c334',
        '#e87c25',
        '#fcce10',
        '#27727b',
        '#c1232b',
      ],
      // color: [ "#26c0c0", "#f0805a", "#f4e001", "#c6e579", "#d7504b", "#60c0dd", "#f3a43b", "#fad860", "#9bca63", "#fe8463", "#b5c334", "#e87c25", "#fcce10", "#27727b", "#c1232b"],
      title: {
        text: titleText,
        padding: [
          5, // 上
          5, // 右
          5, // 下
          30, // 左
        ],
      },
      legend: {
        type: 'scroll',
        width: '75%',
        data:
          dataset &&
          dataset.map(item => {
            const typeName = item && item.dimensions && item.dimensions[2];
            return {
              name: item && item.source && item.source[0] && item.source[0][typeName],
              // 强制设置图形为圆
              icon: 'circle',
            };
          }),
        ...legendConfig,
      },
      tooltip: {
        trigger: 'axis',
      },
      grid: {
        left: 30,
        top: yName ? 60 : 50, // 默认 60
        right: !noBorder && dataset && dataset.length > 5 ? 130 : 50,
        bottom: noBorder ? 40 : '5%',
        containLabel: true,
      },
      // xAxis : [
      //   {
      //     type: 'category',
      //     boundaryGap: false,
      //   }
      //   // {
      //   //   type: 'time',
      //   //   boundaryGap: ['20%', '20%'],
      //   // }
      // ],
      xAxis: {
        type: 'category',
        boundaryGap: true, // X 轴不从 0 开始
        // name: '时间', // 待优化：画空图时横轴显示时间
        axisTick: {
          alignWithLabel: true,
        },
        axisLabel: {
          formatter(value) {
            // 暂时格式化成 年-月-日 时:分
            // 待优化交互要求：当时间（X 轴范围）在一天之内时，只显示小时和分钟（例：11:11）。当时间大于一天的时候，时间以天为单位，时、分、秒去掉。
            return moment(value).format('YYYY-MM-DD HH:mm');
          },
          // showMinLabel: true, // 是否显示最小 tick 的 label
          // showMaxLabel: true, // 是否显示最大 tick 的 label
        },

        // type: 'time',
        // boundaryGap: ['20%', '20%'],
      },
      yAxis: {
        name: yName,
        splitLine: {
          // 去掉网格线
          show: false,
        },
        axisTick: {
          // 去掉刻度
          show: false,
        },
      },
      dataset,
      // Declare several bar series, each will be mapped
      // to a column of dataset.source by default.
      series:
        dataset &&
        dataset.map((item, index) => {
          const typeName = item && item.dimensions && item.dimensions[2];
          return {
            type: 'line',
            name: item && item.source && item.source[0] && item.source[0][typeName],
            // symbolSize: 8,
            // 使用序号为 index 的 dataset
            datasetIndex: index,
          };
        }),
    };
  };

  render() {
    const { noBorder, height } = this.props;
    const style = noBorder
      ? {
          height: height || 300,
          // marginBottom: 30,
          paddingTop: 10,
        }
      : {
          height: height || 400,
          margin: '30px 40px',
          border: '1px solid #ddd',
          paddingTop: 10,
        };

    return (
      <ReactEcharts
        option={this.getOption()}
        notMerge
        style={style}
        // className='react_for_echarts'
        // notMerge={true}
        // lazyUpdate={true}
        // theme={"theme_name"}
        // onChartReady={this.onChartReadyCallback}
        // onEvents={EventsDict}
        // opts={}
      />
    );
  }
}
