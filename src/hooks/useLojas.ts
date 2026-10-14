import { useCallback, useState } from "react";
import { useFocusEffect } from "expo-router";
import { Loja } from "../models/types";
import { lojaService } from "../services/lojaService";
export function useLojas() {
  const [lojas, setLojas] = useState<Loja[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<unknown>(null);
  useFocusEffect(useCallback(() => { let ativa = true; setCarregando(true); lojaService.listar().then(dados => ativa && setLojas(dados)).catch(causa => ativa && setErro(causa)).finally(() => ativa && setCarregando(false)); return () => { ativa = false; }; }, []));
  return { lojas, carregando, erro };
}