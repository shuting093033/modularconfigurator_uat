import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Assembly {
  id: string;
  name: string;
  description?: string;
  total_material_cost: number;
  total_labor_cost: number;
  labor_hours: number;
  created_at: string;
  updated_at: string;
  user_id?: string;
}

export const useAssemblyRefresh = () => {
  const [assemblies, setAssemblies] = useState<Assembly[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadAssemblies = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('assemblies')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAssemblies(data || []);
    } catch (error) {
      console.error('Error loading assemblies:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addAssembly = useCallback((newAssembly: Assembly) => {
    setAssemblies(prev => [newAssembly, ...prev]);
  }, []);

  const refreshAssemblies = useCallback(() => {
    loadAssemblies();
  }, [loadAssemblies]);

  return {
    assemblies,
    isLoading,
    loadAssemblies,
    addAssembly,
    refreshAssemblies
  };
};