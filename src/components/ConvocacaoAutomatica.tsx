import { useEffect, useRef } from "react";
import { usePathname, useRootNavigationState, useRouter } from "expo-router";
import { useAuth } from "../context/authContext";
import { partidaService } from "../services/partidaService";

const INTERVALO_VERIFICACAO = 4000;

// Quando a loja chama o jogador para a mesa, abre sozinha a tela verde de confirmar presença,
// em qualquer lugar do app. Cada convocação (partida + prazo) abre a tela uma vez só: se o jogador
// fechar a tela, ele ainda confirma pelo botão da partida, e uma nova chamada da loja abre de novo.
export function ConvocacaoAutomatica() {
  const { usuario } = useAuth();
  const router = useRouter();
  const navegacao = useRootNavigationState();
  const caminho = usePathname();
  const caminhoAtual = useRef(caminho);
  const jaAbertas = useRef<Set<string>>(new Set());

  useEffect(() => {
    caminhoAtual.current = caminho;
  }, [caminho]);
  const usuarioId = usuario?.id;
  const navegacaoPronta = !!navegacao?.key;

  useEffect(() => {
    if (usuarioId === undefined || !navegacaoPronta) return;
    let ativo = true;

    const verificar = async () => {
      try {
        const convocacao = await partidaService.convocacaoPendente();
        if (!ativo || !convocacao) return;

        const chave = `${convocacao.partidaId}:${convocacao.checkInExpiraEm}`;
        if (jaAbertas.current.has(chave)) return;
        jaAbertas.current.add(chave);

        // Já está na tela dessa partida (abriu pela notificação): não empilha outra
        if (caminhoAtual.current.startsWith(`/check-in/${convocacao.partidaId}`)) return;
        router.push(`/check-in/${convocacao.partidaId}` as never);
      } catch {
        // sem rede ou sessão expirada: tenta de novo no próximo ciclo
      }
    };

    verificar();
    const intervalo = setInterval(verificar, INTERVALO_VERIFICACAO);
    return () => {
      ativo = false;
      clearInterval(intervalo);
    };
  }, [usuarioId, navegacaoPronta, router]);

  return null;
}
