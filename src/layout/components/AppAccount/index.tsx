import avatar from '@/assets/avatar.png';
import { useAppDispatch } from '@/store/hooks';
import { setSignOut } from '@/store/modules/user';
import { removeStorage } from '@/utils/storage';
import { Dropdown, Image, message} from 'antd';
import { useNavigate } from 'react-router';
import type { MenuProps } from 'antd';
import { getAccountStyle } from './style';
import { logOut } from '@/server/useInfo';
import { createErrorModal, createErrorMsg, createSuccessMsg } from '@/hooks/web/useMessage';
import { setStorage, getStorage } from '@/utils/storage';
const AppAccount = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const { AccountDiv } = getAccountStyle();

  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: '退出登录',
    },
  ];

  const memuChange: MenuProps['onClick'] = async(_e) => {
    const res = await logOut(getStorage('access-token'));
    if(res.code === 10000){
      messageApi.success(res.message);
      setTimeout(() => {
        removeStorage('userInfo');
        dispatch(setSignOut());
        navigate('/login');
      }, 1000);
    }else{
      messageApi.error(res.message);
    }

  };

  return (
    <>
      {contextHolder}
      <AccountDiv className="cursor">
        <Dropdown
          menu={{
            items,
            onClick: memuChange,
          }}
          placement="bottom"
          arrow
        >
          <div className="wave">
            <Image src={avatar} width={30} preview={false} />
          </div>
        </Dropdown>
      </AccountDiv>
    </>
  );
};

export default AppAccount;
