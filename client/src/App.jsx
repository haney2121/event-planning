import React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';

import { Layout, PageHeader } from 'antd';

import MainNav from './components/Navigation/MainNav';

import LoginPage from './pages/Login';
import EventsPage from './pages/Events';
import BookingsPage from './pages/Bookings';
import NotFoundPage from './pages/NotFound';

import { UserProvider } from './context/userContext';

const { Header, Content, Footer, Sider } = Layout;

const App = props => {
  return (
    <BrowserRouter>
      <UserProvider>
        <Layout style={{ minHeight: '100vh' }}>
          <Header className='header'>
            <PageHeader
              onBack={() => null}
              backIcon={false}
              title='Event Planning Graphql'
              subTitle='We make planning easier for you.'
            />
          </Header>
          <Layout>
            <Sider>
              <MainNav />
            </Sider>
            <Content style={{ padding: '0 50px' }}>
              <Switch>
                <Redirect from='/' to='/auth' exact />
                <Route exact path='/auth' component={LoginPage} />
                <Route exact path='/events' component={EventsPage} />
                <Route exact path='/bookings' component={BookingsPage} />
                <Route exact path='*' component={NotFoundPage} />
              </Switch>
            </Content>
          </Layout>
          <Footer
            style={{
              backgroundColor: 'rgb(0, 21, 41)',
              textAlign: 'center',
              color: '#fff'
            }}
          >
            Ant Design ©2018 Created by Ant UED
          </Footer>
        </Layout>
      </UserProvider>
    </BrowserRouter>
  );
};

export default App;
