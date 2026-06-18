import { useState, useEffect, useCallback } from 'react';
import { barberosService } from '../services/barberos.service';

export const useBarberos = () => {
  const [barberos, setBarberos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadBarberos = useCallback(async () => {
    setLoading(true);
    setError(null);
    const result = await barberosService.getAll();
    if (result.success) {
      setBarberos(result.data);
    } else {
      setError(result.error);
    }
    setLoading(false);
  }, []);

  const createBarbero = useCallback(async (barberoData) => {
    setLoading(true);
    const result = await barberosService.create(barberoData);
    if (result.success) {
      await loadBarberos();
    }
    setLoading(false);
    return result;
  }, [loadBarberos]);

  const updateBarbero = useCallback(async (id, barberoData) => {
    setLoading(true);
    const result = await barberosService.update(id, barberoData);
    if (result.success) {
      await loadBarberos();
    }
    setLoading(false);
    return result;
  }, [loadBarberos]);

  const deleteBarbero = useCallback(async (id) => {
    setLoading(true);
    const result = await barberosService.delete(id);
    if (result.success) {
      await loadBarberos();
    }
    setLoading(false);
    return result;
  }, [loadBarberos]);

  useEffect(() => {
    loadBarberos();
  }, [loadBarberos]);

  return {
    barberos,
    loading,
    error,
    createBarbero,
    updateBarbero,
    deleteBarbero,
    refreshBarberos: loadBarberos,
  };
};