import logo from '@/assets/logo.png';
import AppLocale from '@/components/AppLocale';
import AppTheme from '@/components/AppTheme';
import { useLocale } from '@/locales';
import { initAsyncRoute } from '@/router/utils';
import { login, getUserInfo } from '@/server/useInfo';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setUserInfo } from '@/store/modules/user';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Image, Input, theme, message } from 'antd';
import { memo, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { setStorage,getStorage } from '@/utils/storage';
import type { LoginForm } from './type';
import { createErrorModal, createErrorMsg, createSuccessMsg } from '@/hooks/web/useMessage';
const Login = memo(() => {
  const intl = useLocale();
  const [messageApi, contextHolder] = message.useMessage();
  const thme = theme.useToken();

  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(false);

  const onFinish = async (values: LoginForm) => {
    setLoading(true);
    const res = await login(values.username, values.password);
    if(res.code === 10000){
      messageApi.success('登陆成功');
      setStorage('access-token', res.data.token);
      await initAsyncRoute('admin');
      const r = await getUserInfo(getStorage('access-token'));
      dispatch(
        setUserInfo({
          name: values.username,
          userid: '00000001',
          email: '1531733886@qq.com',
          signature: '甜甜的蜂蜜，甘甜的绿茶，蜂蜜中和了绿茶的苦涩保留了绿茶回甘，绝妙啊',
          introduction: '微笑着，努力着，欣赏着',
          title: '小斯斯',
          token: res.data.token ,
          power: 'admin',
        }),
      );
      
    }else {
      messageApi.error(res.message);
    }
    setLoading(false);
  };

  const userStore = useAppSelector(state => state.user);

  useEffect(() => {
    if (userStore.power) {
      navigate('/home');
    }
  }, [userStore]);

  return (
    <>
      {contextHolder}
      <div
        className="w-full h-full flex flex-col items-center justify-center relative"
        style={{ backgroundColor: thme.token.colorBgContainer, color: thme.token.colorText }}
      >
        <div className="flex flex-row justify-center items-center absolute top-3 right-3 gap-3">
          <AppLocale />
          <AppTheme />
        </div>
        <div className="p-10" style={{ boxShadow: '0 15px 25px #0009' }}>
          <div className="mb-10 flex flex-row items-center justify-center "></div>
          <Form
            className="w-[360px]"
            name="normal_login"
            size="large"
            initialValues={{ remember: true }}
            onFinish={onFinish}
          >
            <Form.Item<LoginForm>
              name="username"
              rules={[{ required: true, message: intl.formatMessage({ id: 'login.userNameRules' }) }]}
            >
              <Input prefix={<UserOutlined />} placeholder="username" allowClear />
            </Form.Item>
            <Form.Item<LoginForm>
              name="password"
              rules={[{ required: true, message: intl.formatMessage({ id: 'login.passwordRules' }) }]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="possword" allowClear />
            </Form.Item>
            <Form.Item<LoginForm>>
              <div className="flex flex-row justify-between items-center">
                <Form.Item name="remember" noStyle>
                  <Checkbox checked>{intl.formatMessage({ id: 'login.rememberPassword' })}</Checkbox>
                </Form.Item>

                <Button type="link" className="p-0" style={{ color: thme.token.colorPrimary }}>
                  {intl.formatMessage({ id: 'login.forgotPassword' })}
                </Button>
              </div>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" className="w-full" loading={loading}>
                {intl.formatMessage({ id: 'login.button' })}
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </>
  );
});

export default Login;
