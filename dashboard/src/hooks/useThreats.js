import { useState, useEffect, useCallback } from 'react';
import { fetchStats, fetchThreats, fetchBrands, fetchReports, fetchWhitelist } from '../lib/api';
export function useThreats() {
    const [stats, setStats] = useState(null);
    const [threats, setThreats] = useState([]);
    const [brands, setBrands] = useState([]);
    const [reports, setReports] = useState([]);
    const [whitelist, setWhitelist] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // Filter & Pagination States
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [riskFilter, setRiskFilter] = useState('ALL');
    const [searchQuery, setSearchQuery] = useState('');
    const loadAll = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const [statsData, threatsData, brandsData, reportsData, whitelistData] = await Promise.all([
                fetchStats().catch(() => null),
                fetchThreats({ page, limit: 15, riskLevel: riskFilter, search: searchQuery }).catch(() => ({ threats: [], totalPages: 1 })),
                fetchBrands().catch(() => ({ brands: [] })),
                fetchReports().catch(() => []),
                fetchWhitelist().catch(() => []),
            ]);
            if (statsData)
                setStats(statsData);
            if (threatsData) {
                setThreats(threatsData.threats || []);
                setTotalPages(threatsData.totalPages || 1);
            }
            if (brandsData)
                setBrands(brandsData.brands || []);
            if (reportsData)
                setReports(reportsData);
            if (whitelistData)
                setWhitelist(whitelistData);
        }
        catch (err) {
            setError(err.message || 'Error loading dashboard data');
        }
        finally {
            setLoading(false);
        }
    }, [page, riskFilter, searchQuery]);
    useEffect(() => {
        loadAll();
    }, [loadAll]);
    return {
        stats,
        threats,
        brands,
        reports,
        whitelist,
        loading,
        error,
        page,
        setPage,
        totalPages,
        riskFilter,
        setRiskFilter,
        searchQuery,
        setSearchQuery,
        reload: loadAll,
    };
}
