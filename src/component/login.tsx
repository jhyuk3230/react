import styles from '@/styles/login.module.css';
import SignIn from './signIn';
import { useAuthStore } from '@/store/authStore';
import SignUp from './signUp';
import axios from 'axios';
import { useEffect } from 'react';
import Cookies from 'js-cookie';

export default function Login() {
    const { isLogin, isLoginPopup, isSignUpPopup, loginId, setIsLogin, setIsLoginPopup, setLoginId } = useAuthStore();

    const handleLoginPopup = () => {
        setIsLoginPopup(!isLoginPopup);
    }

    const handleLogout = () => {
        setIsLogin(false)
    }

    const handleWithdrawal = async () => {
        try {
            const id = loginId;
            await axios.delete(`http://localhost:3001/user/${id}`)
            setLoginId("");
            setIsLogin(false);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        console.log(isLogin);
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