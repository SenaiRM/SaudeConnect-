from pathlib import Path

from docx import Document
from docx.enum.section import WD_SECTION
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Cm, Pt, RGBColor


OUT = Path(__file__).resolve().parents[1] / "docs" / "Apresentacao_Sprint_2_SaudeConnect.docx"
TEAL = "087E8B"
NAVY = "243746"
MUTED = "607985"
PALE = "EAF5F6"
LIGHT = "F4F9FA"
WHITE = "FFFFFF"


def shade(cell, color):
    tc_pr = cell._tc.get_or_add_tcPr()
    fill = OxmlElement("w:shd")
    fill.set(qn("w:fill"), color)
    tc_pr.append(fill)


def set_cell_margins(cell, top=120, start=140, bottom=120, end=140):
    tc = cell._tc
    tc_pr = tc.get_or_add_tcPr()
    mar = tc_pr.first_child_found_in("w:tcMar")
    if mar is None:
        mar = OxmlElement("w:tcMar")
        tc_pr.append(mar)
    for side, value in (("top", top), ("start", start), ("bottom", bottom), ("end", end)):
        node = mar.find(qn(f"w:{side}"))
        if node is None:
            node = OxmlElement(f"w:{side}")
            mar.append(node)
        node.set(qn("w:w"), str(value))
        node.set(qn("w:type"), "dxa")


def set_repeat_table_header(row):
    tr_pr = row._tr.get_or_add_trPr()
    tbl_header = OxmlElement("w:tblHeader")
    tbl_header.set(qn("w:val"), "true")
    tr_pr.append(tbl_header)


def add_text(paragraph, text, size=11, bold=False, color=NAVY, italic=False):
    run = paragraph.add_run(text)
    run.font.name = "Aptos"
    run._element.rPr.rFonts.set(qn("w:eastAsia"), "Aptos")
    run.font.size = Pt(size)
    run.bold = bold
    run.italic = italic
    run.font.color.rgb = RGBColor.from_string(color)
    return run


def add_title(doc, title, subtitle=None):
    p = doc.add_paragraph(style="Title")
    p.alignment = WD_ALIGN_PARAGRAPH.LEFT
    p.paragraph_format.space_after = Pt(8)
    add_text(p, title, size=29, bold=True, color="000000")
    if subtitle:
        p = doc.add_paragraph()
        p.paragraph_format.space_after = Pt(22)
        add_text(p, subtitle, size=14, color=MUTED)


def add_heading(doc, text):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(8)
    p.paragraph_format.space_after = Pt(8)
    add_text(p, text, size=19, bold=True, color="000000")


def add_body(doc, text):
    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(9)
    p.paragraph_format.line_spacing = 1.22
    add_text(p, text, size=11, color=NAVY)
    return p


def add_bullets(doc, items):
    for item in items:
        p = doc.add_paragraph(style="List Bullet")
        p.paragraph_format.space_after = Pt(6)
        add_text(p, item, size=11, color=NAVY)


def add_footer(section, page_label="SaúdeConnect+ | Sprint 2"):
    footer = section.footer
    p = footer.paragraphs[0]
    p.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    add_text(p, page_label, size=8, color=MUTED)


def add_table(doc, headers, rows, widths):
    table = doc.add_table(rows=1, cols=len(headers))
    table.autofit = False
    table.style = "Table Grid"
    header = table.rows[0]
    set_repeat_table_header(header)
    for index, label in enumerate(headers):
        cell = header.cells[index]
        cell.width = Cm(widths[index])
        shade(cell, NAVY)
        set_cell_margins(cell)
        cell.vertical_alignment = WD_ALIGN_VERTICAL.CENTER
        p = cell.paragraphs[0]
        add_text(p, label, size=9, bold=True, color=WHITE)
    for row_index, row in enumerate(rows):
        cells = table.add_row().cells
        for index, value in enumerate(row):
            cells[index].width = Cm(widths[index])
            set_cell_margins(cells[index])
            cells[index].vertical_alignment = WD_ALIGN_VERTICAL.CENTER
            if row_index % 2 == 0:
                shade(cells[index], LIGHT)
            add_text(cells[index].paragraphs[0], value, size=9.5, color=NAVY)
    doc.add_paragraph().paragraph_format.space_after = Pt(2)


def page(doc):
    doc.add_page_break()


def main():
    OUT.parent.mkdir(parents=True, exist_ok=True)
    doc = Document()
    section = doc.sections[0]
    section.top_margin = Cm(2.2)
    section.bottom_margin = Cm(1.8)
    section.left_margin = Cm(2.1)
    section.right_margin = Cm(2.1)
    add_footer(section)

    # Capa
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(110)
    add_text(p, "SaúdeConnect+", size=16, bold=True, color=TEAL)
    p = doc.add_paragraph(style="Title")
    p.paragraph_format.space_before = Pt(10)
    p.paragraph_format.space_after = Pt(10)
    add_text(p, "Apresentação Sprint 2", size=32, bold=True, color="000000")
    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(28)
    add_text(p, "MVP 2 | Reagendamento, Modo Fácil e Geolocalização", size=15, color=MUTED)
    add_body(doc, "Período da sprint: 15/09/2026 a 29/09/2026")
    add_body(doc, "Objetivo: tornar o agendamento mais simples, acessível e orientado à rede local de atendimento.")

    page(doc)
    add_title(doc, "Objetivo e escopo", "Evoluções entregues no MVP 2")
    add_body(doc, "A Sprint 2 concentrou três melhorias que reduzem esforço na jornada do paciente: reagendar sem depender da recepção, navegar com uma interface simplificada e encontrar unidades da rede em Anápolis, Goiás.")
    add_table(doc, ["Atividade", "Entrega", "Resultado"], [
        ("AT-015", "Protótipo e fluxo das novas funcionalidades", "Fluxos definidos para reagendamento, Modo Fácil e geolocalização."),
        ("AT-016", "Atualização dos diagramas técnicos", "Fluxo sequencial de agendamento e regras de disponibilidade atualizados."),
        ("AT-017", "Testes e validação", "Testes automatizados e build de produção executados com sucesso."),
    ], [2.0, 6.0, 7.0])
    add_heading(doc, "Principais entregas")
    add_bullets(doc, [
        "Reagendamento imediato apenas entre horários realmente disponíveis.",
        "Modo Fácil em Agenda, Instituições e fluxo de agendamento, com adaptação para celular e computador.",
        "Mapa OpenStreetMap e rede demonstrativa posicionados em Anápolis, GO.",
    ])

    page(doc)
    add_title(doc, "Reagendamento imediato", "Menos espera para alterar uma consulta ou exame")
    add_body(doc, "O paciente abre o atendimento na Agenda, escolhe uma nova data, seleciona um horário livre e confirma. A agenda é atualizada imediatamente com o status Confirmado.")
    add_table(doc, ["Antes", "Agora"], [
        ("O novo horário era exibido como solicitação e aguardava confirmação da recepção.", "O novo horário é confirmado na própria aplicação."),
        ("Mensagem dependia da secretaria para validar disponibilidade.", "Somente horários livres aparecem para seleção; conflitos continuam bloqueados."),
        ("Paciente precisava acompanhar uma confirmação posterior.", "A mensagem de sucesso confirma a alteração no mesmo momento."),
    ], [7.5, 7.5])
    add_heading(doc, "Fluxo de demonstração")
    add_bullets(doc, ["Agenda", "Reagendar", "Escolher data", "Escolher horário", "Confirmar novo horário", "Agenda atualizada"])
    add_heading(doc, "Relação com arquitetura de software")
    add_body(doc, "Cache pode acelerar dados consultados com frequência, como catálogo de especialidades, unidades e detalhes institucionais. Já a disponibilidade do horário é validada na fonte de verdade no momento da confirmação, para evitar que duas pessoas ocupem o mesmo horário. Assim, a solução combina desempenho para leitura e consistência para o reagendamento.")

    page(doc)
    add_title(doc, "Modo Fácil", "A mesma funcionalidade com menos esforço de leitura e decisão")
    add_body(doc, "O Modo Fácil foi ampliado para além do painel inicial. Ele mantém as mesmas ações, mas organiza a tela por prioridade, aumenta áreas de toque e melhora a leitura em telas pequenas e grandes.")
    add_table(doc, ["Tela", "Ajuste aplicado"], [
        ("Agenda", "Próximo atendimento em destaque, ações de reagendar e cancelar visíveis e acesso direto a novo agendamento."),
        ("Instituições", "Referência de Anápolis, seletor único de tipo e cartões com endereço e ações grandes."),
        ("Agendamento", "Uma escolha por etapa, conteúdo centralizado no computador e orientação clara para voltar ou alterar escolhas."),
        ("Celular e computador", "Barra inferior, botões, cartões, contraste e largura de leitura ajustados por tamanho de tela."),
    ], [3.0, 12.0])

    page(doc)
    add_title(doc, "Geolocalização em Anápolis", "Unidades da rede próximas e mapa integrado")
    add_body(doc, "A aba Instituições agora apresenta uma rede de nove unidades demonstrativas concentradas em Anápolis, GO: três clínicas, três hospitais e três laboratórios.")
    add_table(doc, ["Recurso", "Comportamento"], [
        ("Mapa", "Mapa OpenStreetMap centralizado em Anápolis, sem depender de uma chave paga do Google Maps."),
        ("Perto de mim", "Ordena as unidades pela distância da referência de Anápolis."),
        ("Localização externa", "Se o navegador informar uma cidade fora da região, a aplicação evita distâncias incoerentes e usa Anápolis como referência da rede demonstrativa."),
        ("Filtros", "Permanece possível filtrar por clínica, hospital ou laboratório e abrir detalhes da unidade."),
    ], [3.4, 11.6])
    add_heading(doc, "Rede demonstrativa")
    add_bullets(doc, ["Clínica Saúde Plena, Clínica Bem Estar e Clínica Horizonte.", "Hospital São Lucas, Hospital Central de Anápolis e Hospital Jardim das Américas.", "Laboratório Vida, Laboratório Diagnóstico e Laboratório Anápolis."])

    page(doc)
    add_title(doc, "Validação e demonstração", "Próximos passos para apresentar o MVP 2")
    add_body(doc, "A implementação foi validada com 37 testes automatizados e build de produção concluído. A apresentação pode seguir a jornada abaixo para demonstrar as entregas da Sprint 2.")
    add_table(doc, ["Etapa da demo", "O que mostrar"], [
        ("1. Perfil", "Ativar o Modo Fácil."),
        ("2. Agenda", "Selecionar um atendimento, reagendar para um horário disponível e confirmar na hora."),
        ("3. Instituições", "Abrir Unidades perto de Anápolis, aplicar um tipo de unidade e selecionar Agendar."),
        ("4. Agendamento", "Avançar por localização, serviço, unidade, horário e confirmação."),
    ], [4.0, 11.0])
    add_heading(doc, "Resultado da Sprint 2")
    add_body(doc, "O SaúdeConnect+ passa a oferecer uma jornada de agendamento mais direta, inclusiva e conectada à rede local, preservando as funcionalidades essenciais para consultas, exames e acompanhamento da agenda.")

    doc.save(OUT)
    print(OUT)


def concise_main():
    """Versão curta para apresentação ao vivo, com comparação antes e depois."""
    OUT.parent.mkdir(parents=True, exist_ok=True)
    doc = Document()
    section = doc.sections[0]
    section.top_margin = Cm(2.0)
    section.bottom_margin = Cm(1.7)
    section.left_margin = Cm(2.0)
    section.right_margin = Cm(2.0)
    add_footer(section)

    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(120)
    add_text(p, "SaúdeConnect+", size=16, bold=True, color=TEAL)
    p = doc.add_paragraph(style="Title")
    p.paragraph_format.space_after = Pt(10)
    add_text(p, "Sprint 2", size=34, bold=True, color="000000")
    add_body(doc, "Reagendamento, Modo Fácil e unidades próximas em Anápolis, GO")
    add_body(doc, "Apresentação curta para acompanhar a demonstração ao vivo do aplicativo.")

    page(doc)
    add_title(doc, "Sprint 2", "Planejamento das atividades da semana")
    sprint_image = Path(r"C:\Users\rafae\AppData\Local\Temp\codex-clipboard-409e7172-a224-4161-9553-2ebe34cd2a1e.png")
    if sprint_image.exists():
        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p.add_run().add_picture(str(sprint_image), width=Cm(14.5))
        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        add_text(p, "Planejamento da Sprint 2: 15/09/2026 a 29/09/2026.", size=8.5, italic=True, color=MUTED)
    add_body(doc, "A sprint reuniu três atividades: prototipação e fluxo das novas funcionalidades, atualização dos diagramas técnicos e testes de validação do MVP 2.")

    page(doc)
    add_title(doc, "O que foi entregue", "Funcionalidades implementadas no MVP 2")
    add_table(doc, ["Funcionalidade", "Entrega da semana"], [
        ("Reagendamento", "Novo horário escolhido entre opções disponíveis e confirmado imediatamente na agenda."),
        ("Modo Fácil", "Interface simplificada em Agenda, Instituições e Agendamento, com botões maiores e leitura melhor em celular e computador."),
        ("Geolocalização", "Mapa OpenStreetMap e unidades próximas configurados para Anápolis, GO."),
    ], [4.0, 11.0])
    add_body(doc, "Também foram adicionadas nove unidades demonstrativas, distribuídas entre clínicas, hospitais e laboratórios.")

    page(doc)
    add_title(doc, "Demonstração ao vivo", "Mostre as entregas no aplicativo")
    add_table(doc, ["Passo", "Ação no aplicativo"], [
        ("1", "Entrar como paciente e ativar Modo Fácil no Perfil."),
        ("2", "Abrir Agenda, escolher Reagendar, selecionar um horário disponível e confirmar."),
        ("3", "Mostrar que o novo horário aparece imediatamente como Confirmado."),
        ("4", "Abrir Instituições e selecionar Unidades perto de Anápolis, GO."),
        ("5", "Filtrar uma categoria, abrir uma unidade e iniciar o agendamento."),
    ], [1.5, 13.5])
    add_heading(doc, "Validação")
    add_body(doc, "As funcionalidades foram validadas com testes automatizados e build de produção concluído.")
    doc.save(OUT)
    print(OUT)


def one_page_main():
    """Resumo de uma página para apresentar a Sprint 2."""
    OUT.parent.mkdir(parents=True, exist_ok=True)
    doc = Document()
    section = doc.sections[0]
    section.top_margin = Cm(1.7)
    section.bottom_margin = Cm(1.5)
    section.left_margin = Cm(2.0)
    section.right_margin = Cm(2.0)
    add_footer(section, "SaúdeConnect+ | Sprint 2")

    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(3)
    add_text(p, "SaúdeConnect+", size=13, bold=True, color=TEAL)
    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(4)
    add_text(p, "Sprint 2", size=27, bold=True, color="000000")
    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(18)
    add_text(p, "15/09/2026 a 29/09/2026", size=11, color=MUTED)

    add_heading(doc, "Planejamento da sprint")
    add_body(doc, "Foram realizadas duas atividades para evolução do MVP 2:")
    add_bullets(doc, [
        "AT-015 - Prototipação e fluxo das novas funcionalidades do MVP 2.",
        "AT-017 - Testes e validação das funcionalidades do MVP 2.",
    ])

    add_heading(doc, "O que foi entregue")
    add_body(doc, "O agendamento de consultas e exames também foi modernizado. Antes, as escolhas ficavam concentradas em uma única tela; agora, o usuário é guiado por etapas claras até a confirmação.")
    add_table(doc, ["Funcionalidade", "Entrega realizada"], [
        ("Agendamento", "Fluxo guiado para consultas e exames: localização, atendimento, unidade, horário e confirmação."),
        ("Reagendamento", "Novo horário disponível é confirmado imediatamente na agenda."),
        ("Modo Fácil", "Interface simplificada em Agenda, Instituições e Agendamento para celular e computador."),
        ("Geolocalização", "Mapa e unidades próximas configurados para Anápolis, GO."),
    ], [4.0, 11.0])
    add_body(doc, "Validação: testes automatizados executados e build de produção concluído.")
    add_heading(doc, "Próximos passos")
    add_bullets(doc, [
        "Atualizar os diagramas técnicos do MVP 2 conforme os fluxos implementados.",
        "Atualizar o Diagrama de Casos de Uso e o Diagrama de Sequência.",
        "Atualizar o DER com as entidades e relacionamentos das novas funcionalidades.",
    ])

    doc.add_page_break()
    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(4)
    add_text(p, "Antes e Depois", size=24, bold=True, color="000000")
    add_body(doc, "Evolução da marcação de consultas e exames durante a Sprint 2.")
    comparison = doc.add_table(rows=1, cols=2)
    comparison.autofit = False
    before = comparison.cell(0, 0)
    after = comparison.cell(0, 1)
    for cell in (before, after):
        set_cell_margins(cell, top=160, start=160, bottom=160, end=160)
        cell.vertical_alignment = WD_ALIGN_VERTICAL.TOP
    before_image = Path(r"C:\Users\rafae\AppData\Local\Temp\saudeconnect-captures\booking-before.png")
    flow_image = Path(r"C:\Users\rafae\AppData\Local\Temp\saudeconnect-captures\booking-flow.png")
    p = before.paragraphs[0]
    add_text(p, "ANTES", size=10, bold=True, color=TEAL)
    if before_image.exists():
        p = before.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p.add_run().add_picture(str(before_image), width=Cm(6.7))
    p = before.add_paragraph()
    add_text(p, "Consulta, exame e especialidades ficavam concentrados na mesma tela.", size=8.5, color=MUTED)
    p = after.paragraphs[0]
    add_text(p, "DEPOIS", size=10, bold=True, color=TEAL)
    if flow_image.exists():
        p = after.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p.add_run().add_picture(str(flow_image), width=Cm(6.7))
    p = after.add_paragraph()
    add_text(p, "A jornada segue etapas claras até a confirmação, reduzindo erros nas escolhas.", size=8.5, color=MUTED)
    add_heading(doc, "Novo fluxo de agendamento")
    add_table(doc, ["Etapa", "O que o paciente define"], [
        ("1. Localização", "Cidade ou região para encontrar a rede disponível."),
        ("2. Atendimento", "Consulta ou exame e o serviço desejado."),
        ("3. Unidade", "Instituição compatível com o atendimento."),
        ("4. Horário", "Data, profissional quando necessário e horário livre."),
        ("5. Confirmação", "Resumo final antes de concluir o agendamento."),
    ], [4.0, 11.0])
    doc.save(OUT)
    print(OUT)


if __name__ == "__main__":
    one_page_main()
