import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface NotificationState {
    unreadCount: number;
}

const initialState: NotificationState = {
    unreadCount: 0,
};

const notificationSlice = createSlice({
    name: "notification",
    initialState,
    reducers: {
        setUnreadCount(state, action: PayloadAction<number>) {
            state.unreadCount = action.payload;
        },
        clearUnreadCount(state) {
            state.unreadCount = 0;
        },
        incrementUnread(state) {
            state.unreadCount += 1;
        },
    },
});

// ✅ экспорт нового действия
export const { setUnreadCount, clearUnreadCount, incrementUnread } = notificationSlice.actions;
export default notificationSlice.reducer;
