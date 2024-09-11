import { Navigate, Route, Routes } from 'react-router-dom';
import ProfilePage from './ProfilePage/ProfilePage';
import HomeDetailPostPage from './pages/HomeDetailPostPage/HomeDetailPostPage';
import HeaderComponent from './components/HeaderComponent/HeaderComponent';
import { Container, Flex } from '@chakra-ui/react';
import HomePage from './pages/HomePage/HomePage';

// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage/LoginPage';
import SignUpPage from './pages/SignUpPage/SignUpPage';
import NotFoundPage from './pages/NotFoundPage/NotFoundPage';
import { useRecoilValue } from 'recoil';
import userAtom from './atoms/userAtom';
import UpdateProfileComponent from './components/UpdateProfileComponent/UpdateProfileComponent';
import CreatePostComponent from './components/CreatePostComponent/CreatePostComponent';
import SidebarComponent from './components/SidebarComponent/SidebarComponent';
import FollowingPage from './pages/FollowingPage/FollowingPage';

function App() {
    const user = useRecoilValue(userAtom);
    return (
        <Flex>
            <SidebarComponent />

            {/* Main Content */}
            <Flex flex="1" ml="80px" justifyContent="center">
                <Container maxW="640px">
                    <HeaderComponent />
                    <Routes>
                        <Route path="/" element={user ? <HomePage /> : <Navigate to="/login" />} />
                        <Route path="/following" element={user ? <FollowingPage /> : <Navigate to="/login" />} />
                        <Route path="/register" element={<SignUpPage />} />
                        <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/" />} />

                        <Route
                            path="/updateProfile"
                            element={user ? <UpdateProfileComponent /> : <Navigate to="/login" />}
                        />
                        {/* <Route path="/createPost" element={user ? <CreatePostComponent /> : <Navigate to="/login" />} /> */}

                        <Route path="/:username/post/:postId" element={<HomeDetailPostPage />} />
                        <Route
                            path="/:username"
                            element={
                                user ? (
                                    <>
                                        <ProfilePage />
                                        <CreatePostComponent />
                                    </>
                                ) : (
                                    <ProfilePage />
                                )
                            }
                        />

                        <Route path="/message" element={!user ? <LoginPage /> : <ProfilePage />} />
                        {/* <Route path="/:username" element={!user ? <LoginPage /> : <ProfilePage />} /> */}

                        <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                </Container>
            </Flex>
        </Flex>
    );
}

export default App;
