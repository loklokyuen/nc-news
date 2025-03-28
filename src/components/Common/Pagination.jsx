import { useEffect } from "react";

export default function Pagination({ currentPage, onPageChanged, totalPages }) {
	const pageNumbers = [];
	const showPagesBefore = 2;
	const showPagesAfter = 2;
	let startPage;
	let endPage;
	if (totalPages <= 1) return;
	if (totalPages <= 5) {
		for (let i = 1; i <= totalPages; i++) {
			pageNumbers.push(i);
		}
	} else {
		startPage = Math.max(1, currentPage - showPagesBefore);
		endPage = Math.min(totalPages, currentPage + showPagesAfter);

		for (let i = startPage; i <= endPage; i++) {
			pageNumbers.push(i);
		}
		if (currentPage - showPagesBefore > 1) {
			pageNumbers.unshift("...");
		}
		if (currentPage + showPagesAfter < totalPages) {
			pageNumbers.push("...");
		}
	}
	useEffect(() => {
		function handleKeyPress(e) {
			switch (e.key) {
				case "ArrowLeft":
					if (currentPage > 1) onPageChanged(currentPage - 1);
					break;
				case "ArrowRight":
					if (currentPage < totalPages) onPageChanged(currentPage + 1);
					break;
				default:
					break;
			}
		}
		window.addEventListener("keydown", handleKeyPress);

		return () => {
			window.removeEventListener("keydown", handleKeyPress);
		};
	}, []);
	return (
		<nav aria-label="Page navigation" className="mb-2">
			<p className="text-tertiary font-semibold m-0.5">
				Page {currentPage} of {totalPages}
			</p>
			<ul className="flex items-center -space-x-px h-8 text-sm justify-center">
				<li
					onClick={() => {
						if (currentPage > 1) onPageChanged(currentPage - 1);
					}}
				>
					<a
						href="#"
						aria-disabled={currentPage === 1 ? "true" : "false"}
						className="pagination flex items-center justify-center px-3 h-8 ms-0 leading-tight rounded-s-lg"
					>
						<span className="sr-only">Previous</span>
						<i className="fa-solid fa-angle-left"></i>
					</a>
				</li>
				{pageNumbers.map((pageNumber, index) => {
					return (
						<li
							key={pageNumber}
							onClick={() => {
								if (pageNumber === "...") {
									if (index === 0) onPageChanged(startPage - 1);
									else onPageChanged(endPage + 1);
								} else onPageChanged(pageNumber);
							}}
						>
							<a
								href="#"
								className={`pagination flex items-center justify-center px-3 h-8 leading-tight  ${pageNumber === currentPage ? "pagination-current" : null}`}
							>
								{pageNumber}
							</a>
						</li>
					);
				})}
				<li
					onClick={() => {
						if (currentPage < totalPages) onPageChanged(currentPage + 1);
					}}
				>
					<a
						href="#"
						aria-disabled={currentPage === totalPages ? "true" : "false"}
						className={`pagination flex items-center justify-center px-3 h-8 leading-tight rounded-e-lg ${currentPage === totalPages ? "pointer-events-none" : null}`}
					>
						<span className="sr-only">Next</span>
						<i className="fa-solid fa-angle-right"></i>
					</a>
				</li>
			</ul>
		</nav>
	);
}
