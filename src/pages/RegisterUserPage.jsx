import {useUser} from "../hooks/useUser.js";
import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {UserForm} from "../components/user/UserForm.jsx";

export const RegisterUserPage = () => {

    const {initialUserForm, users = []} = useUser();
    const [userSelected, setUserSelected] = useState(initialUserForm);
    const {id} = useParams();

    useEffect(() => {
        if (id) {
            const userId = parseInt(id);
            const user = users.find(user => user.id === userId);
            if (user) {
                setUserSelected(user);
            }
        }
    }, [id, users]);

    return (
        <>
            <div className="container my-4">
                <h2 className="text-center mb-4">
                    {id ? 'Editar Usuario' : 'Nuevo Usuario'}
                </h2>
                <div className="row justify-content-center">
                    <UserForm userSelected={userSelected}/>
                </div>
            </div>
        </>
    )
}