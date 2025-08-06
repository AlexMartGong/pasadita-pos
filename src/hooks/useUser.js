import {useDispatch, useSelector} from "react-redux";
import {useCallback} from "react";
import {setUsers, initialUserForm} from "../stores/user/userSlice.js";
import {getAllEmployees} from "../services/userSevice.js";
import {toast} from "react-toastify";

export const useUser = () => {

    const {users, userSelected} = useSelector(state => state.user);
    const dispatch = useDispatch();

    const getAllUsers = useCallback(async () => {
        try {
            const result = await getAllEmployees();
            if (result.status === 200) {
                dispatch(setUsers(result.data));
            } else {
                toast.error('Error al encontrar usuarios.');
            }
        } catch (error) {
            console.error('Error fetching all users:', error);
            throw error;
        }
    }, [dispatch]);

    const handleAddUser = useCallback(() => {
        console.log("Agregar nuevo usuario");
    }, [dispatch]);

    const handleEdit = useCallback((userId) => {
        console.log("Editar usuario:", userId);
    }, [dispatch]);

    const handleToggleStatus = useCallback((userId, currentStatus) => {
        console.log("Cambiar estado del usuario:", userId, "Estado actual:", currentStatus);
    }, [dispatch]);

    return {
        initialUserForm,
        users,
        userSelected,
        getAllUsers,
        handleAddUser,
        handleEdit,
        handleToggleStatus,
    }
}
