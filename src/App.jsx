// import { Button } from '@chakra-ui/react';
import { Col, Row } from 'antd';
import { Route, Router, Routes } from 'react-router-dom';
import UserPage from './pages/UserPage';
import PostPage from './pages/PostPage/PostPage';
import Header from './components/Header';
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

function App() {
    return (
        <>
            <Container maxW="620px">
                <Header />
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    {/* <Route path="/auth" element={<AuthPage />} /> */}
                    <Route path="/register" element={<SignUpPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/:username/post/:postId" element={<PostPage />} />
                    <Route path="/:username" element={<UserPage />} />

                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
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
