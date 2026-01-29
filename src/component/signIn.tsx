import styles from '@/styles/login.module.css'
import { useState } from 'react'
import { useNaverLogin } from '@/hooks/naverLogin'
import { useAuthStore } from '@/store/authStore';

export default function SignIn() {
    const { isLoginPopup, setIsLogin, setIsLoginPopup, setIsSignUpPopup } = useAuthStore();
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

    const handleSignUp = () => {
        setIsSignUpPopup(true);
        setIsLoginPopup(false);
    }

    return (
        <>
            <div className={`${styles.loginPopupDim} ${isLoginPopup === true ? styles.open : ''}`} onClick={handleLoginPopupDim}>
                <div className={`${styles.loginPopup} ${isLoginPopup === true ? styles.open : ''}`}>
                    <h2>로그인</h2>
                    <div>
                        <form action="" onSubmit={handleLoginForm}>
                            <input type="text" placeholder="아이디" name="id" />
                            <input type="password" placeholder="비밀번호" name="pw" />
                            {idError || pwError ? <p className={styles.loginError}>{idError ? '아이디를 입력해주세요' : pwError ? '비밀번호를 입력해주세요' : ''}</p> : null}
                            <button className={styles.loginBtn} type="submit">로그인</button>
                        </form>
                        <ul className={styles.loginPopupLink}>
                            <li>
                                <a href="#">아이디 찾기</a>
                            </li>
                            <li>
                                <a href="#">비밀번호 찾기</a>
                            </li>
                            <li>
                                <button className={styles.signupBtn} onClick={handleSignUp}>회원가입</button>
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