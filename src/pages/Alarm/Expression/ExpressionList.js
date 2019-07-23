import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Card, Button, Input, Divider, message, Modal } from 'antd';
import SimpleTable from '@/components/SimpleTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from './ExpressionList.less';

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

@connect(({ expression, loading }) => ({
  expression,
  effectsLoading: loading.effects,
}))
class ExpressionList extends PureComponent {
  state = {
    pagination: {
      current: 1,
      pageSize: 10,
    },
    searchKey: undefined,
  };

  columns = [
    {
      key: 'expression',
      title: '规则',
      render: (text, record) => (
        <Fragment>
          <p style={{ fontSize: 16, fontWeight: 'bold' }}>{record.expression}</p>
          <p style={{ color: '#999' }}>
            if {record.func}
            {record.op}
            {record.right_value}
            <span style={{ color: '#2A425B' }}>{'{ alarm to'} </span>
            <span style={{ color: '#CC3333' }}>{`${record.uic}}`}</span>
          </p>
          <p style={{ color: '#999' }}>
            note: {record.note} (Max:{record.max_step}, P{record.priority}) by {record.create_user}
          </p>
        </Fragment>
      ),
    },
    {
      key: 'operate',
      title: '操作',
      width: 160,
      render: (text, record) => (
        <Fragment>
          {record.pause && <a onClick={() => this.handlePause(record)}>继续</a>}
          {!record.pause && <a onClick={() => this.handlePause(record)}>暂停</a>}
          <Divider type="vertical" />
          <a onClick={() => this.handleEditExpression(record)}>编辑</a>
          <Divider type="vertical" />
          <a onClick={() => this.handleDelete(record)}>删除</a>
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
      type: 'expression/fetch',
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

  handlePause = expression => {
    const { dispatch } = this.props;

    Modal.confirm({
      title: '提示',
      content: `确认要${expression && expression.pause ? '继续' : '暂停'}吗？`,
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        dispatch({
          type: 'expression/update',
          payload: {
            id: expression && expression.id,
            pause: expression && !expression.pause,
          },
          callback: () => {
            message.success('更改成功');
            this.handleFetch();
          },
        });
      },
      onCancel: () => {
        // console.log('Cancel');
      },
    });
  };

  handleDelete = expression => {
    const { dispatch } = this.props;
    const { pagination } = this.state;

    Modal.confirm({
      title: '提示',
      content: '确认要删除该规则吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        dispatch({
          type: 'expression/remove',
          payload: {
            id: expression && expression.id,
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
          },
        });
      },
      onCancel: () => {
        // console.log('Cancel');
      },
    });
  };

  handleEditExpression = expression => {
    router.push(`/alarm/expression/edit/${expression.id}`);
  };

  handleAddExpression = () => {
    router.push('/alarm/expression/add');
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

  render() {
    const {
      expression: { data },
      effectsLoading,
    } = this.props;
    const { searchKey, pagination } = this.state;

    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.expressionList}>
            <div className={styles.expressionListOperator}>
              <Button icon="plus" type="primary" onClick={this.handleAddExpression}>
                新建规则
              </Button>
              <Input.Search
                style={{ width: 350, float: 'right' }}
                placeholder="输入告警规则表达式或备注信息进行搜索"
                enterButton="搜索"
                value={searchKey}
                onChange={this.handleSearchChange}
                onSearch={this.handleSearch}
              />
            </div>
            <SimpleTable
              rowKey="id"
              loading={effectsLoading['expression/fetch']}
              data={data}
              pagination={pagination}
              columns={this.columns}
              onChange={this.handleSimpleTableChange}
            />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default ExpressionList;
