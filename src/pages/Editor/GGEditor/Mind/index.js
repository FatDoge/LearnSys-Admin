import React from 'react'
import { Form, Card, Input, Button, message } from 'antd';
// import FormItem from '@/components/Form/CustomFormItem';
import { rules } from '@/utils/constant';
import { uploadArticle, fetchCurrentArticle } from '@/services/article';
const FormItem = Form.Item
// 引入编辑器组件
import BraftEditor from 'braft-editor'
// 引入编辑器样式
import 'braft-editor/dist/index.css'

@Form.create()
class EditorDemo extends React.Component {

  state = {
  }

  async componentDidMount() {
    this.fetchCurrent()
  }

  fetchCurrent = async () => {
    const { match: {params, path}} = this.props
    console.log(params, path);
    if(path.split('/').includes('create')) {
      return;
    }
    if(path.split('/').includes('update')) {
      const res = await fetchCurrentArticle(params);
      console.log(res)
      // 使用BraftEditor.createEditorState将html字符串转换为编辑器需要的editorState
      this.props.form.setFieldsValue({
        content: BraftEditor.createEditorState(res.content),
        title: res.title,
      })
    }

  }

  /** 提交表单 */
  handleSubmit = e => {
    const { match: { params: pData } } = this.props
    e.preventDefault();
    const { form: { validateFields, resetFields } } = this.props;
    validateFields(async (errors, params) => {
      if (errors) {
        return;
      }
      message.info('上传文章中')
      const result = await uploadArticle({
        ...params,
        ...pData,
        content: params.content.toHTML(),
      })
      if (result.success) {
        message.success('上传文章成功');
        return;
      }
      message.error('上传文章失败');
    });
  }

  render() {
    const { form: { getFieldDecorator } } = this.props;
    return (
      <Card title='上传文章'>
        <Form onSubmit={this.handleSubmit} autoComplete="off">
          <FormItem label="文章名称">
            {getFieldDecorator('title', {
              rules,
            })(<Input placeholder="请输入文章名称" />)}
          </FormItem>
          <FormItem label="文章内容">
            {getFieldDecorator('content', {
              validateTrigger: 'onBlur',
              rules: [{
                required: true,
                validator: (_, value, callback) => {
                  if (value.isEmpty()) {
                    callback('请输入正文内容')
                  } else {
                    callback()
                  }
                }
              }],
            })(
              <BraftEditor
                placeholder="请输入正文内容"
              />
            )}
          </FormItem>
          <FormItem type="submit" style={{ marginTop: 32 }}>
            <Button type="primary" htmlType="submit">
              提交
            </Button>
          </FormItem>
        </Form>
      </Card>
    )
  }
}

export default EditorDemo