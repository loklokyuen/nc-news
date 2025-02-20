export default function Pagination({ currentPage, setCurrentPage, totalPages }) {
    const pageNumbers = [];
    const showPagesBefore = 2;
    const showPagesAfter = 2;
    if ( totalPages === 1) return;
    if ( totalPages <= 5 ){
        for (let i = 1; i <= totalPages; i++) {
            pageNumbers.push(i);
        }
    } else {
        let startPage = Math.max(1, currentPage - showPagesBefore);
        let endPage = Math.min(totalPages, currentPage + showPagesAfter);
    
        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }
        if (currentPage - showPagesBefore > 1) {
            pageNumbers.unshift('...');
        }
        if (currentPage + showPagesAfter < totalPages) {
            pageNumbers.push('...');
        }
    }

    return <nav aria-label="Page navigation" className="mb-2">
        <p className="text-highland-400 font-semibold">Page {currentPage} of {totalPages}</p>
        <ul className="flex items-center -space-x-px h-8 text-sm justify-center">
            <li onClick={()=>setCurrentPage(currentPage-1)}>
                <a href="#" aria-disabled={currentPage === 1 ? "true" : "false"}
                className="pagination flex items-center justify-center px-3 h-8 ms-0 leading-tight rounded-s-lg">
                    <span className="sr-only">Previous</span>
                    <i className="fa-solid fa-angle-left"></i>
                </a>
            </li>
            { pageNumbers.map((pageNumber)=>{
                return <li key={pageNumber} onClick={()=>setCurrentPage(pageNumber)}>
                    <a href="#" className={`pagination flex items-center justify-center px-3 h-8 leading-tight  ${pageNumber === currentPage? "pagination-current": null}`}>{pageNumber}</a>
                </li>})
            }
   
            <li onClick={()=>setCurrentPage(currentPage+1)}>
                <a href="#" aria-disabled={currentPage === totalPages ? "true" : "false"}
                className={`pagination flex items-center justify-center px-3 h-8 leading-tight rounded-e-lg ${currentPage === totalPages? "pointer-events-none": null}`}>
                    <span className="sr-only">Next</span>
                    <i className="fa-solid fa-angle-right"></i>
                </a>
            </li>
        </ul>
    </nav>

    
}