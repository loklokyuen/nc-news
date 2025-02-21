export default function Footer() {
    return (
        <footer className="bg-bg text-tertiary text-center mt-2 p-2 border-t-1 border-primary-light">
            <p className="font-light">&copy; 2025 Melody Yuen</p>
                <a href="https://github.com/loklokyuen" target="_blank" rel="noopener noreferrer">
                    <i className="fab fa-github fa-xl text-primary-light m-0.5 hover:text-primary"></i>
                </a>
                <a href="https://www.linkedin.com/in/melody-yuen-ll/" target="_blank" rel="noopener noreferrer">
                    <i className="fab fa-linkedin fa-xl text-primary-light m-0.5 hover:text-primary"></i>
                </a>
        </footer>
    );
}