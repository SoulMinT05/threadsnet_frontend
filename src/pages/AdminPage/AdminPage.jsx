import React, { useState } from 'react';
import { Button, Layout, theme } from 'antd';
import './AdminPage.scss';
import LogoComponent from '../../components/LogoComponent/LogoComponent';
import MenuListComponent from '../../components/MenuListComponent/MenuListComponent';
import ToggleThemeButton from '../../components/ToggleThemeButton/ToggleThemeButton';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';

const { Header, Sider } = Layout;

const AdminPage = () => {
    const [darkTheme, setDarkTheme] = useState(false);
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer },
    } = theme.useToken();
    const toggleTheme = () => {
        setDarkTheme(!darkTheme);
    };

    return (
        <Layout style={{ minHeight: '1000px', padding: 0, margin: 0 }}>
            <Sider
                collapsed={collapsed}
                collapsible
                trigger={null}
                className="sidebar"
                theme={darkTheme ? 'dark' : 'light'}
                style={{ padding: 0, margin: 0 }}
            >
                <LogoComponent />
                <MenuListComponent darkTheme={darkTheme} />
                <ToggleThemeButton darkTheme={darkTheme} toggleTheme={toggleTheme} />
            </Sider>
            <Layout>
                <Header style={{ padding: 0, background: colorBgContainer }}>
                    <Button
                        type="text"
                        className="toggle"
                        onClick={() => setCollapsed(!collapsed)}
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                    />
                </Header>
            </Layout>
        </Layout>
    );
};

export default AdminPage;
