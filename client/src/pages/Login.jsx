import React, { useState, useContext } from 'react';

import { Alert, Form, Icon, Input, Button, Checkbox } from 'antd';

import { UserContext } from '../context/userContext';

const LoginPage = props => {
  const { getFieldDecorator } = props.form;
  const [isLogin, setIsLogin] = useState(true);
  const [errors, setErrors] = useState(null);
  const { setUser } = useContext(UserContext);

  const handleLoginFormToggle = () => {
    setIsLogin(!isLogin);
  };

  const handleSubmit = e => {
    e.preventDefault();
    props.form.validateFields(async (err, values) => {
      const { email, password, name } = values;
      if (!err) {
        try {
          let requestBody;
          if (isLogin) {
            requestBody = {
              query: `
            query {            
                login(email: "${email}", password: "${password}") {
                token
                tokenExpiration
                email
                name
                userId
              }
            }
          `
            };
          } else {
            requestBody = {
              query: `
                mutation {
                  createUser(userInput: {email: "${email}", name: "${name}", password: "${password}"}) {
                    name
                    email
                  }
                }
              `
            };
          }

          let res = await fetch('http://localhost:4001/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
              'Content-Type': 'application/json'
            }
          });
          if (res.status !== 200 && res.status !== 201) {
            let error = await res.json();
            setErrors(error.errors[0].message);
          }
          let data = await res.json();
          setUser(data.data.login);
        } catch (err) {
          console.log(err);
        }
      }
    });
  };

  if (isLogin) {
    return (
      <Form onSubmit={handleSubmit} className='login-form'>
        {errors && <Alert message={errors} type='error' />}
        <Form.Item>
          {getFieldDecorator('email', {
            rules: [
              {
                type: 'email',
                message: 'The input is not valid E-mail!'
              },
              {
                required: true,
                message: 'Please input your E-mail!'
              }
            ]
          })(
            <Input
              prefix={<Icon type='mail' style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder='Email'
              type='email'
            />
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: 'Please input your Password!' }]
          })(
            <Input
              prefix={<Icon type='lock' style={{ color: 'rgba(0,0,0,.25)' }} />}
              type='password'
              placeholder='Password'
            />
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('remember', {
            valuePropName: 'checked',
            initialValue: true
          })(<Checkbox>Remember me</Checkbox>)}
          <a className='login-form-forgot' href=''>
            Forgot password
          </a>
          <Button
            type='primary'
            htmlType='submit'
            className='login-form-button'
          >
            Login
          </Button>
          Or{' '}
          <span className='toggleForm' onClick={handleLoginFormToggle}>
            register now!
          </span>
        </Form.Item>
      </Form>
    );
  } else {
    return (
      <Form onSubmit={handleSubmit} className='login-form'>
        {errors && <Alert message={errors} type='error' />}
        <Form.Item>
          {getFieldDecorator('email', {
            rules: [
              {
                type: 'email',
                message: 'The input is not valid E-mail!'
              },
              {
                required: true,
                message: 'Please input your E-mail!'
              }
            ]
          })(
            <Input
              prefix={<Icon type='mail' style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder='Email'
              type='email'
            />
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('name', {
            rules: [{ required: true, message: 'Please input your name!' }]
          })(
            <Input
              prefix={<Icon type='user' style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder='name'
            />
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: 'Please input your Password!' }]
          })(
            <Input
              prefix={<Icon type='lock' style={{ color: 'rgba(0,0,0,.25)' }} />}
              type='password'
              placeholder='Password'
            />
          )}
        </Form.Item>
        <Form.Item>
          <Button
            type='primary'
            htmlType='submit'
            className='login-form-button'
          >
            Signup
          </Button>
          Or{' '}
          <span className='toggleForm' onClick={handleLoginFormToggle}>
            Have account already? Login!
          </span>
        </Form.Item>
      </Form>
    );
  }
};

export default Form.create({ name: 'normal_login' })(LoginPage);
