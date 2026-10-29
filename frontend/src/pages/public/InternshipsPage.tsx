import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '@/services/api';
import { Internship } from '@/types';
import { StatusBadge } from '@/components/common/Badge';
import {
  Search,
  Filter,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
} from 'lucide-react';

export const InternshipsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [internships, setInternships] = useState<Internship[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Filter states
  const query = searchParams.get('query') || '';
  const category = searchParams.get('category') || '';
  const workMode = searchParams.get('workMode') || '';
  const location = searchParams.get('location') || '';
  const minStipend = searchParams.get('minStipend') || '';
  const sort = searchParams.get('sort') || 'newest';
  const page = parseInt(searchParams.get('page') || '0', 10);

  const [inputQuery, setInputQuery] = useState(query);

  const fetchInternships = async () => {
    setLoading(true);
    try {
      const res = await api.getInternships({
        query: query || undefined,
        category: category || undefined,
        workMode: workMode || undefined,
        location: location || undefined,
        minStipend: minStipend ? Number(minStipend) : undefined,
        sort,
        page,
        size: 10,
      });

      const list = res.content || res || [];
      setInternships(Array.isArray(list) ? list : []);
      setTotalElements(res.totalElements || (Array.isArray(list) ? list.length : 0));
      setTotalPages(res.totalPages || 1);
    } catch (err) {
      console.error('Failed to load internships:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInternships();
  }, [query, category, workMode, location, minStipend, sort, page]);

  const updateParam = (key: string, val: string) => {
    const next = new URLSearchParams(searchParams);
    if (val) {
      next.set(key, val);
    } else {
      next.delete(key);
    }
    next.set('page', '0');
    setSearchParams(next);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateParam('query', inputQuery.trim());
  };

  const handleReset = () => {
    setInputQuery('');
    setSearchParams(new URLSearchParams());
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        {/* Blue Header Section */}
        <div className="bg-[#356F9D] text-white px-5 py-3 rounded-sm border-b border-[#28587E] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h1 className="text-base sm:text-lg font-bold tracking-wide uppercase">
              Internship Opportunities Directory
            </h1>
            <p className="text-xs text-[#EAF2FC] mt-0.5">
              Browse approved vacancies from verified recruitment partners
            </p>
          </div>
          <div className="text-xs text-[#FFF0CE] font-medium bg-[#28587E] px-2.5 py-1 rounded-sm border border-[#4779B8] self-start sm:self-auto">
            Total Available: <strong>{totalElements}</strong>
          </div>
        </div>

        {/* Filter Box */}
        <div className="bg-white border border-[#D4DCE6] rounded-sm p-4 shadow-sm">
          <form onSubmit={handleSearchSubmit} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-6">
                <label className="block text-xs font-bold text-[#333333] mb-1">
                  Search Keywords (Title, Skills, Company)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputQuery}
                    onChange={(e) => setInputQuery(e.target.value)}
                    placeholder="e.g. Java Backend, React, Data Engineer..."
                    className="flex-1 px-3 py-1.5 text-xs border border-[#D4DCE6] rounded-sm focus:border-[#4779B8] focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-[#4779B8] hover:bg-[#356F9D] text-white text-xs font-bold rounded-sm border border-[#356F9D] flex items-center gap-1 transition-colors"
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>Search</span>
                  </button>
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-[#333333] mb-1">Work Mode</label>
                <select
                  value={workMode}
                  onChange={(e) => updateParam('workMode', e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs border border-[#D4DCE6] rounded-sm bg-white focus:border-[#4779B8] focus:outline-none"
                >
                  <option value="">All Modes</option>
                  <option value="REMOTE">Remote</option>
                  <option value="HYBRID">Hybrid</option>
                  <option value="ONSITE">Onsite</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-[#333333] mb-1">Min. Monthly Stipend</label>
                <select
                  value={minStipend}
                  onChange={(e) => updateParam('minStipend', e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs border border-[#D4DCE6] rounded-sm bg-white focus:border-[#4779B8] focus:outline-none"
                >
                  <option value="">Any Stipend</option>
                  <option value="10000">₹10,000 / mo</option>
                  <option value="15000">₹15,000 / mo</option>
                  <option value="25000">₹25,000 / mo</option>
                  <option value="35000">₹35,000 / mo</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-[#333333] mb-1">Sort Results</label>
                <select
                  value={sort}
                  onChange={(e) => updateParam('sort', e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs border border-[#D4DCE6] rounded-sm bg-white focus:border-[#4779B8] focus:outline-none"
                >
                  <option value="newest">Newest First</option>
                  <option value="stipend_high">Highest Stipend</option>
                  <option value="deadline">Approaching Deadline</option>
                </select>
              </div>
            </div>

            {(query || workMode || minStipend || location) && (
              <div className="pt-2 border-t border-[#D4DCE6] flex items-center justify-between text-xs">
                <span className="text-[#666666]">
                  Active Filter: {query && `"${query}" `} {workMode && `[${workMode}] `}
                </span>
                <button
                  type="button"
                  onClick={handleReset}
                  className="text-[#C94242] hover:underline flex items-center gap-1 font-semibold"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Clear All Filters</span>
                </button>
              </div>
            )}
          </form>
        </div>

        {/* Results Table */}
        <div className="bg-white border border-[#D4DCE6] rounded-sm shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="portal-table">
              <thead>
                <tr>
                  <th>Job ID</th>
                  <th>Internship Title</th>
                  <th>Company</th>
                  <th>Location</th>
                  <th>Work Mode</th>
                  <th>Duration</th>
                  <th>Stipend</th>
                  <th>Deadline</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={9} className="text-center py-8 text-[#666666]">
                      Searching available internships...
                    </td>
                  </tr>
                ) : internships.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="text-center py-8 text-[#666666]">
                      No internships matched your search criteria. Try clearing filters.
                    </td>
                  </tr>
                ) : (
                  internships.map((item) => (
                    <tr key={item.id}>
                      <td className="font-mono text-xs text-[#666666]">INT-{String(item.id).padStart(4, '0')}</td>
                      <td className="font-semibold text-[#356F9D]">
                        <Link to={`/internships/${item.id}`} className="hover:underline">
                          {item.title}
                        </Link>
                      </td>
                      <td className="font-medium text-[#333333]">{item.companyName}</td>
                      <td>{item.location}</td>
                      <td>
                        <StatusBadge status={item.workMode} size="sm" />
                      </td>
                      <td>{item.durationMonths || 3} Months</td>
                      <td className="font-semibold text-[#285C2A]">
                        {item.stipendMin ? `₹${item.stipendMin.toLocaleString()}/mo` : 'Unpaid'}
                      </td>
                      <td className="text-xs text-[#555555]">
                        {item.applicationDeadline ? new Date(item.applicationDeadline).toLocaleDateString() : 'Rolling'}
                      </td>
                      <td>
                        <Link
                          to={`/internships/${item.id}`}
                          className="px-2.5 py-1 bg-[#4779B8] hover:bg-[#356F9D] text-white text-xs font-semibold rounded-sm border border-[#356F9D] inline-block whitespace-nowrap"
                        >
                          View Details
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Simple Pagination */}
          {totalPages > 1 && (
            <div className="p-3 bg-[#FAFCFF] border-t border-[#D4DCE6] flex items-center justify-between text-xs">
              <button
                disabled={page <= 0}
                onClick={() => updateParam('page', String(page - 1))}
                className="px-3 py-1 bg-white border border-[#D4DCE6] text-[#333333] rounded-sm disabled:opacity-40 hover:bg-[#EAF2FC]"
              >
                &larr; Previous Page
              </button>
              <span className="font-medium text-[#666666]">
                Page <strong>{page + 1}</strong> of <strong>{totalPages}</strong>
              </span>
              <button
                disabled={page >= totalPages - 1}
                onClick={() => updateParam('page', String(page + 1))}
                className="px-3 py-1 bg-white border border-[#D4DCE6] text-[#333333] rounded-sm disabled:opacity-40 hover:bg-[#EAF2FC]"
              >
                Next Page &rarr;
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
