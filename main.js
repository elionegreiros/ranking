// ============================================================================
// RANKING APS CORPORATIVO - MAIN
// ============================================================================

let currentPeriodo = "2Q";
let distribuicaoChart = null;
let top5Chart = null;

function getCurrentData() {
    if (currentPeriodo === "1Q") {
        return {
            vinculo: vinculoData1Q,
            qualidade: qualidadeData1Q,
            label: "1º Quadrimestre 2026"
        };
    } else {
        return {
            vinculo: vinculoData2Q,
            qualidade: qualidadeData2Q,
            label: "2º Quadrimestre 2026"
        };
    }
}

function calcularRanking(ordenarPor = "scoreFinal") {
    const data = getCurrentData();
    const vinculo = data.vinculo;
    const qualidade = data.qualidade;
    
    const ranking = equipesAPS.map(equipe => {
        const q = qualidade[equipe];
        const mediaQualidade = calcularMediaQualidade(q);
        
        let valorOrdenacao;
        if (ordenarPor === "scoreFinal") valorOrdenacao = vinculo[equipe].scoreFinal;
        else if (ordenarPor === "mediaQualidade") valorOrdenacao = mediaQualidade;
        else valorOrdenacao = q[ordenarPor];
        
        return {
            equipe: equipe.replace(" - PSF", ""),
            equipeOriginal: equipe,
            scoreFinal: vinculo[equipe].scoreFinal,
            classificacaoVinculo: classificarVinculo(vinculo[equipe].scoreFinal),
            mediaQualidade: mediaQualidade,
            c1: q.c1,
            c2: q.c2,
            c3: q.c3,
            c4: q.c4,
            c5: q.c5,
            c6: q.c6,
            c7: q.c7,
            valorOrdenacao: valorOrdenacao
        };
    });
    
    ranking.sort((a, b) => b.valorOrdenacao - a.valorOrdenacao);
    return ranking;
}

function renderKpiGrid(ranking) {
    const container = document.getElementById("kpiGrid");
    const data = getCurrentData();
    
    const totalEquipes = ranking.length;
    const equipesOtimo = ranking.filter(e => e.classificacaoVinculo === "ÓTIMO").length;
    const equipesBom = ranking.filter(e => e.classificacaoVinculo === "BOM").length;
    const maiorScore = ranking[0]?.scoreFinal || 0;
    const mediaGeral = (ranking.reduce((sum, e) => sum + e.mediaQualidade, 0) / totalEquipes).toFixed(1);
    const melhorC2 = Math.max(...ranking.map(e => e.c2));
    
    container.innerHTML = `
        <div class="kpi-card">
            <div class="kpi-icon"><i class="fas fa-building"></i></div>
            <div class="kpi-info">
                <h3>${totalEquipes}</h3>
                <p>Equipes Avaliadas</p>
            </div>
        </div>
        <div class="kpi-card">
            <div class="kpi-icon"><i class="fas fa-trophy"></i></div>
            <div class="kpi-info">
                <h3>${equipesOtimo}</h3>
                <p>Classificação ÓTIMA</p>
            </div>
        </div>
        <div class="kpi-card">
            <div class="kpi-icon"><i class="fas fa-chart-line"></i></div>
            <div class="kpi-info">
                <h3>${equipesBom}</h3>
                <p>Classificação BOM</p>
            </div>
        </div>
        <div class="kpi-card">
            <div class="kpi-icon"><i class="fas fa-star"></i></div>
            <div class="kpi-info">
                <h3>${maiorScore.toFixed(2)}</h3>
                <p>Maior Score Final</p>
            </div>
        </div>
        <div class="kpi-card">
            <div class="kpi-icon"><i class="fas fa-chart-simple"></i></div>
            <div class="kpi-info">
                <h3>${mediaGeral}%</h3>
                <p>Média Qualidade</p>
            </div>
        </div>
        <div class="kpi-card">
            <div class="kpi-icon"><i class="fas fa-child"></i></div>
            <div class="kpi-info">
                <h3>${melhorC2.toFixed(1)}%</h3>
                <p>Melhor C2 (Infantil)</p>
            </div>
        </div>
    `;
}

function renderPodium(ranking) {
    const container = document.getElementById("podiumContainer");
    const top3 = ranking.slice(0, 3);
    
    const medallas = ["🥇", "🥈", "🥉"];
    const titulos = ["Campeão", "Vice-Campeão", "3º Lugar"];
    
    container.innerHTML = top3.map((item, idx) => `
        <div class="podium-card podium-${idx + 1}">
            <div class="podium-medal">${medallas[idx]}</div>
            <div class="podium-equipe"><strong>${item.equipe.substring(0, 28)}</strong></div>
            <div class="podium-score">${item.scoreFinal.toFixed(2)}</div>
            <div class="podium-label">Score Final</div>
            <div class="podium-badge" style="background: ${getCorClassificacao(item.classificacaoVinculo)}20; color: ${getCorClassificacao(item.classificacaoVinculo)};">
                ${item.classificacaoVinculo}
            </div>
            <div class="podium-label" style="margin-top: 8px;">${titulos[idx]}</div>
        </div>
    `).join('');
}

function renderRankingTable(ranking) {
    const tbody = document.getElementById("rankingBody");
    
    tbody.innerHTML = ranking.map((item, idx) => {
        const posicao = idx + 1;
        let posClass = "";
        if (posicao === 1) posClass = "ranking-1";
        else if (posicao === 2) posClass = "ranking-2";
        else if (posicao === 3) posClass = "ranking-3";
        
        const corClassificacao = getCorClassificacao(item.classificacaoVinculo);
        const progressWidth = (item.scoreFinal / 10) * 100;
        
        return `
            <tr class="${posClass}">
                <td><strong>${posicao}º</strong></td>
                <td style="text-align: left; font-weight: 600;">${item.equipe}</td>
                <td>
                    <strong>${item.scoreFinal.toFixed(2)}</strong>
                    <div class="progress-bar"><div class="progress-fill" style="width: ${progressWidth}%; background: ${corClassificacao};"></div></div>
                </td>
                <td><strong>${item.mediaQualidade.toFixed(1)}%</strong></td>
                <td>${item.c1.toFixed(1)}%</td>
                <td>${item.c2.toFixed(1)}%</td>
                <td>${item.c3.toFixed(1)}%</td>
                <td>${item.c4.toFixed(1)}%</td>
                <td>${item.c5.toFixed(1)}%</td>
                <td>${item.c6.toFixed(1)}%</td>
                <td>${item.c7.toFixed(1)}%</td>
                <td><span class="badge ${badgeClass(item.classificacaoVinculo)}">${item.classificacaoVinculo}</span></td>
            </tr>
        `;
    }).join('');
}

function renderInsights(ranking) {
    const container = document.getElementById("insightsGrid");
    
    const melhorC2 = [...ranking].sort((a, b) => b.c2 - a.c2)[0];
    const melhorC4 = [...ranking].sort((a, b) => b.c4 - a.c4)[0];
    const lider = ranking[0];
    const piorC2 = [...ranking].sort((a, b) => a.c2 - b.c2)[0];
    const acimaMedia = ranking.filter(e => e.mediaQualidade > 70).length;
    const mediaC2 = (ranking.reduce((sum, e) => sum + e.c2, 0) / ranking.length).toFixed(1);
    
    container.innerHTML = `
        <div class="insight-card">
            <div class="insight-header">
                <i class="fas fa-crown"></i>
                <h3>Líder do Ranking</h3>
            </div>
            <div class="insight-value">${lider.equipe}</div>
            <div class="insight-detail">Score Final: ${lider.scoreFinal.toFixed(2)} | Média: ${lider.mediaQualidade.toFixed(1)}%</div>
        </div>
        <div class="insight-card">
            <div class="insight-header">
                <i class="fas fa-child"></i>
                <h3>Melhor C2 - Desenvolvimento Infantil</h3>
            </div>
            <div class="insight-value">${melhorC2.c2.toFixed(1)}%</div>
            <div class="insight-detail">${melhorC2.equipe}</div>
        </div>
        <div class="insight-card">
            <div class="insight-header">
                <i class="fas fa-heartbeat"></i>
                <h3>Melhor C4 - Diabetes</h3>
            </div>
            <div class="insight-value">${melhorC4.c4.toFixed(1)}%</div>
            <div class="insight-detail">${melhorC4.equipe}</div>
        </div>
        <div class="insight-card">
            <div class="insight-header">
                <i class="fas fa-chart-line"></i>
                <h3>Desempenho Geral</h3>
            </div>
            <div class="insight-value">${acimaMedia}/10</div>
            <div class="insight-detail">Equipes com média >70%</div>
        </div>
        <div class="insight-card">
            <div class="insight-header">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Atenção Prioritária</h3>
            </div>
            <div class="insight-value">${piorC2.equipe}</div>
            <div class="insight-detail">C2 - Desenvolvimento Infantil: ${piorC2.c2.toFixed(1)}%</div>
        </div>
        <div class="insight-card">
            <div class="insight-header">
                <i class="fas fa-chart-simple"></i>
                <h3>Média Municipal C2</h3>
            </div>
            <div class="insight-value">${mediaC2}%</div>
            <div class="insight-detail">Referência para monitoramento</div>
        </div>
    `;
}

function renderCharts(ranking) {
    // Gráfico de distribuição
    const ctxDist = document.getElementById('distribuicaoChart')?.getContext('2d');
    if (ctxDist) {
        if (distribuicaoChart) distribuicaoChart.destroy();
        
        const otimos = ranking.filter(e => e.classificacaoVinculo === "ÓTIMO").length;
        const bons = ranking.filter(e => e.classificacaoVinculo === "BOM").length;
        const suficientes = ranking.filter(e => e.classificacaoVinculo === "SUFICIENTE").length;
        const regulares = ranking.filter(e => e.classificacaoVinculo === "REGULAR").length;
        
        distribuicaoChart = new Chart(ctxDist, {
            type: 'doughnut',
            data: {
                labels: ['ÓTIMO', 'BOM', 'SUFICIENTE', 'REGULAR'],
                datasets: [{
                    data: [otimos, bons, suficientes, regulares],
                    backgroundColor: ['#2ecc71', '#3498db', '#f39c12', '#e74c3c'],
                    borderWidth: 0,
                    hoverOffset: 10
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: { position: 'bottom', labels: { font: { size: 11 } } },
                    tooltip: { callbacks: { label: (ctx) => `${ctx.label}: ${ctx.raw} equipe(s)` } }
                }
            }
        });
    }
    
    // Gráfico Top 5 C2
    const ctxTop5 = document.getElementById('top5Chart')?.getContext('2d');
    if (ctxTop5) {
        if (top5Chart) top5Chart.destroy();
        
        const top5C2 = [...ranking].sort((a, b) => b.c2 - a.c2).slice(0, 5);
        
        top5Chart = new Chart(ctxTop5, {
            type: 'bar',
            data: {
                labels: top5C2.map(e => e.equipe.substring(0, 20)),
                datasets: [{
                    label: 'C2 - Desenvolvimento Infantil (%)',
                    data: top5C2.map(e => e.c2),
                    backgroundColor: '#2ecc71',
                    borderRadius: 8,
                    barPercentage: 0.7
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                scales: { y: { beginAtZero: true, max: 100, title: { display: true, text: 'Percentual (%)' } } },
                plugins: { tooltip: { callbacks: { label: (ctx) => `${ctx.raw}%` } } }
            }
        });
    }
}

function atualizarHeaderPeriodo() {
    const data = getCurrentData();
    const headerBadge = document.querySelector('.header-badge span');
    if (headerBadge) headerBadge.textContent = data.label;
}

function atualizarRanking() {
    const ordenarPor = document.getElementById("ordenarPor").value;
    const ranking = calcularRanking(ordenarPor);
    
    renderKpiGrid(ranking);
    renderPodium(ranking);
    renderRankingTable(ranking);
    renderInsights(ranking);
    renderCharts(ranking);
    atualizarHeaderPeriodo();
}

function setPeriodo(periodo) {
    currentPeriodo = periodo;
    
    document.querySelectorAll(".periodo-option").forEach(btn => {
        if (btn.dataset.periodo === periodo) {
            btn.classList.add("active");
        } else {
            btn.classList.remove("active");
        }
    });
    
    atualizarRanking();
}

function toggleTema() {
    document.body.classList.toggle("dark-mode");
    const btn = document.getElementById("temaBtn");
    if (document.body.classList.contains("dark-mode")) {
        btn.innerHTML = '<i class="fas fa-sun"></i><span>Modo Claro</span>';
    } else {
        btn.innerHTML = '<i class="fas fa-moon"></i><span>Modo Escuro</span>';
    }
    localStorage.setItem("rankingTema", document.body.classList.contains("dark-mode") ? "dark" : "light");
}

function exportarRanking() {
    const ranking = calcularRanking("scoreFinal");
    let csv = "Posição,Equipe,Score Final,Classificação,Média Qualidade,C1 Acesso,C2 Infantil,C3 Gestante,C4 Diabetes,C5 Hipertensão,C6 Idoso,C7 Mulher\n";
    
    ranking.forEach((item, idx) => {
        csv += `${idx + 1},"${item.equipe}",${item.scoreFinal.toFixed(2)},${item.classificacaoVinculo},${item.mediaQualidade.toFixed(1)}%,${item.c1.toFixed(1)}%,${item.c2.toFixed(1)}%,${item.c3.toFixed(1)}%,${item.c4.toFixed(1)}%,${item.c5.toFixed(1)}%,${item.c6.toFixed(1)}%,${item.c7.toFixed(1)}%\n`;
    });
    
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute("download", `ranking_aps_${currentPeriodo}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// Event Listeners
document.addEventListener("DOMContentLoaded", () => {
    atualizarRanking();
    
    document.querySelectorAll(".periodo-option").forEach(btn => {
        btn.addEventListener("click", () => setPeriodo(btn.dataset.periodo));
    });
    
    document.getElementById("temaBtn").addEventListener("click", toggleTema);
    document.getElementById("btnAtualizarRanking").addEventListener("click", atualizarRanking);
    document.getElementById("exportRankingBtn").addEventListener("click", exportarRanking);
    
    if (localStorage.getItem("rankingTema") === "dark") {
        document.body.classList.add("dark-mode");
        document.getElementById("temaBtn").innerHTML = '<i class="fas fa-sun"></i><span>Modo Claro</span>';
    }
});