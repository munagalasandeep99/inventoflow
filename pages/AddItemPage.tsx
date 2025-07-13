import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InventoryForm from '../components/inventory/InventoryForm';
import { InventoryItem } from '../types';
import { createItem } from '../services/api';

const AddItemPage: React.FC = () => {
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleAddItem = async (formData: Omit<InventoryItem, 'itemId' | 'createdAt' | 'updatedAt'>) => {
        setIsLoading(true);
        setError(null);
        try {
            await createItem(formData);
            navigate('/app/inventory');
        } catch (err) {
            setError('Failed to create item. Please try again.');
            console.error(err);
            setIsLoading(false);
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Add New Item</h1>
            <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl mx-auto">
                 {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                        <span className="block sm:inline">{error}</span>
                    </div>
                )}
                <InventoryForm 
                    onSubmit={handleAddItem} 
                    onCancel={() => navigate('/app/inventory')}
                    isLoading={isLoading}
                />
            </div>
        </div>
    );
};

export default AddItemPage;