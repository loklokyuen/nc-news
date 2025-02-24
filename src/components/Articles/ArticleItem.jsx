import { NavLink } from "react-router";
import Voting from "../Common/Voting";
import { useEffect, useRef, useState } from "react";
import FormattedDate from "../Comments/FormattedDate";

export default function ArticleItem({ article }){
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
        <section className="flex flex-row items-center">
            <p className="secondary-interactive ml-2">
                <NavLink to={`/users/${article.author}`}>
                    <span className="secondary-interactive">{article.author}</span>
                </NavLink>
                <FormattedDate date={article.created_at} />
            </p>
        </section>
        <div className="relative">
            <NavLink to={"/articles/" + article.article_id}>
                <img src={article.article_img_url} alt="article image" className="rounded-lg article-item-img px-1 py-1 max-h-40 object-cover"/>
            </NavLink>
            <NavLink to={`/articles?topic=${article.topic}`} className="absolute bottom-1.5 right-2.5 p-0 bg-primary/70 rounded-sm">
                <p className="m-1 p-0.5 text-white italic hover:text-secondary-light">#{article.topic[0].toUpperCase() + article.topic.slice(1)}</p>
            </NavLink>
        </div>
        <NavLink to={"/articles/" + article.article_id}>
            <h2 className="primary-interactive p-1 pt-0">{article.title}</h2>
        </NavLink>
        <section className="flex flex-row items-center text-center justify-center bg-bg/50 rounded-md">
            <Voting votes={article.votes} itemType="article" id={article.article_id}></Voting>
            <span className="ml-1 font-semibold font-stretch-90%">
                <NavLink to={`/articles/${article.article_id}#comments`}>
                    <i className="fa-regular fa-comments fa-xl text-cyan-800 action-icon"></i> 
                    <span className="text-cyan-800 font-bold font-stretch-90% "> {article.comment_count}</span>
                </NavLink>
            </span>
        </section>
        
    </li>
}