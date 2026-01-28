import styles from '@/styles/login.module.css'
import Cookies from 'js-cookie'
import { useState } from 'react'
import { useNaverLogin } from '@/hooks/naverLogin'
import { useAuthStore } from '@/store/authStore';

export default function SignIn() {
    const { isLogin, isLoginPopup, setIsLogin, setIsLoginPopup } = useAuthStore();
    const [idError, setIdError] = useState(false);
    const [pwError, setPwError] = useState(false);

    const handleLoginPopupDim = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            setIsLoginPopup(false);
            setIdError(false);
            setPwError(false);
        }
    }

    const handleLogin = () => {
        setIsLogin(true);
        setIsLoginPopup(false);
    }

    const handleLoginForm = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(e.target as HTMLFormElement);

        setIdError(false);
        setPwError(false);

        if (formData.get("id") === "") {
            setIdError(true);
        } else {
            if (formData.get("pw") === "") {
                setPwError(true);
            } else {
                handleLogin();
                form.reset();
                setIdError(false);
                setPwError(false);
            }
        }
    }

    const { naverLogin } = useNaverLogin(() => {
        setIsLogin(true);
        setIsLoginPopup(false);
    });

    return (
        <>
            <div className={`${styles.loginPopupDim} ${isLoginPopup === true ? styles.open : ''}`} onClick={handleLoginPopupDim}>
                <div className={`${styles.loginPopup} ${isLoginPopup === true ? styles.open : ''}`}>
                    <h2>로그인</h2>
                    <div>
                        <form action="" onSubmit={handleLoginForm}>
                            <input type="text" placeholder="아이디" name="id" />
                            <input type="password" placeholder="비밀번호" name="pw" />
                            <button className={styles.loginBtn} type="submit">로그인</button>
                        </form>
                        <p className={styles.loginError}>{idError ? '아이디를 입력해주세요' : pwError ? '비밀번호를 입력해주세요' : ''}</p>
                        <ul className={styles.loginPopupLink}>
                            <li>
                                <a href="#">아이디 찾기</a>
                            </li>
                            <li>
                                <a href="#">비밀번호 찾기</a>
                            </li>
                            <li>
                                <a href="#">회원가입</a>
                            </li>
                        </ul>
                        <ul className={styles.snsLoginList}>
                            <li>
                                <button className={styles.snsLoginBtn} onClick={naverLogin}>네이버</button>
                            </li>
                            <li>
                                <button className={styles.snsLoginBtn} onClick={naverLogin}>네이버</button>
                            </li>
                            <li>
                                <button className={styles.snsLoginBtn} onClick={naverLogin}>네이버</button>
                            </li>
                            <li>
                                <button className={styles.snsLoginBtn} onClick={naverLogin}>네이버</button>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </>
    )
}