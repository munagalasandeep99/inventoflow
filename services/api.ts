import { InventoryItem } from '../types';
import { userPool } from '../cognito-config';

const API_ENDPOINT = 'https://xe11sqsoyk.execute-api.us-east-1.amazonaws.com';

const getAuthHeader = async (): Promise<HeadersInit> => {
  return new Promise((resolve) => {
    const cognitoUser = userPool.getCurrentUser();
    if (!cognitoUser) {
      return resolve({});
    }

    cognitoUser.getSession((err: Error | null, session: any) => {
      if (err || !session || !session.isValid()) {
        return resolve({});
      }
      const token = session.getIdToken().getJwtToken();
      resolve({
        'Authorization': `Bearer ${token}`
      });
    });
  });
};


// Fetch all inventory items
export async function fetchItems(): Promise<InventoryItem[]> {
  const authHeader = await getAuthHeader();
  try {
    const response = await fetch(`${API_ENDPOINT}/items`, {
       headers: { ...authHeader, 'Content-Type': 'application/json' },
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `API error: ${response.status}`);
    }
    
    const data = await response.json();
    if (data && Array.isArray(data.Items)) return data.Items;
    if (data && Array.isArray(data.items)) return data.items;
    if (Array.isArray(data)) return data;
    
    console.warn('Fetched items data is not in an expected format:', data);
    return [];
  } catch (error) {
    console.error('Error fetching items:', error);
    throw error;
  }
}

// Fetch a single inventory item
export async function fetchItem(itemId: string): Promise<InventoryItem> {
   const authHeader = await getAuthHeader();
  try {
    const response = await fetch(`${API_ENDPOINT}/items?itemId=${itemId}`, {
       headers: { ...authHeader, 'Content-Type': 'application/json' },
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching item ${itemId}:`, error);
    throw error;
  }
}

// Create a new inventory item
export async function createItem(itemData: Omit<InventoryItem, 'itemId' | 'createdAt' | 'updatedAt'>): Promise<any> {
   const authHeader = await getAuthHeader();
  try {
    const response = await fetch(`${API_ENDPOINT}/items`, {
      method: 'POST',
      headers: { ...authHeader, 'Content-Type': 'application/json' },
      body: JSON.stringify(itemData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating item:', error);
    throw error;
  }
}

// Update an existing inventory item
export async function updateItem(itemData: Partial<InventoryItem> & { itemId: string }): Promise<any> {
  const authHeader = await getAuthHeader();
  try {
    const response = await fetch(`${API_ENDPOINT}/items`, {
      method: 'PUT',
      headers: { ...authHeader, 'Content-Type': 'application/json' },
      body: JSON.stringify(itemData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error updating item ${itemData.itemId}:`, error);
    throw error;
  }
}

// Delete an inventory item
export async function deleteItem(itemId: string): Promise<any> {
  const authHeader = await getAuthHeader();
  try {
    const response = await fetch(`${API_ENDPOINT}/items?itemId=${itemId}`, {
      method: 'DELETE',
      headers: { ...authHeader },
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error deleting item ${itemId}:`, error);
    throw error;
  }
}