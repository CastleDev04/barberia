import { useState, useEffect, useCallback } from 'react';
import { turnosService, getClientesDisponibles, getBarberosDisponibles, getServiciosDisponibles } from '../services/turnos.service';

export const useTurnos = () => {
  const [items, setItems] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [barberos, setBarberos] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    const result = await turnosService.getAll();
    if (result.success) {
      setItems(result.data);
    } else {
      setError(result.error);
    }
    setLoading(false);
  }, []);

  const loadClientes = useCallback(async () => {
    const result = await getClientesDisponibles();
    if (result.success) {
      setClientes(result.data);
    }
  }, []);

  const loadBarberos = useCallback(async () => {
    const result = await getBarberosDisponibles();
    if (result.success) {
      setBarberos(result.data);
    }
  }, []);

  const loadServicios = useCallback(async () => {
    const result = await getServiciosDisponibles();
    if (result.success) {
      setServicios(result.data);
    }
  }, []);

  const createItem = useCallback(async (data) => {
    setLoading(true);
    const result = await turnosService.create(data);
    if (result.success) {
      await loadItems();
    }
    setLoading(false);
    return result;
  }, [loadItems]);

  const cancelItem = useCallback(async (id) => {
    setLoading(true);
    const result = await turnosService.cancel(id);
    if (result.success) {
      await loadItems();
    }
    setLoading(false);
    return result;
  }, [loadItems]);

  const deleteItem = useCallback(async (id) => {
    setLoading(true);
    const result = await turnosService.delete(id);
    if (result.success) {
      await loadItems();
    }
    setLoading(false);
    return result;
  }, [loadItems]);

  const updateEstado = useCallback(async (id, estado) => {
    setLoading(true);
    const result = await turnosService.updateEstado(id, estado);
    if (result.success) {
      await loadItems();
    }
    setLoading(false);
    return result;
  }, [loadItems]);

  useEffect(() => {
    loadItems();
    loadClientes();
    loadBarberos();
    loadServicios();
  }, [loadItems, loadClientes, loadBarberos, loadServicios]);

  return {
    items,
    clientes,
    barberos,
    servicios,
    loading,
    error,
    createItem,
    cancelItem,
    deleteItem,
    updateEstado,  
    refresh: loadItems,
  };
};