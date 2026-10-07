import React, { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "./authContext";
import { Inscricao, Torneio } from "../models/types";
import { inscricaoService } from "../services/inscricaoService";

interface InscricoesContextDados {
  // Inscrições que não foram canceladas, cada uma com o seu torneio
  inscricoesAtivas: Inscricao[];
  // Torneios dessas inscrições (vêm junto da inscrição, então aparecem mesmo fora da vitrine)
  torneiosInscritos: Torneio[];
  carregandoInscricoes: boolean;
  inscricaoDoTorneio: (torneioId: number) => Inscricao | undefined;
  estaInscrito: (torneioId: number) => boolean;
  // Lançam erro com a mensagem do backend para a tela mostrar
  inscrever: (torneio: Torneio) => Promise<Inscricao>;
  cancelar: (torneioId: number) => Promise<void>;
  recarregar: () => Promise<void>;
}

// Lista carregada e de qual usuário ela é (ao trocar de conta, a lista antiga deixa de valer)
interface Carregadas {
  usuarioId: number;
  inscricoes: Inscricao[];
}

const InscricoesContext = createContext<InscricoesContextDados>({} as InscricoesContextDados);

function listarSemFalhar(usuarioId: number) {
  return inscricaoService.listarMinhas(usuarioId).catch(() => [] as Inscricao[]);
}

export function InscricoesProvider({ children }: { children: ReactNode }) {
  const { usuario } = useAuth();
  const usuarioId = usuario?.id;
  const [carregadas, setCarregadas] = useState<Carregadas | null>(null);

  useEffect(() => {
    if (usuarioId === undefined) return;

    let ativo = true;
    listarSemFalhar(usuarioId).then((inscricoes) => {
      if (ativo) setCarregadas({ usuarioId, inscricoes });
    });

    return () => {
      ativo = false;
    };
  }, [usuarioId]);

  const recarregar = useCallback(async () => {
    if (usuarioId === undefined) return;
    const inscricoes = await listarSemFalhar(usuarioId);
    setCarregadas({ usuarioId, inscricoes });
  }, [usuarioId]);

  const daContaAtual = usuarioId !== undefined && carregadas?.usuarioId === usuarioId;
  const carregandoInscricoes = usuarioId !== undefined && !daContaAtual;

  const inscricoesAtivas = useMemo(
    () => (daContaAtual ? carregadas.inscricoes.filter((inscricao) => inscricao.status !== "CANCELADO") : []),
    [daContaAtual, carregadas]
  );

  const torneiosInscritos = useMemo(
    () =>
      inscricoesAtivas
        .map((inscricao) => inscricao.torneio)
        .filter((torneio): torneio is Torneio => torneio !== undefined),
    [inscricoesAtivas]
  );

  function inscricaoDoTorneio(torneioId: number) {
    return inscricoesAtivas.find((inscricao) => inscricao.torneioId === torneioId);
  }

  function substituir(usuarioDaInscricao: number, nova: Inscricao) {
    setCarregadas((atuais) => {
      const anteriores = atuais?.usuarioId === usuarioDaInscricao ? atuais.inscricoes : [];
      return {
        usuarioId: usuarioDaInscricao,
        inscricoes: [...anteriores.filter((item) => item.torneioId !== nova.torneioId), nova],
      };
    });
  }

  async function inscrever(torneio: Torneio) {
    if (usuarioId === undefined) {
      throw new Error("Entre na sua conta para se inscrever");
    }
    const nova = await inscricaoService.inscrever(usuarioId, torneio);
    substituir(usuarioId, nova);
    return nova;
  }

  async function cancelar(torneioId: number) {
    const inscricao = inscricaoDoTorneio(torneioId);
    if (usuarioId === undefined || !inscricao) return;
    substituir(usuarioId, await inscricaoService.cancelar(usuarioId, inscricao));
  }

  return (
    <InscricoesContext.Provider
      value={{
        inscricoesAtivas,
        torneiosInscritos,
        carregandoInscricoes,
        inscricaoDoTorneio,
        estaInscrito: (torneioId) => inscricaoDoTorneio(torneioId) !== undefined,
        inscrever,
        cancelar,
        recarregar,
      }}
    >
      {children}
    </InscricoesContext.Provider>
  );
}

export function useInscricoes() {
  return useContext(InscricoesContext);
}
