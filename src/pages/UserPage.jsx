import UserHeader from '../components/UserHeader/UserHeader';
import UserPost from '../components/UserPost/UserPost';

const UserPage = () => {
    return (
        <div>
            <UserHeader />
            <UserPost likes={101} replies={200} postImg="/post1.png" postTitle="Let's talke about threads" />
            <UserPost likes={202} replies={301} postImg="/post2.png" postTitle="Nice tutorial" />
            <UserPost likes={303} replies={572} postImg="/post3.png" postTitle="Beautiful moment" />
            <UserPost likes={405} replies={921} postTitle="Talent girl in this performance" />
        </div>
    );
};

export default UserPage;
