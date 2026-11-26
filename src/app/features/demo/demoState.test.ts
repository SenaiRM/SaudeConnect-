import assert from "node:assert/strict";
import test from "node:test";

import { DEMO_STATE_KEY, LEGACY_DEMO_STATE_KEY, migrateDemoState, rebaseDemoAppointments } from "./demoState.ts";

test("a chave do estado é versionada e separada da anterior", () => {
  assert.equal(DEMO_STATE_KEY, "saudeconnect-demo-state-v2");
  assert.equal(LEGACY_DEMO_STATE_KEY, "saudeconnect-demo-state-v1");
});

test("migração troca o destinatário admin por secretaria", () => {
  const migrado = migrateDemoState({
    agendamentos: [],
    notificacoes: [
      { id: "n1", titulo: "t", mensagem: "m", tipo: "info", data: "2026-01-01", lida: false, destinatario: "admin" },
      { id: "n2", titulo: "t", mensagem: "m", tipo: "info", data: "2026-01-01", lida: false, destinatario: "paciente" },
    ],
    historicoAgendamentos: [],
  });

  assert.equal(migrado.notificacoes[0].destinatario, "secretaria");
  assert.equal(migrado.notificacoes[1].destinatario, "paciente");
});

test("migração normaliza o responsável gravado no histórico", () => {
  const migrado = migrateDemoState({
    agendamentos: [],
    notificacoes: [],
    historicoAgendamentos: [
      { agendamentoId: "a1", tipo: "criado", responsavel: "usuário", data: "2026-01-01", anterior: {}, atual: {} },
      { agendamentoId: "a2", tipo: "reagendamento_confirmado", responsavel: "admin", data: "2026-01-01", anterior: {}, atual: {} },
    ],
  });

  assert.equal(migrado.historicoAgendamentos[0].responsavel, "usuario");
  assert.equal(migrado.historicoAgendamentos[1].responsavel, "secretaria");
});

test("migração é idempotente", () => {
  const entrada = {
    agendamentos: [],
    notificacoes: [{ id: "n1", titulo: "t", mensagem: "m", tipo: "info", data: "2026-01-01", lida: false, destinatario: "admin" }],
    historicoAgendamentos: [],
  };

  assert.deepEqual(migrateDemoState(migrateDemoState(entrada)), migrateDemoState(entrada));
});

test("migração rejeita conteúdo inválido devolvendo null", () => {
  assert.equal(migrateDemoState(null), null);
  assert.equal(migrateDemoState({ agendamentos: "nao é lista" }), null);
});

test("agendamentos ativos vencidos são trazidos para a frente preservando o intervalo", () => {
  const agendamentos = [
    { id: "a1", data: "2026-10-20", horario: "09:00", status: "confirmado" },
    { id: "a2", data: "2026-10-23", horario: "10:00", status: "pendente" },
  ];

  const rebased = rebaseDemoAppointments(agendamentos, new Date(2026, 9, 28));

  assert.equal(rebased[0].data, "2026-10-29");
  assert.equal(rebased[1].data, "2026-11-01");
});

test("agendamentos encerrados e os que já estão no futuro não são movidos", () => {
  const agendamentos = [
    { id: "a1", data: "2026-10-20", horario: "09:00", status: "realizado" },
    { id: "a2", data: "2026-10-21", horario: "10:00", status: "cancelado" },
    { id: "a3", data: "2026-11-10", horario: "08:00", status: "confirmado" },
  ];

  const rebased = rebaseDemoAppointments(agendamentos, new Date(2026, 9, 28));

  assert.deepEqual(rebased.map((a) => a.data), ["2026-10-20", "2026-10-21", "2026-11-10"]);
});

test("migração descarta registros que derrubariam a tela (tipo desconhecido ou incompleto)", () => {
  const migrado = migrateDemoState({
    agendamentos: [],
    notificacoes: [{ id: "n1", titulo: "t", mensagem: "m", tipo: "novidade", data: "2026-01-01", lida: false, destinatario: "paciente" }],
    historicoAgendamentos: [
      { agendamentoId: "a1", tipo: "criado", responsavel: "usuario", data: "2026-01-01", anterior: {}, atual: {} },
      { agendamentoId: "a1", tipo: "remarcado", responsavel: "usuario", data: "2026-01-01", anterior: {}, atual: {} },
      { agendamentoId: "a1", tipo: "cancelado", responsavel: "usuario", data: "2026-01-01" },
      null,
    ],
  });

  assert.equal(migrado.notificacoes[0].tipo, "info");
  assert.equal(migrado.historicoAgendamentos.length, 1);
  assert.equal(migrado.historicoAgendamentos[0].tipo, "criado");
});
