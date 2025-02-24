export default function FormattedDate({ date }) {
    const now = new Date();
    const then = new Date(date);
    const diff = now - then;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(weeks / 4);
    const years = Math.floor(months / 12);
    const exactDate = then.toLocaleDateString();
    if (years > 5) {
        return <span className="m-0.5 text-gray-500"> · {exactDate}</span>
    }
    if (years > 0) {
        return <span className="m-0.5 text-gray-500"> · {years}y</span>
    }
    if (months > 0) {
        return <span className="m-0.5 text-gray-500"> · {months}m</span>
    }
    if (weeks > 0) {
        return <span className="m-0.5 text-gray-500"> · {weeks}w</span>
    }
    if (days > 0) {
        return <span className="m-0.5 text-gray-500"> · {days}d</span>
    }
    if (hours > 0) {
        return <span className="m-0.5 text-gray-500"> · {hours}h</span>
    }
    if (minutes > 0) {
        return <span className="m-0.5 text-gray-500"> · {minutes}m</span>
    }
    if (seconds > 0) {
        return <span className="m-0.5 text-gray-500"> · {seconds}s</span>
    }
    // return <span className="m-0.5"></span>
}