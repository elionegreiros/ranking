// ============================================================================
// RANKING DE QUALIDADE APS - SOMENTE INDICADORES C1 a C7
// ============================================================================

const equipesAPS = [
    "PS VALE VERDE - PSF",
    "PS MORADA NOVA - PSF",
    "PS NOVO HORIZONTE - PSF",
    "PS AMANO LIMA PSF",
    "PS IEDA - PSF",
    "PS ISIDORIA - PSF",
    "PS SANTA ROSA - PSF",
    "PS CENTRO",
    "PS LAVANDERIA PSF",
    "SEGUNDA EQUIPE SAUDE D FAMILIA"
];

// 2º Quadrimestre 2026 - SOMENTE C1 a C7
const qualidadeData2Q = {
    "PS VALE VERDE - PSF": { c1: 70.03, c2: 80.00, c3: 69.38, c4: 89.59, c5: 86.26, c6: 79.13, c7: 84.99 },
    "PS MORADA NOVA - PSF": { c1: 38.87, c2: 42.22, c3: 70.33, c4: 69.83, c5: 69.44, c6: 81.27, c7: 71.11 },
    "PS NOVO HORIZONTE - PSF": { c1: 55.90, c2: 71.43, c3: 78.63, c4: 88.20, c5: 86.77, c6: 90.46, c7: 73.96 },
    "PS AMANO LIMA PSF": { c1: 47.49, c2: 56.67, c3: 74.17, c4: 76.49, c5: 76.70, c6: 75.41, c7: 76.90 },
    "PS IEDA - PSF": { c1: 29.68, c2: 20.00, c3: 72.93, c4: 69.13, c5: 70.51, c6: 75.17, c7: 77.88 },
    "PS ISIDORIA - PSF": { c1: 54.76, c2: 70.00, c3: 51.40, c4: 72.10, c5: 75.55, c6: 79.21, c7: 77.30 },
    "PS SANTA ROSA - PSF": { c1: 75.57, c2: 30.00, c3: 61.80, c4: 67.84, c5: 70.44, c6: 72.94, c7: 77.11 },
    "PS CENTRO": { c1: 57.16, c2: 58.18, c3: 69.20, c4: 68.25, c5: 67.11, c6: 70.12, c7: 75.97 },
    "PS LAVANDERIA PSF": { c1: 53.29, c2: 8.57, c3: 70.27, c4: 78.82, c5: 74.10, c6: 69.50, c7: 76.52 },
    "SEGUNDA EQUIPE SAUDE D FAMILIA": { c1: 36.80, c2: 48.89, c3: 73.00, c4: 81.47, c5: 81.03, c6: 83.90, c7: 77.04 }
};

// 1º Quadrimestre 2026 - SOMENTE C1 a C7
const qualidadeData1Q = {
    "PS VALE VERDE - PSF": { c1: 65.65, c2: 56.67, c3: 86.33, c4: 92.87, c5: 93.35, c6: 81.64, c7: 83.97 },
    "PS MORADA NOVA - PSF": { c1: 41.35, c2: 52.00, c3: 72.08, c4: 76.23, c5: 77.35, c6: 84.58, c7: 77.43 },
    "PS NOVO HORIZONTE - PSF": { c1: 66.72, c2: 60.00, c3: 73.00, c4: 90.81, c5: 92.66, c6: 91.27, c7: 74.06 },
    "PS AMANO LIMA PSF": { c1: 35.71, c2: 60.00, c3: 81.00, c4: 77.39, c5: 75.87, c6: 76.72, c7: 78.43 },
    "PS IEDA - PSF": { c1: 48.78, c2: 33.33, c3: 74.00, c4: 79.50, c5: 78.15, c6: 79.25, c7: 82.43 },
    "PS ISIDORIA - PSF": { c1: 47.54, c2: 62.50, c3: 64.00, c4: 81.78, c5: 83.90, c6: 85.85, c7: 81.11 },
    "PS SANTA ROSA - PSF": { c1: 37.50, c2: 36.00, c3: 65.75, c4: 75.92, c5: 78.30, c6: 74.41, c7: 81.66 },
    "PS CENTRO": { c1: 50.29, c2: 60.00, c3: 84.00, c4: 77.34, c5: 73.26, c6: 74.12, c7: 77.57 },
    "PS LAVANDERIA PSF": { c1: 60.60, c2: 36.36, c3: 85.38, c4: 84.35, c5: 80.61, c6: 71.98, c7: 78.54 },
    "SEGUNDA EQUIPE SAUDE D FAMILIA": { c1: 54.19, c2: 50.00, c3: 80.57, c4: 85.30, c5: 87.88, c6: 86.15, c7: 79.71 }
};

// Funções de classificação
function classificarC1(pct) {
    if (pct > 50 && pct <= 70) return "ÓTIMO";
    if (pct > 30 && pct <= 50) return "BOM";
    if (pct > 10 && pct <= 30) return "SUFICIENTE";
    return "REGULAR";
}

function classificarGeral(pct) {
    if (pct > 75) return "ÓTIMO";
    if (pct > 50) return "BOM";
    if (pct > 25) return "SUFICIENTE";
    return "REGULAR";
}

function calcularMediaGeral(q) {
    return (q.c1 + q.c2 + q.c3 + q.c4 + q.c5 + q.c6 + q.c7) / 7;
}

function badgeClass(status) {
    if (status === "ÓTIMO") return "badge-otimo";
    if (status === "BOM") return "badge-bom";
    if (status === "SUFICIENTE") return "badge-suficiente";
    return "badge-regular";
}

function getCorClassificacao(classificacao) {
    if (classificacao === "ÓTIMO") return "#2ecc71";
    if (classificacao === "BOM") return "#3498db";
    if (classificacao === "SUFICIENTE") return "#f39c12";
    return "#e74c3c";
}