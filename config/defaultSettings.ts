import { ProLayoutProps } from '@ant-design/pro-components';

/**
 * @name
 */
const Settings: ProLayoutProps & {
  pwa?: boolean;
  logo?: string;
} = {
  navTheme: 'light',
  // 拂晓蓝
  colorPrimary: '#1890ff',
  layout: 'side',
  contentWidth: 'Fluid',
  fixedHeader: false,
  fixSiderbar: true,
  colorWeak: false,
  title: '作业提交系统',
  pwa: true,
  // logo: 'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg',
  iconfontUrl: '',
  token: {
    // 参见ts声明，demo 见文档，通过token 修改样式
    //https://procomponents.ant.design/components/layout#%E9%80%9A%E8%BF%87-token-%E4%BF%AE%E6%94%B9%E6%A0%B7%E5%BC%8F
    colorBgAppListIconHover: 'rgba(0,0,0,0.06)',
    colorTextAppListIconHover: 'rgba(255,255,255,0.95)',
    colorTextAppListIcon: 'rgba(255,255,255,0.85)',
    sider: {
      colorBgCollapsedButton: '#fff',
      colorTextCollapsedButtonHover: 'rgba(0,0,0,0.65)',
      colorTextCollapsedButton: 'rgba(0,0,0,0.45)',
      colorMenuBackground: '#004FD9',
      // colorBgMenuItemCollapsedHover: 'rgba(0,0,0,0.06)',
      //colorBgMenuItemCollapsedSelected: 'rgba(0,0,0,0.15)',
      colorBgMenuItemCollapsedElevated: 'rgba(0,0,0,0.85)',
      colorMenuItemDivider: 'rgba(255,255,255,0.15)',
      colorBgMenuItemHover: 'rgba(0,0,0,0.06)',
      colorBgMenuItemSelected: 'rgba(0,0,0,0.15)',
      colorTextMenuSelected: '#fff',
      colorTextMenuItemHover: 'rgba(255,255,255,0.75)',
      colorTextMenu: 'rgba(255,255,255,0.75)',
      colorTextMenuSecondary: 'rgba(255,255,255,0.65)',
      colorTextMenuTitle: 'rgba(255,255,255,0.95)',
      colorTextMenuActive: 'rgba(255,255,255,0.95)',
      colorTextSubMenuSelected: '#fff',
    },
  },
};

export default Settings;
