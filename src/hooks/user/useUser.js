import {useDispatch, useSelector} from "react-redux";
import {useCallback} from "react";
import {
    setUsers,
    initialUserForm,
    onUserAdded,
    onUserUpdated,
    onUserChangeStatus
} from "../../stores/slices/user/userSlice.js";
import {changePassword, changeStatus, getAllEmployees, saveEmployee, updateEmployee} from "../../services/userService.js";
import {toast} from "react-toastify";
import {useNavigate} from "react-router-dom";
import {useApiErrorHandler} from "../useApiErrorHandler.js";

export const useUser = () => {
    const {users, userSelected} = useSelector(state => state.user);
    const {handleApiError} = useApiErrorHandler();
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
            handleApiError(error);
        }
    }, [dispatch, handleApiError]);

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
            handleApiError(error);
        }
    }, [dispatch, handleApiError]);


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
            handleApiError(error);
        }
    }, [dispatch, handleApiError]);

    const handleChangePassword = useCallback(async (userId, newPassword) => {
        try {
            const result = await changePassword(userId, {password: newPassword});
            if (result.status === 200) {
                toast.success('Contraseña actualizada exitosamente.');
            } else {
                toast.error('Error al actualizar la contraseña.');
            }
        } catch (error) {
            console.log(error);
            handleApiError(error);
        }
    }, [handleApiError]);

    const handleEditPassword = useCallback((userId) => {
        navigate(`/users/edit-password/${userId}`);
    }, [navigate]);

    const handleEditRow = useCallback((id) => {
        navigate(`/users/edit/${id}`);
    }, [navigate]);

    return {
        initialUserForm,
        handleEditRow,
        users,
        userSelected,
        getAllUsers,
        handleAddUser,
        handleToggleStatus,
        handleEditPassword,
        handleChangePassword,
    }
}
