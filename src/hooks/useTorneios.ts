import { useEffect, useState } from "react";
import { Torneio } from "../models/types";
import { torneioService } from "../services/torneioService";

interface EstadoTorneios {
  torneios: Torneio[];
  carregando: boolean;
  erro: boolean;
}

// Vitrine de torneios
export function useTorneios() {
  const [estado, setEstado] = useState<EstadoTorneios>({
    torneios: [],
    carregando: true,
    erro: false,
  });

  useEffect(() => {
    let ativo = true;

    torneioService
      .listar()
      .then((torneios) => {
        if (ativo) setEstado({ torneios, carregando: false, erro: false });
      })
      .catch(() => {
        if (ativo) setEstado({ torneios: [], carregando: false, erro: true });
      });

    return () => {
      ativo = false;
    };
  }, []);

  return estado;
}
