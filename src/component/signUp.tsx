import styles from '@/styles/login.module.css';
import { useAuthStore } from '@/store/authStore';
import { useState } from 'react';
import axios from 'axios';

export default function SignUp() {
    const { isSignUpPopup, setIsSignUpPopup, setIsLoginPopup } = useAuthStore();

    const handleSignUpPopupDim = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            setIsSignUpPopup(false);
        }
    }

    const [formData, setFormData] = useState({
        id: '',
        email: '',
        pw: '',
        pwre: '',
        name: '',
        contact: '',
    });

    const [formError, setFormError] = useState({
        id: false,
        email: false,
        pw: false,
        pwre: false,
        name: false,
        contact: false,
    });

    const handleSignUpForm = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!formError.id || !formError.email || !formError.pw || !formError.pwre || !formError.name || !formError.contact) {
            try {
                await axios.post('http://localhost:3001/user', {
                    id: formData.id,
                    email: formData.email,
                    pw: formData.pw,
                    name: formData.name,
                    contact: formData.contact,
                });
            } catch (error) {
                console.error(error);
            }

            setFormData({
                id: "",
                email: "",
                pw: "",
                pwre: "",
                name: "",
                contact: "",
            });
            setIsSignUpPopup(false);
            setIsLoginPopup(true);
            return;
        }
    }

    const formErrorRules = {
        id: (value: string) => value === "",
        email: (value: string) => !value.includes('@'),
        pw: (value: string) => {
            const pwRule = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,25}$/;
            if (!pwRule.test(value)) {
                return true;
            }
        },
        pwre: (value: string) => value !== formData.pw,
        name: (value: string) => value === "",
        contact: (value: string) => value.length !== 11,
    };

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        })

        if (formErrorRules[name as keyof typeof formErrorRules]) {
            const isError = formErrorRules[name as keyof typeof formErrorRules](value);

            setFormError({
                ...formError,
                [name]: isError,
            })
        }
    }

    return (
        <>
            <div className={`${styles.loginPopupDim} ${isSignUpPopup === true ? styles.open : ''}`} onClick={handleSignUpPopupDim}>
                <div className={`${styles.loginPopup} ${isSignUpPopup === true ? styles.open : ''}`}>
                    <h2>회원가입</h2>
                    <div>
                        <form action="" onSubmit={handleSignUpForm}>
                            <input type="text" placeholder="아이디" name="id" value={formData.id} onChange={handleFormChange} />
                            <input type="email" placeholder="이메일" name="email" value={formData.email} onChange={handleFormChange} />
                            <input type="password" placeholder="비밀번호" name="pw" value={formData.pw} onChange={handleFormChange} />
                            <input type="password" placeholder="비밀번호 재입력" name="pwre" value={formData.pwre} onChange={handleFormChange} />
                            <input type="text" placeholder="이름" name="name" value={formData.name} onChange={handleFormChange} />
                            <input type="number" placeholder="연락처" name="contact" value={formData.contact} onChange={handleFormChange} />
                            {formError.id || formError.email || formError.pw || formError.pwre || formError.name || formError.contact ? <p className={styles.loginError}>{formError.id ? '아이디를 입력해주세요' : formError.email ? '이메일형식이 아닙니다' : formError.pw ? '비밀번호 형식에 맞지 않습니다 (8자리 이상, 영문, 숫자, 특수문자 조합)' : formError.pwre ? '비밀번호와 일치하지 않습니다' : formError.name ? '이름을 입력해주세요' : formError.contact ? '연락처를 입력해주세요' : ''}</p> : null}
                            <button className={styles.loginBtn} type="submit">회원가입</button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}