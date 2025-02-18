import { NavLink } from "react-router";

export default function Topic({ topic }) {
    return <li className="text-left mt-2">
        <NavLink to={`/articles?topic=${topic.slug}`}>
            <span className="font-bold text-xl m-2 text-green-kelp-800 hover:text-green-kelp-600 hover:underline">
                {topic.slug[0].toUpperCase() + topic.slug.slice(1)}
            </span>
        </NavLink>
        <p className="text-green-kelp-600 ml-2">{topic.description}</p>
        </li>

}