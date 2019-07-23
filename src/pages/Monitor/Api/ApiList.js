/* eslint-disable react/no-array-index-key */
/* eslint-disable no-useless-escape */
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
  Card,
  Form,
  Input,
  Select,
  Icon,
  Button,
  DatePicker,
  Modal,
  message,
  Drawer,
  Tooltip,
  Spin,
} from 'antd';
import router from 'umi/router';

import SimpleTable from '@/components/SimpleTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import LineChart from '@/components/Echarts/LineChart';

import styles from './ApiList.less';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const { TextArea } = Input;
const { Option } = Select;

let id = 0;
const chartMap = {
  api_status: {
    title: '响应码统计',
    yName: '数量',
  },
  response_time: {
    title: '平均响应时间统计',
    yName: '响应时长（ms）',
  },
};
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

const CreateForm = Form.create()(props => {
  const { modalVisible, form, handleAdd, handleModalVisible, effectsLoading } = props;

  const formItemLayout = {
    labelCol: { span: 5, offset: 1 },
    wrapperCol: { span: 15, offset: 1 },
  };
  const formItemLayoutWithOutLabel = {
    wrapperCol: { span: 15, offset: 7 },
  };

  const removeRequestHeader = k => {
    const keys = form.getFieldValue('keys');
    // We need at least one requestHeader
    if (keys.length === 1) {
      return;
    }

    // can use data-binding to set
    form.setFieldsValue({
      keys: keys.filter(key => key !== k),
    });
  };

  const addRequestHeader = () => {
    const keys = form.getFieldValue('keys');
    // const nextKeys = keys.concat(id++);
    const nextKeys = keys.concat((id += 1));
    // can use data-binding to set
    // important! notify form to detect changes
    form.setFieldsValue({
      keys: nextKeys,
    });
  };

  const closeHandle = () => {
    id = 0;
    form.setFieldsValue({ keys: [0] });
  };

  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const { keys, requestHeaders, project, url, method } = fieldsValue;
      const headers = {};
      keys.forEach(key => {
        headers[requestHeaders[key].key] = requestHeaders[key].value;
      });

      handleAdd({
        project,
        url,
        method,
        api_name: fieldsValue.api_name,
        request_data: fieldsValue.request_data,
        request_headers: JSON.stringify(headers),
      });
    });
  };

  const handleCheckJson = (rule, value, callback) => {
    if (!value) callback('请求数据不能为空');

    try {
      JSON.parse(value);
    } catch (error) {
      callback('格式错误，请输入能转换成json的格式');
    }

    // Note: 必须总是返回一个 callback，否则 validateFieldsAndScroll 无法响应
    callback();
  };

  form.getFieldDecorator('keys', { initialValue: [0] });
  const keys = form.getFieldValue('keys');
  const requestHeaderItems = keys.map((k, index) => (
    <FormItem
      {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
      label={index === 0 ? '请求头' : ''}
      required={false}
      key={k}
      style={{ marginBottom: 0 }}
    >
      <FormItem style={{ display: 'inline-block', width: 'calc(50% - 32px)' }}>
        {form.getFieldDecorator(`requestHeaders[${k}]['key']`)(<Input placeholder="输入key的值" />)}
      </FormItem>
      <FormItem style={{ display: 'inline-block', marginLeft: '12px', width: 'calc(50% - 32px)' }}>
        {form.getFieldDecorator(`requestHeaders[${k}]['value']`)(
          <Input placeholder="输入value的值" />
        )}
      </FormItem>
      {keys.length > 1 ? (
        <Icon
          className="dynamic-delete-button"
          style={{ display: 'inline-block', marginLeft: '12px', textAlign: 'center' }}
          type="minus-circle-o"
          onClick={() => removeRequestHeader(k)}
        />
      ) : null}
      {index === keys.length - 1 ? (
        <Icon
          className="dynamic-add-button"
          style={{ display: 'inline-block', marginLeft: '12px', textAlign: 'center' }}
          type="plus-circle-o"
          onClick={() => addRequestHeader()}
        />
      ) : null}
    </FormItem>
  ));

  return (
    <Modal
      destroyOnClose
      afterClose={closeHandle}
      title="新建API监控"
      visible={modalVisible}
      confirmLoading={effectsLoading['api/add']}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <Form {...formItemLayout}>
        <FormItem label="项目">
          {form.getFieldDecorator('project', {
            validateFirst: true,
            rules: [
              {
                pattern: /^[a-zA-Z0-9_\-\.]*$/,
                message: "格式错误，只允许大小写字母、数字和'_-.'组成",
              },
              { max: 30, message: '项目长度不能超过30' },
            ],
          })(<Input placeholder="请输入项目名称" />)}
        </FormItem>
        <FormItem label="api名称">
          {form.getFieldDecorator('api_name', {
            validateFirst: true,
            rules: [
              { required: true, message: 'api名称不能为空' },
              {
                pattern: /^[a-zA-Z0-9_\-\.]*$/,
                message: "格式错误，只允许大小写字母、数字和'_-.'组成",
              },
              { max: 30, message: 'api名称长度不能超过30' },
            ],
          })(<Input placeholder="请输入api名称" />)}
        </FormItem>
        <FormItem label="url">
          {form.getFieldDecorator('url', {
            validateFirst: true,
            rules: [
              { required: true, message: 'url不能为空' },
              { pattern: /^http[s]*:\/\//, message: '格式错误，请以“http:// ”或 “https://”开头' },
              { max: 1024, message: 'url长度不能超过1024' },
            ],
          })(<Input placeholder="请输入url" />)}
        </FormItem>
        <FormItem label="请求方式">
          {form.getFieldDecorator('method', {
            initialValue: 'POST',
            validateFirst: true,
            rules: [{ required: true, message: '请选择请求方式' }],
          })(
            <Select getPopupContainer={triggerNode => triggerNode.parentElement}>
              <Option value="POST">POST</Option>
              <Option value="GET">GET</Option>
              <Option value="PUT" disabled>
                PUT
              </Option>
              <Option value="DELETE" disabled>
                DELETE
              </Option>
            </Select>
          )}
        </FormItem>
        {form.getFieldValue('method') === 'POST' && (
          <FormItem label="请求数据">
            {form.getFieldDecorator('request_data', {
              validateFirst: true,
              rules: [
                { required: true, message: '请求数据不能为空' },
                { max: 4096, message: '请求数据长度不能超过4k' },
                { validator: handleCheckJson },
              ],
              // validate: [{
              //   rules: [
              //     { required: true, message: '请求数据不能为空' },
              //     { max: 4096, message: '请求数据长度不能超过4096' },
              //   ],
              //   trigger: 'onChange',
              // }, {
              //   rules: [
              //     { validator: handleCheckJson },
              //   ],
              //   trigger: 'onBlur',
              // }]
            })(<TextArea rows={4} placeholder="请输入请求数据" />)}
          </FormItem>
        )}
        {requestHeaderItems}
      </Form>
    </Modal>
  );
});

@connect(({ api, loading }) => ({
  api,
  effectsLoading: loading.effects,
}))
class MonitorChart extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      active: 1,
      time: [moment().subtract(6, 'hours'), moment()],
      downsample: '300',
      // func: 'max',
    };
  }

  componentDidMount() {
    this.handleFetchChart();
  }

  handleFetchChart = (params = {}) => {
    const { dispatch, values } = this.props;
    const { downsample, time } = this.state;

    dispatch({
      type: 'api/fetchChart',
      payload: {
        api_name: values.api_name, // 查看试图的api名字，必选
        downsample, // 修改查询数据的抽样时间间隔，时间单位为秒，取值范围为 60~3600, 默认取值为300
        start_time: time && time[0].unix(), // 查询的时间范围的开始时间戳，不传的话默认 从end_time 往前减去6个小时
        end_time: time && time[1].unix(), // 查询的时间范围的截止时间戳， 不传的话 默认取当前时间
        // func, // downsample的参数大于60时， 多个值聚合函数。只能填一个 默认为avg。 取值范围为 min,max, avg
        ...params,
      },
      // callback: () => {
      //   message.success('11111');
      // },
    });
  };

  handleDownsampleChange = downsample => {
    this.handleFetchChart({ downsample });
    this.setState({ downsample });
  };

  // handleFuncChange = (func) => {
  //   this.handleFetchChart({ func });
  //   this.setState({ func });
  // }

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
    const { handleChartVisible, chartVisible, effectsLoading, values } = this.props;
    // const { active, time, downsample, func } = this.state;
    const { active, time, downsample } = this.state;
    const {
      api: { chartData },
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
              &nbsp;&nbsp;API 监控视图
            </div>
            <div>
              <div style={{ display: 'inline-block', marginRight: 10 }}>
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
              {/* <div style={{ display: 'inline-block', margin: '0 10px' }}>
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
              </div> */}
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
          <Spin spinning={effectsLoading['api/fetchChart']} tip="Loading..." size="large">
            <div className={styles.chartContent}>
              {chartData &&
                chartData.items &&
                chartData.items.map((item, index) => {
                  const { title, yName } = chartMap[
                    item && item[0] && item[0].dimensions && item[0].dimensions[1]
                  ];
                  return (
                    <LineChart
                      key={index}
                      dataset={item}
                      title={`${title}(${values.api_name})`}
                      yName={yName}
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
@connect(({ api, loading }) => ({
  api,
  effectsLoading: loading.effects,
}))
class ApiList extends PureComponent {

  state = {
    modalVisible: false,
    deleteModalVisible: false,
    chartVisible: false,
    pagination: {
      current: 1,
      pageSize: 10,
    },
    searchKey: undefined,
    deleteFormValues: {},
    chartValues: {},
  };

  columns = [
    {
      title: 'api名称',
      dataIndex: 'api_name',
    },
    {
      title: 'api地址',
      dataIndex: 'url',
    },
    {
      title: '请求方式',
      dataIndex: 'method',
    },
    {
      title: () => (
        <Fragment>
          平均响应时长(ms)&nbsp;
          <Tooltip title="展示最近5分钟的平均响应时长，显示为“-”表示api请求不通">
            <Icon style={{ color: '#bbb', fontSize: 13 }} type="info-circle-o" />
          </Tooltip>
        </Fragment>
      ),
      dataIndex: 'avg_response_time',
    },
    {
      title: '创建人',
      dataIndex: 'creator',
    },
    {
      title: '项目',
      dataIndex: 'project',
    },
    {
      title: '可视化',
      width: 95,
      render: (text, record) => (
        <a onClick={() => this.handleChartVisible(true, record)}>查看视图</a>
      ),
    },
    {
      title: '操作',
      width: 70,
      render: (text, record) => (
        <a onClick={() => this.handleDeleteModalVisible(true, record)}>移除</a>
      ),
    },
  ];

  constructor() {
    super();
    this.linkToNewApiPage = this.linkToNewApiPage.bind(this);
  };

  componentDidMount() {
    this.handleFetch();
  }

  handleFetch = (params = {}) => {
    const { dispatch } = this.props;
    const { pagination, searchKey } = this.state;

    dispatch({
      type: 'api/fetch',
      payload: {
        _page: pagination.current, // 不传默认 1
        _num: pagination.pageSize,
        _search_key: searchKey,
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
    });
    const params = {
      _page: 1,
      _search_key: searchValue || undefined,
    };
    this.handleFetch(params);
  };

  handleAdd = fields => {
    const { dispatch } = this.props;
    const { pagination } = this.state;
    dispatch({
      type: 'api/add',
      payload: fields,
      callback: () => {
        message.success('添加成功');
        this.setState({
          pagination: {
            current: 1,
            pageSize: pagination.pageSize,
          },
          searchKey: undefined,
        });
        const params = {
          _page: 1,
          _search_key: undefined,
        };
        this.handleFetch(params);
        this.handleModalVisible();
      },
    });
  };

  handleDelete = fields => {
    const { dispatch } = this.props;
    const { pagination } = this.state;
    dispatch({
      type: 'api/remove',
      payload: {
        id: fields.id,
      },
      callback: () => {
        message.success('移除成功');
        this.setState({
          pagination: {
            current: 1,
            pageSize: pagination.pageSize,
          },
        });
        const params = {
          _page: 1,
        };
        this.handleFetch(params);
        this.handleDeleteModalVisible();
      },
    });
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };


  handleDeleteModalVisible = (flag, record) => {
    this.setState({
      deleteModalVisible: !!flag,
      deleteFormValues: record || {},
    });
  };

  handleChartVisible = (flag, record) => {
    const { dispatch } = this.props;

    dispatch({
      type: 'api/saveChartData',
      payload: {
        items: [],
        total: 0,
      },
    });
    this.setState({
      chartVisible: !!flag,
      chartValues: record || {},
    });
  };

  handleSearchChange = event => {
    this.setState({ searchKey: event.target.value });
  };

  handleSimpleTableChange = (pagination, filtersArg, sorter) => {
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
    });

    this.handleFetch(params);
  };

  linkToNewApiPage() {
    router.push('/monitor/api/newapi');
  }

  renderDeleteModal() {
    const { effectsLoading } = this.props;
    const { deleteModalVisible, deleteFormValues } = this.state;

    return (
      <Modal
        destroyOnClose
        title="提示"
        visible={deleteModalVisible}
        confirmLoading={effectsLoading['api/remove']}
        onOk={() => this.handleDelete(deleteFormValues)}
        onCancel={() => this.handleDeleteModalVisible()}
      >
        <p style={{ textAlign: 'center', fontSize: '16px', color: '#222', margin: '30px' }}>
          确认要移除该api地址吗？
        </p>
      </Modal>
    );
  }

  render() {
    const {
      api: { data },
      effectsLoading,
    } = this.props;
    const { searchKey, pagination, modalVisible, chartVisible, chartValues } = this.state;

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };
    const chartMethods = {
      handleChartVisible: this.handleChartVisible,
    };


    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.apiList}>
            <div className={styles.apiListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                新建API监控
              </Button>
              <Button icon="plus" type="primary" onClick={() => this.linkToNewApiPage()}>
                新建API监控-new page
              </Button>
              <Input.Search
                style={{ width: 370, float: 'right' }}
                placeholder="输入api名称、api地址或所属项目进行搜索"
                enterButton="搜索"
                value={searchKey}
                onChange={this.handleSearchChange}
                onSearch={this.handleSearch}
              />
            </div>
            <SimpleTable
              rowKey="id"
              loading={effectsLoading['api/fetch']}
              data={data}
              pagination={pagination}
              columns={this.columns}
              onChange={this.handleSimpleTableChange}
            />
          </div>
        </Card>
        <CreateForm
          {...parentMethods}
          modalVisible={modalVisible}
          effectsLoading={effectsLoading}
        />
        {this.renderDeleteModal()}
        {chartVisible ? (
          <MonitorChart {...chartMethods} chartVisible={chartVisible} values={chartValues} />
        ) : null}
      </PageHeaderWrapper>
    );
  }
}

export default ApiList;
