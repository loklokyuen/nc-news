import { NavLink } from "react-router";
import Voting from "../Common/Voting";
import { useEffect, useRef, useState } from "react";

export default function ArticleItem({ article }){
    const formattedDate = new Date(article.created_at).toLocaleString();
    const [loaded, setLoaded] = useState(false);
    const articleRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setLoaded(true);
                        observer.unobserve(entry.target);
                    } else {
                        setLoaded(false);
                    }
                });
            }, { threshold: 0.1 }
        );
        if (articleRef.current) {
            observer.observe(articleRef.current);
        }
        return () => {
            if (articleRef.current) {
                observer.unobserve(articleRef.current);
            }
        };
    }, []);
    return <li ref={articleRef}  className={`article-item ${loaded ? 'loaded' : ''}`}>
        <NavLink to={"/articles/" + article.article_id}>
            <img src={article.article_img_url} alt="article image" className="w-xl article-item-img p-2 max-h-40 object-cover"/>
            <h2 className="primary-interactive p-1 pt-0">{article.title}</h2>
        </NavLink>
        <NavLink to={`/users/${article.author}`}>
            <p className="secondary-interactive">{article.author}</p>
        </NavLink>
        <NavLink to={`/articles?topic=${article.topic}`}>
            <p className="m-0.5 tertiary-interactive">Topic: {article.topic[0].toUpperCase() + article.topic.slice(1)}</p>
        </NavLink>
        <p className="m-0.5">Posted on {formattedDate}</p>
        <Voting votes={article.votes} itemType="article" id={article.article_id}></Voting>
        <p className="m-0.5">Comment ({article.comment_count})</p>
    </li>
}