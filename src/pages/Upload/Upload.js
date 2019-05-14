import React from 'react';
import { Card, Button, Form, Input, message } from 'antd';
import UploadFile from '@/components/Form/UploadFile';
import FormItem from '@/components/Form/CustomFormItem';
import { rules } from '@/utils/constant';
import { uploadLesson } from '@/services/api';

@Form.create()
class Upload extends React.Component {
  uploadSuccess = async res => {
    const { form: { setFieldsValue } } = this.props;
    setFieldsValue({
      classurl: res
    })
  };

  onRemove = () => {
    const { form: { setFieldsValue } } = this.props;
    setFieldsValue({
      classurl: null
    })
  }

  /** 提交表单 */
  handleSubmit = e => {
    e.preventDefault();
    const { form: { validateFields, resetFields } } = this.props;
    validateFields(async (errors, params) => {
      if (errors) {
        return;
      }
      message.info('上传课程中')
      const result = await uploadLesson(params)
      if(result.success) {
        message.success('上传课程成功');
        resetFields();
        return;
      }
      message.error('上传课程失败');
    });
  }



  render() {
    const { form: { getFieldDecorator } } = this.props;
    return (
      <Card title='上传课程'>
        <Form onSubmit={this.handleSubmit} autoComplete="off">
          <FormItem label="课程名称">
            {getFieldDecorator('classname', {
              rules,
            })(<Input placeholder="请输入课程名称" />)}
          </FormItem>
          <FormItem label="课程简介">
            {getFieldDecorator('classdetail', {
              rules,
            })(<Input placeholder="请输入课程简介" />)}
          </FormItem>
          <FormItem label="上传视频">
            {getFieldDecorator('classurl', {
              rules,
            })(<Input type="hidden" />)}
            <UploadFile
              uploadSuccess={this.uploadSuccess}
              onRemoveHandle={this.onRemove}
              btnType="primary"
              tipText="上传视频"
              accept='video/*'
            />
          </FormItem>
          <FormItem type="submit" style={{ marginTop: 32 }}>
            <Button type="primary" htmlType="submit">
              提交
            </Button>
          </FormItem>
        </Form>
      </Card>
    );
  }
}
export default Upload