import { useState, useEffect, useCallback } from 'react';
import { horariosService, getBarberosDisponibles } from '../services/horarios.service';

export const useHorarios = () => {
  const [items, setItems] = useState([]);
  const [barberos, setBarberos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    const result = await horariosService.getAll();
    if (result.success) {
      setItems(result.data);
    } else {
      setError(result.error);
    }
    setLoading(false);
  }, []);

  const loadBarberos = useCallback(async () => {
    const result = await getBarberosDisponibles();
    if (result.success) {
      setBarberos(result.data);
    }
  }, []);

  const createItem = useCallback(async (data) => {
    setLoading(true);
    const result = await horariosService.create(data);
    if (result.success) {
      await loadItems();
    }
    setLoading(false);
    return result;
  }, [loadItems]);

  const updateItem = useCallback(async (id, data) => {
    setLoading(true);
    const result = await horariosService.update(id, data);
    if (result.success) {
      await loadItems();
    }
    setLoading(false);
    return result;
  }, [loadItems]);

  const deleteItem = useCallback(async (id) => {
    setLoading(true);
    const result = await horariosService.delete(id);
    if (result.success) {
      await loadItems();
    }
    setLoading(false);
    return result;
  }, [loadItems]);

  useEffect(() => {
    loadItems();
    loadBarberos();
  }, [loadItems, loadBarberos]);

  return {
    items,
    barberos,
    loading,
    error,
    createItem,
    updateItem,
    deleteItem,
    refresh: loadItems,
  };
};