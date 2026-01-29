import { create } from 'zustand'
import Cookies from 'js-cookie'

interface AuthState {
    isLogin: boolean;
    isLoginPopup: boolean;
    isSignUpPopup: boolean;
    setIsLogin: (value: boolean) => void;
    setIsLoginPopup: (value: boolean) => void;
    setIsSignUpPopup: (value: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    isLogin: !!Cookies.get("isLogin"),
    isLoginPopup: false,
    isSignUpPopup: false,

    setIsLogin: (value: boolean) => {
        if (value) {
            Cookies.set("isLogin", "true");
        } else {
            Cookies.remove("isLogin");
        }
        set({ isLogin: value });
    },

    setIsLoginPopup: (value: boolean) => set({isLoginPopup: value}),
    setIsSignUpPopup: (value: boolean) => set({isSignUpPopup: value}),
}))