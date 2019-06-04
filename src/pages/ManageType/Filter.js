import React from 'react';
import moment from 'moment';
import { Form, Button, Input } from 'antd';

const FormItem = Form.Item;

class Filter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  // 重置检索条件表单
  handleReset = () => {
    const { onSubmit, form: {resetFields}} = this.props;
    resetFields();
    onSubmit();
  };

  /** 搜索 */
  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFields((errors, params) => {
      this.props.onSubmit(params);
    });
  }



  render() {
    const { form: { getFieldDecorator }, defaultValue } = this.props;

    return (
      <Form
        onSubmit={e => {
          this.handleSubmit(e, false);
        }}
        autoComplete="off"
        layout="inline"
      >
        <FormItem label="类别名称">
          {getFieldDecorator('typename', {
            initialValue: defaultValue.typename,
          })(<Input placeholder="请输入类别名称" />)}
        </FormItem>

        <FormItem type="submit">
          <Button type="primary" htmlType="submit">
            搜索
          </Button>
        </FormItem>

        <FormItem>
          <Button onClick={this.handleReset}>重置</Button>
        </FormItem>
      </Form>
    );
  }
}

export default Form.create()(Filter);
