import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
  // Row,
  // Col,
  Card,
  Form,
  Input,
  Select,
  Button,
  DatePicker,
  Modal,
  message,
  Checkbox,
  Pagination,
  Alert,
  Drawer,
  Icon,
  Spin,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import LineChart from '@/components/Echarts/LineChart';

import styles from './CustomList.less';
// import Center from '@/pages/Account/Center/Center';

const { RangePicker } = DatePicker;
const { Option } = Select;
const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

@connect(({ custom, loading }) => ({
  custom,
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
    const {
      dispatch,
      values,
      checkedList,
      custom: { endpointData },
    } = this.props;
    const { downsample, func, time } = this.state;

    let checkedEndpoints = [];

    checkedList.forEach(id => {
      checkedEndpoints = checkedEndpoints.concat(
        endpointData &&
          endpointData.items &&
          endpointData.items.filter(item => item.endpoint_id === id)
      );
    });
    const endpoint = checkedEndpoints.map(item => item.endpoint).join(',');
    const metric = values && values.map(record => record.graph_metric).join('|');

    dispatch({
      type: 'custom/fetchChart',
      payload: {
        metric, // 完整指标（包含指标名和tags），可支持多个，以“|”分隔
        endpoint, // 完整的endpoint名，可支持多个，以逗号分隔
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
      custom: { chartData },
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
              &nbsp;&nbsp;自定义指标监控
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
          <Spin spinning={effectsLoading['custom/fetchChart']} tip="Loading..." size="large">
            <div className={styles.chartContent}>
              {chartData &&
                chartData.items &&
                chartData.items.map((item, index) => {
                  return (
                    <LineChart
                      // eslint-disable-next-line react/no-array-index-key
                      key={index}
                      dataset={item}
                      title={item && item[0] && item[0].dimensions && item[0].dimensions[1]}
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
@connect(({ custom, loading }) => ({
  custom,
  effectsLoading: loading.effects,
}))
@Form.create()
class CustomList extends PureComponent {
  state = {
    chartVisible: false,
    chartValues: [],
    deleteModalVisible: false,
    deleteFormValues: [],
    selectedRows: [],
    pagination: {
      current: 1,
      pageSize: 10,
    },
    endpointPagination: {
      current: 1,
      pageSize: 16,
    },
    checkedList: [],
    indeterminate: false,
    checkAll: false,
    endpoints: '',
    metric: '',
  };

  columns = [
    {
      title: '指标名',
      dataIndex: 'metric',
    },
    {
      title: 'Tag',
      dataIndex: 'tags',
    },
  ];

  componentDidMount() {
    this.handleFetch();
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const {
      dispatch,
      custom: { endpointData },
    } = this.props;
    const { endpoints, metric } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      metric_page: pagination.current,
      metric_num: pagination.pageSize,
      endpoint_ids:
        endpointData &&
        endpointData.items &&
        endpointData.items.map(endpoint => endpoint.endpoint_id).join(','),
      endpoints,
      metric,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    this.setState({
      pagination,
      selectedRows: [], // hack 翻页清空选择项，但此处如果不是翻页触发有 bug，待优化
    });

    dispatch({
      type: 'custom/fetchMetricPages',
      payload: params,
    });
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  onCheckboxChange = checkedList => {
    const {
      custom: { endpointData },
    } = this.props;
    const { selectedRows } = this.state;

    this.setState({
      checkedList,
      indeterminate: !!checkedList.length && checkedList.length < endpointData.items.length,
      checkAll: checkedList.length === endpointData.items.length,
      selectedRows: checkedList.length ? selectedRows : [],
    });
  };

  onCheckAllChange = e => {
    const {
      custom: { endpointData },
    } = this.props;
    const { selectedRows } = this.state;

    this.setState({
      checkedList: e.target.checked
        ? endpointData &&
          endpointData.items &&
          endpointData.items.map(endpoint => endpoint.endpoint_id)
        : [],
      indeterminate: false,
      checkAll: e.target.checked,
      selectedRows: e.target.checked ? selectedRows : [],
    });
  };

  handleEndpointPaginationChange = (page, pageSize) => {
    const { endpoints, metric, pagination } = this.state;

    const params = {
      endpoint_page: page,
      endpoint_num: pageSize,
      metric_page: 1,
      metric_num: pagination.pageSize,
      endpoints,
      metric,
    };

    this.handleFetch(params);

    this.setState({
      checkedList: [],
      selectedRows: [],
      indeterminate: false,
      checkAll: false,
      pagination: {
        current: 1,
        pageSize: pagination.pageSize,
      },
      endpointPagination: {
        current: page,
        pageSize,
      },
    });
  };

  handleDeleteEndpoint = () => {
    const {
      custom: { endpointData },
      dispatch,
    } = this.props;
    const { checkedList } = this.state;

    let checkedEndpoints = [];

    checkedList.forEach(id => {
      checkedEndpoints = checkedEndpoints.concat(
        endpointData.items.filter(item => item.endpoint_id === id)
      );
    });

    Modal.confirm({
      title: '提示',
      content: `确认要移除${checkedEndpoints.map(item => item.endpoint).join('、')}这${
        checkedList.length
      }个主机吗？`,
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        dispatch({
          type: 'custom/removeEndpoint',
          payload: {
            endpoints: checkedList.join(','),
          },
          callback: () => {
            message.success('移除成功');
            this.handleSearch();
          },
        });
      },
      onCancel: () => {
        // console.log('Cancel');
      },
    });
  };

  handleFetch = (params = {}) => {
    const { dispatch } = this.props;
    const { endpointPagination, pagination } = this.state;

    dispatch({
      type: 'custom/fetch',
      payload: {
        metric_page: pagination.current, // 不传默认 1
        metric_num: pagination.pageSize,
        endpoint_page: endpointPagination.current, // 不传默认 1
        endpoint_num: endpointPagination.pageSize,
        ...params,
      },
    });
  };

  handleSearch = () => {
    const { form } = this.props;
    const { endpointPagination, pagination } = this.state;

    form.validateFields((err, values) => {
      if (err) return;

      const endpoints = values.endpoints && values.endpoints.trim();
      const metric = values.metric && values.metric.trim();

      form.setFieldsValue({
        endpoints,
        metric,
      });

      const params = {
        endpoints,
        metric,
        metric_page: 1,
        metric_num: pagination.pageSize,
        endpoint_page: 1,
        endpoint_num: endpointPagination.pageSize,
      };
      this.handleFetch(params);

      this.setState({
        checkedList: [],
        selectedRows: [],
        indeterminate: false,
        checkAll: false,
        endpoints,
        metric,
        pagination: {
          current: 1,
          pageSize: pagination.pageSize,
        },
        endpointPagination: {
          current: 1,
          pageSize: endpointPagination.pageSize,
        },
      });
    });
  };

  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
    this.setState({
      endpoints: '',
      metric: '',
    });
    this.handleSearch();
  };

  handleChartVisible = (flag, record) => {
    const { dispatch } = this.props;

    dispatch({
      type: 'custom/saveChartData',
      payload: {
        items: [],
        total: 0,
      },
    });
    this.setState({
      chartVisible: !!flag,
      chartValues: record || [],
    });
  };

  handleDeleteModalVisible = (flag, record) => {
    this.setState({
      deleteModalVisible: !!flag,
      deleteFormValues: record || [],
    });
  };

  handleDelete = fields => {
    const { dispatch } = this.props;
    const { checkedList } = this.state;

    dispatch({
      type: 'custom/removeMetric',
      payload: {
        endpoints: checkedList.join(','),
        metrics: fields.map(item => item.graph_metric).join('|'),
      },
      callback: () => {
        message.success('移除成功');
        this.handleSearch();
        this.handleDeleteModalVisible();
      },
    });
  };

  renderDeleteModal() {
    const { effectsLoading } = this.props;
    const { deleteModalVisible, deleteFormValues } = this.state;

    const {
      custom: { endpointData },
    } = this.props;
    const { checkedList } = this.state;

    let checkedEndpoints = [];

    checkedList.forEach(id => {
      checkedEndpoints = checkedEndpoints.concat(
        endpointData.items.filter(item => item.endpoint_id === id)
      );
    });

    return (
      <Modal
        destroyOnClose
        title="提示"
        visible={deleteModalVisible}
        confirmLoading={effectsLoading['custom/removeMetric']}
        onOk={() => this.handleDelete(deleteFormValues)}
        onCancel={() => this.handleDeleteModalVisible()}
      >
        <p style={{ textAlign: 'center', fontSize: '16px', color: '#222', margin: '30px' }}>
          确认要移除
          <span style={{ color: '#1890FF' }}>
            {checkedEndpoints.map(item => item.endpoint).join('、')}
          </span>
          里面的
          <span style={{ color: '#1890FF' }}>
            {deleteFormValues.map(item => item.metric).join(',')}
          </span>
          吗？
        </p>
      </Modal>
    );
  }

  renderSearchForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form layout="inline" className={styles.customContainer}>
        <FormItem label="主机名">
          {getFieldDecorator('endpoints')(<Input placeholder="输入主机关键字" />)}
        </FormItem>
        <FormItem label="指标名">
          {getFieldDecorator('metric')(<Input placeholder="输入指标关键字" />)}
        </FormItem>
        <FormItem style={{ marginLeft: 20 }}>
          <Button type="primary" onClick={this.handleSearch}>
            搜索
          </Button>
          <Button style={{ marginLeft: 20 }} onClick={this.handleFormReset}>
            重置
          </Button>
        </FormItem>
      </Form>
    );
  }

  renderEndpoints() {
    const {
      custom: { endpointData },
      effectsLoading,
    } = this.props;
    const { checkedList, indeterminate, checkAll, endpointPagination } = this.state;
    return (
      <div className={styles.customContainer}>
        <div className={styles.leftContainer}>主机名：</div>
        <div className={styles.rightContainer}>
          <Spin
            className={styles.rightContainer}
            spinning={
              effectsLoading['custom/fetch'] || effectsLoading['custom/fetchEndpointPages'] || false
            }
          >
            <div className={styles.endpointsContainer}>
              <CheckboxGroup value={checkedList} onChange={this.onCheckboxChange}>
                {endpointData &&
                 endpointData.items &&
                 endpointData.items.map(item => (
                   // <Col key={item.endpoint_id} span={3}>
                   // <Col key={item.endpoint_id} span={5}>
                   <div className={styles.rightDistance}>
                     <Checkbox value={item.endpoint_id}>{item.endpoint}</Checkbox>
                   </div>
                   // </Col>
                    ))}
              </CheckboxGroup>
            </div>
            <Checkbox
              style={{ margin: '0 20px' }}
              indeterminate={indeterminate}
              onChange={this.onCheckAllChange}
              checked={checkAll}
            >
              全选
            </Checkbox>
            {checkedList.length < 1 ? (
              <Button disabled>批量移除</Button>
            ) : (
              <Fragment>
                <Button onClick={() => this.handleDeleteEndpoint()}>批量移除</Button>
                &nbsp;&nbsp;已选 {checkedList.length} 条
              </Fragment>
            )}
            <Pagination
              style={{ float: 'right' }}
              showQuickJumper
              {...endpointPagination}
              total={endpointData.total}
              onChange={this.handleEndpointPaginationChange}
            />
          </Spin>
        </div>
      </div>
    );
  }

  render() {
    const {
      custom: { metricData },
      effectsLoading,
    } = this.props;
    const { checkedList, selectedRows, pagination, chartVisible, chartValues } = this.state;

    const chartMethods = {
      handleChartVisible: this.handleChartVisible,
    };

    return (
      <PageHeaderWrapper>
        {this.renderSearchForm()}
        {this.renderEndpoints()}
        <Card bordered={false}>
          <div className={styles.customList}>
            <div className={styles.customListOperator}>
              {selectedRows.length < 1 ? (
                <Fragment>
                  <Button disabled>批量查看视图</Button>
                  <Button disabled>批量移除</Button>
                </Fragment>
              ) : (
                <Fragment>
                  <Button onClick={() => this.handleChartVisible(true, selectedRows)}>
                    批量查看视图
                  </Button>
                  <Button onClick={() => this.handleDeleteModalVisible(true, selectedRows)}>
                    批量移除
                  </Button>
                  &nbsp;&nbsp;已选 {selectedRows.length} 条
                </Fragment>
              )}
            </div>
            {checkedList.length < 1 && (
              <div className={styles.tableAlert}>
                <Alert
                  message="至少选择一个主机才可对下列的指标进行操作！"
                  type="warning"
                  showIcon
                  style={{ marginBottom: 20 }}
                />
              </div>
            )}
            <StandardTable
              rowKey="graph_metric"
              selectedRows={selectedRows}
              allCheckboxDisabled={checkedList.length < 1}
              loading={effectsLoading['custom/fetch'] || effectsLoading['custom/fetchMetricPages']}
              data={metricData}
              pagination={pagination}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
              locale={{
                emptyText: () => (
                  <Fragment>
                    <p style={{ fontWeight: 'bold', color: '#666' }}>暂无数据</p>
                    <p>请重新对主机或者指标进行搜索</p>
                  </Fragment>
                ),
              }}
            />
          </div>
        </Card>
        {this.renderDeleteModal()}
        {chartVisible ? (
          <MonitorChart
            {...chartMethods}
            chartVisible={chartVisible}
            values={chartValues}
            checkedList={checkedList}
          />
        ) : null}
      </PageHeaderWrapper>
    );
  }
}

export default CustomList;
