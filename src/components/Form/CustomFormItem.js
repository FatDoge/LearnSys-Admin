import React from 'react';
import { Form } from 'antd';
import PropTypes from 'prop-types';

const FormItem = Form.Item;

export default class CustomFormItem extends React.Component {
  static defaultProps = {
    type: 'default',
  };
  static propTypes = {
    type: PropTypes.string,
  };
  formLayout = () => {
    const formLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 },
      },
    };
    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 },
      },
    };
    return this.props.type === 'submit' ? submitFormLayout : formLayout;
  };

  render() {
    return <FormItem {...this.formLayout()} {...this.props} />;
  }
}
