/** Versão do texto aceito, gravada junto com o agendamento. */
export const TERMOS_VERSAO = "2026-10-v1";

export const TERMOS_TEXTO = [
  "Confirmo que os dados informados (nome, telefone e documento) são meus e estão corretos.",
  "Estou ciente de que devo chegar com 15 minutos de antecedência, levando documento com foto e cartão do convênio, quando houver.",
  "Estou ciente de que, em caso de exame, o preparo indicado (como jejum) é obrigatório e que o não cumprimento pode impedir a realização.",
  "Comprometo-me a avisar com pelo menos 24 horas de antecedência caso não possa comparecer, para que o horário seja liberado a outro paciente.",
  "Autorizo o compartilhamento dos meus dados com a unidade de saúde escolhida, exclusivamente para a realização deste atendimento.",
  "Estou ciente de que este pedido depende da confirmação da secretaria da unidade.",
];

export interface AceiteDeTermos {
  aceito: true;
  aceitoEm: string;
  versao: string;
}

/** Registra o aceite no momento em que o paciente confirma. */
export function registrarAceite(agora = new Date()): AceiteDeTermos {
  return { aceito: true, aceitoEm: agora.toISOString(), versao: TERMOS_VERSAO };
}

/** O agendamento só pode ser enviado depois do aceite explícito. */
export function podeConfirmar(aceitou: boolean): boolean {
  return aceitou === true;
}
