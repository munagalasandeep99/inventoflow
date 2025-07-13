
import React, { useState, useEffect } from 'react';
import { InventoryItem } from '../../types';

interface InventoryFormProps {
    item?: InventoryItem | null;
    isEditing?: boolean;
    onSubmit: (data: any) => void;
    onCancel: () => void;
    isLoading?: boolean;
}

const InventoryForm: React.FC<InventoryFormProps> = ({ item, isEditing = false, onSubmit, onCancel, isLoading = false }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        quantity: 0,
        price: 0,
        category: '',
        imageUrl: ''
    });

    useEffect(() => {
        if (isEditing && item) {
            setFormData({
                name: item.name || '',
                description: item.description || '',
                quantity: item.quantity || 0,
                price: item.price || 0,
                category: item.category || '',
                imageUrl: item.imageUrl || ''
            });
        }
    }, [item, isEditing]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'quantity' ? parseInt(value, 10) || 0 :
                    name === 'price' ? parseFloat(value) || 0 : value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const submissionData = isEditing && item ? { ...formData, itemId: item.itemId } : formData;
        onSubmit(submissionData);
    };
    
    const renderInput = (id: string, label: string, type: string, props: any = {}) => (
      <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">{label}</label>
        <input
          type={type}
          id={id}
          name={id}
          {...props}
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary"
        />
      </div>
    );

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">{isEditing ? 'Edit' : 'Add'} Inventory Item</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                
                {renderInput("name", "Name", "text", { value: formData.name, onChange: handleChange, required: true, placeholder: "e.g. Wireless Mouse" })}
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary"
                    placeholder="Provide a brief description of the item"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {renderInput("quantity", "Quantity", "number", { value: formData.quantity, onChange: handleChange, min: "0", required: true })}
                    {renderInput("price", "Price (INR)", "number", { value: formData.price, onChange: handleChange, min: "0", step: "1", required: true })}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {renderInput("category", "Category", "text", { value: formData.category, onChange: handleChange, placeholder: "e.g. Electronics" })}
                    {renderInput("imageUrl", "Image URL", "url", { value: formData.imageUrl, onChange: handleChange, placeholder: "https://example.com/image.jpg" })}
                </div>

                <div className="flex justify-end gap-4 pt-4">
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={isLoading}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="px-4 py-2 bg-primary text-white font-semibold rounded-md shadow-sm hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-focus disabled:opacity-50"
                    >
                        {isLoading ? 'Processing...' : isEditing ? 'Update Item' : 'Add Item'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default InventoryForm;
