import { NAVER_CONFIG, KAKAO_CONFIG } from '@/config/sns';
import { useEffect, useRef } from 'react';

export const useSnsLogin = (onLoginSuccess: (code: string, provider: string) => void) => {
    const popup = useRef<Window | null>(null);

    const login = (provider: "naver" | "kakao") => {
        localStorage.setItem("login_provider", provider);
        if (provider === "naver") {
            const state = Math.random().toString(36).substr(2, 11);
            const url = `${NAVER_CONFIG.AUTH_URL}?response_type=code&client_id=${NAVER_CONFIG.CLIENT_ID}&redirect_uri=${encodeURI(NAVER_CONFIG.CALLBACK_URL)}&state=${state}`;
            // const url = `${NAVER_CONFIG.AUTH_URL}?response_type=code&client_id=${NAVER_CONFIG.CLIENT_ID}&client_secret=${NAVER_CONFIG.CLIENT_SECRET}&redirect_uri=${encodeURI(NAVER_CONFIG.CALLBACK_URL)}&state=${state}`;
            popup.current = window.open(url, "naverLogin", "width=500, height=600");
        }

        if (provider === "kakao") {
            const url = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${KAKAO_CONFIG.REST_API_KEY}&redirect_uri=${KAKAO_CONFIG.REDIRECT_URI}`
            // alert("kakao login try");
            popup.current = window.open(url, "kakaoLogin", "width=500, height=600");
        }
        
    }
    
    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.origin !== window.location.origin) return;
            if (event.data.type === "SNS_LOGIN" && event.data.code && event.data.provider) {
                onLoginSuccess(event.data.code, event.data.provider);
                popup.current?.close();
            }

        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, [])

    return { snsLogin: login };
}