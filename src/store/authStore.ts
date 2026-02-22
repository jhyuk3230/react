import { create } from 'zustand'
import Cookies from 'js-cookie'

interface AuthState {
    isLogin: boolean;
    isLoginPopup: boolean;
    isSignUpPopup: boolean;
    setIsLogin: (value: boolean) => void;
    setIsLoginPopup: (value: boolean) => void;
    setIsSignUpPopup: (value: boolean) => void;
    loginId: string;
    setLoginId: (value: string) => void;
    accessToken: string;
    setAccessToken: (value: string) => void;
    loginType: string;
    setLoginType: (value: string) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    isLogin: !!Cookies.get("isLogin"),
    isLoginPopup: false,
    isSignUpPopup: false,
    loginId: "",
    accessToken: "",
    loginType: "",

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
    setLoginId: (value: string) => {
        if (value === "") {
            Cookies.remove("loginId");
        } else {
            Cookies.set("loginId", value);
        }
        set({ loginId: value });
    },
    setAccessToken: (value: string) => {
        if (value === "") {
            Cookies.remove("accessToken");
        } else {
            Cookies.set("accessToken", value);
        }
        set({ accessToken: value });
    },
    setLoginType: (value: string) => {
        if (value === "") {
            Cookies.remove("loginType");
        } else {
            Cookies.set("loginType", value);
        }
        set({ loginType: value });
    }
}))