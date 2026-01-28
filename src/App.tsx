import styles from '@/styles/App.module.css'
import Login from '@/component/login.tsx'
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    if (window.opener) {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get("code");

      if (code) {
        window.opener.postMessage({ type: 'NAVER_LOGIN', code }, window.location.origin);
      }
    }
  }, [])
  return (
    <>
      <main className={styles.main}>
        <section className={styles.topLineSection}>
          <Login />
        </section>

        <section></section>
      </main>
    </>
  )
}

export default App

