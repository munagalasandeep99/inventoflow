
import React from 'react';
import { InventoryItem } from '../../types';

interface InventoryDetailsProps {
    item: InventoryItem;
    onEdit: (item: InventoryItem) => void;
    onDelete: (itemId: string) => void;
    onUpdateStock: (item: InventoryItem) => void;
}

const DetailRow: React.FC<{ label: string; value: React.ReactNode; isMono?: boolean }> = ({ label, value, isMono = false }) => (
    <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
        <dt className="text-sm font-medium text-gray-500">{label}</dt>
        <dd className={`mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 ${isMono ? 'font-mono' : ''}`}>{value}</dd>
    </div>
);

const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
        }).format(new Date(dateString));
    } catch (e) {
        console.error("Failed to format date:", dateString, e);
        return 'Invalid Date';
    }
};

const InventoryDetails: React.FC<InventoryDetailsProps> = ({ item, onEdit, onDelete, onUpdateStock }) => {
    return (
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="p-4 sm:p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Item Details</h2>
                {item.imageUrl ? (
                    <div className="mb-6 rounded-lg bg-gray-100 flex items-center justify-center h-64 overflow-hidden">
                        <img src={item.imageUrl} alt={item.name} className="max-w-full max-h-full object-contain" />
                    </div>
                ) : (
                    <div className="mb-6 rounded-lg bg-gray-100 flex items-center justify-center h-64">
                        <span className="text-gray-400">No Image</span>
                    </div>
                )}
                <dl className="divide-y divide-gray-200">
                    <DetailRow label="Name" value={item.name} />
                    <DetailRow label="Category" value={item.category || 'N/A'} />
                    <DetailRow label="Quantity" value={`${item.quantity} units`} />
                    <DetailRow label="Price" value={`₹${item.price.toFixed(2)}`} />
                    <DetailRow label="Description" value={item.description || 'N/A'} />
                    <DetailRow label="Item ID" value={item.itemId} isMono />
                    <DetailRow label="Created At" value={formatDate(item.createdAt)} />
                    <DetailRow label="Last Updated" value={formatDate(item.updatedAt)} />
                </dl>
            </div>
            <div className="px-4 py-4 sm:px-6 bg-gray-50 flex justify-end items-center gap-3 flex-wrap">
                <button
                    onClick={() => onUpdateStock(item)}
                    className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all"
                >
                    Update Stock
                </button>
                <button
                    onClick={() => onEdit(item)}
                    className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
                >
                    Edit
                </button>
                <button
                    onClick={() => onDelete(item.itemId)}
                    className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all"
                >
                    Delete
                </button>
            </div>
        </div>
    );
};

export default InventoryDetails;
