import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const HistorySearch = () => {
  const [rollNumber, setRollNumber] = useState("");
  const [student, setStudent] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [apiError, setApiError] = useState(false);

  useEffect(() => {
    axios.defaults.withCredentials = true;
    axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;
  }, []);

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-GB");
  };

  const fetchHistory = async () => {
    if (!rollNumber.trim()) {
      toast.warning("Please enter a valid roll number");
      return;
    }

    setLoading(true);
    setApiError(false);

    try {
      const { data: studentData } = await axios.get(`/api/issues/student-by-roll/${rollNumber}`);
      if (!studentData.success) {
        toast.error("Student not found");
        setApiError(true);
        setStudent(null);
        setTransactions([]);
        return;
      }

      const { data: historyData } = await axios.get(`/api/history/history/${studentData.student._id}`);
      
      setStudent(studentData.student);
      setTransactions(historyData.transactions || []);
      setHasSearched(true);

      if (!historyData.success || !historyData.transactions.length) {
        toast.info(historyData.message || "No transactions found");
      } else {
        toast.success(`Found ${historyData.transactions.length} transactions`);
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Error fetching history");
      setApiError(true);
      setStudent(null);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <span className="text-blue-600">📚</span>
              Transaction History
            </h1>
            
            {/* Search Input */}
            <div className="flex-1 max-w-2xl">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter Student Roll Number"
                  value={rollNumber}
                  onChange={(e) => setRollNumber(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !loading && fetchHistory()}
                  className="w-full pl-4 pr-24 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  disabled={loading}
                />
                <button
                  onClick={fetchHistory}
                  disabled={loading}
                  className={`absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 rounded-md text-white font-medium text-sm transition-all duration-200 ${
                    loading 
                      ? "bg-gray-400 cursor-not-allowed" 
                      : "bg-blue-600 hover:bg-blue-700"
                  } flex items-center gap-2`}
                >
                  {loading ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      <span>Searching</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      <span>Search</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Loading Skeleton */}
        {loading && (
          <div className="space-y-4 animate-pulse">
            <div className="h-24 bg-white rounded-lg"></div>
            <div className="space-y-3">
              <div className="h-20 bg-white rounded-lg"></div>
              <div className="h-20 bg-white rounded-lg"></div>
              <div className="h-20 bg-white rounded-lg"></div>
            </div>
          </div>
        )}

        {/* Content (Only show when not loading) */}
        {!loading && (
          <>
            {/* Student Info */}
            {student && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <div className="text-xs font-medium text-gray-500 mb-1">Name</div>
                    <div className="font-medium text-gray-900">{student.name}</div>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-gray-500 mb-1">Roll Number</div>
                    <div className="font-medium text-gray-900">{student.rollNumber}</div>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-gray-500 mb-1">Department</div>
                    <div className="font-medium text-gray-900">{student.department}</div>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-gray-500 mb-1">Batch</div>
                    <div className="font-medium text-gray-900">{student.batch || "N/A"}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Transactions */}
            {hasSearched && !apiError && (
              <div>
                {transactions.length > 0 ? (
                  <>
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-medium text-gray-900">Transaction Records</h2>
                      <span className="bg-blue-50 text-blue-700 text-xs font-medium px-2.5 py-1 rounded-md">
                        {transactions.length} {transactions.length === 1 ? 'record' : 'records'}
                      </span>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                      <div className="max-h-[calc(100vh-300px)] overflow-y-auto">
                        <div className="divide-y divide-gray-100">
                          {transactions.map((txn, idx) => (
                            <div
                              key={`${txn.issueId}-${txn.issuedBookId || idx}`}
                              className="flex flex-col sm:flex-row items-stretch"
                            >
                              {/* Book Info Section */}
                              <div className="flex-1 p-3 sm:p-4 flex flex-col sm:border-r border-gray-100">
                                <div className="flex items-start justify-between gap-3 mb-2">
                                  <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-medium text-gray-800 truncate">
                                      {txn.book?.bookName}
                                    </h4>
                                    <p className="text-xs text-gray-500 mt-0.5">
                                      {txn.book?.authorName}
                                    </p>
                                  </div>
                                  <span className={`shrink-0 px-2 py-1 rounded text-xs font-medium ${
                                    txn.returned 
                                      ? "bg-green-100 text-green-700" 
                                      : "bg-yellow-100 text-yellow-800"
                                  }`}>
                                    {txn.returned ? "Returned" : "Not Returned"}
                                  </span>
                                </div>
                                <div className="mt-auto">
                                  <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">
                                    ACC: {txn.book?.accessionNumber}
                                  </span>
                                </div>
                              </div>

                              {/* Dates Section */}
                              <div className="sm:w-[280px] p-3 sm:p-4 bg-gray-50 flex flex-col justify-center space-y-2">
                                {/* Issue Date */}
                                <div className="flex items-center justify-between text-xs">
                                  <div className="flex items-center gap-1.5">
                                    <svg className="w-3.5 h-3.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span className="text-gray-600">Issued:</span>
                                  </div>
                                  <span className="font-medium text-gray-800">{formatDate(txn.issueDate)}</span>
                                </div>

                                {/* Due Date */}
                                <div className="flex items-center justify-between text-xs">
                                  <div className="flex items-center gap-1.5">
                                    <svg className="w-3.5 h-3.5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span className="text-gray-600">Due:</span>
                                  </div>
                                  <div className="flex items-center gap-1.5">
                                    <span className={`font-medium ${
                                      txn.isOverdue && !txn.returned ? "text-red-600" : "text-gray-800"
                                    }`}>
                                      {formatDate(txn.dueDate)}
                                    </span>
                                    {txn.isOverdue && !txn.returned && (
                                      <span className="bg-red-100 text-red-600 px-1.5 py-0.5 rounded text-[10px] leading-none">
                                        Overdue
                                      </span>
                                    )}
                                  </div>
                                </div>

                                {/* Return Date */}
                                {txn.returned && (
                                  <div className="flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-1.5">
                                      <svg className="w-3.5 h-3.5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                      </svg>
                                      <span className="text-gray-600">Returned:</span>
                                    </div>
                                    <span className="font-medium text-gray-800">{formatDate(txn.returnedAt)}</span>
                                  </div>
                                )}

                                {/* Fine Amount */}
                                {txn.fine > 0 && (
                                  <div className="flex items-center justify-between text-xs pt-1 mt-1 border-t border-gray-200">
                                    <div className="flex items-center gap-1.5">
                                      <svg className="w-3.5 h-3.5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                      </svg>
                                      <span className="text-red-600 font-medium">Fine:</span>
                                    </div>
                                    <span className="font-medium text-red-600">₹{txn.fine}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-4">
                      <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No Transaction History</h3>
                    <p className="text-gray-500">This student has no recorded book transactions.</p>
                  </div>
                )}
              </div>
            )}

            {/* Error State */}
            {apiError && (
              <div className="bg-white rounded-lg shadow-sm border border-red-200 p-8 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mb-4">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">Error Fetching Data</h3>
                <p className="text-gray-500">Please check the roll number and try again.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default HistorySearch;
