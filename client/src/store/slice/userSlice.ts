import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {IUser} from "../../types/types";
import {AppThunk} from "../store";

interface IUserState {
    user: IUser;
}

const initialState: IUserState = {
    user: {
        id: 0,
        chatId: 0,
        role: 'admin',
        username: '',
        name: '',
        email: '',
        gender: '',
        date: '',
        phone: '',
    },
};

export const user = createSlice({
    name: "user",
    initialState,
    reducers: {
        fetchUser: (state: IUserState, action: PayloadAction<Partial<IUser>>) => {
            state.user = action.payload;
        },
    },
});

// ✅ наш кастомный thunk-экшен
export const updateLocalUser = (updated: Partial<IUser>): AppThunk => (dispatch, getState) => {
    const current = getState().userReducer.user;

    const merged = {
        ...current,
        ...updated,
    };

    dispatch(fetchUser(merged));
    localStorage.setItem("user", JSON.stringify(merged));
};

export const {fetchUser} = user.actions;
export default user.reducer;
