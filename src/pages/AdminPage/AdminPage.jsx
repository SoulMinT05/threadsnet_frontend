import { useState } from 'react';
import { Button, Layout, theme } from 'antd';
import './AdminPage.scss';
import LogoComponent from '../../components/LogoComponent/LogoComponent';
import MenuListComponent from '../../components/MenuListComponent/MenuListComponent';
import ToggleThemeButton from '../../components/ToggleThemeButton/ToggleThemeButton';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { Content } from 'antd/es/layout/layout';
import UserPage from '../UserPage/UserPage';

const { Header, Sider } = Layout;

const AdminPage = () => {
    const [darkTheme, setDarkTheme] = useState(false);
    const [collapsed, setCollapsed] = useState(false);
    const [currentPage, setCurrentPage] = useState('home');

    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const toggleTheme = () => {
        setDarkTheme(!darkTheme);
    };

    const handleMenuClick = (key) => {
        setCurrentPage(key); // Cập nhật trang hiện tại khi menu được nhấn
    };

    const renderContent = () => {
        switch (currentPage) {
            case 'user':
                return <UserPage />;
            // case 'activity':
            //     return <ActivityPage />;
            // case 'progress':
            //     return <ProgressPage />;
            // case 'payment':
            //     return <PaymentPage />;
            // case 'setting':
            //     return <SettingPage />;
            default:
                return <div>Dashboard Content</div>; // Nội dung mặc định
        }
    };

    return (
        <Layout style={{ minHeight: '1000px', padding: 0, margin: 0 }}>
            {/* Sidebar */}
            <Sider
                collapsed={collapsed}
                collapsible
                trigger={null}
                className="sidebar"
                theme={darkTheme ? 'dark' : 'light'}
                style={{ padding: 0, margin: 0 }}
            >
                <LogoComponent />
                <MenuListComponent darkTheme={darkTheme} onMenuClick={handleMenuClick} />
                <ToggleThemeButton darkTheme={darkTheme} toggleTheme={toggleTheme} />
            </Sider>
            {/* Header */}
            <Layout>
                <Header style={{ padding: 0, background: colorBgContainer }}>
                    <Button
                        type="text"
                        className="toggle"
                        onClick={() => setCollapsed(!collapsed)}
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                    />
                </Header>
                {/* Main content */}
                <Content style={{ margin: '16px' }}>{renderContent()}</Content>
            </Layout>
        </Layout>
    );
};

export default AdminPage;
