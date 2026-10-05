import { useEffect, useState } from "react";
import { Chaveamento } from "../models/types";
import { torneioService } from "../services/torneioService";

interface Resultado {
  torneioId: number;
  partidas: Chaveamento[];
  erro: boolean;
}

// partidas vazia depois de carregar = a chave ainda não foi gerada
export function useChaveamento(torneioId: number) {
  const [resultado, setResultado] = useState<Resultado | null>(null);

  useEffect(() => {
    let ativo = true;

    torneioService
      .listarChaveamento(torneioId)
      .then((partidas) => {
        if (ativo) setResultado({ torneioId, partidas, erro: false });
      })
      .catch(() => {
        if (ativo) setResultado({ torneioId, partidas: [], erro: true });
      });

    return () => {
      ativo = false;
    };
  }, [torneioId]);

  // Enquanto o resultado não for deste torneio (primeira carga ou troca de torneio), está carregando
  const carregando = resultado?.torneioId !== torneioId;
  return {
    partidas: carregando ? [] : resultado.partidas,
    carregando,
    erro: !carregando && resultado.erro,
  };
}
