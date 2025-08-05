import {useUser} from "../../hooks/useUser.js";

export const ProductTable = () => {

    const {users} = useUser();

    return (
        <>
            <table>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Full Name</th>
                    <th>Username</th>
                    <th>Position</th>
                </tr>
                </thead>
                <tbody>
                {users.map(user => (
                    <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>{user.fullName}</td>
                        <td>{user.username}</td>
                        <td>{user.position}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </>
    )
}