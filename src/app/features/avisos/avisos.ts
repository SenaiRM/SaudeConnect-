export type Papel = "usuario" | "secretaria";

type AvisoLike = {
  id: string;
  lida: boolean;
  usuarioId?: string;
  instituicaoId?: string;
  destinatario?: string;
};

export interface ContextoDeLeitura {
  papel: Papel;
  usuarioId?: string;
  /** Unidade da secretaria; ausente significa "todas", usado só em telas de visão geral. */
  instituicaoId?: string;
}

/** Sufixo aleatório por gerador, para duas abas nunca produzirem o mesmo id. */
function sufixoDeSessao() {
  return Math.random().toString(36).slice(2, 8);
}

/**
 * Cria ids únicos e estáveis.
 *
 * `Date.now()` repetia quando duas ações caíam no mesmo milissegundo, e um
 * contador simples colidiria entre abas e com os ids já existentes.
 */
export function criarGeradorDeId(prefixo: string, existentes: string[] = []) {
  const usados = new Set(existentes);
  const sessao = sufixoDeSessao();
  let sequencia = 0;

  return function gerar(): string {
    let id = "";
    do {
      sequencia += 1;
      id = `${prefixo}${Date.now().toString(36)}${sessao}${sequencia}`;
    } while (usados.has(id));
    usados.add(id);
    return id;
  };
}

/**
 * Quais avisos este papel pode ler.
 *
 * Estrito de propósito: antes, um aviso sem `destinatario` aparecia para os dois
 * papéis, e um sem `usuarioId` era entregue a qualquer paciente.
 */
export function filtrarPorPapel<T extends AvisoLike>(avisos: T[], contexto: ContextoDeLeitura): T[] {
  return avisos.filter((aviso) => {
    if (contexto.papel === "secretaria") {
      if (aviso.destinatario !== "secretaria") return false;
      if (!contexto.instituicaoId || !aviso.instituicaoId) return !contexto.instituicaoId;
      return aviso.instituicaoId === contexto.instituicaoId;
    }
    return aviso.destinatario === "paciente" && Boolean(aviso.usuarioId) && aviso.usuarioId === contexto.usuarioId;
  });
}

/** Marca como lidos apenas os avisos que este papel realmente enxerga. */
export function marcarTodasLidas<T extends AvisoLike>(avisos: T[], visiveis: AvisoLike[]): T[] {
  const alcance = new Set(visiveis.map((aviso) => aviso.id));
  return avisos.map((aviso) => (alcance.has(aviso.id) ? { ...aviso, lida: true } : aviso));
}
