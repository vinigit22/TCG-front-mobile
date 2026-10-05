import { useEffect, useState } from "react";
import { Torneio } from "../models/types";
import { torneioService } from "../services/torneioService";

interface Resultado {
  id: number;
  torneio: Torneio | null;
  erro: boolean;
}

// torneio null depois de carregar = não encontrado
export function useTorneio(id: number) {
  const [resultado, setResultado] = useState<Resultado | null>(null);

  useEffect(() => {
    let ativo = true;

    torneioService
      .buscar(id)
      .then((torneio) => {
        if (ativo) setResultado({ id, torneio, erro: false });
      })
      .catch(() => {
        if (ativo) setResultado({ id, torneio: null, erro: true });
      });

    return () => {
      ativo = false;
    };
  }, [id]);

  // Enquanto o resultado não for deste id (primeira carga ou troca de torneio), está carregando
  const carregando = resultado?.id !== id;
  return {
    torneio: carregando ? null : resultado.torneio,
    carregando,
    erro: !carregando && resultado.erro,
  };
}
