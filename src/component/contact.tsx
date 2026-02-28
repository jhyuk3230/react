import styles from '@/styles/contact.module.css'
import emailjs from '@emailjs/browser'

export default function Contact() {
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const form = e.currentTarget;

        emailjs.sendForm("service_jjfq0ob", "template_r19n9ui", "#contactForm", {
            publicKey: "RqN7W_B3zA2opHTRR"
        })
        .then(() => {
            form.reset();
        });

        alert("전송되었습니다");
    }

    return (
        <>
            <h2 className="sr-only">Contact</h2>
            <div>
                <form action="" onSubmit={handleSubmit} id="contactForm" className={styles.contactForm}>
                    <input type="text" name="name" placeholder="이름" />
                    <input type="email" name="email" placeholder="이메일" />
                    <input type="text" name="title" placeholder="제목" className={styles.title} />
                    <textarea name="message" id="" placeholder="내용"></textarea>
                    <button type="submit">전송</button>
                </form>
            </div>
        </>
    )
}