import React from 'react';
import { Modal, Form, Input } from 'antd';

class SortModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  onOk() {
    const that = this;
    this.props.form.validateFields((errors, values) => {
      if (errors) {
        return;
      }
      that.props.onOk(values);
      that.props.form.resetFields();
      that.props.onCancel();
    });
  }

  render() {
    const { form: { getFieldDecorator }, sortId } = this.props;
    return (
      <Modal
        visible={this.props.visible}
        title="排序"
        onCancel={this.props.onCancel.bind(this)}
        onOk={this.onOk.bind(this)}
      >
        <Form autoComplete="off">
          <Form.Item>
            {getFieldDecorator('sortId', {
              initialValue: sortId || null,
              rules: [
                {
                  required: true,
                  message: this.props.placeholder ? this.props.placeholder : '请输入排序编号',
                },
              ],
            })(
              <Input
                type="number"
                placeholder={this.props.placeholder ? this.props.placeholder : '请输入排序编号'}
              />
            )}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default Form.create()(SortModal);
