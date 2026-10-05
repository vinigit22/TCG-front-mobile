import { Inscricao } from "../models/types";

// Inscrições iniciais do modo mock. O usuário padrão (id 1, vinimarques) já está na Copa Bela Vista,
// que está em andamento e aparece no chaveamento mock.
export const inscricoesMock: Omit<Inscricao, "torneio">[] = [
  {
    id: 1,
    torneioId: 4,
    jogadorId: 1,
    status: "CONFIRMADO",
    pagamentoStatus: "ISENTO",
    inscritoEm: "2026-09-15T10:00:00",
    checkInEm: "2026-09-20T18:30:00",
  },
];
