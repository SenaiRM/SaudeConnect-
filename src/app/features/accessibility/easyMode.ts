/** Conteúdo reduzido para evitar excesso de escolhas no Modo Fácil. */
export function getEasyModeTabs() {
  return ["Próximos", "Histórico"] as const;
}

export function getEasyModeServices(services: string[]) {
  return services.slice(0, 1);
}
