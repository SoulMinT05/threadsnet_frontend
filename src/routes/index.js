import HomePage from '../pages/HomePage/HomePage';
import LoginPage from '../pages/LoginPage/LoginPage';
import SignUpPage from '../pages/SignUpPage/SignUpPage';
import AdminPage from '../pages/AdminPage/AdminPage';
import NotFoundPage from '../pages/NotFoundPage/NotFoundPage';

export const routes = [
    {
        path: '/',
        page: HomePage,
        isShowHeader: true,
        isShowFooter: true,
    },
    {
        path: '/login',
        page: LoginPage,
        isShowHeader: false,
        isShowFooter: true,
    },
    {
        path: '/register',
        page: SignUpPage,
        isShowHeader: false,
        isShowFooter: true,
    },
    // {
    //     path: '/profile-user',
    //     page: ProfilePage,
    //     isShowHeader: true,
    //     isShowFooter: true,
    // },
    {
        path: '/admin',
        page: AdminPage,
        isShowHeader: false,
        isShowFooter: true,
        isPrivate: true,
    },
    {
        path: '*',
        page: NotFoundPage,
    },
];
