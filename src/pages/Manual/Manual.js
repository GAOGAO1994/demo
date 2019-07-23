import React, { PureComponent } from 'react';
import { Card } from 'antd';

class Manual extends PureComponent {
  state = {};

  componentDidMount() {}

  render() {
    return (
      <Card bordered={false}>
        <div>
          请点击
          <a href="/api/v1/doc" target="_blank">
            此处
          </a>
          ，查看操作手册详细内容！
        </div>
      </Card>
    );
  }
}

export default Manual;
