import styles from '@/styles/login.module.css'
import SignIn from './signIn';
import { useAuthStore } from '@/store/authStore';

export default function Login() {
    const { isLogin, isLoginPopup, setIsLogin, setIsLoginPopup } = useAuthStore();

    const handleLoginPopup = () => {
        setIsLoginPopup(!isLoginPopup);
    }

    const handleLogout = () => {
        setIsLogin(false)
    }

    return (
        <>
            <button className={styles.loginPopupBtn} onClick={isLogin ? handleLogout : handleLoginPopup}>
                {isLogin ? '로그아웃' : '로그인'}
            </button>

            {isLoginPopup && <SignIn />}
        </>
    )
}