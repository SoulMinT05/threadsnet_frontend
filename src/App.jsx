// import { Button } from '@chakra-ui/react';
import { Col, Row } from 'antd';
import { Route, Routes } from 'react-router-dom';
import UserPage from './pages/UserPage';
import PostPage from './pages/PostPage/PostPage';
import Header from './components/Header';
import { Container } from '@chakra-ui/react';
import HomePage from './pages/HomePage/HomePage';
import AuthPage from './pages/AuthPage/AuthPage';

function App() {
    return (
        <>
            <h1>Heelo</h1>
            <h1>Hello</h1>
            <Container maxW="620px">
                <Header />
                {/* <Row> */}
                {/* <Header /> */}
                {/* <Col span={6}>col-6</Col> */}
                {/* <Col span={18}> */}
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/auth" element={<AuthPage />} />
                    <Route path="/:username" element={<UserPage />} />
                    <Route path="/:username/post/:postId" element={<PostPage />} />
                </Routes>
                {/* </Col> */}
                {/* </Row> */}
            </Container>
        </>
    );
}

export default App;
