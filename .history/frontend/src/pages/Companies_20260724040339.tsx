import { useEffect, useState } from "react";
import { Building2, Mail, Phone, Users, Plus, Eye, Edit, Trash2, Search, Briefcase } from "lucide-react";
import { getCompanies } from "../services/company.service";
// import Card from "../components/Card";
import Button from "../components/Button";
// import SearchBar from "../components/SearchBar";

const Companies = () => {
    const [companies, setCompanies] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCompanies();
    }, []);

    const fetchCompanies = async () => {
        try {
            setLoading(true);
            const data = await getCompanies();
            setCompanies(data);
        } catch (error) {
            console.error("Error fetching companies:", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredCompanies = companies.filter((company: any) =>
        company.name?.toLowerCase().includes(search.toLowerCase()) ||
        company.industry?.toLowerCase().includes(search.toLowerCase()) ||
        company.email?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            Companies
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400 mt-2">
                            Manage and organize all your companies
                        </p>
                    </div>
                    <Button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300 flex items-center gap-2">
                        <Plus className="w-5 h-5" />
                        Add Company
                    </Button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-xl shadow-blue-500/10 border border-slate-200 dark:border-slate-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Companies</p>
                                <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">{companies.length}</p>
                            </div>
                            <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg shadow-blue-500/30">
                                <Building2 className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-xl shadow-emerald-500/10 border border-slate-200 dark:border-slate-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Active Industries</p>
                                <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
                                    {new Set(companies.map((c: any) => c.industry)).size}
                                </p>
                            </div>
                            <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-lg shadow-emerald-500/30">
                                <Briefcase className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-xl shadow-violet-500/10 border border-slate-200 dark:border-slate-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Owners</p>
                                <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
                                    {companies.filter((c: any) => c.owner).length}
                                </p>
                            </div>
                            <div className="p-3 bg-gradient-to-br from-violet-500 to-violet-600 rounded-xl shadow-lg shadow-violet-500/30">
                                <Users className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-xl shadow-slate-500/10 border border-slate-200 dark:border-slate-700">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search companies by name, industry, or email..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-900 dark:text-white placeholder-slate-400"
                        />
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                )}

                {/* Companies Grid */}
                {!loading && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredCompanies.map((company: any) => (
                            <div
                                key={company._id}
                                className="group bg-white dark:bg-slate-800 rounded-2xl shadow-xl shadow-slate-500/10 border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 hover:-translate-y-1"
                            >
                                {/* Company Header with Gradient */}
                                <div className="h-24 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 relative overflow-hidden">
                                    <div className="absolute inset-0 bg-black/10" />
                                    <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-white/10 rounded-full" />
                                    <div className="absolute -top-8 -left-8 w-24 h-24 bg-white/10 rounded-full" />
                                </div>

                                {/* Company Avatar */}
                                <div className="relative px-6 -mt-12">
                                    <div className="w-20 h-20 bg-white dark:bg-slate-800 rounded-2xl shadow-xl flex items-center justify-center border-4 border-white dark:border-slate-800">
                                        <span className="text-3xl font-bold bg-gradient-to-br from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                            {company.name?.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                </div>

                                {/* Company Info */}
                                <div className="p-6 pt-4">
                                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                                        {company.name}
                                    </h2>

                                    <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mb-4">
                                        <Briefcase className="w-3 h-3 mr-1" />
                                        {company.industry}
                                    </div>

                                    <div className="space-y-3 mb-6">
                                        <div className="flex items-center gap-3 text-sm">
                                            <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                                                <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-500 dark:text-slate-400">Owner</p>
                                                <p className="font-medium text-slate-900 dark:text-white">
                                                    {company.owner?.name || "No Owner"}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 text-sm">
                                            <div className="p-2 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg">
                                                <Mail className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-500 dark:text-slate-400">Email</p>
                                                <p className="font-medium text-slate-900 dark:text-white">
                                                    {company.email}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 text-sm">
                                            <div className="p-2 bg-violet-50 dark:bg-violet-900/30 rounded-lg">
                                                <Phone className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-500 dark:text-slate-400">Phone</p>
                                                <p className="font-medium text-slate-900 dark:text-white">
                                                    {company.phone}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-2 pt-4 border-t border-slate-200 dark:border-slate-700">
                                        <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl font-medium hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-all">
                                            <Eye className="w-4 h-4" />
                                            View
                                        </button>
                                        <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-xl font-medium hover:bg-amber-100 dark:hover:bg-amber-900/50 transition-all">
                                            <Edit className="w-4 h-4" />
                                            Edit
                                        </button>
                                        <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl font-medium hover:bg-red-100 dark:hover:bg-red-900/50 transition-all">
                                            <Trash2 className="w-4 h-4" />
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {!loading && filteredCompanies.length === 0 && (
                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-12 shadow-xl shadow-slate-500/10 border border-slate-200 dark:border-slate-700 text-center">
                        <div className="w-20 h-20 mx-auto bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mb-4">
                            <Building2 className="w-10 h-10 text-slate-400" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                            {search ? "No companies found" : "No companies yet"}
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400 mb-6">
                            {search
                                ? "Try adjusting your search terms"
                                : "Get started by adding your first company"}
                        </p>
                        {!search && (
                            <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300 inline-flex items-center gap-2">
                                <Plus className="w-5 h-5" />
                                Add Company
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Companies;