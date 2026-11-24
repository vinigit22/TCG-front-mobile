import React from "react";
import { Medidor } from "./ui/Medidor";

interface VagasProps {
  vagasMax: number;
  vagasDisponiveis: number;
}

// Vagas do torneio no medidor do web (ocupadas/total)
export function Vagas({ vagasMax, vagasDisponiveis }: VagasProps) {
  return <Medidor ocupadas={Math.max(0, vagasMax - vagasDisponiveis)} total={vagasMax} />;
}
