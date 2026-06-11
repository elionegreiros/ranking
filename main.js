// ============================================================================
// RANKING DE QUALIDADE APS - MAIN
// ============================================================================

let currentPeriodo = "2Q";
let melhoresChart = null;
let top5Chart = null;

function getCurrentData() {
    if (currentPeriodo === "1Q") {
        return {
            qualidade: qualidadeData1Q,
            label: "1º Quadrimestre 2026"
        };
    } else {
        return {
            qualidade: qualidadeData2Q,
            label: "2º Quadrimestre 2026"
        };
    }
}

function calcularRanking(ordenarPor = "mediaGeral") {
    const data = getCurrentData();
    const qualidade = data.qualidade;
    
    const ranking = equipesAPS.map(equipe => {
        const q = qualidade[equipe];
        const mediaGeral = calcularMediaGeral(q);
        
        let valorOrdenacao;
        if (ordenarPor === "mediaGeral") valorOrdenacao = mediaGeral;
        else valorOrdenacao = q[ordenarPor];
        
        // Encontrar melhor e pior indicador
        const indicadores = [
            { nome: "C1", valor: q.c1 },
            { nome: "C2", valor: q.c2 },
            { nome: "C3", valor: q.c3 },
            { nome: "C4", valor: q.c4 },
            { nome: "C5", valor: q.c5 },
            { nome: "C6", valor: q.c6 },
            { nome: "C7", valor: q.c7 }
        ];
        const melhor = indicadores.reduce((a, b) => a.valor > b.valor ? a : b);
        const pior = indicadores.reduce((a, b) => a.valor < b.valor ? a : b);
        
        return {
            equipe: equipe.replace(" - PSF", ""),
            equipeOriginal: equipe,
            mediaGeral: mediaGeral,
            c1: q.c1,
            c2: q.c2,
            c3: q.c3,
            c4: q.c4,
            c5: q.c5,
            c6: q.c6,
            c7: q.c7,
            melhorIndicador: melhor.nome,
            melhorValor: melhor.valor,
            piorIndicador: pior.nome,
            piorValor: pior.valor,
            valorOrdenacao: valorOrdenacao
        };
    });
    
    ranking.sort((a, b) => b.valorOrdenacao - a.valorOrdenacao);
    return ranking;
}

function renderKpiGrid(ranking) {
    const container = document.getElementById("kpiGrid");
    const data = getCurrentData();
    
    const mediaGeralMunicipal = (ranking.reduce((sum, e) => sum + e.mediaGeral, 0) / ranking.length).toFixed(1);
    const melhorMedia = ranking[0]?.mediaGeral.toFixed(1) || 0;
    const melhorEquipe = ranking[0]?.equipe || "";
    const piorMedia = ranking[ranking.length - 1]?.mediaGeral.toFixed(1) || 0;
    const acimaMedia = ranking.filter(e => e.mediaGeral > 70).length;
    const melhorC2 = Math.max(...ranking.map(e => e.c2)).toFixed(1);
    
    container.innerHTML = `
        <div class="kpi-card"><h3>${mediaGeralMunicipal}%</h3><p>Média Geral Municipal</p></div>
        <div class="kpi-card"><h3>${melhorMedia}%</h3><p>Melhor Média Geral</p><small>${melhorEquipe.substring(0, 20)}</small></div>
        <div class="kpi-card"><h3>${piorMedia}%</h3><p>Pior Média Geral</p></div>
        <div class="kpi-card"><h3>${acimaMedia}/10</h3><p>Equipes com média >70%</p></div>
        <div class="kpi-card"><h3>${melhorC2}%</h3><p>Melhor C2 (Infantil)</p></div>
    `;
}

function renderPodium(ranking) {
    const container = document.getElementById("podiumContainer");
    const top3 = ranking.slice(0, 3);
    const medallas = ["🥇", "🥈", "🥉"];
    const titulos = ["Melhor Qualidade", "2º Melhor", "3º Melhor"];
    
    container.innerHTML = top3.map((item, idx) => `
        <div class="podium-card podium-${idx + 1}">
            <div class="podium-medal">${medallas[idx]}</div>
            <div class="podium-equipe"><strong>${item.equipe.substring(0, 28)}</strong></div>
            <div class="podium-score">${item.mediaGeral.toFixed(1)}%</div>
            <div class="podium-label">Média Geral (C1-C7)</div>
            <div class="podium-label" style="margin-top: 8px;">${titulos[idx]}</div>
        </div>
    `).join('');
}

function renderRankingTable(ranking, ordenarPor) {
    const tbody = document.getElementById("rankingBody");
    
    tbody.innerHTML = ranking.map((item, idx) => {
        const posicao = idx + 1;
        let posClass = "";
        if (posicao === 1) posClass = "ranking-1";
        else if (posicao === 2) posClass = "ranking-2";
        else if (posicao === 3) posClass = "ranking-3";
        
        const progressWidth = (item.mediaGeral / 100) * 100;
        const cor = item.mediaGeral >= 75 ? "#2ecc71" : (item.mediaGeral >= 50 ? "#3498db" : (item.mediaGeral >= 25 ? "#f39c12" : "#e74c3c"));
        
        return `
            <tr class="${posClass}">
                <td><strong>${posicao}º</strong></td>
                <td style="text-align: left; font-weight: 600;">${item.equipe}</td>
                <td>
                    <strong>${item.mediaGeral.toFixed(1)}%</strong>
                    <div class="progress-bar"><div class="progress-fill" style="width: ${progressWidth}%; background: ${cor};"></div></div>
                </td>
                <td>${item.c1.toFixed(1)}%</td>
                <td>${item.c2.toFixed(1)}%</td>
                <td>${item.c3.toFixed(1)}%</td>
                <td>${item.c4.toFixed(1)}%</td>
                <td>${item.c5.toFixed(1)}%</td>
                <td>${item.c6.toFixed(1)}%</td>
                <td>${item.c7.toFixed(1)}%</td>
                <td><span class="badge badge-otimo">${item.melhorIndicador}</span><br><small>${item.melhorValor.toFixed(1)}%</small></td>
                <td><span class="badge badge-regular">${item.piorIndicador}</span><br><small>${item.piorValor.toFixed(1)}%</small></td>
            </tr>
        `;
    }).join('');
}

function renderCharts(ranking) {
    // Gráfico de melhores por indicador
    const melhoresPorIndicador = {
        c1: Math.max(...ranking.map(e => e.c1)),
        c2: Math.max(...ranking.map(e => e.c2)),
        c3: Math.max(...ranking.map(e => e.c3)),
        c4: Math.max(...ranking.map(e => e.c4)),
        c5: Math.max(...ranking.map(e => e.c5)),
        c6: Math.max(...ranking.map(e => e.c6)),
        c7: Math.max(...ranking.map(e => e.c7))
    };
    
    const ctxMelhores = document.getElementById('melhoresIndicadoresChart')?.getContext('2d');
    if (ctxMelhores) {
        if (melhoresChart) melhoresChart.destroy();
        melhoresChart = new Chart(ctxMelhores, {
            type: 'bar',
            data: {
                labels: ['C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7'],
                datasets: [{
                    label: 'Melhor Percentual (%)',
                    data: Object.values(melhoresPorIndicador),
                    backgroundColor: ['#e74c3c', '#2ecc71', '#3498db', '#f39c12', '#1abc9c', '#9b59b6', '#e67e22'],
                    borderRadius: 8
                }]
            },
            options: { responsive: true, maintainAspectRatio: true, scales: { y: { beginAtZero: true, max: 100 } }, plugins: { tooltip: { callbacks: { label: (ctx) => `${ctx.raw}%` } } } }
        });
    }
    
    // Gráfico Top 5 Média Geral
    const top5 = [...ranking].sort((a, b) => b.mediaGeral - a.mediaGeral).slice(0, 5);
    const ctxTop5 = document.getElementById('top5MediaChart')?.getContext('2d');
    if (ctxTop5) {
        if (top5Chart) top5Chart.destroy();
        top5Chart = new Chart(ctxTop5, {
            type: 'bar',
            data: {
                labels: top5.map(e => e.equipe.substring(0, 20)),
                datasets: [{ label: 'Média Geral (%)', data: top5.map(e => e.mediaGeral), backgroundColor: '#2ecc71', borderRadius: 8 }]
            },
            options: { responsive: true, maintainAspectRatio: true, scales: { y: { beginAtZero: true, max: 100 } }, plugins: { tooltip: { callbacks: { label: (ctx) => `${ctx.raw}%` } } } }
        });
    }
}

function atualizarHeaderPeriodo() {
    const data = getCurrentData();
    document.getElementById("periodoLabel").textContent = data.label;
}

function atualizarRanking() {
    const ordenarPor = document.getElementById("ordenarPor").value;
    const ranking = calcularRanking(ordenarPor);
    
    renderKpiGrid(ranking);
    renderPodium(ranking);
    renderRankingTable(ranking, ordenarPor);
    renderCharts(ranking);
    atualizarHeaderPeriodo();
}

function setPeriodo(periodo) {
    currentPeriodo = periodo;
    document.querySelectorAll(".periodo-option").forEach(btn => {
        if (btn.dataset.periodo === periodo) btn.classList.add("active");
        else btn.classList.remove("active");
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
    const ranking = calcularRanking("mediaGeral");
    let csv = "Posição,Equipe,Média Geral,C1 Acesso,C2 Infantil,C3 Gestante,C4 Diabetes,C5 Hipertensão,C6 Idoso,C7 Mulher,Melhor Indicador,Pior Indicador\n";
    ranking.forEach((item, idx) => {
        csv += `${idx + 1},"${item.equipe}",${item.mediaGeral.toFixed(1)}%,${item.c1.toFixed(1)}%,${item.c2.toFixed(1)}%,${item.c3.toFixed(1)}%,${item.c4.toFixed(1)}%,${item.c5.toFixed(1)}%,${item.c6.toFixed(1)}%,${item.c7.toFixed(1)}%,${item.melhorIndicador} (${item.melhorValor.toFixed(1)}%),${item.piorIndicador} (${item.piorValor.toFixed(1)}%)\n`;
    });
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute("download", `ranking_qualidade_aps_${currentPeriodo}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// Event Listeners
document.addEventListener("DOMContentLoaded", () => {
    atualizarRanking();
    document.querySelectorAll(".periodo-option").forEach(btn => btn.addEventListener("click", () => setPeriodo(btn.dataset.periodo)));
    document.getElementById("temaBtn").addEventListener("click", toggleTema);
    document.getElementById("btnAtualizarRanking").addEventListener("click", atualizarRanking);
    document.getElementById("exportRankingBtn").addEventListener("click", exportarRanking);
    
    if (localStorage.getItem("rankingTema") === "dark") {
        document.body.classList.add("dark-mode");
        document.getElementById("temaBtn").innerHTML = '<i class="fas fa-sun"></i><span>Modo Claro</span>';
    }
});