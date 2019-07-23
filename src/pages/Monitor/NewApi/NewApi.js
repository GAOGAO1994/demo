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
  message,
  Drawer,
  Tooltip,
  Spin,
} from 'antd';

import Link from 'umi/link';

import Title from '@/components/AddNewItems/formTitle';
import styles from './NewApi.less';

let id = 0;
const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;



const CreateForm1 = Form.create()(props => {
  const { modalVisible, form, handleAdd, handleModalVisible, effectsLoading } = props;
  const formItemLayout = {
    labelCol: { span: 3, offset: 1 },
    wrapperCol: { span: 10, offset: 1 },
  };

  const handleSubmit = e => {
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  };

  const formItemLayoutWithOutLabel = {
    wrapperCol: { span: 10, offset: 5 },
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
    <Form {...formItemLayout} onSubmit={handleSubmit}>
      <Title title="基本信息" />
      <FormItem label="项目">
        {form.getFieldDecorator('project', {
          validateFirst: true,
          rules: [
            { required: true, message: '项目名称不能为空' },
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
      <Form.Item label="告警小组" hasFeedback>
        {form.getFieldDecorator('select', {
          rules: [{ required: true, message: 'Please select your country!' }],
        })(
          <Select placeholder="请选择告警小组">
            {/* <Option value="china">China</Option> */}
            {/* <Option value="usa">U.S.A</Option> */}
          </Select>
        )}
      </Form.Item>
      <Title title="高级信息" />
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
            <Option value="PUT">
              PUT
            </Option>
            <Option value="DELETE">
              DELETE
            </Option>
            {/* <Option value="PUT" disabled> */}
            {/*  PUT */}
            {/* </Option> */}
            {/* <Option value="DELETE" disabled> */}
            {/*  DELETE */}
            {/* </Option> */}
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
      {form.getFieldValue('method') === 'POST' && (
        <FormItem label="预期响应数据">
          {form.getFieldDecorator('request_data', {
            // validateFirst: true,
            rules: [
              { required: false },
              { max: 4096, message: '请求数据长度不能超过4k' },
              { validator: handleCheckJson },
            ],
          })(<TextArea rows={4} placeholder="请输入预期响应数据" />)}
        </FormItem>
      )}
      {requestHeaderItems}
      <FormItem wrapperCol={{ span: 3, offset: 6 }}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </FormItem>
    </Form>
  )
});



class NewApi extends PureComponent{

  render() {
    // const parentMethods = {
    //   handleAdd: this.handleAdd,
    //   handleModalVisible: this.handleModalVisible,
    // };
    return (
      <div>
        <div className={styles.list}>
          <Link to="/monitor/api"><span className={styles.link}>API监控</span></Link>&nbsp;&nbsp;>&nbsp;&nbsp;
          <span>新建API监控</span>
        </div>
        <div className={styles.container}>
          {/* <Title title="基本信息" /> */}

          <CreateForm1 />

          {/* <Title title="高级信息" /> */}


        </div>
      </div>
    )
  }
}

export default NewApi;
