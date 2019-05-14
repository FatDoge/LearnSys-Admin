import React from 'react';
import { message, Icon, Upload, Button } from 'antd';
import { uploadFileI, queryUploadToken } from '@/services/api';

export default class UploadFile extends React.Component {
  state = {
    payload: {},
  };

  /** 上传文件 */
  handleUpload = async () => {
    message.info('视频上传中')
    const { payload } = this.state;
    const { uploadSuccess } = this.props;
    const lessonUrl = await uploadFileI(payload);
    message.success('视频上传成功')
    uploadSuccess(lessonUrl);
  };

  handleChange = ({fileList}) => {
    const newFileList = fileList.slice(-1);
    this.setState({ fileList: newFileList });
  };

  render() {
    const { tipText = '选择文件', btnType = 'default', accept = '*' } = this.props;
    const { fileList } = this.state;
    const props = {
      tipText,
      accept,
      listType: 'picture-card',
      onRemove: file => {
        const { onRemoveHandle } = this.props;
        onRemoveHandle(file);
      },
      onChange: this.handleChange,
      beforeUpload: async file => {
        const { data: { token } } = await queryUploadToken()
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = async () => {
          await this.setState({
            payload: {
              file,
              fileName: file.name,
              token,
            },
          });
          await this.handleUpload();
        };
        return false;
      },
    };
    return (
      <Upload {...props} fileList={fileList}>
        <Button type={btnType}>
          <Icon type="upload" /> {tipText}
        </Button>
      </Upload>
    );
  }
}
