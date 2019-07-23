/* eslint-disable no-useless-escape */
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Card, Form, Input, Select, Button, Modal, message, Divider, Tooltip, Icon } from 'antd';
import SimpleTable from '@/components/SimpleTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from './LogList.less';

const FormItem = Form.Item;
const { Option } = Select;

const logLevelMap = ['info', 'notice', 'debug', 'warn', 'error', 'fatal'];
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

const CreateForm = Form.create()(props => {
  const {
    modalVisible,
    form,
    values,
    handleAdd,
    handleUpdate,
    handleModalVisible,
    effectsLoading,
  } = props;

  const isUpdate = values && Object.keys(values).length > 0;

  const formItemLayout = {
    labelCol: { span: 7, offset: 1 },
    wrapperCol: { span: 13, offset: 1 },
  };

  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const { logNumThreshold, timeInterval } = fieldsValue;
      const params = {
        ...fieldsValue,
        logNumThreshold: Number(logNumThreshold),
        timeInterval: Number(timeInterval),
      };

      if (isUpdate) {
        delete params.taskName;
        handleUpdate({
          ...params,
          id: values.id,
        });
      } else {
        handleAdd(params);
      }

      // form.resetFields();
    });
  };

  return (
    <Modal
      destroyOnClose
      width={700}
      title={isUpdate ? '编辑日志监控' : '新建日志监控'}
      visible={modalVisible}
      confirmLoading={effectsLoading['log/update'] || effectsLoading['log/add']}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <Form {...formItemLayout}>
        <FormItem label="任务名称">
          {form.getFieldDecorator('taskName', {
            initialValue: isUpdate ? values.taskName : '',
            rules: [
              { required: true, message: '任务名称不能为空' },
              {
                pattern: /^[a-zA-Z0-9_\-\.]*$/,
                message: "格式错误，只允许大小写字母、数字和'_-.'组成",
              },
              { max: 255, message: '任务名称长度不能超过255' },
            ],
          })(<Input placeholder="请输入任务名称" disabled={isUpdate} />)}
        </FormItem>
        <FormItem label="项目">
          {form.getFieldDecorator('project', {
            initialValue: isUpdate ? values.project : '',
            rules: [
              {
                pattern: /^[a-zA-Z0-9_\-\.]*$/,
                message: "格式错误，只允许大小写字母、数字和'_-.'组成",
              },
              { max: 30, message: '项目长度不能超过30' },
            ],
          })(<Input placeholder="请输入项目" />)}
        </FormItem>
        <FormItem label="Kafka topic模式">
          {form.getFieldDecorator('topicPattern', {
            initialValue: isUpdate ? values.topicPattern : '',
            rules: [
              { required: true, message: 'Kafka topic模式不能为空' },
              { max: 255, message: 'Kafka topic模式长度不能超过255' },
            ],
          })(<Input placeholder="请输入Kafka topic模式" />)}
        </FormItem>
        <FormItem label="获取任务属性topic">
          {form.getFieldDecorator('topic', {
            initialValue: isUpdate ? values.topic : '',
            rules: [
              { required: true, message: '获取任务属性topic不能为空' },
              { max: 255, message: '获取任务属性topic长度不能超过255' },
            ],
          })(<Input placeholder="请输入获取任务属性topic" />)}
        </FormItem>
        <FormItem label="日志解析正则">
          {form.getFieldDecorator('regx', {
            initialValue: isUpdate ? values.regx : '',
            rules: [
              { required: true, message: '日志解析正则不能为空' },
              { max: 255, message: '日志解析正则长度不能超过255' },
            ],
          })(<Input placeholder="请输入日志解析正则" />)}
        </FormItem>
        <FormItem label="解析后字段名">
          {form.getFieldDecorator('colnames', {
            initialValue: isUpdate ? values.colnames : '',
            rules: [
              { required: true, message: '解析后字段名不能为空' },
              {
                pattern: /^[a-zA-Z0-9_\-\.,]*$/,
                message: "格式错误，只允许大小写字母、数字和'_-.,'组成",
              },
              { max: 255, message: '解析后字段名长度不能超过255' },
            ],
          })(<Input placeholder="请输入解析后字段名(多个字段名之间，用逗号分隔)" />)}
        </FormItem>
        <FormItem label="触发告警日志数量">
          {form.getFieldDecorator('logNumThreshold', {
            initialValue: isUpdate ? values.logNumThreshold : '',
            rules: [
              { required: true, message: '触发告警日志数量不能为空' },
              { pattern: /^\d+$/, message: '格式错误，请输入非负整数' },
            ],
          })(<Input placeholder="请输入触发告警日志数量" />)}
        </FormItem>
        <FormItem label="告警日志级别">
          {form.getFieldDecorator('logLevel', {
            initialValue: isUpdate ? values.logLevel : 0,
            rules: [{ required: true, message: '请选择告警日志级别' }],
          })(
            <Select getPopupContainer={triggerNode => triggerNode.parentElement}>
              <Option value={0}>info</Option>
              <Option value={1}>notice</Option>
              <Option value={2}>debug</Option>
              <Option value={3}>warn</Option>
              <Option value={4}>error</Option>
              <Option value={5}>fatal</Option>
            </Select>
          )}
        </FormItem>
        <FormItem label="告警推送时间间隔">
          {form.getFieldDecorator('timeInterval', {
            initialValue: isUpdate ? values.timeInterval : '',
            rules: [
              { required: true, message: '告警推送时间间隔不能为空' },
              { pattern: /^\d+$/, message: '格式错误，请输入非负整数' },
            ],
          })(<Input placeholder="请输入告警推送时间间隔" addonAfter="ms" />)}
        </FormItem>
        <FormItem
          label={
            <span>
              日志级别字段名&nbsp;
              <Tooltip title="来源于解析后字段名">
                <Icon style={{ color: '#bbb', fontSize: 13 }} type="info-circle-o" />
              </Tooltip>
            </span>
          }
        >
          {form.getFieldDecorator('logLevelcolName', {
            initialValue: isUpdate ? values.logLevelcolName : '',
            rules: [
              { required: true, message: '日志级别字段名不能为空' },
              { max: 255, message: '日志级别字段名长度不能超过255' },
            ],
          })(<Input placeholder="请输入日志级别字段名" />)}
        </FormItem>
        <FormItem
          label={
            <span>
              日志聚合字段名&nbsp;
              <Tooltip title="该属性为解析后字段名的子集">
                <Icon style={{ color: '#bbb', fontSize: 13 }} type="info-circle-o" />
              </Tooltip>
            </span>
          }
        >
          {form.getFieldDecorator('LogAbstractColNames', {
            initialValue: isUpdate ? values.LogAbstractColNames : '',
            rules: [
              { required: true, message: '日志聚合字段名不能为空' },
              { max: 255, message: '日志聚合字段名长度不能超过255' },
            ],
          })(<Input placeholder="请输入日志聚合字段名" />)}
        </FormItem>
      </Form>
    </Modal>
  );
});

/* eslint react/no-multi-comp:0 */
@connect(({ log, loading }) => ({
  log,
  effectsLoading: loading.effects,
}))
@Form.create()
class LogList extends PureComponent {
  state = {
    modalVisible: false,
    deleteModalVisible: false,
    pagination: {
      current: 1,
      pageSize: 10,
    },
    searchKey: undefined,
    deleteFormValues: {},
    updateFormValues: {},
  };

  columns = [
    {
      title: '任务名',
      dataIndex: 'taskName',
    },
    {
      title: 'Kafka topic模式',
      dataIndex: 'topicPattern',
    },
    {
      title: '日志解析正则',
      dataIndex: 'regx',
    },
    {
      title: '告警级别',
      dataIndex: 'logLevel',
      render: val => logLevelMap[val],
    },
    {
      title: '项目',
      dataIndex: 'project',
    },
    {
      title: '操作',
      width: 110,
      render: (text, record) => (
        <Fragment>
          <a onClick={() => this.handleModalVisible(true, record)}>编辑</a>
          <Divider type="vertical" />
          <a onClick={() => this.handleDeleteModalVisible(true, record)}>移除</a>
        </Fragment>
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
      type: 'log/fetch',
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
      type: 'log/add',
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
      type: 'log/remove',
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

  handleUpdate = fields => {
    const { dispatch } = this.props;
    const { pagination } = this.state;
    dispatch({
      type: 'log/update',
      payload: fields,
      callback: () => {
        message.success('编辑成功');
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
        this.handleModalVisible();
      },
    });
  };

  handleModalVisible = (flag, record) => {
    this.setState({
      modalVisible: !!flag,
      updateFormValues: record || {},
    });
  };

  handleDeleteModalVisible = (flag, record) => {
    this.setState({
      deleteModalVisible: !!flag,
      deleteFormValues: record || {},
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

  renderDeleteModal() {
    const { effectsLoading } = this.props;
    const { deleteModalVisible, deleteFormValues } = this.state;

    return (
      <Modal
        destroyOnClose
        title="提示"
        visible={deleteModalVisible}
        confirmLoading={effectsLoading['log/remove']}
        onOk={() => this.handleDelete(deleteFormValues)}
        onCancel={() => this.handleDeleteModalVisible()}
      >
        <p style={{ textAlign: 'center', fontSize: '16px', color: '#222', margin: '30px' }}>
          确认要移除该日志吗？
        </p>
      </Modal>
    );
  }

  render() {
    const {
      log: { data },
      effectsLoading,
    } = this.props;
    const { searchKey, pagination, modalVisible, updateFormValues } = this.state;

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleUpdate: this.handleUpdate,
      handleModalVisible: this.handleModalVisible,
    };

    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.logList}>
            <div className={styles.logListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                新建日志监控
              </Button>
              <Input.Search
                style={{ width: 350, float: 'right' }}
                placeholder="输入任务名进行搜索"
                enterButton="搜索"
                value={searchKey}
                onChange={this.handleSearchChange}
                onSearch={this.handleSearch}
              />
            </div>
            <SimpleTable
              rowKey="id"
              loading={effectsLoading['log/fetch']}
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
          values={updateFormValues}
          effectsLoading={effectsLoading}
        />
        {this.renderDeleteModal()}
      </PageHeaderWrapper>
    );
  }
}

export default LogList;
