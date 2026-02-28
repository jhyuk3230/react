import styles from '@/styles/App.module.css'
import Login from '@/component/login.tsx'
import { useEffect } from 'react';
import Crawling from '@/component/crawling';
import Calendar from '@/component/calendar';
import Contact from '@/component/contact';

function App() {
  useEffect(() => {
    if (window.opener) {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get("code");

      if (code) {
        window.opener.postMessage({ type: 'SNS_LOGIN', code, provider: localStorage.getItem("login_provider") }, window.location.origin);
      }
    }
  }, [])
  return (
    <>
      <main className={styles.main}>
        <section className={styles.topLineSection}>
          <Login />
        </section>

        <section>
          <Calendar />
        </section>

        <section>
          <Crawling />
        </section>

        <section>
          <Contact />
        </section>
      </main>
    </>
  )
}

export default App

