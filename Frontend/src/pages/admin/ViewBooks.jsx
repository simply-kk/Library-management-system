import { useEffect, useState } from "react";
import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ViewBooks = () => {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const limit = 10;

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await axios.get(
          `${API_BASE_URL}/api/books/books?page=${currentPage}&limit=${limit}&search=${searchTerm}`,
          { withCredentials: true }
        );
        setBooks(res.data.books);
        setTotalPages(res.data.totalPages || 1);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load books");
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
      fetchBooks();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [currentPage, searchTerm]);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });

    const sortedBooks = [...books].sort((a, b) => {
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
      return 0;
    });
    setBooks(sortedBooks);
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return '↕️';
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8 max-w-[1400px] mx-auto">
      {/* Header Section */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            📚 Library Collection
          </h1>
        </div>

        {/* Search Bar */}
        <div className="relative w-full max-w-2xl mx-auto mb-6">
          <input
            type="text"
            placeholder="Search by book name, author, category..."
            className="w-full px-4 py-3 pl-12 text-gray-700 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="absolute left-4 top-3.5 text-gray-400">🔍</span>
        </div>
      </div>

      {/* Content Section */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
          {error}
        </div>
      ) : books.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 text-gray-600 px-4 py-8 rounded-lg text-center">
          No books found matching your search.
        </div>
      ) : (
        <>
          <div className="overflow-x-auto bg-white rounded-xl shadow-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="sticky top-0 z-10 bg-gray-50 px-4 py-3 text-left">
                    <span className="text-xs font-medium text-gray-600">SR. NO.</span>
                  </th>
                  <th className="sticky top-0 z-10 bg-gray-50 px-4 py-3 text-left">
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => handleSort('accessionNumber')}
                        className="group inline-flex items-center space-x-2 text-xs font-medium text-gray-600 hover:text-gray-900"
                      >
                        <span>ACCESSION NO.</span>
                        <span className="text-gray-400 group-hover:text-gray-600">
                          {getSortIcon('accessionNumber')}
                        </span>
                      </button>
                    </div>
                  </th>
                  <th className="sticky top-0 z-10 bg-gray-50 px-4 py-3 text-left">
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => handleSort('authorName')}
                        className="group inline-flex items-center space-x-2 text-xs font-medium text-gray-600 hover:text-gray-900"
                      >
                        <span>AUTHOR NAME</span>
                        <span className="text-gray-400 group-hover:text-gray-600">
                          {getSortIcon('authorName')}
                        </span>
                      </button>
                    </div>
                  </th>
                  <th className="sticky top-0 z-10 bg-gray-50 px-4 py-3 text-left">
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => handleSort('bookName')}
                        className="group inline-flex items-center space-x-2 text-xs font-medium text-gray-600 hover:text-gray-900"
                      >
                        <span>BOOK NAME</span>
                        <span className="text-gray-400 group-hover:text-gray-600">
                          {getSortIcon('bookName')}
                        </span>
                      </button>
                    </div>
                  </th>
                  <th className="sticky top-0 z-10 bg-gray-50 px-4 py-3 text-left">
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => handleSort('publication')}
                        className="group inline-flex items-center space-x-2 text-xs font-medium text-gray-600 hover:text-gray-900"
                      >
                        <span>PUBLICATION</span>
                        <span className="text-gray-400 group-hover:text-gray-600">
                          {getSortIcon('publication')}
                        </span>
                      </button>
                    </div>
                  </th>
                  <th className="sticky top-0 z-10 bg-gray-50 px-4 py-3 text-left">
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => handleSort('year')}
                        className="group inline-flex items-center space-x-2 text-xs font-medium text-gray-600 hover:text-gray-900"
                      >
                        <span>YEAR</span>
                        <span className="text-gray-400 group-hover:text-gray-600">
                          {getSortIcon('year')}
                        </span>
                      </button>
                    </div>
                  </th>
                  <th className="sticky top-0 z-10 bg-gray-50 px-4 py-3 text-left">
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => handleSort('totalPages')}
                        className="group inline-flex items-center space-x-2 text-xs font-medium text-gray-600 hover:text-gray-900"
                      >
                        <span>PAGES</span>
                        <span className="text-gray-400 group-hover:text-gray-600">
                          {getSortIcon('totalPages')}
                        </span>
                      </button>
                    </div>
                  </th>
                  <th className="sticky top-0 z-10 bg-gray-50 px-4 py-3 text-left">
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => handleSort('price')}
                        className="group inline-flex items-center space-x-2 text-xs font-medium text-gray-600 hover:text-gray-900"
                      >
                        <span>PRICE</span>
                        <span className="text-gray-400 group-hover:text-gray-600">
                          {getSortIcon('price')}
                        </span>
                      </button>
                    </div>
                  </th>
                  <th className="sticky top-0 z-10 bg-gray-50 px-4 py-3 text-left">
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => handleSort('category')}
                        className="group inline-flex items-center space-x-2 text-xs font-medium text-gray-600 hover:text-gray-900"
                      >
                        <span>CATEGORY</span>
                        <span className="text-gray-400 group-hover:text-gray-600">
                          {getSortIcon('category')}
                        </span>
                      </button>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {books.map((book, index) => (
                  <tr
                    key={book._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {(currentPage - 1) * limit + index + 1}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {book.accessionNumber}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {book.authorName}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {book.bookName}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {book.publication}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {book.year}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {book.totalPages}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      ₹{book.price}
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {book.category}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="mt-6 flex justify-between items-center">
            <div className="text-sm text-gray-500">
              Showing {books.length} books
            </div>
            <div className="flex items-center gap-4">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ViewBooks;
