import { Menu } from 'antd';
import {
    HomeOutlined,
    UserOutlined,
    AppstoreOutlined,
    AreaChartOutlined,
    SettingOutlined,
    PayCircleOutlined,
} from '@ant-design/icons';
import './MenuListComponent.scss';

const MenuListComponent = ({ darkTheme, onMenuClick }) => {
    const items = [
        {
            key: 'home',
            icon: <HomeOutlined />,
            label: 'Dashboard',
            onClick: () => onMenuClick('home'),
        },
        {
            key: 'user',
            icon: <UserOutlined />,
            label: 'User',
            onClick: () => onMenuClick('user'),
        },
        {
            key: 'activity',
            icon: <AppstoreOutlined />,
            label: 'Activity',
            onClick: () => onMenuClick('activity'),
        },
        {
            key: 'progress',
            icon: <AreaChartOutlined />,
            label: 'Progress',
            onClick: () => onMenuClick('progress'),
        },
        {
            key: 'payment',
            icon: <PayCircleOutlined />,
            label: 'Payment',
            onClick: () => onMenuClick('payment'),
        },
        {
            key: 'setting',
            icon: <SettingOutlined />,
            label: 'Setting',
            onClick: () => onMenuClick('setting'),
        },
    ];
    return <Menu theme={darkTheme ? 'dark' : 'light'} mode="inline" className="menu-bar" items={items} />;
};

export default MenuListComponent;
