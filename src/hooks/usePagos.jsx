import { useState, useEffect, useCallback } from 'react';
import { pagosService, getTurnosParaPago } from '../services/pagos.service';

export const usePagos = () => {
  const [items, setItems] = useState([]);
  const [turnos, setTurnos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    const result = await pagosService.getAll();
    if (result.success) {
      setItems(result.data);
    } else {
      setError(result.error);
    }
    setLoading(false);
  }, []);

  const loadTurnos = useCallback(async () => {
    const result = await getTurnosParaPago();
    if (result.success) {
      setTurnos(result.data);
    }
  }, []);

  const createItem = useCallback(async (data) => {
    setLoading(true);
    const result = await pagosService.create(data);
    if (result.success) {
      await loadItems();
    }
    setLoading(false);
    return result;
  }, [loadItems]);

  const updateItem = useCallback(async (id, data) => {
    setLoading(true);
    const result = await pagosService.update(id, data);
    if (result.success) {
      await loadItems();
    }
    setLoading(false);
    return result;
  }, [loadItems]);

  const deleteItem = useCallback(async (id) => {
    setLoading(true);
    const result = await pagosService.delete(id);
    if (result.success) {
      await loadItems();
    }
    setLoading(false);
    return result;
  }, [loadItems]);

  useEffect(() => {
    loadItems();
    loadTurnos();
  }, [loadItems, loadTurnos]);

  return {
    items,
    turnos,
    loading,
    error,
    createItem,
    updateItem,
    deleteItem,
    refresh: loadItems,
  };
};