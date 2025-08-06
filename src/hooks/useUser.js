import {useDispatch, useSelector} from "react-redux";
import {useCallback} from "react";
import {setUsers} from "../stores/user/userSlice.js";
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

    return {
        users,
        userSelected,
        getAllUsers
    }
}
