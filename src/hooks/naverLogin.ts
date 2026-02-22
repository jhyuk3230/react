import { NAVER_CONFIG } from '@/config/naver';
import { useEffect, useRef } from 'react';

export const useNaverLogin = (onLoginSuccess: (code: string) => void) => {
    const popup = useRef<Window | null>(null);

    const login = () => {
        const state = Math.random().toString(36).substr(2,11);
        const url = `${NAVER_CONFIG.AUTH_URL}?response_type=code&client_id=${NAVER_CONFIG.CLIENT_ID}&redirect_uri=${encodeURI(NAVER_CONFIG.CALLBACK_URL)}&state=${state}`;
        // const url = `${NAVER_CONFIG.AUTH_URL}?response_type=code&client_id=${NAVER_CONFIG.CLIENT_ID}&client_secret=${NAVER_CONFIG.CLIENT_SECRET}&redirect_uri=${encodeURI(NAVER_CONFIG.CALLBACK_URL)}&state=${state}`;
        popup.current = window.open(url, "naverLogin", "width=500, height=600");
    }
    
    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.origin !== window.location.origin) return;
            if (event.data.type === "NAVER_LOGIN" && event.data.code) {
                onLoginSuccess(event.data.code);
                popup.current?.close();
            }

        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, [])

    return { naverLogin: login };
}