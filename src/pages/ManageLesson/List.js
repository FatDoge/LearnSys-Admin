import React, { Fragment } from 'react';
import { Card, Button, Table, Modal, Divider, Popconfirm, message } from 'antd';
import { connect } from 'dva';
import withSearchAndPaging from '@/components/withSearchAndPaging';
import Filter from './Filter';
import NoticeForm from './NoticeForm';
import VideoPreview from './VideoPreview';
import { Link } from 'dva/router';
import { deleteLesson } from '@/services/lesson';
import { fetchTypeList } from '@/services/type';


@connect(({ lesson, user }) => ({
  lesson,
  user
}))
@withSearchAndPaging(Filter, async (props, searchCondition) => {
  console.log(searchCondition)
  const res = {};
  await props.dispatch({
    type: 'lesson/fetch',
    payload: searchCondition,
    callback: result => {
      res.items = result.items;
      // res.pageBean = result.pageBean;
    },
  });
  return res;
})
export default class List extends React.Component {
  state = {
    visible: false,
    detail: {},
    videoVisible: false,
    currentClassUrl: null,
  };

  componentDidMount = async () => {
    const { items } = await fetchTypeList()
    this.setState({
      detail: {
        ...this.state.detail,
        typelist: items,
      },
    })
  }

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  handleSubmit = payload => {
    console.log(payload)
    this.props.dispatch({
      type: 'lesson/updateLesson',
      payload,
      callback: () =>
        this.setState(
          {
            visible: false,
          },
          this.props.fetchData
        ),
    });
  };

  handleDelete = async id => {
    const res = await deleteLesson({id})
    if(res.success) {
      message.success('删除成功')
      this.props.fetchData();
    }
  }

  // 渲染更改税法信息Modal
  renderNoticeModal = () => {
    const { detail } = this.state;
    return (
      <Modal
        title='编辑课程信息'
        visible={this.state.visible}
        onCancel={this.handleCancel}
        destroyOnClose
        footer={null}
      >
        <NoticeForm
          handleCancel={this.handleCancel}
          onSubmit={this.handleSubmit}
          detail={this.state.detail}
        />
      </Modal>
    );
  };

  renderPreviewModal = () => {
    return (
      <Modal
        title='预览课程'
        visible={this.state.videoVisible}
        onCancel={() => this.setState({
          videoVisible: false,
        })}
        destroyOnClose
        footer={null}
      >
        <VideoPreview
          classurl={this.state.currentClassUrl}
        />
      </Modal>
    );
  };

  previewClass = text => {
    this.setState({
      videoVisible: true,
      currentClassUrl: text,
    })
  }

  render() {
    const columns = [
      {
        title: '课程名',
        dataIndex: 'classname',
      },
      {
        title: '课程简介',
        dataIndex: 'classdetail',
        width: 450,
      },
      {
        title: '课程分类',
        dataIndex: 'typeid',
        render: text => {
          return this.state.detail.typelist.filter( x => x.id === text)[0].typename || '暂无分类'
        }
      },
      {
        title: '作者',
        dataIndex: 'nickname',
        render: () => {
          return <span>{this.props.user.currentUser.nickname}</span>
        }
      },
      {
        title: '课程链接',
        dataIndex: 'classurl',
        render: (text, item) => {
          return (
            <a onClick={() => this.previewClass(text)}>点击观看</a>
          );
        },
      },
      {
        title: '操作',
        dataIndex: 'handle',
        render: (text, item) => {
          return (
            <Fragment>
              <a onClick={() => this.setState({ visible: true, detail: { ...this.state.detail,...item} })}>
                编辑
              </a>
              <Divider type="vertical"/>
              <Popconfirm
                title="是否删除该课程?"
                onConfirm={()=>this.handleDelete(item.id)}
                okText="是"
                cancelText="否"
              >
                <a style={{ color: 'red' }}>删除</a>
              </Popconfirm>
            </Fragment>
            );
          },
        },
      ];
    const { loading, itemsData: items } = this.props;
    return (
      <Card
        title="课程管理"
        extra={
          <Link to={'/upload'}>
          <Button type="primary">
            新增
          </Button>
          </Link>
        }
      >
        {this.renderNoticeModal()}
        {this.renderPreviewModal()}
        <Table
          dataSource={items}
          columns={columns}
          loading={loading}
          pagination={false}
          rowKey="id"
          scroll={{ x: 1000, y: 0 }}
        />
      </Card>
    );
  }
}
