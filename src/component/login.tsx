import styles from '@/styles/login.module.css';
import SignIn from './signIn';
import { useAuthStore } from '@/store/authStore';
import SignUp from './signUp';
import axios from 'axios';
import { useEffect } from 'react';
import Cookies from 'js-cookie';
import { NAVER_CONFIG } from '@/config/naver'

export default function Login() {
    const { isLogin, isLoginPopup, isSignUpPopup, loginId, loginType, setIsLogin, setIsLoginPopup, setLoginId, setAccessToken, setLoginType } = useAuthStore();

    const handleLoginPopup = () => {
        setIsLoginPopup(!isLoginPopup);
    }

    const handleLogout = () => {
        setIsLogin(false);
        setLoginId("");
        setAccessToken("");
        setLoginType("");
    }

    const handleWithdrawal = async () => {
        try {
            if (loginType === "naver") {
                const accessToken = Cookies.get("accessToken") as string;
                const params = new URLSearchParams();
                params.append("grant_type", "delete");
                params.append("client_id", NAVER_CONFIG.CLIENT_ID);
                params.append("client_secret", NAVER_CONFIG.CLIENT_SECRET);
                params.append("access_token", accessToken);
                params.append("service_provider", "NAVER");

                await axios.post("/api/naver/oauth2.0/token", params);
            }
            const id = loginId;
            await axios.delete(`http://localhost:3001/user/${id}`);
            handleLogout();
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        // console.log(isLogin);
        if (isLogin) {
            setLoginId(Cookies.get("loginId") as string);
        }
    }, [])

    return (
        <>
            {isLogin ? <p>{loginId}님 환영합니다</p> : null}
            <button className={styles.loginPopupBtn} onClick={isLogin ? handleLogout : handleLoginPopup}>
                {isLogin ? '로그아웃' : '로그인'}
            </button>

            {isLogin ? <button className={styles.loginPopupBtn} onClick={handleWithdrawal}>회원탈퇴</button> : null}

            {isLoginPopup && <SignIn />}
            {isSignUpPopup && <SignUp />}
        </>
    )
}