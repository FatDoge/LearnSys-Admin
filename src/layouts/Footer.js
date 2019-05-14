import React, { Fragment } from 'react';
import { Layout, Icon } from 'antd';
import GlobalFooter from '@/components/GlobalFooter';

const { Footer } = Layout;
const FooterView = () => (
  <Footer style={{ padding: 0 }}>
    <GlobalFooter
      links={[
        {
          key: '博客',
          title: '博客',
          href: 'https://fatdoge.cn',
          blankTarget: true,
        },
        {
          key: 'Github',
          title: <Icon type="github" />,
          href: 'https://github.com/fatdoge',
          blankTarget: true,
        },
        {
          key: '论坛',
          title: 'BBS',
          href: 'https://bbs.fatdoge.cn',
          blankTarget: true,
        },
      ]}
      copyright={
        <Fragment>
          Copyright <Icon type="copyright" /> 2019 Fatdoge
        </Fragment>
      }
    />
  </Footer>
);
export default FooterView;
