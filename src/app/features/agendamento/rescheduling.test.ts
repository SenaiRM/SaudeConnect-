import assert from "node:assert/strict";
import test from "node:test";
import { confirmAppointment, cancelAppointmentByProfessional, confirmReschedulingAppointment, createAppointmentHistory, getReschedulingRequest, rescheduleAppointment } from "./rescheduling.ts";

test("envia o reagendamento para confirmação da secretaria", () => {
  assert.deepEqual(getReschedulingRequest("2026-11-04", "09:00", "2026-11-11", "14:30"), {
    status: "reagendamento",
    title: "Reagendamento enviado para confirmação",
    message: "Solicitação enviada: de 04/11/2026 às 09:00 para 11/11/2026 às 14:30. Aguarde a confirmação da secretaria.",
  });
});

const appointment = {
  id: "a1",
  usuarioId: "u1",
  data: "2026-11-04",
  horario: "09:00",
  status: "confirmado" as const,
};

test("registra a solicitação com data anterior e aguarda confirmação", () => {
  const result = rescheduleAppointment(appointment, "2026-11-11", "14:30", "2026-10-27T12:00:00.000Z");

  assert.deepEqual(result.appointment, { ...appointment, data: "2026-11-11", horario: "14:30", status: "reagendamento" });
  assert.deepEqual(result.event, {
    agendamentoId: "a1",
    tipo: "reagendado",
    responsavel: "usuario",
    data: "2026-10-27T12:00:00.000Z",
    anterior: { data: "2026-11-04", horario: "09:00" },
    atual: { data: "2026-11-11", horario: "14:30" },
  });
});

test("a secretaria confirma o horário solicitado e registra a decisão", () => {
  const requested = { ...appointment, data: "2026-11-11", horario: "14:30", status: "reagendamento" as const };
  const result = confirmReschedulingAppointment(requested, "2026-10-27T12:30:00.000Z");

  assert.equal(result.appointment.status, "confirmado");
  assert.deepEqual(result.event, {
    agendamentoId: "a1",
    tipo: "reagendamento_confirmado",
    responsavel: "secretaria",
    data: "2026-10-27T12:30:00.000Z",
    anterior: { status: "reagendamento" },
    atual: { data: "2026-11-11", horario: "14:30", status: "confirmado" },
  });
});

test("cancelamento pelo profissional cria aviso para o paciente e evento auditável", () => {
  const result = cancelAppointmentByProfessional(appointment, "Dra. Ana Lima", "2026-10-27T12:00:00.000Z");

  assert.equal(result.appointment.status, "cancelado");
  assert.deepEqual(result.event, {
    agendamentoId: "a1",
    tipo: "cancelado",
    responsavel: "Dra. Ana Lima",
    data: "2026-10-27T12:00:00.000Z",
    anterior: { status: "confirmado" },
    atual: { status: "cancelado" },
  });
  assert.deepEqual(result.notification, {
    usuarioId: "u1",
    agendamentoId: "a1",
    titulo: "Agendamento cancelado pelo profissional",
    mensagem: "Seu agendamento de 04/11/2026 às 09:00 foi cancelado por Dra. Ana Lima. Escolha um novo horário quando puder.",
    tipo: "cancelamento",
  });
});

test("guarda a criação para que o agendamento feito pelo paciente apareça no histórico compartilhado", () => {
  assert.deepEqual(createAppointmentHistory(appointment, "2026-10-27T12:00:00.000Z"), {
    agendamentoId: "a1",
    tipo: "criado",
    responsavel: "usuário",
    data: "2026-10-27T12:00:00.000Z",
    anterior: {},
    atual: { data: "2026-11-04", horario: "09:00", status: "confirmado" },
  });
});

test("a secretaria confirma um agendamento pendente e registra a decisão", () => {
  const appointment = { id: "a1", usuarioId: "u1", data: "2026-11-04", horario: "09:00", status: "pendente" };

  const result = confirmAppointment(appointment, "2026-10-28T12:00:00.000Z");

  assert.equal(result.appointment.status, "confirmado");
  assert.deepEqual(result.event, {
    agendamentoId: "a1",
    tipo: "confirmado",
    responsavel: "secretaria",
    data: "2026-10-28T12:00:00.000Z",
    anterior: { status: "pendente" },
    atual: { data: "2026-11-04", horario: "09:00", status: "confirmado" },
  });
});

test("confirmar duas vezes não muda nada na segunda", () => {
  const appointment = { id: "a1", usuarioId: "u1", data: "2026-11-04", horario: "09:00", status: "confirmado" };

  assert.equal(confirmAppointment(appointment, "2026-10-28T12:00:00.000Z"), null);
});
