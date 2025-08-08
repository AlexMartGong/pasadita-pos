import {useDispatch, useSelector} from "react-redux";
import {useCallback} from "react";
import {setUsers, initialUserForm, onUserAdded, onUserUpdated, onUserChangeStatus} from "../stores/slices/user/userSlice.js";
import {changeStatus, getAllEmployees, saveEmployee, updateEmployee} from "../services/userSevice.js";
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

            if (result.status === 201 || result.status === 200) toast.success('Usuario guardado exitosamente.');
            else toast.error('Error al guardar el usuario.');
        } catch (error) {
            console.error('Error fetching all users:', error);
        }
    }, [dispatch]);


    const handleToggleStatus = useCallback(async (userId, currentStatus) => {
        const newStatus = !currentStatus;
        const confirmMessage = `¿Está seguro de ${newStatus ? 'activar' : 'desactivar'} este usuario?`;

        if (!window.confirm(confirmMessage)) {
            return;
        }

        try {
            const result = await changeStatus(userId, {active: newStatus});
            dispatch(onUserChangeStatus({id: userId, active: newStatus}));
            if (result.status === 200) toast.success('Estado del usuario actualizado exitosamente.');
        } catch (error) {
            console.error('Error fetching all users:', error);
            toast.error('Error al cambiar el estado del usuario.');
        }
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
