import styles from '@/styles/login.module.css'
import { useState } from 'react'
import { useSnsLogin } from '@/hooks/snsLogin'
import { useAuthStore } from '@/store/authStore'
import axios from 'axios';
import { KAKAO_CONFIG, NAVER_CONFIG } from '@/config/sns';

export default function SignIn() {
    const { isLoginPopup, setIsLogin, setIsLoginPopup, setIsSignUpPopup, setLoginId, setAccessToken, setLoginType } = useAuthStore();
    const [idError, setIdError] = useState(false);
    const [pwError, setPwError] = useState(false);
    const [loginError, setLoginError] = useState(false);

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

    const handleLoginForm = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(e.target as HTMLFormElement);

        const id = formData.get("id") as string;
        const pw = formData.get("pw");

        setIdError(false);
        setPwError(false);

        if (formData.get("id") === "") {
            setIdError(true);
            return;
        }

        if (formData.get("pw") === "") {
            setPwError(true);
            return;
        }

        try {
            const response = await axios.get(`http://localhost:3001/user?id=${id}&pw=${pw}`);
            if (response.data.length === 0) {
                setLoginError(true);
                return;
            }

            setLoginId(id);
            setLoginType("local");
            handleLogin();
            form.reset();
            setIdError(false);
            setPwError(false);
        } catch (error) {
            console.error(error);
        }
    }

    // 콜백
    const { snsLogin } = useSnsLogin(async (code: string, provider: string) => {
        try{
            if (provider === "naver") {
                // console.log(code);
                const state = Math.random().toString(36).substr(2, 11);
                const params = new URLSearchParams();
                params.append("grant_type", "authorization_code");
                params.append("client_id", NAVER_CONFIG.CLIENT_ID);
                params.append("client_secret", NAVER_CONFIG.CLIENT_SECRET);
                params.append("code", code);
                params.append("state", state);
                const tokenResponse = await axios.post("/api/naver/oauth2.0/token", params);

                // console.log(tokenResponse);

                const accessToken = tokenResponse.data.access_token;
                // console.log(accessToken);

                const userResponse = await axios.get("/api/openapi/v1/nid/me", {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                })
                // console.log(userResponse.data.response);

                const userData = userResponse.data.response;

                try {
                    const response = await axios.get(`http://localhost:3001/user?id=${userData.id}`);

                    if (response.data.length === 0) {
                        await axios.post("http://localhost:3001/user", {
                            id: userData.id,
                            email: userData.email,
                            pw: `${userData.id}${Math.random().toString(36).substr(2, 11)}`,
                            name: userData.name,
                            contact: userData.mobile.replaceAll("-", ""),
                        })
                    }

                    setLoginId(userData.id);
                    // Cookies.set("loginId", userData.id);
                    setIsLogin(true);
                    setIsLoginPopup(false);
                    setAccessToken(accessToken);
                    setLoginType("naver");
                } catch (error) {
                    console.error(error);
                }
            }

            if (provider === "kakao") {
                const params = new URLSearchParams();
                params.append("grant_type", "authorization_code");
                params.append("client_id", KAKAO_CONFIG.REST_API_KEY);
                params.append("redirect_uri", KAKAO_CONFIG.REDIRECT_URI);
                params.append("client_secret", KAKAO_CONFIG.CLIENT_SECRET);
                params.append("code", code);

                // console.log(params.toStrizng());
                const tokenResponse = await axios.post("api/kakao/oauth/token", params);
                
                const accessToken = tokenResponse.data.access_token;
                // console.log(accessToken);

                const userResponse = await axios.get("/api/kapi/v2/user/me", {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
                    }
                })
                // console.log(userResponse.data.kakao_account);

                const userData = userResponse.data;

                try {
                    // console.log(userData.id);
                    const id = userData.id.toString();
                    const response = await axios.get(`http://localhost:3001/user/${id}`);

                    if (response.status !== 404) {
                        setLoginId(id);
                        setIsLogin(true);
                        setIsLoginPopup(false);
                        setAccessToken(accessToken);
                        setLoginType("kakao");
                    }

                    // if (response.data.id !== id) {
                    //     await axios.post("http://localhost:3001/user", {
                    //         id: id,
                    //         email: userData.kakao_account.email,
                    //         pw: `${userData.id}${Math.random().toString(36).substr(2, 11)}`,
                    //         name: userData.kakao_account.profile.nickname,
                    //         contact: "01000000000",
                    //     })
                    // }

                    // setLoginId(id);
                    // setIsLogin(true);
                    // setIsLoginPopup(false);
                    // setAccessToken(accessToken);
                    // setLoginType("kakao");
                } catch (e: any) {
                    if (e.response.status === 404) {
                        const id = userData.id.toString();

                        await axios.post("http://localhost:3001/user", {
                            id: id,
                            email: userData.kakao_account.email,
                            pw: `${userData.id}${Math.random().toString(36).substr(2, 11)}`,
                            name: userData.kakao_account.profile.nickname,
                            contact: "01000000000",
                        });

                        setLoginId(userData.id);
                        setIsLogin(true);
                        setIsLoginPopup(false);
                        setAccessToken(accessToken);
                        setLoginType("kakao");
                    }
                }
            }
        } catch (error) {
            // console.error(error);
        }
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
                            {loginError ? <p className={styles.loginError}>아이디 또는 비밀번호가 일치하지 않습니다</p> : null}
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
                                <button className={styles.snsLoginBtn} onClick={() => snsLogin("naver")}>네이버</button>
                            </li>
                            <li>
                                <button className={styles.snsLoginBtn} onClick={() => snsLogin("kakao")}>카카오</button>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </>
    )
}