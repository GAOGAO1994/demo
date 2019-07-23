import React, { PureComponent } from 'react';
import { Table } from 'antd';
import styles from './index.less';

class SimpleTable extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {};
  }

  handleTableChange = (pagination, filters, sorter) => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(pagination, filters, sorter);
    }
  };

  render() {
    const { data = {}, pagination = {}, rowKey, ...rest } = this.props;
    const { items = [], total } = data;

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      ...pagination,
      total,
    };

    return (
      <div className={styles.simpleTable}>
        <Table
          bordered
          rowKey={rowKey || 'key'}
          dataSource={items}
          pagination={paginationProps}
          onChange={this.handleTableChange}
          {...rest}
        />
      </div>
    );
  }
}

export default SimpleTable;
