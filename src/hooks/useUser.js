import {useDispatch, useSelector} from "react-redux";
import {useCallback} from "react";
import {setUsers, initialUserForm, onUserAdded, onUserUpdated} from "../stores/user/userSlice.js";
import {getAllEmployees, saveEmployee, updateEmployee} from "../services/userSevice.js";
import {toast} from "react-toastify";
import {useNavigate} from "react-router-dom";

export const useUser = () => {

    const {users, userSelected} = useSelector(state => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

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

    const handleAddUser = useCallback(async (newUser) => {
        let result;

        try {
            if (newUser.id === 0) {
                result = await saveEmployee(newUser);
                dispatch(onUserAdded(result.data));
            }

            if (newUser.id > 0) {
                result = await updateEmployee(newUser);
                dispatch(onUserUpdated(result.data));
            }

            console.log(result)

            if (result.status === 201 || result.status === 200) toast.success('Usuario guardado exitosamente.');
            else toast.error('Error al guardar el usuario.');

        } catch (error) {
            console.error('Error fetching all users:', error);
        }
    }, [dispatch]);


    const handleToggleStatus = useCallback((userId, currentStatus) => {
        console.log("Cambiar estado del usuario:", userId, "Estado actual:", currentStatus);
    }, [dispatch]);

    const handleEditRow = (id) => {
        navigate(`/users/edit/${id}`);
    }

    return {
        initialUserForm,
        handleEditRow,
        users,
        userSelected,
        getAllUsers,
        handleAddUser,
        handleToggleStatus,
    }
}
