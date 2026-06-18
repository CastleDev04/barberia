import { useState, useEffect, useCallback } from 'react';
import { gastosService } from '../services/gastos.service';

export const useGastos = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    const result = await gastosService.getAll();
    if (result.success) {
      setItems(result.data);
    } else {
      setError(result.error);
    }
    setLoading(false);
  }, []);

  const createItem = useCallback(async (data) => {
    setLoading(true);
    const result = await gastosService.create(data);
    if (result.success) {
      await loadItems();
    }
    setLoading(false);
    return result;
  }, [loadItems]);

  const updateItem = useCallback(async (id, data) => {
    setLoading(true);
    const result = await gastosService.update(id, data);
    if (result.success) {
      await loadItems();
    }
    setLoading(false);
    return result;
  }, [loadItems]);

  const deleteItem = useCallback(async (id) => {
    setLoading(true);
    const result = await gastosService.delete(id);
    if (result.success) {
      await loadItems();
    }
    setLoading(false);
    return result;
  }, [loadItems]);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  return {
    items,
    loading,
    error,
    createItem,
    updateItem,
    deleteItem,
    refresh: loadItems,
  };
};