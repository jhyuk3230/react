import axios from "axios";
import * as Cheerio from "cheerio";
import { useState } from "react";
import styles from '@/styles/crawling.module.css';

interface Post {
    title: string;
    date: string;
    link: string;
}

export default function Crawling() {
    const [post, setPost] = useState<Post[]>([])
    const handleCrawling = async () => {
        try {
            const response = await axios.get('/api/board/lists/?id=alopecia');
            
            const $ = Cheerio.load(response.data);
            const crawlData: Post[] = [];

            $('.us-post').each((index, element) => {
                const title = $(element).find(".gall_tit a").text().trim();
                const date = $(element).find(".gall_date").text().trim();
                const link = $(element).find(".gall_tit a").attr("href") || "";

                if (title) {
                    crawlData.push({
                        title: title,
                        date: date,
                        link: `https://gall.dcinside.com/${link}`
                    })
                }
            });

            setPost(crawlData);

            console.log(crawlData);
        } catch (error) {
            console.error(error);
        }
    }
    
    return (
        <>
            <h2 className="sr-only">크롤링</h2>

            <button onClick={handleCrawling}>크롤링</button>
            <ul className={styles.postList}>
                {post.map((content, index) => (
                    <li key={index}>
                        <a href={content.link} className={styles.postLink}>
                            <span>{content.title}</span>
                            <span>{content.date}</span>
                        </a>
                    </li>
                ))}
            </ul>
        </>
    )
}