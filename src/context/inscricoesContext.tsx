import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "./authContext";

interface InscricoesContextDados {
  torneioIds: number[];
  carregandoInscricoes: boolean;
  estaInscrito: (torneioId: number) => boolean;
  inscrever: (torneioId: number) => Promise<void>;
}

const InscricoesContext = createContext<InscricoesContextDados>({} as InscricoesContextDados);

export function InscricoesProvider({ children }: { children: ReactNode }) {
  const { usuario } = useAuth();
  const [torneioIds, setTorneioIds] = useState<number[]>([]);
  const [carregandoInscricoes, setCarregandoInscricoes] = useState(true);

  useEffect(() => {
    let ativo = true;
    async function carregar() {
      if (!usuario) {
        if (ativo) {
          setTorneioIds([]);
          setCarregandoInscricoes(false);
        }
        return;
      }

      setCarregandoInscricoes(true);
      const chave = `@TCGTorneios:inscricoes:${usuario.id}`;
      try {
        const salvo = await AsyncStorage.getItem(chave);
        if (ativo) setTorneioIds(salvo ? JSON.parse(salvo) : []);
      } catch {
        if (ativo) setTorneioIds([]);
      } finally {
        if (ativo) setCarregandoInscricoes(false);
      }
    }
    carregar();
    return () => { ativo = false; };
  }, [usuario?.id]);

  async function inscrever(torneioId: number) {
    if (!usuario || torneioIds.includes(torneioId)) return;
    const atualizados = [...torneioIds, torneioId];
    setTorneioIds(atualizados);
    await AsyncStorage.setItem(`@TCGTorneios:inscricoes:${usuario.id}`, JSON.stringify(atualizados));
  }

  return (
    <InscricoesContext.Provider value={{
      torneioIds,
      carregandoInscricoes,
      estaInscrito: (torneioId) => torneioIds.includes(torneioId),
      inscrever,
    }}>
      {children}
    </InscricoesContext.Provider>
  );
}

export function useInscricoes() {
  return useContext(InscricoesContext);
}
