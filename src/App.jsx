import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import ProfilePage from './pages/ProfilePage/ProfilePage';
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
import SearchPage from './pages/SearchPage/SearchPage';
import LikedPage from './pages/LikedPage/LikedPage';
import MessagePage from './pages/MessagePage/MessagePage';
import NotificationPage from './pages/NotificationPage/NotificationPage';
import MorePage from './pages/MorePage/MorePage';
import BlockedListPage from './pages/BlockedListPage/BlockedListPage';
import SettingsPage from './pages/SettingsPage/SettingsPage';
import AdminPage from './pages/AdminPage/AdminPage';
import ChangePasswordComponent from './components/ChangePasswordComponent/ChangePasswordComponent';
import ForgotPasswordPage from './pages/ForgotPasswordPage/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage/ResetPasswordPage';

function App() {
    const user = useRecoilValue(userAtom);
    const location = useLocation();

    return (
        <Flex>
            {location.pathname !== '/admin' &&
                location.pathname !== '/login' &&
                location.pathname !== '/register' &&
                location.pathname !== '/forgotPassword' &&
                location.pathname !== '/resetPassword' && <SidebarComponent />}

            <Flex
                flex="1"
                ml={location.pathname !== '/admin' && '80px'}
                bg={location.pathname === '/admin' && 'white'}
                justifyContent="center"
            >
                <Container p={0} sx={{ margin: 0 }} maxW={location.pathname === '/admin' ? 'full' : '640px'}>
                    {location.pathname !== '/admin' && <HeaderComponent />}

                    <Routes>
                        <Route path="/admin" element={user && <AdminPage />} />
                        {/* <Routes> */}
                        <Route path="/" element={user ? <HomePage /> : <Navigate to="/login" />} />
                        <Route path="/following" element={user ? <FollowingPage /> : <Navigate to="/login" />} />
                        <Route path="/register" element={<SignUpPage />} />
                        <Route
                            path="/login"
                            element={!user || !user.userData.accessToken ? <LoginPage /> : <Navigate to="/" />}
                        />
                        <Route
                            path="/forgotPassword"
                            element={!user || !user.userData.accessToken ? <ForgotPasswordPage /> : <Navigate to="/" />}
                        />
                        <Route
                            path="/resetPassword/:token"
                            element={!user || !user.userData.accessToken ? <ResetPasswordPage /> : <Navigate to="/" />}
                        />

                        <Route
                            path="/updateProfile"
                            element={user ? <UpdateProfileComponent /> : <Navigate to="/login" />}
                        />
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
                        <Route path="/changePassword" element={user && <ChangePasswordComponent />} />
                        <Route path="/liked" element={user && <LikedPage />} />
                        <Route path="/search" element={user && <SearchPage />} />
                        <Route path="/message" element={user && <MessagePage />} />
                        <Route path="/notification" element={user && <NotificationPage />} />
                        <Route path="/more" element={user && <MorePage />} />
                        <Route path="/blockedList" element={user && <BlockedListPage />} />
                        <Route path="/settings" element={user && <SettingsPage />} />
                        <Route path="*" element={<NotFoundPage />} />
                        {/* </Routes> */}
                    </Routes>
                </Container>
            </Flex>
        </Flex>
    );
}

export default App;
