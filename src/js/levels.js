export const phases = [
    {
        id: 1,
        name: "FASE 1: CINTURÃO DE ASTEROIDES",
        locked: false,
        levels: [
            {
                id: 1,
                description: "Uma paciente de 28 anos chega à unidade de saúde queixando-se de cansaço extremo, palidez e falta de ar ao subir escadas. Ao avaliar os exames laboratoriais, qual é o principal critério para diagnosticar anemia nesta paciente?",
                data: { "Saturação": "98%", "FC": "88 bpm" },
                options: [
                    { id: "a", text: "Falta de vitamina C", correct: false },
                    { id: "b", text: "Falta de ferro no organismo", correct: true },
                    { id: "c", text: "Excesso de atividade física", correct: false },
                    { id: "d", text: "Doença renal crônica", correct: false }
                ],
                successMessage: "Correto! A deficiência de ferro é a principal causa de anemia no mundo.",
                failMessage: "Incorreto. A falta de ferro é a causa mais comum de anemia."
            },
            {
                id: 2,
                description: "Durante uma consulta de enfermagem, você orienta um paciente sobre alimentação para prevenir anemia. Qual nutriente você deve enfatizar como o mais importante para esta prevenção?",
                data: { "VCM": "70 fL", "HCM": "22 pg" },
                options: [
                    { id: "a", text: "Proteína", correct: false },
                    { id: "b", text: "Carboidrato", correct: false },
                    { id: "c", text: "Ferro", correct: true },
                    { id: "d", text: "Vitamina D", correct: false }
                ],
                successMessage: "Exato! O ferro é essencial para a produção de hemoglobina.",
                failMessage: "Errado. O ferro é o nutriente mais importante para prevenir anemia."
            },
            {
                id: 3,
                description: "Ao estudar os diferentes tipos de anemia em sua formação, você aprende sobre suas classificações. Qual é o tipo mais comum de anemia encontrado na população mundial?",
                data: { "Prescrição": "Sulfato Ferroso 40mg" },
                options: [
                    { id: "a", text: "Anemia falciforme", correct: false },
                    { id: "b", text: "Anemia ferropriva", correct: true },
                    { id: "c", text: "Anemia megaloblástica", correct: false },
                    { id: "d", text: "Anemia normocítica", correct: false }
                ],
                successMessage: "Perfeito! A anemia ferropriva é a mais comum no mundo.",
                failMessage: "Não. A anemia ferropriva (por falta de ferro) é a mais comum."
            },
            {
                id: 4,
                description: "Você está realizando uma avaliação de enfermagem em um paciente com suspeita de anemia. Quais são os sintomas mais comuns que você deve investigar durante a anamnese?",
                data: { "Sintomas": "Parestesias, Glossite" },
                options: [
                    { id: "a", text: "Fadiga e fraqueza muscular", correct: true },
                    { id: "b", text: "Dor de cabeça e febre alta", correct: false },
                    { id: "c", text: "Náusea e vômito intenso", correct: false },
                    { id: "d", text: "Todas as anteriores", correct: false }
                ],
                successMessage: "Correto! Fadiga e fraqueza são os sintomas mais característicos da anemia.",
                failMessage: "Incorreto. Os sintomas mais comuns são fadiga e fraqueza."
            },
            {
                id: 5,
                description: "Em uma ação de educação em saúde na comunidade, você explica sobre grupos de risco para anemia. Qual população está mais propensa a desenvolver esta condição?",
                data: { "Via": "Intramuscular Profunda" },
                options: [
                    { id: "a", text: "Homens adultos saudáveis", correct: false },
                    { id: "b", text: "Mulheres em idade fértil", correct: true },
                    { id: "c", text: "Crianças e adolescentes", correct: false },
                    { id: "d", text: "Idosos sedentários", correct: false }
                ],
                successMessage: "Excelente! Mulheres em idade fértil têm maior risco devido à menstruação.",
                failMessage: "Errado. Mulheres em idade fértil são o grupo de maior risco."
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
                description: "Um paciente chega ao pronto-socorro com suspeita de anemia. O médico solicita exames laboratoriais. Qual é o exame mais comum e eficaz para diagnosticar anemia?",
                data: { "Queixa": "Dor 10/10", "Sat": "92%" },
                options: [
                    { id: "a", text: "Hemograma completo", correct: true },
                    { id: "b", text: "Exame de urina tipo 1", correct: false },
                    { id: "c", text: "Exame parasitológico de fezes", correct: false },
                    { id: "d", text: "Ultrassonografia abdominal", correct: false }
                ],
                successMessage: "Correto! O hemograma completo avalia os níveis de hemoglobina e hematócrito.",
                failMessage: "Incorreto. O hemograma completo é o exame padrão para diagnóstico."
            },
            {
                id: 7,
                description: "Você está orientando um paciente diagnosticado com anemia ferropriva sobre o tratamento. Qual é a abordagem terapêutica mais comum para este tipo de anemia?",
                data: { "Dieta": "Avaliação Nutricional" },
                options: [
                    { id: "a", text: "Suplementação de ferro oral ou injetável", correct: true },
                    { id: "b", text: "Antibióticos de amplo espectro", correct: false },
                    { id: "c", text: "Anti-inflamatórios não esteroidais", correct: false },
                    { id: "d", text: "Cirurgia corretiva", correct: false }
                ],
                successMessage: "Isso! A suplementação de ferro é o tratamento padrão para anemia ferropriva.",
                failMessage: "Incorreto. O tratamento principal é a reposição de ferro."
            },
            {
                id: 8,
                description: "Durante uma palestra sobre complicações da anemia, você explica os riscos de não tratar adequadamente esta condição. Quais podem ser as consequências graves da anemia não tratada?",
                data: { "RDW": "18%" },
                options: [
                    { id: "a", text: "Problemas cardíacos", correct: false },
                    { id: "b", text: "Insuficiência renal", correct: false },
                    { id: "c", text: "Problemas de visão", correct: false },
                    { id: "d", text: "Todas as anteriores", correct: true }
                ],
                successMessage: "Correto! A anemia não tratada pode afetar múltiplos órgãos e sistemas.",
                failMessage: "Errado. Todas essas complicações podem ocorrer com anemia grave não tratada."
            },
            {
                id: 9,
                description: "Em uma unidade de pediatria, você está avaliando dados epidemiológicos sobre anemia infantil. Qual faixa etária é mais afetada por esta condição?",
                data: { "Tempo": "15 min de infusão" },
                options: [
                    { id: "a", text: "Crianças menores de 5 anos", correct: true },
                    { id: "b", text: "Adolescentes de 12 a 18 anos", correct: false },
                    { id: "c", text: "Adultos jovens de 20 a 30 anos", correct: false },
                    { id: "d", text: "Idosos acima de 65 anos", correct: false }
                ],
                successMessage: "Exato! Crianças menores de 5 anos são o grupo mais vulnerável.",
                failMessage: "Erro! A faixa etária mais afetada são crianças menores de 5 anos."
            },
            {
                id: 10,
                description: "Você está desenvolvendo um programa de prevenção de anemia na atenção primária. Qual é a melhor estratégia para prevenir a anemia na população?",
                data: { "Obs": "Comportamento alimentar" },
                options: [
                    { id: "a", text: "Consumir alimentos ricos em ferro", correct: false },
                    { id: "b", text: "Tomar suplementos de ferro regularmente", correct: false },
                    { id: "c", text: "Praticar exercícios físicos regularmente", correct: false },
                    { id: "d", text: "Todas as anteriores", correct: true }
                ],
                successMessage: "Correto! A prevenção da anemia envolve alimentação adequada, suplementação quando necessário e hábitos saudáveis.",
                failMessage: "Incorreto. A melhor prevenção combina alimentação, suplementação e exercícios."
            }
        ]
    }
];
