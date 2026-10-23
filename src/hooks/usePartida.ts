import { useEffect, useState } from "react";
import { PartidaDetalhe, partidaService } from "../services/partidaService";

export function usePartida(partidaId: number | undefined, intervaloMs = 10000) {
  const [partida, setPartida] = useState<PartidaDetalhe | null>(null);

  useEffect(() => {
    if (partidaId === undefined) return;
    let ativo = true;

    const carregar = () =>
      partidaService
        .buscar(partidaId)
        .then((dados) => {
          if (ativo) setPartida(dados);
        })
        .catch(() => undefined);

    carregar();
    const intervalo = setInterval(carregar, intervaloMs);

    return () => {
      ativo = false;
      clearInterval(intervalo);
    };
  }, [partidaId, intervaloMs]);

  return partida && partida.id === partidaId ? partida : null;
}