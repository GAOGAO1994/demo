/* eslint-disable no-useless-escape */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Form, Input, Button, message, Spin } from 'antd';

const FormItem = Form.Item;

@connect(({ user, loading }) => ({
  user,
  loading: loading.models.user,
}))
@Form.create()
class Center extends PureComponent {
  state = {
    isEditable: false,
  };

  handleSubmit = e => {
    e.preventDefault();
    const {
      user: { currentUser },
      form,
      dispatch,
    } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      dispatch({
        type: 'user/update',
        payload: {
          id: currentUser.id,
          ...fieldsValue,
        },
        callback: () => {
          message.success('修改成功');
          this.setState({
            isEditable: false,
          });
        },
      });
    });
  };

  render() {
    const {
      user: { currentUser },
      loading,
      form,
    } = this.props;
    const { isEditable } = this.state;

    return (
      <Card bordered={false}>
        <Spin spinning={loading}>
          <div
            style={{
              fontSize: 24,
              fontWeight: 'bold',
              borderLeft: '5px solid #999',
              paddingLeft: 15,
              marginBottom: 30,
            }}
          >
            基本设置
          </div>
          <Form
            style={{ width: 400 }}
            labelAlign="left"
            labelCol={{ span: 4, offset: 2 }}
            wrapperCol={{ span: 18 }}
          >
            <FormItem label="微信号">
              {form.getFieldDecorator('im', {
                initialValue: currentUser.im,
                rules: [{ max: 32, message: '微信号长度不能超过32' }],
              })(
                isEditable ? (
                  <Input disabled={!isEditable} />
                ) : (
                  <span>{currentUser.im || '未填写'}</span>
                )
              )}
            </FormItem>
            <FormItem label="邮箱">
              {form.getFieldDecorator('email', {
                initialValue: currentUser.email,
                rules: [
                  {
                    pattern: /^[\w\.\-]+@[a-zA-Z0-9]+\.[a-zA-Z0-9\.]+$/,
                    message: '格式错误，请输入正确的邮箱格式',
                  },
                  { max: 255, message: '邮箱长度不能超过255' },
                ],
              })(
                isEditable ? (
                  <Input disabled={!isEditable} />
                ) : (
                  <span>{currentUser.email || '未填写'}</span>
                )
              )}
            </FormItem>
            <FormItem wrapperCol={{ offset: 6 }}>
              {isEditable ? (
                <Button type="primary" onClick={this.handleSubmit}>
                  保 存
                </Button>
              ) : (
                <Button
                  type="primary"
                  onClick={() => {
                    this.setState({
                      isEditable: true,
                    });
                  }}
                >
                  修 改
                </Button>
              )}
            </FormItem>
          </Form>
        </Spin>
      </Card>
    );
  }
}

export default Center;
