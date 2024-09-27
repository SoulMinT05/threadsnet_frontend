import { Input, Table } from 'antd';
import { useState } from 'react';

const UserPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [users, setUsers] = useState([]); // Dữ liệu người dùng
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    // Fetch dữ liệu người dùng từ API (tương tự như bạn đã làm ở các phần khác)
    // ...

    const filteredUsers = users.filter((user) => user.username.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div>
            <h1>Quản Lý Người Dùng</h1>
            <Input
                placeholder="Tìm kiếm người dùng"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ marginBottom: '16px' }}
            />
            <Table
                dataSource={filteredUsers}
                pagination={{
                    current: currentPage,
                    pageSize,
                    onChange: (page, pageSize) => {
                        setCurrentPage(page);
                        setPageSize(pageSize);
                    },
                }}
                // Thêm các cột cho bảng
            />
        </div>
    );
};

export default UserPage;
