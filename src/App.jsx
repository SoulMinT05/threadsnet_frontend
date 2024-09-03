// import { Button } from '@chakra-ui/react';
import { Col, Row } from 'antd';
import { Navigate, Route, Router, Routes } from 'react-router-dom';
import UserPage from './pages/UserPage';
import PostPage from './pages/PostPage/PostPage';
import HeaderComponent from './components/HeaderComponent/HeaderComponent';
import { Container } from '@chakra-ui/react';
import HomePage from './pages/HomePage/HomePage';
import AuthPage from './pages/AuthPage/AuthPage';

import React, { Fragment, useEffect, useState } from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DefaultComponent from './components/DefaultComponent/DefaultComponent';
import { routes } from './routes';
import LoginPage from './pages/LoginPage/LoginPage';
import SignUpPage from './pages/SignUpPage/SignUpPage';
import NotFoundPage from './pages/NotFoundPage/NotFoundPage';
import { useRecoilValue } from 'recoil';
import userAtom from './atoms/userAtom';
import LogoutComponent from './components/LogoutComponent/LogoutComponent';
import UpdateProfilePage from './pages/UpdateProfilePage/UpdateProfilePage';

function App() {
    const user = useRecoilValue(userAtom);
    return (
        <>
            <Container maxW="620px">
                <HeaderComponent />
                <Routes>
                    <Route path="/" element={user ? <HomePage /> : <Navigate to="/login" />} />
                    <Route path="/register" element={<SignUpPage />} />
                    <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/" />} />
                    <Route path="/updateProfile" element={user ? <UpdateProfilePage /> : <Navigate to="/login" />} />

                    <Route path="/:username/post/:postId" element={<PostPage />} />
                    <Route path="/:username" element={<UserPage />} />

                    <Route path="*" element={<NotFoundPage />} />
                </Routes>

                {user && <LogoutComponent />}
            </Container>
            {/* <Router>
                <Routes>
                    {routes.map((route) => {
                        const Page = route.page;
                        const ischeckAuth = !route.isPrivate;
                        // || user.isAdmin;
                        const Layout = route.isShowHeader && route.isShowFooter ? DefaultComponent : Fragment;
                        return (
                            <Route
                                key={route.path}
                                path={
                                    // ischeckAuth && route.path
                                    ischeckAuth ? route.path : undefined
                                }
                                element={
                                    <Layout>
                                        <Page />
                                    </Layout>
                                }
                            />
                        );
                    })}
                </Routes>
            </Router> */}
        </>
    );
}

export default App;
