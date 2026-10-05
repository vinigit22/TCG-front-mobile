import { EstatisticasJogador } from "../models/types";

// Troféus do modo mock: o usuário padrão (id 1) tem alguns, os demais começam zerados
export function trofeusMock(jogadorId: number): EstatisticasJogador {
  if (jogadorId === 1) {
    return { jogadorId, ouro: 1, prata: 0, bronze: 1, torneiosDisputados: 4 };
  }
  return { jogadorId, ouro: 0, prata: 0, bronze: 0, torneiosDisputados: 0 };
}
