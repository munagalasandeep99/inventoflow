
import React from 'react';
import { InventoryItem } from '../../types';

const StockStatus: React.FC<{ quantity: number }> = ({ quantity }) => {
    if (quantity === 0) {
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Out of Stock</span>;
    }
    if (quantity < 10) {
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Low Stock</span>;
    }
    return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">In Stock</span>;
};

interface InventoryListProps {
    items: InventoryItem[];
    onSelect: (item: InventoryItem) => void;
    selectedItemId: string | null;
}

const InventoryList: React.FC<InventoryListProps> = ({ items, onSelect, selectedItemId }) => {
    if (items.length === 0) {
        return <div className="bg-white p-8 rounded-lg shadow-md text-center text-gray-500">No inventory items found.</div>;
    }

    return (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="overflow-y-auto max-h-[60vh]">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 sticky top-0">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {items.map(item => (
                            <tr 
                                key={item.itemId}
                                onClick={() => onSelect(item)}
                                className={`cursor-pointer transition-colors duration-150 ${selectedItemId === item.itemId ? 'bg-blue-100 hover:bg-blue-200' : 'hover:bg-gray-50'}`}
                            >
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-10 w-10">
                                            <img className="h-10 w-10 rounded-full object-cover" src={item.imageUrl || 'https://picsum.photos/seed/placeholder/40/40'} alt={item.name} />
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">{item.name}</div>
                                            <div className="text-sm text-gray-500">{item.category}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <StockStatus quantity={item.quantity} />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.quantity} units</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default InventoryList;
