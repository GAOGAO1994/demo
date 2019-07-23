/* eslint-disable class-methods-use-this */
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Icon,
  Button,
  DatePicker,
  // message,
  Tooltip,
  Progress,
  Drawer,
  Spin,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import LineChart from '@/components/Echarts/LineChart';

import styles from './SystemList.less';

const { RangePicker } = DatePicker;
const { Option } = Select;

const chartMap = {
  cpu: {
    title: 'CPU使用率（%）',
  },
  mem: {
    title: '内存使用率（%）',
  },
};
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

@connect(({ system, loading }) => ({
  system,
  effectsLoading: loading.effects,
}))
class MonitorChart extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      active: 1,
      time: [moment().subtract(6, 'hours'), moment()],
      downsample: '300',
      func: 'max',
    };
  }

  componentDidMount() {
    this.handleFetchChart();
  }

  handleFetchChart = (params = {}) => {
    const { dispatch, values } = this.props;
    const { downsample, func, time } = this.state;
    const endpoints = values && values.map(record => record.endpoint).join(',');

    dispatch({
      type: 'system/fetchChart',
      payload: {
        endpoints, // 查看视图的endpoint列表，必选，以逗号分隔多个
        downsample, // 修改查询数据的抽样时间间隔，时间单位为秒，取值范围为 60~3600, 默认取值为300
        start_time: time && time[0].unix(), // 查询的时间范围的开始时间戳，不传的话默认 从end_time 往前减去6个小时
        end_time: time && time[1].unix(), // 查询的时间范围的截止时间戳， 不传的话 默认取当前时间
        func, // downsample的参数大于60时， 多个值聚合函数。只能填一个 默认为avg。 取值范围为 min,max, avg
        ...params,
      },
      callback: () => {
        // message.success('11111');
      },
    });
  };

  handleDownsampleChange = downsample => {
    this.handleFetchChart({ downsample });
    this.setState({ downsample });
  };

  handleFuncChange = func => {
    this.handleFetchChart({ func });
    this.setState({ func });
  };

  handleTimeChange = momentRange => {
    const params = {
      start_time: momentRange[0].startOf('day').unix(),
      end_time: momentRange[1].endOf('day').unix(),
    };
    this.handleFetchChart(params);
    this.setState({
      active: 0,
      time: [momentRange[0].startOf('day'), momentRange[1].endOf('day')],
    });
  };

  handleQuickTimeChange = type => {
    let momentRange = [];
    switch (type) {
      case 1:
        momentRange = [moment().subtract(6, 'hours'), moment()];
        break;
      case 2:
        momentRange = [moment().subtract(1, 'days'), moment()];
        break;
      case 3:
        momentRange = [moment().subtract(7, 'days'), moment()];
        break;
      default:
        momentRange = [moment().subtract(6, 'hours'), moment()];
        break;
    }
    const params = {
      start_time: momentRange[0].unix(),
      end_time: momentRange[1].unix(),
    };
    this.handleFetchChart(params);
    this.setState({
      active: type,
      time: momentRange,
    });
  };

  render() {
    const { handleChartVisible, chartVisible, effectsLoading } = this.props;
    const { active, time, downsample, func } = this.state;
    const {
      system: { chartData },
    } = this.props;

    const disabledDate = current => {
      // Can not select days after today
      return current && current > moment().endOf('day');
    };

    return (
      <div>
        <Drawer
          width="75%"
          closable={false}
          onClose={() => handleChartVisible(false)}
          visible={chartVisible}
        >
          <div
            justify="space-between"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '0 0 30px',
              borderBottom: '1px solid #ddd',
            }}
          >
            <div style={{ fontSize: 24, fontWeight: 'bold' }}>
              <Icon type="line-chart" />
              &nbsp;&nbsp;系统指标监控
            </div>
            <div>
              <div style={{ display: 'inline-block' }}>
                时间维度：
                <Select
                  defaultValue={downsample}
                  value={downsample}
                  style={{ width: 90 }}
                  onChange={this.handleDownsampleChange}
                >
                  <Option value="60">1min</Option>
                  <Option value="300">5min</Option>
                </Select>
              </div>
              <div style={{ display: 'inline-block', margin: '0 10px' }}>
                采样方式：
                <Select
                  defaultValue={func}
                  value={func}
                  style={{ width: 90 }}
                  onChange={this.handleFuncChange}
                >
                  <Option value="max">MAX</Option>
                  <Option value="min">MIN</Option>
                  <Option value="avg">AVERAGE</Option>
                </Select>
              </div>
              <div style={{ display: 'inline-block' }}>
                时间：
                <RangePicker
                  allowClear={false}
                  style={{ width: 240 }}
                  disabledDate={disabledDate}
                  defaultValue={time}
                  value={time}
                  onChange={this.handleTimeChange}
                />
                {active === 1 ? (
                  <span className={`${styles.quickTimePicker} ${styles.quickTimePickerActive}`}>
                    近6小时
                  </span>
                ) : (
                  <span
                    className={styles.quickTimePicker}
                    onClick={() => this.handleQuickTimeChange(1)}
                  >
                    近6小时
                  </span>
                )}
                {active === 2 ? (
                  <span className={`${styles.quickTimePicker} ${styles.quickTimePickerActive}`}>
                    近1天
                  </span>
                ) : (
                  <span
                    className={styles.quickTimePicker}
                    onClick={() => this.handleQuickTimeChange(2)}
                  >
                    近1天
                  </span>
                )}
                {active === 3 ? (
                  <span className={`${styles.quickTimePicker} ${styles.quickTimePickerActive}`}>
                    近7天
                  </span>
                ) : (
                  <span
                    className={styles.quickTimePicker}
                    onClick={() => this.handleQuickTimeChange(3)}
                  >
                    近7天
                  </span>
                )}
              </div>
            </div>
          </div>
          <Spin spinning={effectsLoading['system/fetchChart']} tip="Loading..." size="large">
            <div className={styles.chartContent}>
              {chartData &&
                chartData.items &&
                chartData.items.map((item, index) => {
                  const charType =
                    chartMap[item && item[0] && item[0].dimensions && item[0].dimensions[1]];
                  return (
                    <LineChart
                      key={index} // eslint-disable-line
                      dataset={item}
                      title={
                        charType
                          ? charType.title
                          : `${item &&
                              item[0] &&
                              item[0].dimensions &&
                              item[0].dimensions[1]}磁盘使用率（%）`
                      }
                    />
                  );
                })}
              {chartData && chartData.total <= 0 && (
                <p
                  style={{
                    height: '90%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  暂无视图数据，请调整参数
                </p>
              )}
            </div>
          </Spin>
        </Drawer>
      </div>
    );
  }
}

/* eslint react/no-multi-comp:0 */
@connect(({ system, loading }) => ({
  system,
  effectsLoading: loading.effects,
}))
@Form.create()
class SystemList extends PureComponent {
  state = {
    chartVisible: false,
    selectedRows: [],
    pagination: {
      current: 1,
      pageSize: 10,
    },
    searchKey: undefined,
    chartValues: [],
  };

  columns = [
    {
      title: () => (
        <Fragment>
          主机列表&nbsp;
          <Tooltip
            title="点击主机名称可直接查看详细监控数据"
            overlayClassName={styles.systemTooltip}
          >
            <Icon style={{ color: '#bbb', fontSize: 13 }} type="info-circle-o" />
          </Tooltip>
        </Fragment>
      ),
      dataIndex: 'endpoint',
      render: (text, record) =>
        record && record.details ? (
          <a href={record.details} rel="noopener noreferrer" target="_blank">
            {text}
          </a>
        ) : (
          <span>{text}</span>
        ),
    },
    {
      title: this.renderColumnTitle('CPU'),
      dataIndex: 'cpu',
      render: text => this.renderProgress(text),
    },
    {
      title: this.renderColumnTitle('内存'),
      dataIndex: 'mem',
      render: text => this.renderProgress(text),
    },
    {
      title: this.renderColumnTitle('磁盘'),
      dataIndex: 'disk',
      render: text => this.renderProgress(text),
    },
    {
      title: '可视化',
      width: 95,
      render: (text, record) => (
        <a onClick={() => this.handleChartVisible(true, record)}>查看视图</a>
      ),
    },
  ];

  componentDidMount() {
    this.handleFetch();
  }

  handleFetch = (params = {}) => {
    const { dispatch } = this.props;
    const { pagination, searchKey } = this.state;

    dispatch({
      type: 'system/fetch',
      payload: {
        _page: pagination.current, // 不传默认 1
        _num: pagination.pageSize,
        endpoint: searchKey,
        ...params,
      },
    });
  };

  handleSearch = value => {
    const { pagination } = this.state;
    const searchValue = value.trim();
    this.setState({
      pagination: {
        current: 1,
        pageSize: pagination.pageSize,
      },
      searchKey: searchValue || undefined,
      selectedRows: [],
    });
    const params = {
      _page: 1,
      endpoint: searchValue || undefined,
    };
    this.handleFetch(params);
  };

  handleChartVisible = (flag, record) => {
    const { dispatch } = this.props;

    dispatch({
      type: 'system/saveChartData',
      payload: {
        items: [],
        total: 0,
      },
    });
    this.setState({
      chartVisible: !!flag,
      chartValues: Array.isArray(record) ? record : [record],
    });
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleSearchChange = event => {
    this.setState({ searchKey: event.target.value });
  };

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      _page: pagination.current,
      _num: pagination.pageSize,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    this.setState({
      pagination,
      selectedRows: [], // hack 翻页清空选择项，但此处如果不是翻页触发有 bug，待优化
    });

    this.handleFetch(params);
  };

  renderColumnTitle(title) {
    return (
      <Fragment>
        {title}&nbsp;
        <Tooltip
          title={
            <Fragment>
              <Row>
                <Col span={16}>0~70</Col>
                <Col span={8} style={{ color: '#40CC99' }}>
                  绿色
                </Col>
              </Row>
              <Row>
                <Col span={16}>70~90</Col>
                <Col span={8} style={{ color: '#FACC67' }}>
                  黄色
                </Col>
              </Row>
              <Row>
                <Col span={16}>90~100</Col>
                <Col span={8} style={{ color: '#F40003' }}>
                  红色
                </Col>
              </Row>
              <Row style={{ marginTop: 10 }}>
                最近5分钟的平均数据
                <br />
                {title === '磁盘' && '(显示多个磁盘的最大值)'}
              </Row>
            </Fragment>
          }
          overlayClassName={styles.systemTooltip}
        >
          <Icon style={{ color: '#bbb', fontSize: 13 }} type="info-circle-o" />
        </Tooltip>
      </Fragment>
    );
  }

  renderProgress(text) {
    let content;

    // https://github.com/airbnb/javascript#standard-library--isnan
    // 29.1 Use Number.isNaN instead of global isNaN. eslint: no-restricted-globals
    // const isNumber = value => !Number.isNaN(parseFloat(value));
    // Number.isNaN 与 isNaN 的区别: https://juejin.im/post/59f7c5f551882529452fba6b
    if (Number.isNaN(parseFloat(text))) {
      // eslint-disable-line
      content = <div style={{ textAlign: 'center' }}>-</div>;
    } else {
      const value = Number(text);
      let color;
      if (value <= 70) {
        color = '#40CC99';
      } else if (value > 90) {
        color = '#F40003';
      } else {
        color = '#FACC67';
      }
      content = (
        <Progress
          className={styles.systemProgress}
          percent={Number(value.toFixed(2))}
          strokeWidth={20}
          strokeColor={color}
        />
      );
    }

    return content;
  }

  render() {
    const {
      system: { data },
      effectsLoading,
    } = this.props;
    const { searchKey, selectedRows, pagination, chartVisible, chartValues } = this.state;

    const chartMethods = {
      handleChartVisible: this.handleChartVisible,
    };
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.systemList}>
            <div className={styles.systemListOperator}>
              {selectedRows.length < 2 ? (
                <Button disabled>批量查看视图</Button>
              ) : (
                <span>
                  <Button onClick={() => this.handleChartVisible(true, selectedRows)}>
                    批量查看视图
                  </Button>
                  &nbsp;&nbsp;已选择 {selectedRows.length} 条
                </span>
              )}
              <Input.Search
                style={{ width: 350, float: 'right' }}
                placeholder="输入主机名称进行搜索"
                enterButton="搜索"
                value={searchKey}
                onChange={this.handleSearchChange}
                onSearch={this.handleSearch}
              />
            </div>
            <StandardTable
              rowKey="endpoint"
              selectedRows={selectedRows}
              loading={effectsLoading['system/fetch']}
              data={data}
              pagination={pagination}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        {chartVisible ? (
          <MonitorChart {...chartMethods} chartVisible={chartVisible} values={chartValues} />
        ) : null}
      </PageHeaderWrapper>
    );
  }
}

export default SystemList;
