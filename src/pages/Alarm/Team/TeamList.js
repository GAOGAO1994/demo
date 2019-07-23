/* eslint-disable no-useless-escape */
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Card, Form, Input, Select, Button, Modal, message, Divider } from 'antd';
import SimpleTable from '@/components/SimpleTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from './TeamList.less';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

const CreateForm = Form.create()(props => {
  const {
    modalVisible,
    form,
    values,
    userList,
    handleAdd,
    handleUpdate,
    handleModalVisible,
    effectsLoading,
  } = props;
  const isUpdate = values && Object.keys(values).length > 0;

  const formItemLayout = {
    labelCol: { span: 4, offset: 1 },
    wrapperCol: { span: 16, offset: 1 },
  };

  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const { name, resume, selectedUsers } = fieldsValue;
      const params = {
        name,
        resume,
        user_list: selectedUsers.join(','),
      };

      if (isUpdate) {
        delete params.name;
        handleUpdate({
          ...params,
          key: values.id,
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
      width={600}
      title={isUpdate ? '修改信息' : '增加小组'}
      visible={modalVisible}
      confirmLoading={effectsLoading['team/update'] || effectsLoading['team/add']}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <Form {...formItemLayout}>
        <FormItem label="小组名">
          {form.getFieldDecorator('name', {
            initialValue: isUpdate ? values.name : '',
            rules: [
              { required: true, message: '小组名不能为空' },
              {
                pattern: /^[a-zA-Z0-9_\-\.]*$/,
                message: "格式错误，只允许大小写字母、数字和'_-.'组成",
              },
              { max: 40, message: '小组名长度不能超过40' },
            ],
          })(<Input placeholder="请输入小组名称" disabled={isUpdate} />)}
        </FormItem>
        <FormItem label="小组描述">
          {form.getFieldDecorator('resume', {
            rules: [
              { required: true, message: '小组描述不能为空' },
              { max: 100, message: '小组描述长度不能超过100' },
            ],
            initialValue: isUpdate ? values.resume : '',
          })(<TextArea rows={4} placeholder="请输入小组描述" />)}
        </FormItem>
        <FormItem label="小组成员">
          {form.getFieldDecorator('selectedUsers', {
            initialValue: isUpdate ? values.user && values.user.map(user => user.id) : [],
            rules: [{ required: true, message: '至少选择一名小组成员' }],
          })(
            <Select
              mode="multiple"
              // style={{ width: 120 }}
              // value={this.state.secondCity}
              // onChange={this.onSecondCityChange}
              // defaultValue={isUpdate ? values.user && values.user.map(user => user.id) : []}
              getPopupContainer={triggerNode => triggerNode.parentElement}
              placeholder="选择小组成员（至少一人）"
              filterOption={(input, option) =>
                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {userList.items &&
                userList.items.map(user => (
                  <Option key={user.id} value={user.id}>
                    {user.name}
                  </Option>
                ))}
            </Select>
          )}
        </FormItem>
      </Form>
    </Modal>
  );
});

/* eslint react/no-multi-comp:0 */
@connect(({ team, user, loading }) => ({
  team,
  user,
  effectsLoading: loading.effects,
}))
class TeamList extends PureComponent {
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
      title: '小组名',
      dataIndex: 'name',
    },
    {
      title: '小组描述',
      dataIndex: 'resume',
    },
    {
      title: '组员',
      dataIndex: 'user',
      render: val => val.map(user => user.name).join('、'),
    },
    {
      title: '操作',
      width: 110,
      render: (text, record) => (
        <Fragment>
          <a onClick={() => this.handleModalVisible(true, record)}>编辑</a>
          <Divider type="vertical" />
          <a onClick={() => this.handleDeleteModalVisible(true, record)}>删除</a>
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
      type: 'team/fetch',
      payload: {
        _page: pagination.current, // 不传默认 1
        _num: pagination.pageSize,
        _search_key: searchKey,
        _expand: 1,
        ...params,
      },
    });
  };

  handleFetchUserList = (params = {}) => {
    const {
      user: { userList },
      dispatch,
    } = this.props;

    if (!userList.total) {
      dispatch({
        type: 'user/fetchList',
        payload: {
          _num: -1,
          ...params,
        },
      });
    }
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
      type: 'team/add',
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
      type: 'team/remove',
      payload: {
        id: fields.id,
      },
      callback: () => {
        message.success('删除成功');
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
      type: 'team/update',
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

    !!flag && this.handleFetchUserList(); // eslint-disable-line
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
        confirmLoading={effectsLoading['team/remove']}
        onOk={() => this.handleDelete(deleteFormValues)}
        onCancel={() => this.handleDeleteModalVisible()}
      >
        <p style={{ textAlign: 'center', fontSize: '16px', color: '#222', margin: '30px' }}>
          确认要删除该小组吗？
        </p>
      </Modal>
    );
  }

  render() {
    const {
      team: { data },
      user: { userList },
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
          <div className={styles.teamList}>
            <div className={styles.teamListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                添加小组
              </Button>
              <Input.Search
                style={{ width: 350, float: 'right' }}
                placeholder="输入小组名或小组描述进行搜索"
                enterButton="搜索"
                value={searchKey}
                onChange={this.handleSearchChange}
                onSearch={this.handleSearch}
              />
            </div>
            <SimpleTable
              rowKey="id"
              loading={effectsLoading['team/fetch']}
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
          userList={userList}
          effectsLoading={effectsLoading}
        />
        {this.renderDeleteModal()}
      </PageHeaderWrapper>
    );
  }
}

export default TeamList;
