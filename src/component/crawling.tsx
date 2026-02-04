import axios from "axios";
import * as Cheerio from "cheerio";
import { useEffect, useState } from "react";
import styles from '@/styles/crawling.module.css';

interface Post {
    title: string;
    date: string;
    link: string;
}

interface PostPopup {
    title: string;
    writer: string;
    date: string;
    data: string;
}

export default function Crawling() {
    const [post, setPost] = useState<Post[]>([])
    const [postPopup, setPostPopup] = useState<PostPopup[]>([]);
    const [postPopupOpen, setPostPopupOpen] = useState(false);
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
                        link: `https://gall.dcinside.com/${link}`,
                    })
                }
            });

            setPost(crawlData);
        } catch (error) {
            console.error(error);
        }
    }

    const crawlingPopup = async (url: string) => {
        const replaceUrl = url.replace("https://gall.dcinside.com/", "");
        try {
            const response = await axios.get(`/api${replaceUrl}`);
            const $ = Cheerio.load(response.data);
            const postPopupData: PostPopup[] = [];

            $('img').each((index, element) => {
                $(element).removeAttr('onerror');

                const src = $(element).attr('src') || "";
                if (src) {
                    $(element).attr('src', `https://wsrv.nl/?url=${src}`);
                }
            });

            $('.view_content_wrap').each((index, element) => {
                const title = $(element).find('.title_subject').text().trim();
                const writer = $(element).find('.nickname').text().trim();
                const date = $(element).find('.gallview_head .gall_date').text().trim();
                const data = $(element).find('.gallview_contents .write_div').html() || "";

                if (title) {
                    postPopupData.push({
                        title: title,
                        writer: writer,
                        date: date,
                        data: data,
                    })
                }
            })

            setPostPopup(postPopupData);
            setPostPopupOpen(true);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        // console.log(postPopup);
    }, [postPopup]);
    
    return (
        <>
            <h2 className="sr-only">크롤링</h2>

            <button onClick={handleCrawling}>크롤링</button>
            <ul className={styles.postList}>
                {post.map((content, index) => (
                    <li key={index}>
                        <button className={styles.postLink} onClick={() => crawlingPopup(content.link)}>
                            <span>{content.title}</span>
                            <span>{content.date}</span>
                        </button>
                    </li>
                ))}
            </ul>
            
            { postPopupOpen ? (
                <div className={styles.postPopup}>
                    <button className={styles.postPopupCloseBtn} onClick={() => setPostPopupOpen(false)}>닫기</button>
                    <div className={styles.postPopupContent}>
                        <h3>{postPopup[0].title}</h3>
                        <div className={styles.postPopupInfo}>
                            <p>{postPopup[0].writer}</p>
                            <p>{postPopup[0].date}</p>
                        </div>
                        <div dangerouslySetInnerHTML={{ __html: postPopup[0].data }}></div>
                    </div>
                </div>
            ) : null }
        </>
    )
}