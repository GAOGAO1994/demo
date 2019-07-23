import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Card, Form, Button, Input, Select, message, Modal, Row, Col, Checkbox, Spin } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from './AddExpression.less';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;

@connect(({ expression, team, loading }) => ({
  expression,
  team,
  loading: loading.models.expression || false,
}))
@Form.create()
class AddExpression extends PureComponent {
  state = {
    isUpdate: false,
  };

  componentDidMount() {
    this.handleFetchTeamList();
    const {
      match: { params },
    } = this.props;
    if (params && params.id) {
      this.setState({
        isUpdate: true,
      });
      this.handleFetch();
    }
  }

  handleFetchTeamList = (params = {}) => {
    const { dispatch } = this.props;

    dispatch({
      type: 'team/fetchSimpleList',
      payload: {
        _num: -1,
        ...params,
      },
    });
  };

  handleFetch = () => {
    const { dispatch, match } = this.props;
    const { params } = match;

    dispatch({
      type: 'expression/fetchOne',
      payload: {
        id: params.id || '1000000000',
        _expand: 1,
      },
    });
  };

  okHandle = () => {
    const { form } = this.props;
    const { isUpdate } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const { funcSelect, funcNumber, max_step: maxStep, priority, url } = fieldsValue;
      const customParams = {
        ...fieldsValue,
        func: `${funcSelect}(#${funcNumber})`,
        max_step: Number(maxStep),
        priority: Number(priority),
        callback: !!url,
      };
      delete customParams.funcSelect;
      delete customParams.funcNumber;

      if (isUpdate) {
        const {
          match: { params },
        } = this.props;
        this.handleUpdate({
          ...customParams,
          id: params && params.id,
        });
      } else {
        this.handleAdd(customParams);
      }
    });
  };

  cancelHandle = () => {
    router.push('/alarm/expression');
  };

  handleAdd = params => {
    const { dispatch } = this.props;
    Modal.confirm({
      title: '提示',
      content: '确认要添加此规则吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        dispatch({
          type: 'expression/add',
          payload: params,
          callback: () => {
            message.success('规则添加成功');
            router.push('/alarm/expression');
          },
        });
      },
      onCancel: () => {
        // console.log('Cancel');
      },
    });
  };

  handleUpdate = params => {
    const { dispatch } = this.props;
    Modal.confirm({
      title: '提示',
      content: '确认要更改此规则吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        dispatch({
          type: 'expression/update',
          payload: params,
          callback: () => {
            message.success('规则更改成功');
            router.push('/alarm/expression');
          },
        });
      },
      onCancel: () => {
        // console.log('Cancel');
      },
    });
  };

  render() {
    const {
      expression: { expression },
      team: { teamList },
      loading,
      form,
    } = this.props;
    const { isUpdate } = this.state;

    const funcSelect = expression.func && expression.func.match(/.+(?=\()/);
    const funcNumber = expression.func && expression.func.match(/\(#(.+)\)/);

    return (
      <PageHeaderWrapper>
        <Spin spinning={loading} size="large">
          <Form labelAlign="left" hideRequiredMark className={styles.addExpressionForm}>
            {/* <Form className={styles.addExpressionForm}> */}
            <Card title="设置报警规则表达式（e.g.each(metric=qps  srv=falcon)）" bordered={false}>
              <FormItem label="预警规则表达式" labelCol={{ span: 3 }} wrapperCol={{ span: 18 }}>
                {form.getFieldDecorator('expression', {
                  initialValue: isUpdate ? expression.expression : '',
                  rules: [
                    { required: true, message: '表达式不能为空' },
                    { max: 1024, message: '表达式长度不能超过1024' },
                  ],
                })(<TextArea rows={4} />)}
              </FormItem>
              <Row>
                <Col span={1} className={styles.textContainer} style={{ textAlign: 'left' }}>
                  if
                </Col>
                <Col span={2}>
                  <FormItem>
                    {form.getFieldDecorator('funcSelect', {
                      initialValue: isUpdate ? funcSelect : 'max',
                    })(
                      <Select>
                        <Option value="max">MAX</Option>
                        <Option value="min">MIN</Option>
                        <Option value="abs">ABS</Option>
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col span={1} className={styles.textContainer}>
                  (
                </Col>
                <Col span={2}>
                  <FormItem>
                    {form.getFieldDecorator('funcNumber', {
                      initialValue: isUpdate ? funcNumber && funcNumber[1] : '',
                      rules: [
                        { required: true, message: '不能为空' },
                        { pattern: /^[1-9]\d*$/, message: '格式错误，请输入正整数' },
                      ],
                    })(<Input />)}
                  </FormItem>
                </Col>
                <Col span={1} className={styles.textContainer}>
                  )
                </Col>
                <Col span={2}>
                  <FormItem>
                    {form.getFieldDecorator('op', {
                      initialValue: isUpdate ? expression.op : '>=',
                    })(
                      <Select>
                        <Option value="==">==</Option>
                        <Option value="!=">!=</Option>
                        <Option value=">">&gt;</Option>
                        <Option value=">=">&gt;=</Option>
                        <Option value="<">&lt;</Option>
                        <Option value="<=">&lt;=</Option>
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col span={2} push={1}>
                  <FormItem>
                    {form.getFieldDecorator('right_value', {
                      initialValue: isUpdate ? expression.right_value : '',
                      rules: [{ required: true, message: '不能为空' }],
                    })(<Input />)}
                  </FormItem>
                </Col>
                <Col span={3} push={1} className={styles.textContainer}>
                  :alarm;callback();
                </Col>
              </Row>
            </Card>
            <Card title="def alarm(): #配置报警通知" bordered={false}>
              <FormItem label="报警接受组" labelCol={{ span: 3 }} wrapperCol={{ span: 4 }}>
                {form.getFieldDecorator('uic', {
                  initialValue: isUpdate
                    ? expression.uic || (expression.action && expression.action.uic)
                    : '',
                  rules: [
                    { required: true, message: '不能为空' },
                    { max: 255, message: '报警接收组长度不能超过255' },
                  ],
                })(
                  <Select
                    showSearch
                    filterOption={(input, option) =>
                      option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {teamList.items &&
                      teamList.items.map(team => (
                        <Option key={team.id} value={team.name}>
                          {team.name}
                        </Option>
                      ))}
                  </Select>
                )}
              </FormItem>
              <FormItem label="最多报警次数" labelCol={{ span: 3 }} wrapperCol={{ span: 3 }}>
                {form.getFieldDecorator('max_step', {
                  initialValue: isUpdate ? expression.max_step : '',
                  rules: [
                    { required: true, message: '不能为空' },
                    { pattern: /^[1-9]\d*$/, message: '格式错误，请输入正整数' },
                  ],
                })(<Input placeholder="请填写数字" />)}
              </FormItem>
              <FormItem label="报警级别" labelCol={{ span: 3 }}>
                <Fragment>
                  <FormItem style={{ display: 'inline-block', width: 120, marginRight: 10 }}>
                    {form.getFieldDecorator('priority', {
                      initialValue: isUpdate ? expression.priority : '',
                      rules: [
                        { required: true, message: '不能为空' },
                        { pattern: /^[1-9]\d*$/, message: '格式错误，请输入正整数' },
                      ],
                    })(<Input placeholder="请填写数字" />)}
                  </FormItem>
                  如果报警级别大于等于3则以邮箱的方式进行通知，反之则以popo和邮箱；备注信息（将附在告警内容中发送）：
                  <FormItem style={{ display: 'inline-block' }}>
                    {form.getFieldDecorator('note', {
                      initialValue: isUpdate ? expression.note : '',
                      rules: [{ max: 1024, message: '备注信息长度不能超过1024' }],
                    })(<Input />)}
                  </FormItem>
                </Fragment>
              </FormItem>
            </Card>
            <Card title="def callback(): #高级用法，配置callback地址才发出回调" bordered={false}>
              <FormItem label="callback地址" labelCol={{ span: 3 }} wrapperCol={{ span: 18 }}>
                {form.getFieldDecorator('url', {
                  initialValue: isUpdate
                    ? expression.url || (expression.action && expression.action.url)
                    : '',
                  rules: [{ max: 255, message: 'callback地址长度不能超过255' }],
                })(<Input placeholder="默认只支持http get方式回调" />)}
              </FormItem>
              <FormItem label="提醒方式" labelCol={{ span: 3 }} wrapperCol={{ span: 18 }}>
                <Fragment>
                  <FormItem style={{ display: 'inline-block', marginRight: 10 }}>
                    {form.getFieldDecorator('before_callback_sms', {
                      initialValue: isUpdate
                        ? expression.action && expression.action.before_callback_sms
                        : false,
                      valuePropName: 'checked',
                    })(<Checkbox>回调前发提醒短信</Checkbox>)}
                  </FormItem>
                  <FormItem style={{ display: 'inline-block', margin: '0 10px' }}>
                    {form.getFieldDecorator('before_callback_mail', {
                      initialValue: isUpdate
                        ? expression.action && expression.action.before_callback_mail
                        : false,
                      valuePropName: 'checked',
                    })(<Checkbox>回调前发提醒邮件</Checkbox>)}
                  </FormItem>
                  <FormItem style={{ display: 'inline-block', margin: '0 10px' }}>
                    {form.getFieldDecorator('after_callback_sms', {
                      initialValue: isUpdate
                        ? expression.action && expression.action.after_callback_sms
                        : false,
                      valuePropName: 'checked',
                    })(<Checkbox>回调后发提醒短信</Checkbox>)}
                  </FormItem>
                  <FormItem style={{ display: 'inline-block', marginLeft: 10 }}>
                    {form.getFieldDecorator('after_callback_mail', {
                      initialValue: isUpdate
                        ? expression.action && expression.action.after_callback_mail
                        : false,
                      valuePropName: 'checked',
                    })(<Checkbox>回调后发提醒邮件</Checkbox>)}
                  </FormItem>
                </Fragment>
              </FormItem>
            </Card>
            <Card bordered={false}>
              <Button style={{ marginRight: 20 }} type="primary" onClick={this.okHandle}>
                确认
              </Button>
              <Button onClick={this.cancelHandle}>取消</Button>
            </Card>
          </Form>
        </Spin>
      </PageHeaderWrapper>
    );
  }
}

export default AddExpression;
