
import React, { useEffect, useState } from 'react';
import { InventoryItem } from '../types';
import { fetchItems } from '../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// --- New Icons to match the screenshot ---
const IconBox: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-14L4 7m0 10l8 4m0 0v-10" />
    </svg>
);

const IconCurrency: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 8h6m-5 4h4m5 6H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2z" />
    </svg>
);

const IconAlert: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
);

const IconOutOfStock: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
    </svg>
);

// --- Updated StatCard to prevent value overflow and match design ---
const StatCard: React.FC<{ title: string; value: string; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4 overflow-hidden">
        <div className="bg-blue-100 text-primary p-3 rounded-full flex-shrink-0">{icon}</div>
        <div className="min-w-0 flex-1">
            <p className="text-sm text-gray-500 truncate">{title}</p>
            <p className="text-xl md:text-2xl font-bold text-secondary break-words">{value}</p>
        </div>
    </div>
);

const Dashboard: React.FC = () => {
    const [items, setItems] = useState<InventoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadItems = async () => {
            try {
                setLoading(true);
                const fetchedItems = await fetchItems();
                setItems(fetchedItems);
            } catch (err) {
                setError('Failed to fetch dashboard data.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        loadItems();
    }, []);

    const lowStockThreshold = 10;
    const totalItems = items.length;
    const lowStockItems = items.filter(item => item.quantity > 0 && item.quantity < lowStockThreshold);
    const totalValue = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const categories = [...new Set(items.map(item => item.category || 'Uncategorized'))];
    const outOfStockItemsCount = items.filter(item => item.quantity === 0).length;

    const categoryData = categories.map(category => ({
        name: category,
        stock: items.filter(item => (item.category || 'Uncategorized') === category).reduce((sum, item) => sum + item.quantity, 0)
    })).sort((a,b) => b.stock - a.stock);

    if (loading) {
        return <div className="text-center p-10">Loading dashboard...</div>;
    }

    if (error) {
        return <div className="text-center p-10 text-red-500">{error}</div>;
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard title="Total Products" value={totalItems.toString()} icon={<IconBox className="h-6 w-6" />} />
                <StatCard title="Total Inventory Value" value={`₹${totalValue.toLocaleString('en-IN')}`} icon={<IconCurrency className="h-6 w-6" />} />
                <StatCard title="Low Stock Alerts" value={lowStockItems.length.toString()} icon={<IconAlert className="h-6 w-6" />} />
                <StatCard title="Out of Stock" value={outOfStockItemsCount.toString()} icon={<IconOutOfStock className="h-6 w-6" />} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                 <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4 text-secondary">Stock by Category</h2>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <BarChart data={categoryData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" tick={{fontSize: 12}} />
                                <YAxis />
                                <Tooltip formatter={(value) => `${value} units`} />
                                <Legend />
                                <Bar dataKey="stock" fill="#3b82f6" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4 text-secondary">Low Stock Items</h2>
                    {lowStockItems.length > 0 ? (
                        <ul className="divide-y divide-gray-200">
                            {lowStockItems.slice(0, 5).map(item => (
                                <li key={item.itemId} className="py-3 flex justify-between items-center">
                                    <div>
                                        <p className="font-medium text-gray-800">{item.name}</p>
                                        <p className="text-sm text-gray-500">{item.category}</p>
                                    </div>
                                    <span className="bg-yellow-200 text-yellow-800 text-xs font-semibold px-3 py-1 rounded-full">
                                       Qty: {item.quantity}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500 mt-4">No items are currently low on stock. Great job!</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
