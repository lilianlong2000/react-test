import { deffHttp } from '@/utils/axios';
import type { StorageValue } from '@/utils/storage/types';
export interface UseInfoType {
  name: string;
  userid: string;
  email: string;
  signature: string;
  introduction: string;
  title: string;
  token: string;
  power: 'test' | 'admin';
}
export const login = (user: string, pwd: string) =>
  deffHttp.post(
    {
      url: 'https://doujia-api.luerdog.com/api/company/auth/login',
      data: { username: user, password: pwd },
      headers:{
        "Content-Type": "application/x-www-form-urlencoded"
      }
    },
    { errorMessageMode: 'modal', withToken: false },
  );

export const getUserInfo = (token: StorageValue<string>) =>
  deffHttp.post({
    url: 'https://doujia-api.luerdog.com/api/company/auth/profile',
    headers: {
      'Authorization': 'Bearer ' + token,
    },
  });


export const logOut = (token: StorageValue<string>) =>
  deffHttp.delete({
    url: 'https://doujia-api.luerdog.com/api/company/auth/logout',
    headers: {
      Authorization: 'Bearer ' + token,
    },
  });
