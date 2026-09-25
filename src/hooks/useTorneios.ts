import { useEffect, useState } from "react";
import { Torneio } from "../models/types";
import { torneiosMock } from "../mocks/torneios";

interface EstadoTorneios {
  torneios: Torneio[];
  carregando: boolean;
  erro: boolean;
}

export function useTorneios() {
  const [estado, setEstado] = useState<EstadoTorneios>({
    torneios: [],
    carregando: true,
    erro: false,
  });

  useEffect(() => {
    let ativo = true;
    setEstado((atual) => ({ ...atual, carregando: true, erro: false }));

    const tempo = setTimeout(() => {
      if (ativo) {
        setEstado({ torneios: torneiosMock, carregando: false, erro: false });
      }
    }, 350);

    return () => {
      ativo = false;
      clearTimeout(tempo);
    };
  }, []);

  return estado;
}
