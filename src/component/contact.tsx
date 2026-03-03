import styles from '@/styles/contact.module.css'
import { useState } from 'react';

export default function Contact() {
    const [fileName, setFileName] = useState("");

    const fileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFileName(e.target.files?.[0]?.name || "");
    }

    const formSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        // e.preventDefault();
        const formData = new FormData(e.currentTarget);
        // console.log(Object.fromEntries(formData));
        const data = Object.fromEntries(formData);

        if (data.name === "") {
            alert("이름을 입력해주세요");
            e.preventDefault();
            return
        }

        if (data.email === "") {
            alert("이메일을 입력해주세요");
            e.preventDefault();
            return
        }

        if (data.title === "") {
            alert("제목을 입력해주세요");
            e.preventDefault();
            return
        }

        if (data.message === "") {
            alert("내용을 입력해주세요");
            e.preventDefault();
            return
        }
    }

    return (
        <>
            <h2 className="sr-only">Contact</h2>
            <div>
                <form action="https://formsubmit.co/jhyuk3230@gmail.com" method="post" encType="multipart/form-data" onSubmit={formSubmit} className={styles.contactForm}>
                    <input type="hidden" name="_captcha" value="false" />
                    <input type="hidden" name="_next" value="http://localhost:5173" />
                    <input type="text" name="name" placeholder="이름" />
                    <input type="email" name="email" placeholder="이메일" />
                    <input type="text" name="title" placeholder="제목" className={styles.title} />
                    <div className={styles.fileContainer}>
                        <input type="file" name="file" id="file" onChange={fileChange} className="sr-only" />
                        <label htmlFor="file" className={styles.file}>파일 첨부</label>
                        <p className={styles.fileName}>{fileName}</p>
                    </div>
                    <textarea name="message" placeholder="내용"></textarea>
                    <button type="submit">전송</button>
                </form>
            </div>
        </>
    )
}