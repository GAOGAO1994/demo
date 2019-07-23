import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Card, Modal, message, Checkbox } from 'antd';
import SimpleTable from '@/components/SimpleTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from './CaseList.less';

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

/* eslint react/no-multi-comp:0 */
@connect(({ cases, loading }) => ({
  cases,
  effectsLoading: loading.effects,
}))
class CaseList extends PureComponent {
  state = {
    deleteModalVisible: false,
    pagination: {
      current: 1,
      pageSize: 10,
    },
    status: undefined,
    deleteFormValues: {},
  };

  columns = [
    {
      title: '报警信息',
      dataIndex: 'process_status',
      render: (text, record) => (
        <Fragment>
          <p style={{ fontSize: 16, fontWeight: 'bold' }}>{record.status}</p>
          <p style={{ color: '#999' }}>{record.message}</p>
        </Fragment>
      ),
    },
    {
      title: '报警次数',
      dataIndex: 'step',
    },
    {
      title: '报警时间',
      dataIndex: 'update_at',
    },
    {
      title: '备注',
      dataIndex: 'note',
    },
    {
      title: '操作',
      width: 70,
      render: (text, record) => (
        <a onClick={() => this.handleDeleteModalVisible(true, record)}>删除</a>
      ),
    },
  ];

  componentDidMount() {
    this.handleFetch();
  }

  handleFetch = (params = {}) => {
    const { dispatch } = this.props;
    const { pagination, status } = this.state;

    dispatch({
      type: 'cases/fetch',
      payload: {
        _page: pagination.current, // 不传默认 1
        _num: pagination.pageSize,
        status,
        ...params,
      },
    });
  };

  handleFilter = e => {
    const { pagination } = this.state;
    this.setState({
      pagination: {
        current: 1,
        pageSize: pagination.pageSize,
      },
      status: e.target.checked ? 'PROBLEM' : undefined,
    });
    const params = {
      _page: 1,
      status: e.target.checked ? 'PROBLEM' : undefined,
    };
    this.handleFetch(params);
  };

  handleDelete = value => {
    const { dispatch } = this.props;
    const { pagination } = this.state;
    dispatch({
      type: 'cases/remove',
      payload: {
        id: value.id,
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

  handleDeleteModalVisible = (flag, record) => {
    this.setState({
      deleteModalVisible: !!flag,
      deleteFormValues: record || {},
    });
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
        confirmLoading={effectsLoading['cases/remove']}
        onOk={() => this.handleDelete(deleteFormValues)}
        onCancel={() => this.handleDeleteModalVisible()}
      >
        <p style={{ textAlign: 'center', fontSize: '16px', color: '#222', margin: '30px' }}>
          确认要删除该报警信息吗？
        </p>
      </Modal>
    );
  }

  render() {
    const {
      cases: { data },
      effectsLoading,
    } = this.props;
    const { pagination } = this.state;

    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.caseList}>
            <div className={styles.caseListOperator}>
              <Checkbox onChange={this.handleFilter}>筛选未恢复列表</Checkbox>
            </div>
            <SimpleTable
              rowKey="id"
              loading={effectsLoading['cases/fetch']}
              data={data}
              pagination={pagination}
              columns={this.columns}
              onChange={this.handleSimpleTableChange}
            />
          </div>
        </Card>
        {this.renderDeleteModal()}
      </PageHeaderWrapper>
    );
  }
}

export default CaseList;
