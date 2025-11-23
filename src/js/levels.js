export const phases = [
    {
        id: 1,
        name: "FASE 1: CINTURÃO DE ASTEROIDES",
        locked: false,
        levels: [
            {
                id: 1,
                description: "Paciente apresenta palidez cutâneo-mucosa e fadiga. Qual o valor de Hemoglobina (Hb) que define anemia em mulheres adultas não gestantes?",
                data: { "Saturação": "98%", "FC": "88 bpm" },
                options: [
                    { id: "a", text: "Hb < 13.5 g/dL", correct: false },
                    { id: "b", text: "Hb < 12.0 g/dL", correct: true },
                    { id: "c", text: "Hb < 11.0 g/dL", correct: false },
                    { id: "d", text: "Hb < 10.0 g/dL", correct: false }
                ],
                successMessage: "Correto! Hb < 12.0 g/dL define anemia em mulheres.",
                failMessage: "Incorreto. O valor de corte é 12.0 g/dL."
            },
            {
                id: 2,
                description: "Qual é a causa mais comum de anemia no mundo, caracterizada por microcitose e hipocromia?",
                data: { "VCM": "70 fL", "HCM": "22 pg" },
                options: [
                    { id: "a", text: "Anemia Perniciosa", correct: false },
                    { id: "b", text: "Anemia Aplástica", correct: false },
                    { id: "c", text: "Anemia Ferropriva", correct: true },
                    { id: "d", text: "Anemia Falciforme", correct: false }
                ],
                successMessage: "Exato! A deficiência de ferro é a causa mais comum.",
                failMessage: "Errado. Microcitose sugere falta de ferro."
            },
            {
                id: 3,
                description: "Para melhorar a absorção de sulfato ferroso oral, qual orientação de enfermagem é correta?",
                data: { "Prescrição": "Sulfato Ferroso 40mg" },
                options: [
                    { id: "a", text: "Tomar com leite ou iogurte", correct: false },
                    { id: "b", text: "Tomar com antiácidos", correct: false },
                    { id: "c", text: "Tomar logo após o almoço", correct: false },
                    { id: "d", text: "Tomar com suco de laranja (Vitamina C)", correct: true }
                ],
                successMessage: "Perfeito! O ambiente ácido favorece a absorção.",
                failMessage: "Não. Cálcio e antiácidos diminuem a absorção."
            },
            {
                id: 4,
                description: "A Anemia Perniciosa é causada pela deficiência de qual vitamina?",
                data: { "Sintomas": "Parestesias, Glossite" },
                options: [
                    { id: "a", text: "Vitamina B12 (Cobalamina)", correct: true },
                    { id: "b", text: "Vitamina B9 (Ácido Fólico)", correct: false },
                    { id: "c", text: "Vitamina C", correct: false },
                    { id: "d", text: "Vitamina D", correct: false }
                ],
                successMessage: "Correto! Falta de Fator Intrínseco impede absorção de B12.",
                failMessage: "Incorreto. É deficiência de B12."
            },
            {
                id: 5,
                description: "Na administração intramuscular de ferro (Noripurum), qual técnica deve ser utilizada para evitar manchas na pele?",
                data: { "Via": "Intramuscular Profunda" },
                options: [
                    { id: "a", text: "Técnica em Z (Z-track)", correct: true },
                    { id: "b", text: "Prega cutânea simples", correct: false },
                    { id: "c", text: "Massagem vigorosa após aplicação", correct: false },
                    { id: "d", text: "Aplicação no deltoide", correct: false }
                ],
                successMessage: "Excelente! A técnica em Z evita o refluxo do medicamento.",
                failMessage: "Errado. Deve-se usar a técnica em Z no glúteo."
            }
        ]
    },
    {
        id: 2,
        name: "FASE 2: NEBULOSA ESCURA",
        locked: false,
        levels: [
            {
                id: 6,
                description: "Paciente com Anemia Falciforme apresenta crise álgica intensa. Qual a prioridade inicial de enfermagem além da analgesia?",
                data: { "Queixa": "Dor 10/10", "Sat": "92%" },
                options: [
                    { id: "a", text: "Restrição hídrica", correct: false },
                    { id: "b", text: "Hidratação vigorosa e Oxigenoterapia", correct: true },
                    { id: "c", text: "Exercícios físicos", correct: false },
                    { id: "d", text: "Aplicação de frio no local", correct: false }
                ],
                successMessage: "Correto! Hidratação reduz a falcização das hemácias.",
                failMessage: "Incorreto. Hidratação é fundamental."
            },
            {
                id: 7,
                description: "Quais alimentos são as melhores fontes de ferro heme (melhor absorção)?",
                data: { "Dieta": "Avaliação Nutricional" },
                options: [
                    { id: "a", text: "Feijão e Lentilha", correct: false },
                    { id: "b", text: "Espinafre e Couve", correct: false },
                    { id: "c", text: "Carnes vermelhas e vísceras", correct: true },
                    { id: "d", text: "Leite e Derivados", correct: false }
                ],
                successMessage: "Isso! Ferro heme (origem animal) é melhor absorvido.",
                failMessage: "Incorreto. Vegetais têm ferro não-heme."
            },
            {
                id: 8,
                description: "Em um hemograma, o que indica o índice RDW (Red Cell Distribution Width) elevado?",
                data: { "RDW": "18%" },
                options: [
                    { id: "a", text: "Tamanho uniforme das hemácias", correct: false },
                    { id: "b", text: "Anisocitose (variação no tamanho)", correct: true },
                    { id: "c", text: "Excesso de ferro", correct: false },
                    { id: "d", text: "Infecção bacteriana", correct: false }
                ],
                successMessage: "Correto! RDW alto indica anisocitose, comum na carência de ferro.",
                failMessage: "Errado. RDW mede a variação de tamanho."
            },
            {
                id: 9,
                description: "Durante uma transfusão sanguínea, o paciente relata dor lombar e febre. Qual a primeira ação da enfermagem?",
                data: { "Tempo": "15 min de infusão" },
                options: [
                    { id: "a", text: "Aumentar o gotejamento", correct: false },
                    { id: "b", text: "Administrar analgésico", correct: false },
                    { id: "c", text: "Interromper a transfusão imediatamente", correct: true },
                    { id: "d", text: "Chamar o médico e continuar infundindo", correct: false }
                ],
                successMessage: "Exato! Sinais de reação hemolítica exigem parada imediata.",
                failMessage: "Erro Crítico! Deve-se parar a transfusão imediatamente."
            },
            {
                id: 10,
                description: "Qual destes sintomas é característico da síndrome de Pica (alotriofagia) associada à anemia ferropriva?",
                data: { "Obs": "Comportamento alimentar" },
                options: [
                    { id: "a", text: "Vontade de comer doces", correct: false },
                    { id: "b", text: "Vontade de comer gelo, terra ou reboco", correct: true },
                    { id: "c", text: "Perda de apetite total", correct: false },
                    { id: "d", text: "Sede excessiva", correct: false }
                ],
                successMessage: "Correto! Pagofagia (comer gelo) é comum na ferropriva.",
                failMessage: "Incorreto. Pica é o desejo por itens não nutritivos."
            }
        ]
    }
];
