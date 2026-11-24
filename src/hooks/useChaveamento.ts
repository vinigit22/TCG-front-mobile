import { useEffect, useState } from "react";
import { Chaveamento } from "../models/types";
import { torneioService } from "../services/torneioService";

interface Resultado {
  torneioId: number;
  partidas: Chaveamento[];
  erro: boolean;
}

export function useChaveamento(torneioId: number, intervaloMs?: number) {
  const [resultado, setResultado] = useState<Resultado | null>(null);

  useEffect(() => {
    let ativo = true;

    const carregar = () =>
      torneioService
        .listarChaveamento(torneioId)
        .then((partidas) => {
          if (ativo) setResultado({ torneioId, partidas, erro: false });
        })
        .catch(() => {
          if (!ativo) return;
          setResultado((atual) =>
            atual && atual.torneioId === torneioId && !atual.erro ? atual : { torneioId, partidas: [], erro: true }
          );
        });

    carregar();
    const intervalo = intervaloMs ? setInterval(carregar, intervaloMs) : null;

    return () => {
      ativo = false;
      if (intervalo) clearInterval(intervalo);
    };
  }, [torneioId, intervaloMs]);

  const carregando = resultado?.torneioId !== torneioId;
  return {
    partidas: carregando ? [] : resultado.partidas,
    carregando,
    erro: !carregando && resultado.erro,
  };
}