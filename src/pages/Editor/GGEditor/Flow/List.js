import React, { Fragment } from 'react';
import { Card, Button, Table, Modal, Divider, Popconfirm, message } from 'antd';
import { connect } from 'dva';
import withSearchAndPaging from '@/components/withSearchAndPaging';
import Filter from './Filter';
import { Link } from 'dva/router';
import { fetchArticleList, deleteArticle } from '@/services/article';


@connect(({ user }) => ({
  user
}))
@withSearchAndPaging(Filter, async (props, searchCondition) => {
  console.log(searchCondition)
  const res = await fetchArticleList(searchCondition);
  return res;
})
export default class List extends React.Component {
  state = {
    visible: false,
    detail: {},
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  handleDelete = async id => {
    const res = await deleteArticle({id})
    if(res.success) {
      message.success('删除成功')
      this.props.fetchData();
    }
  }



  render() {
    const columns = [
      {
        title: '文章名',
        dataIndex: 'title',
      },
      {
        title: '文章内容',
        dataIndex: 'classdetail',
        render() {
          return <span>暂无预览功能</span>
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
        title: '操作',
        dataIndex: 'handle',
        render: (text, item) => {
          return (
            <Fragment>
              <Link to={`/editor/update/${item.id}`}>编辑</Link>
              <Divider type="vertical"/>
              <Popconfirm
                title="是否删除该文章?"
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
        title="文章管理"
        extra={
          <Link to={'/editor/create'}>
          <Button type="primary">
            新增
          </Button>
          </Link>
        }
      >
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
