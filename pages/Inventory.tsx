import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { InventoryItem } from '../types';
import { fetchItems, deleteItem, updateItem } from '../services/api';
import InventoryList from '../components/inventory/InventoryList';
import InventoryForm from '../components/inventory/InventoryForm';
import InventoryDetails from '../components/inventory/InventoryDetails';
import { SearchIcon, FilterIcon } from '../components/Icons';

const StockUpdateModal: React.FC<{item: InventoryItem, onClose: () => void, onRefresh: (data: InventoryItem) => void}> = ({ item, onClose, onRefresh }) => {
    const [change, setChange] = useState(0);

    const handleUpdate = async () => {
        const newQuantity = item.quantity + change;
        if (newQuantity < 0) {
            alert("Quantity cannot be negative.");
            return;
        }
        try {
            const updatedItem = { ...item, quantity: newQuantity };
            await updateItem(updatedItem);
            onRefresh(updatedItem);
            onClose();
        } catch(e) {
            alert("Failed to update stock.");
            console.error(e);
        }
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm">
                <h3 className="text-lg font-bold mb-4">Update Stock for {item.name}</h3>
                <p className="mb-2">Current stock: {item.quantity}</p>
                <div className="flex items-center gap-2 mb-4">
                    <label htmlFor="stock-change" className="sr-only">Change amount</label>
                    <input 
                        type="number"
                        id="stock-change"
                        value={change}
                        onChange={e => setChange(parseInt(e.target.value, 10) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                        placeholder="e.g., 10 or -5"
                    />
                </div>
                <p className="text-sm text-gray-600">New stock will be: <span className="font-bold">{item.quantity + change}</span></p>
                <div className="mt-6 flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel</button>
                    <button onClick={handleUpdate} className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-hover">Update</button>
                </div>
            </div>
        </div>
    );
};

const Inventory: React.FC = () => {
    const [items, setItems] = useState<InventoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);

    const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
    const [isStockUpdateModalOpen, setIsStockUpdateModalOpen] = useState(false);

    const fetchAllItems = useCallback(async () => {
        try {
            setLoading(true);
            const fetchedItems = await fetchItems();
            setItems(fetchedItems);
            setError(null);
        } catch (err) {
            setError('Failed to fetch inventory items.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAllItems();
    }, [fetchAllItems]);

    const handleDeleteItem = async (itemId: string) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            try {
                await deleteItem(itemId);
                setItems(prev => prev.filter(item => item.itemId !== itemId));
                if (selectedItem?.itemId === itemId) {
                    setSelectedItem(null);
                }
            } catch (err) {
                setError('Failed to delete item.');
                console.error(err);
            }
        }
    };

    const handleEditItem = (item: InventoryItem) => {
        setEditingItem(item);
        setIsFormModalOpen(true);
    };
    
    const handleFormSubmit = async (formData: Partial<InventoryItem> & { itemId?: string }) => {
       if (!editingItem || !formData.itemId) {
            setError("Cannot update: item identifier is missing.");
            return;
        }

        try {
            const updatedItem = { ...editingItem, ...formData };
            await updateItem(updatedItem);

            setItems(prev => prev.map(i => (i.itemId === updatedItem.itemId ? updatedItem : i)));
            setSelectedItem(prev => (prev?.itemId === updatedItem.itemId ? updatedItem : prev));
            
            setIsFormModalOpen(false);
            setEditingItem(null);
        } catch (err) {
            setError('Failed to update item.');
            console.error(err);
        }
    };

    const handleSelectItem = (item: InventoryItem) => {
        setSelectedItem(item);
    };

    const handleUpdateStock = (item: InventoryItem) => {
        setSelectedItem(item);
        setIsStockUpdateModalOpen(true);
    };

    const handleStockUpdateSuccess = (updatedItem: InventoryItem) => {
        setItems(prevItems => prevItems.map(item => 
            item.itemId === updatedItem.itemId ? updatedItem : item
        ));
        setSelectedItem(prev => prev?.itemId === updatedItem.itemId ? updatedItem : prev);
        setIsStockUpdateModalOpen(false);
    };

    const categories = useMemo(() => ['All', ...new Set(items.map(item => item.category).filter(Boolean))], [items]);

    const filteredItems = useMemo(() => {
        return items
            .filter(item => {
                const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
                const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                      (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
                                      item.itemId.toLowerCase().includes(searchTerm.toLowerCase());
                return matchesCategory && matchesSearch;
            })
            .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    }, [items, searchTerm, selectedCategory]);

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Inventory</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="lg:col-span-2 flex flex-col gap-6">
                    <div className="p-4 bg-white rounded-lg shadow-sm flex flex-col gap-4">
                        <div className="relative w-full">
                            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by name, ID..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>
                        <div className="relative w-full">
                            <FilterIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <select
                                value={selectedCategory}
                                onChange={e => setSelectedCategory(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-primary"
                            >
                                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                        </div>
                    </div>
                    
                    {loading && <div className="bg-white p-8 rounded-lg shadow-md text-center text-gray-500">Loading inventory...</div>}
                    {error && <div className="bg-red-100 text-red-700 p-8 rounded-lg shadow-md text-center">{error}</div>}
                    {!loading && !error && (
                        <InventoryList
                            items={filteredItems}
                            onSelect={handleSelectItem}
                            selectedItemId={selectedItem?.itemId || null}
                        />
                    )}
                </div>

                <div className="lg:col-span-3">
                    {selectedItem ? (
                        <InventoryDetails 
                            item={selectedItem}
                            onEdit={handleEditItem}
                            onDelete={() => handleDeleteItem(selectedItem.itemId)}
                            onUpdateStock={handleUpdateStock}
                        />
                    ) : (
                         <div className="flex items-center justify-center h-full bg-white rounded-lg shadow-md min-h-[500px]">
                            <div className="text-center p-6">
                                <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4M4 7s-1 1-1 3v4c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2v-4c0-2-1-3-1-3" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 11v6" />
                                </svg>
                                <h3 className="mt-4 text-lg font-medium text-gray-800">No Item Selected</h3>
                                <p className="mt-1 text-sm text-gray-500">Select an item from the list to view its details.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            
            {isFormModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <InventoryForm
                            item={editingItem}
                            isEditing={!!editingItem}
                            onSubmit={handleFormSubmit}
                            onCancel={() => {
                                setIsFormModalOpen(false);
                                setEditingItem(null);
                            }}
                        />
                    </div>
                </div>
            )}

            {isStockUpdateModalOpen && selectedItem && (
                 <StockUpdateModal 
                    item={selectedItem}
                    onClose={() => setIsStockUpdateModalOpen(false)} 
                    onRefresh={handleStockUpdateSuccess}
                />
            )}
        </div>
    );
};

export default Inventory;