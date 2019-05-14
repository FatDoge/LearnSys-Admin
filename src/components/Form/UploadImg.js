import React from 'react';
import { Icon, Upload, message } from 'antd';
import PropTypes from 'prop-types';

const COMMON_LIMIT = '图片大小：小于 20M';

export default class UploadImg extends React.Component {
  static defaultProps = {
    accept: 'image/*',
    listType: 'picture-card',
    defaultFileList: [],
    tipText: COMMON_LIMIT,
    multiple: false,
    removeSuccess: () => {},
    showUploadList: true,
    disabled: false,
    beforeUpload: undefined,
  };
  static propTypes = {
    accept: PropTypes.string,
    listType: PropTypes.string, // 上传列表的内建样式
    defaultFileList: PropTypes.array, // 默认已经上传的文件列表
    tipText: PropTypes.string,
    multiple: PropTypes.bool, // 是否可以上传多张图片
    removeSuccess: PropTypes.func,
    showUploadList: PropTypes.bool, // 是否展示 uploadList
    disabled: PropTypes.bool, // 是否禁用组件
    beforeUpload: PropTypes.func,
  };
  state = {
    fileList: null,
  };

  /** 上传图片 */
  handleUpload = ({ file, fileList }) => {
    const { multiple } = this.props;
    const newFileList = multiple ? [...fileList] : fileList.slice(-1);

    if (file.status === 'done') {
      const { response: { results: { publicUrl } } } = file;

      const index = newFileList.findIndex(v => v.uid === file.uid);
      if (index >= 0) {
        newFileList[index].url = publicUrl;
      }
      const param = multiple ? newFileList : file.response.results;
      this.props.uploadSuccess(param);
    }
    this.setState({ fileList: newFileList });
  };

  // 清空已上传图片列表
  resetFileList = () => {
    this.setState({ fileList: [] });
  };

  // 重置成默认已上传图片列表
  resetDefaultFileList = () => {
    this.setState({ fileList: this.props.defaultFileList || [] });
  };

  previousBeforeUpload = file => {
    if (!/\.(png|gif|jpe|jpg|jpeg)$/i.test(file.name)) {
      message.error('仅支持 .jpg .jpeg .png .gif 的图片格式');
      return false;
    } else {
      return true;
    }
  }

  render() {
    const { accept, listType, multiple, showUploadList, publicAccess = true, beforeUpload, disabled } = this.props;
    let { tipText } = this.props;
    // const { fileList } = this.state;

    const uploadData = { publicAccess, type: 1 };

    // 空字符串则不显示提示，如果没传则使用通用提示，否则在提示后加上通用提示
    tipText = tipText && `${tipText}，${COMMON_LIMIT}`;
    const props = {
      action: '/japi/platform/115020002',
      accept,
      listType,
      multiple,
      showUploadList,
      fileList: this.state.fileList || this.props.defaultFileList || [],
      name: 'uploadFile',
      beforeUpload: beforeUpload || this.previousBeforeUpload,
      onRemove: async file => {
        const fileList = this.state.fileList || this.props.defaultFileList || [];
        await this.setState({
          fileList: fileList.filter(item => {
            return item.uid !== file.uid;
          }),
        });
        this.props.removeSuccess(this.state.fileList);
      },
      onChange: e => this.handleUpload(e),
    };
    return listType === 'text' ? (
      <Upload {...props} data={uploadData} disabled={disabled}>
        <Icon type="picture" style={{ fontSize: 22 }} /> {tipText}
      </Upload>
    ) : (
      <div>
        <Upload {...props} data={uploadData} disabled={disabled}>
          <Icon type="plus" />
          <div className="ant-upload-text">上传照片</div>
        </Upload>
        <div style={{ fontSize: 12, lineHeight: 1.6 }}>
          <span>{tipText}</span>
        </div>
      </div>
    );
  }
}
