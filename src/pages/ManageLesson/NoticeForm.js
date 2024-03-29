import React from 'react';
import { Form, Button, Input, Divider, Select } from 'antd';
import { connect } from 'dva';
import { rules } from '@/utils/constant';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;

@connect(({ notice }) => ({
  notice,
}))
class NoticeForm extends React.Component {
  static defaultProps = {
    detail: {},
  };



  /** 搜索 */
  handleSubmit(e) {
    e.preventDefault();

    this.props.form.validateFields((errors, params) => {
      if (errors) return;

        const pData = {
          ...this.props.detail,
          ...params,
        };
        this.props.onSubmit(pData);
    });
  }

  render() {
    const { form: { getFieldDecorator }, detail } = this.props;
    const { typelist = [] } = detail;

    return (
      <Form
        onSubmit={e => {
          this.handleSubmit(e, false);
        }}
        autoComplete="off"
      >
        <FormItem label="课程名称">
          {getFieldDecorator('classname', {
            rules,
            initialValue: detail.classname,
          })(<Input placeholder="请输入课程名称" />)}
        </FormItem>
        <FormItem label="课程简介">
          {getFieldDecorator('classdetail', {
            rules,
            initialValue: detail.classdetail,
          })(<TextArea rows={4} placeholder="50字以内" />)}
        </FormItem>
        <FormItem label="选择类别">
          {getFieldDecorator('typeid', {
            rules,
            initialValue: detail.typeid,
          })(
            <Select
              placeholder="请选择类型"
            >
              {typelist.map(d => (
                <Option key={d.id} value={d.id}>
                  {d.typename}
                </Option>
              ))}
            </Select>
          )}
        </FormItem>
        <FormItem type="submit">
          <Button type="primary" htmlType="submit">
            确定
          </Button>
          <Divider type="vertical" />
          <Button onClick={this.props.handleCancel}>返回</Button>
        </FormItem>
      </Form>
    );
  }
}

export default Form.create()(NoticeForm);
