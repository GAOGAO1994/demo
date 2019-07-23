/* eslint-disable no-useless-escape */
/* eslint-disable react/no-array-index-key */
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
  Layout,
  Form,
  Input,
  Select,
  Icon,
  Button,
  DatePicker,
  Modal,
  message,
  Collapse,
  Tooltip,
  Spin,
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import LineChart from '@/components/Echarts/LineChart';

import styles from './ScreenList.less';

const { Header, Sider, Content } = Layout;
const { RangePicker } = DatePicker;
const { Panel } = Collapse;
const { TextArea } = Input;
const { Option } = Select;
const FormItem = Form.Item;

const CreateGroup = Form.create()(props => {
  const {
    form,
    groupModalVisible,
    type,
    values,
    handleAddGroup,
    handleUpdateGroup,
    handleDeleteGroup,
    handleGroupModalVisible,
    effectsLoading,
  } = props;

  let title = '';
  if (type === 'create') {
    title = '新建监控分组';
  } else if (type === 'update') {
    title = '修改大组信息';
  } else {
    title = '提示';
  }

  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const { name, project } = fieldsValue;

      if (type === 'create') {
        handleAddGroup({ parent_id: 0, name, project });
      } else if (type === 'update') {
        handleUpdateGroup({ id: values && values.id, name, project });
      } else {
        handleDeleteGroup({
          group_ids: values && values.id,
          delete_group: 1, // 值为1时，同时删除图和分组
        });
      }

      // form.resetFields();
    });
  };

  return (
    <Modal
      destroyOnClose
      title={title}
      visible={groupModalVisible}
      confirmLoading={
        effectsLoading['screen/addGroup'] ||
        effectsLoading['screen/updateGroup'] ||
        effectsLoading['screen/removeGroupOrScreenGraphs']
      }
      onOk={okHandle}
      onCancel={() => handleGroupModalVisible()}
    >
      {type === 'create' || type === 'update' ? (
        <Fragment>
          <FormItem
            labelCol={{ span: 5, offset: 1 }}
            wrapperCol={{ span: 15, offset: 1 }}
            label="大屏组名"
          >
            {form.getFieldDecorator('name', {
              initialValue: type === 'update' ? values.name : '',
              rules: [
                { required: true, message: '大屏组名不能为空' },
                { max: 10, message: '大屏组名长度不能超过10' },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem
            labelCol={{ span: 5, offset: 1 }}
            wrapperCol={{ span: 15, offset: 1 }}
            label="所属项目"
          >
            {form.getFieldDecorator('project', {
              initialValue: type === 'update' ? values.project : '',
              rules: [
                { required: true, message: '所属项目不能为空' },
                {
                  pattern: /^[a-zA-Z0-9_\-\.]*$/,
                  message: "格式错误，只允许大小写字母、数字和'_-.'组成",
                },
                { max: 30, message: '所属项目长度不能超过30' },
              ],
            })(<Input />)}
          </FormItem>
        </Fragment>
      ) : (
        <p style={{ textAlign: 'center', fontSize: '16px', color: '#222', margin: '30px' }}>
          确认要删除该大组吗？
        </p>
      )}
    </Modal>
  );
});

const CreateScreen = Form.create()(props => {
  const {
    form,
    screenModalVisible,
    type,
    values,
    handleAddScreen,
    handleUpdateScreen,
    handleDeleteScreen,
    handleScreenModalVisible,
    effectsLoading,
  } = props;

  let title = '';
  if (type === 'create') {
    title = '新建小组';
  } else if (type === 'update') {
    title = '修改小组名称';
  } else {
    title = '提示';
  }

  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const { name } = fieldsValue;

      if (type === 'create') {
        handleAddScreen({ parent_id: values && values.id, name });
      } else if (type === 'update') {
        handleUpdateScreen({ id: values && values.id, name });
      } else {
        handleDeleteScreen({ id: values && values.id });
      }

      // form.resetFields();
    });
  };

  return (
    <Modal
      destroyOnClose
      title={title}
      visible={screenModalVisible}
      confirmLoading={
        effectsLoading['screen/addGroup'] ||
        effectsLoading['screen/updateGroup'] ||
        effectsLoading['screen/removeScreen']
      }
      onOk={okHandle}
      onCancel={() => handleScreenModalVisible()}
    >
      {type === 'create' || type === 'update' ? (
        <FormItem
          labelCol={{ span: 5, offset: 1 }}
          wrapperCol={{ span: 15, offset: 1 }}
          label="小组名称"
        >
          {form.getFieldDecorator('name', {
            initialValue: type === 'update' ? values.name : '',
            rules: [
              { required: true, message: '小组名称不能为空' },
              { max: 10, message: '小组名称长度不能超过10' },
            ],
          })(<Input />)}
        </FormItem>
      ) : (
        <p style={{ textAlign: 'center', fontSize: '16px', color: '#222', margin: '30px' }}>
          确认要删除该小组吗？
        </p>
      )}
    </Modal>
  );
});

const CreateGraph = Form.create()(props => {
  const {
    previewData,
    graphModalVisible,
    values,
    form,
    handleAddGraph,
    handlePreviewGraph,
    handleGraphModalVisible,
    effectsLoading,
  } = props;

  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      handleAddGraph({
        group_id: values && values.id,
        ...fieldsValue,
      });
      // form.resetFields();
    });
  };

  const refreshHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      handlePreviewGraph({
        group_id: values && values.id,
        flush: true,
        ...fieldsValue,
      });
    });
  };

  return (
    <Modal
      destroyOnClose
      title="新增graph"
      width={800}
      visible={graphModalVisible}
      onOk={okHandle}
      onCancel={() => handleGraphModalVisible()}
      footer={[
        <Button
          style={{ float: 'left' }}
          key="flush"
          icon="sync"
          type="primary"
          loading={effectsLoading['screen/previewGraph']}
          onClick={refreshHandle}
        >
          预览刷新
        </Button>,
        <Button key="back" onClick={() => handleGraphModalVisible()}>
          取消
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={effectsLoading['screen/addGraph']}
          onClick={okHandle}
        >
          确认
        </Button>,
      ]}
    >
      <div className={styles.chartContent}>
        {previewData &&
          previewData.items &&
          previewData.items.map((item, index) => {
            return item.graph_data && item.graph_data.length > 0 ? (
              <LineChart
                noBorder
                height={250}
                key={index}
                dataset={item.graph_data}
                title={
                  item.graph_data &&
                  item.graph_data[0] &&
                  item.graph_data[0].dimensions &&
                  item.graph_data[0].dimensions[1]
                }
              />
            ) : null;
          })}
        {previewData && previewData.total <= 0 && (
          <p
            style={{
              height: '90%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            点击预览刷新按钮可以查看图表
          </p>
        )}
      </div>
      <Form labelCol={{ span: 4, offset: 2 }} wrapperCol={{ span: 14, offset: 1 }}>
        <FormItem
          label={
            <span>
              metric&nbsp;
              <Tooltip title="metric数据请参考“自定义监控”">
                <Icon style={{ color: '#bbb', fontSize: 13 }} type="info-circle-o" />
              </Tooltip>
            </span>
          }
        >
          {form.getFieldDecorator('metric', {
            rules: [{ required: true, message: 'metrics不能为空' }],
          })(<Input placeholder="例：df.bytes.free.percent" />)}
        </FormItem>
        <FormItem
          label={
            <span>
              tags&nbsp;
              <Tooltip title="tags数据请参考“自定义监控”">
                <Icon style={{ color: '#bbb', fontSize: 13 }} type="info-circle-o" />
              </Tooltip>
            </span>
          }
        >
          {form.getFieldDecorator('tags')(
            <TextArea
              rows={4}
              placeholder="例：clusters=luoge-cluster,fstype=ext4,mount=/endpoints: fuxi-luoge-01,fuxi-luoge-02"
            />
          )}
        </FormItem>
        <FormItem
          label={
            <span>
              endpoints&nbsp;
              <Tooltip title="endpoints数据请参考“自定义监控”">
                <Icon style={{ color: '#bbb', fontSize: 13 }} type="info-circle-o" />
              </Tooltip>
            </span>
          }
        >
          {form.getFieldDecorator('endpoints', {
            rules: [
              { required: true, message: 'endpoints不能为空' },
              { max: 1024, message: 'endpoints长度不能超过1024' },
            ],
          })(<Input placeholder="请输入endpoints" />)}
        </FormItem>
        <FormItem label="默认时间维度">
          {form.getFieldDecorator('downsample', {
            initialValue: '300',
            rules: [{ required: true, message: '请选择默认时间维度' }],
          })(
            <Select getPopupContainer={triggerNode => triggerNode.parentElement}>
              <Option value="60">1min</Option>
              <Option value="300">5min</Option>
            </Select>
          )}
        </FormItem>
        <FormItem label="聚合函数">
          {form.getFieldDecorator('agg_func', {
            initialValue: 'min',
            rules: [{ required: true, message: '请选择默认时间跨度' }],
          })(
            <Select getPopupContainer={triggerNode => triggerNode.parentElement}>
              <Option value="min">min</Option>
              <Option value="max">max</Option>
              <Option value="avg">avg</Option>
            </Select>
          )}
        </FormItem>
      </Form>
    </Modal>
  );
});

/* eslint react/no-multi-comp:0 */
@connect(({ screen, loading }) => ({
  screen,
  effectsLoading: loading.effects,
}))
@Form.create()
class ScreenList extends PureComponent {
  state = {
    active: 1,
    time: [moment().subtract(6, 'hours'), moment()],
    downsample: '300',
    func: 'max',
    groupModalVisible: false,
    screenModalVisible: false,
    graphModalVisible: false,
    groupModalType: 'create',
    screenModalType: 'create',
    selectedScreen: null,
    groupValues: {},
    screenValues: {},
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'screen/saveGraphs',
      payload: {
        items: [],
        total: 0,
      },
    });
    this.handleFetchGroups();
  }

  handleGroupModalVisible = (flag, type, record) => {
    this.setState({
      groupModalVisible: !!flag,
      groupModalType: type || 'create',
      groupValues: record || {},
    });
  };

  handleScreenModalVisible = (flag, type, record) => {
    this.setState({
      screenModalVisible: !!flag,
      screenModalType: type || 'create',
      screenValues: record || {},
    });
  };

  handleGraphModalVisible = flag => {
    const { dispatch } = this.props;

    dispatch({
      type: 'screen/savePreviewData',
      payload: {
        items: [],
        total: 0,
      },
    });
    this.setState({
      graphModalVisible: !!flag,
    });
  };

  handleFetchGroups = (params = {}) => {
    const { dispatch } = this.props;

    dispatch({
      type: 'screen/fetchGroups',
      payload: params,
    });
  };

  handleAddGroup = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'screen/addGroup',
      payload: params,
      callback: () => {
        message.success('添加成功');
        this.handleFetchGroups();
        this.handleGroupModalVisible();
        this.handleScreenModalVisible();
      },
    });
  };

  handleUpdateGroup = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'screen/updateGroup',
      payload: params,
      callback: () => {
        message.success('修改成功');
        this.handleFetchGroups();
        this.handleGroupModalVisible();
        this.handleScreenModalVisible();
      },
    });
  };

  handleDeleteGroup = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'screen/removeGroupOrScreenGraphs',
      payload: params,
      callback: () => {
        message.success('删除成功');
        this.handleFetchGroups();
        this.handleGroupModalVisible();
        dispatch({
          type: 'screen/saveGraphs',
          payload: {
            items: [],
            total: 0,
          },
        });
        this.setState({
          selectedScreen: null,
        });
      },
    });
  };

  handleDeleteScreen = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'screen/removeScreen',
      payload: params,
      callback: () => {
        message.success('删除成功');
        this.handleFetchGroups();
        this.handleScreenModalVisible();
        dispatch({
          type: 'screen/saveGraphs',
          payload: {
            items: [],
            total: 0,
          },
        });
        this.setState({
          selectedScreen: null,
        });
      },
    });
  };

  handleSelectScreen = screen => {
    this.setState({
      selectedScreen: screen || null,
    });
    this.handleFetchGraphs({ group_id: screen && screen.id });
  };

  handleCreateGraph = () => {
    const { selectedScreen } = this.state;
    if (selectedScreen) {
      this.handleGraphModalVisible(true);
    } else {
      Modal.warning({
        title: '提示',
        content: '没有小组被选中，请先选择一个小组',
        okText: '我知道了',
      });
    }
  };

  handleFetchGraphs = (params = {}) => {
    const { dispatch } = this.props;
    const { selectedScreen, downsample, func, time } = this.state;

    dispatch({
      type: 'screen/fetchGraphs',
      payload: {
        group_id: selectedScreen && selectedScreen.id,
        downsample,
        agg_func: func,
        start_time: time && time[0].unix(),
        end_time: time && time[1].unix(),
        ...params,
      },
    });
  };

  handleAddGraph = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'screen/addGraph',
      payload: params,
      callback: () => {
        message.success('添加成功');
        this.handleFetchGraphs();
        this.handleGraphModalVisible();
      },
    });
  };

  handlePreviewGraph = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'screen/previewGraph',
      payload: params,
    });
  };

  handleDeleteAllGraph = () => {
    const { dispatch } = this.props;
    const { selectedScreen } = this.state;

    if (selectedScreen) {
      Modal.confirm({
        title: '提示',
        content: `确认要全部删除${selectedScreen.name}小组的所有graph吗？`,
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          dispatch({
            type: 'screen/removeGroupOrScreenGraphs',
            payload: {
              group_ids: selectedScreen && selectedScreen.id,
              // delete_group: 0, // 默认为0，只删除分组中的所有图，而不删除分组
            },
            callback: () => {
              message.success('删除成功');
              this.handleFetchGraphs();
            },
          });
        },
        onCancel: () => {
          // console.log('Cancel');
        },
      });
    } else {
      Modal.warning({
        title: '提示',
        content: '没有小组被选中，请先选择一个小组',
        okText: '我知道了',
      });
    }
  };

  handleDeleteGraph = graph => {
    const { dispatch } = this.props;

    Modal.confirm({
      title: '提示',
      content: '确认要删除该graph吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        dispatch({
          type: 'screen/removeGraph',
          payload: {
            id: graph && graph.graph_info && graph.graph_info.id,
          },
          callback: () => {
            message.success('删除成功');
            this.handleFetchGraphs();
          },
        });
      },
      onCancel: () => {
        // console.log('Cancel');
      },
    });
  };

  handleDownsampleChange = downsample => {
    const { selectedScreen } = this.state;

    if (selectedScreen) {
      this.handleFetchGraphs({ group_id: selectedScreen.id, downsample });
      this.setState({ downsample });
    } else {
      Modal.warning({
        title: '提示',
        content: '没有小组被选中，请先选择一个小组',
        okText: '我知道了',
      });
    }
  };

  handleFuncChange = func => {
    const { selectedScreen } = this.state;

    if (selectedScreen) {
      this.handleFetchGraphs({ group_id: selectedScreen.id, agg_func: func });
      this.setState({ func });
    } else {
      Modal.warning({
        title: '提示',
        content: '没有小组被选中，请先选择一个小组',
        okText: '我知道了',
      });
    }
  };

  handleTimeChange = momentRange => {
    const { selectedScreen } = this.state;

    if (selectedScreen) {
      const params = {
        start_time: momentRange[0].startOf('day').unix(),
        end_time: momentRange[1].endOf('day').unix(),
      };
      this.handleFetchGraphs({ group_id: selectedScreen.id, ...params });
      this.setState({
        active: 0,
        time: [momentRange[0].startOf('day'), momentRange[1].endOf('day')],
      });
    } else {
      Modal.warning({
        title: '提示',
        content: '没有小组被选中，请先选择一个小组',
        okText: '我知道了',
      });
    }
  };

  handleQuickTimeChange = type => {
    const { selectedScreen } = this.state;

    if (selectedScreen) {
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
      this.handleFetchGraphs({ group_id: selectedScreen.id, ...params });
      this.setState({
        active: type,
        time: momentRange,
      });
    } else {
      Modal.warning({
        title: '提示',
        content: '没有小组被选中，请先选择一个小组',
        okText: '我知道了',
      });
    }
  };

  renderPanelHeader(group) {
    return (
      <Fragment>
        {group.name}
        <div className={styles.customPanelHeaderRight}>
          <Icon type="edit" onClick={() => this.handleGroupModalVisible(true, 'update', group)} />
          <Icon
            type="minus-circle-o"
            style={{ marginLeft: 10 }}
            onClick={() => this.handleGroupModalVisible(true, 'delete', group)}
          />
        </div>
      </Fragment>
    );
  }

  renderPanelItme(screen) {
    const { selectedScreen } = this.state;
    const style =
      selectedScreen && selectedScreen.id === screen.id
        ? `${styles.customPanelItme} ${styles.active}`
        : styles.customPanelItme;
    return (
      <div
        className={style}
        key={`screen_${screen.id}`}
        onClick={() => this.handleSelectScreen(screen)}
      >
        {screen.name}
        <div className={styles.customPanelItmeRight}>
          <Icon type="edit" onClick={() => this.handleScreenModalVisible(true, 'update', screen)} />
          <Icon
            type="minus-circle-o"
            style={{ marginLeft: 10 }}
            onClick={() => this.handleScreenModalVisible(true, 'delete', screen)}
          />
        </div>
      </div>
    );
  }

  render() {
    const {
      screen: { groupData, graphData, previewData },
      effectsLoading,
    } = this.props;

    const {
      active,
      time,
      downsample,
      func,
      groupModalVisible,
      screenModalVisible,
      graphModalVisible,
      groupModalType,
      screenModalType,
      groupValues,
      screenValues,
      selectedScreen,
    } = this.state;

    const groupMethods = {
      handleAddGroup: this.handleAddGroup,
      handleUpdateGroup: this.handleUpdateGroup,
      handleDeleteGroup: this.handleDeleteGroup,
      handleGroupModalVisible: this.handleGroupModalVisible,
    };
    const screenMethods = {
      handleAddScreen: this.handleAddGroup,
      handleUpdateScreen: this.handleUpdateGroup,
      handleDeleteScreen: this.handleDeleteScreen,
      handleScreenModalVisible: this.handleScreenModalVisible,
    };
    const graphMethods = {
      handleAddGraph: this.handleAddGraph,
      handlePreviewGraph: this.handlePreviewGraph,
      handleGraphModalVisible: this.handleGraphModalVisible,
    };

    const disabledDate = current => {
      // Can not select days after today
      return current && current > moment().endOf('day');
    };

    return (
      <PageHeaderWrapper>
        <Layout className={styles.screenLayout}>
          <Sider style={{ padding: 30 }} width={300} theme="light">
            <Button
              type="dashed"
              block
              size="large"
              style={{ marginBottom: 30 }}
              onClick={() => this.handleGroupModalVisible(true)}
            >
              + 添加大屏分组
            </Button>
            <Spin spinning={effectsLoading['screen/fetchGroups']} delay={500}>
              <Collapse
                bordered={false}
                defaultActiveKey={['1']}
                className={styles.screenListCollapse}
                expandIcon={({ isActive }) => (
                  <Icon type="caret-right" rotate={isActive ? 90 : 0} />
                )}
              >
                {groupData &&
                  groupData.items &&
                  groupData.items.map(group => (
                    // <Panel style={{ fontSize: 20 }} header={this.renderPanelHeader(group)} key={`group_${group.id}`}>
                    <Panel
                      className={styles.customPanelHeader}
                      header={this.renderPanelHeader(group)}
                      key={`group_${group.id}`}
                    >
                      {group.sub_groups &&
                        group.sub_groups.map(screen => this.renderPanelItme(screen))}
                      <div
                        className={styles.customPanelItme}
                        onClick={() => this.handleScreenModalVisible(true, 'create', group)}
                      >
                        <Icon type="plus-circle-o" />
                      </div>
                    </Panel>
                  ))}
              </Collapse>
            </Spin>
          </Sider>
          <Layout style={{ marginLeft: 24, minHeight: 658, padding: 30, background: '#fff' }}>
            <Header>
              <div style={{ minWidth: 250 }}>
                <Button icon="plus" type="primary" onClick={this.handleCreateGraph}>
                  graph
                </Button>
                <Button style={{ marginLeft: 20 }} onClick={this.handleDeleteAllGraph}>
                  全部删除
                </Button>
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
            </Header>
            <Spin spinning={effectsLoading['screen/fetchGraphs'] || false} tip="Loading...">
              <Content>
                {graphData &&
                  graphData.items &&
                  graphData.items.map((item, index) => {
                    return item.graph_data && item.graph_data.length > 0 ? (
                      <div className={styles.chartContainer} key={index}>
                        <Icon
                          className={styles.close}
                          type="close"
                          onClick={() => this.handleDeleteGraph(item)}
                        />
                        <LineChart
                          noBorder
                          dataset={item.graph_data}
                          title={
                            item.graph_data &&
                            item.graph_data[0] &&
                            item.graph_data[0].dimensions &&
                            item.graph_data[0].dimensions[1]
                          }
                        />
                      </div>
                    ) : null;
                  })}
                {graphData && graphData.total <= 0 && (
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: 500,
                    }}
                  >
                    <p style={{ fontWeight: 'bold', color: '#333' }}>暂无数据</p>
                    <p>创建graph进行数据查看、分析</p>
                    <Button icon="plus" type="primary" onClick={this.handleCreateGraph}>
                      graph
                    </Button>
                  </div>
                )}
              </Content>
            </Spin>
          </Layout>
        </Layout>
        <CreateGroup
          {...groupMethods}
          groupModalVisible={groupModalVisible}
          type={groupModalType}
          values={groupValues}
          effectsLoading={effectsLoading}
        />
        <CreateScreen
          {...screenMethods}
          screenModalVisible={screenModalVisible}
          type={screenModalType}
          values={screenValues}
          effectsLoading={effectsLoading}
        />
        <CreateGraph
          {...graphMethods}
          graphModalVisible={graphModalVisible}
          values={selectedScreen}
          previewData={previewData}
          effectsLoading={effectsLoading}
        />
      </PageHeaderWrapper>
    );
  }
}

export default ScreenList;
