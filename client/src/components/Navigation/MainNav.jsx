import React, { useState, useContext } from 'react';
import { withRouter, Link } from 'react-router-dom';

import { Menu, Icon } from 'antd';

import { UserContext } from '../../context/userContext';

const MainNav = props => {
  const path = props.location.pathname.split('/')[1];
  const [current, setCurrent] = useState(path);
  const { user } = useContext(UserContext);

  console.log(user);

  return (
    <Menu theme='dark' mode='inline' defaultSelectedKeys={[current]}>
      <Menu.Item key='auth'>
        <Link to='/auth'>
          <Icon type='user' />
          Auth
        </Link>
      </Menu.Item>
      <Menu.Item key='events'>
        <Link to='/events'>
          <Icon type='calendar' />
          Events
        </Link>
      </Menu.Item>
      <Menu.Item key='bookings'>
        <Link to='/bookings'>
          <Icon type='select' />
          Booking
        </Link>
      </Menu.Item>
    </Menu>
  );
};

export default withRouter(MainNav);
