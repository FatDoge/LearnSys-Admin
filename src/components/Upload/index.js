import React from 'react';
import { Icon, Upload, Button } from 'antd';
import { uploadFileI } from '../../services/api';

export default class UploadFile extends React.Component {
  state = {
    payload: {},
  };

  /** 上传文件 */
  handleUpload = async () => {
    const { payload } = this.state;
    const { success, results } = await uploadFileI(payload);
    if (success) {
      this.props.uploadSuccess(results);
    }
  };

  render() {
    const { tipText = '选择文件', btnType = 'default' } = this.props;
    const props = {
      tipText,
      beforeUpload: file => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = async () => {
          await this.setState({
            payload: {
              type: 0,
              uploadFile: file,
              publicAccess: true,
              filename: file.name,
            },
          });
          await this.handleUpload();
        };
        return false;
      },
    };
    return (
      <Upload {...props}>
        <Button type={btnType}>
          <Icon type="upload" /> {tipText}
        </Button>
      </Upload>
    );
  }
}
