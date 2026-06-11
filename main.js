// ============================================================================
// RANKING APS - MAIN
// ============================================================================

let currentPeriodo = "2Q";

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

// Calcular ranking
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

// Renderizar cards de estatísticas
function renderStatsGrid(ranking) {
    const container = document.getElementById("statsGrid");
    const data = getCurrentData();
    
    const totalEquipes = ranking.length;
    const equipesOtimo = ranking.filter(e => e.classificacaoVinculo === "ÓTIMO").length;
    const equipesBom = ranking.filter(e => e.classificacaoVinculo === "BOM").length;
    const maiorScore = ranking[0]?.scoreFinal || 0;
    const mediaGeral = (ranking.reduce((sum, e) => sum + e.mediaQualidade, 0) / totalEquipes).toFixed(1);
    
    container.innerHTML = `
        <div class="stat-card">
            <div class="stat-icon"><i class="fas fa-building"></i></div>
            <div class="stat-value">${totalEquipes}</div>
            <div class="stat-label">Equipes Avaliadas</div>
        </div>
        <div class="stat-card">
            <div class="stat-icon"><i class="fas fa-trophy"></i></div>
            <div class="stat-value">${equipesOtimo}</div>
            <div class="stat-label">Equipes ÓTIMAS</div>
        </div>
        <div class="stat-card">
            <div class="stat-icon"><i class="fas fa-chart-line"></i></div>
            <div class="stat-value">${equipesBom}</div>
            <div class="stat-label">Equipes BOM</div>
        </div>
        <div class="stat-card">
            <div class="stat-icon"><i class="fas fa-star"></i></div>
            <div class="stat-value">${maiorScore}</div>
            <div class="stat-label">Maior Score Final</div>
        </div>
        <div class="stat-card">
            <div class="stat-icon"><i class="fas fa-chart-simple"></i></div>
            <div class="stat-value">${mediaGeral}%</div>
            <div class="stat-label">Média Qualidade</div>
        </div>
    `;
}

// Renderizar pódio
function renderPodium(ranking) {
    const container = document.getElementById("podium");
    const top3 = ranking.slice(0, 3);
    
    const medallas = ["🥇", "🥈", "🥉"];
    const cores = ["#FFD700", "#C0C0C0", "#CD7F32"];
    
    container.innerHTML = top3.map((item, idx) => `
        <div class="podium-card podium-${idx + 1}" style="background: linear-gradient(135deg, ${cores[idx]}, ${cores[idx]}dd);">
            <div class="podium-medal">${medallas[idx]}</div>
            <div class="podium-equipe"><strong>${item.equipe.substring(0, 25)}</strong></div>
            <div class="podium-score">${item.scoreFinal.toFixed(2)}</div>
            <div class="podium-label">Score Final</div>
            <div class="podium-label" style="margin-top: 5px;">${item.classificacaoVinculo}</div>
        </div>
    `).join('');
}

// Renderizar tabela de ranking
function renderRankingTable(ranking, ordenarPor) {
    const tbody = document.getElementById("rankingBody");
    
    tbody.innerHTML = ranking.map((item, idx) => {
        const posicao = idx + 1;
        let posClass = "";
        if (posicao === 1) posClass = "ranking-1";
        else if (posicao === 2) posClass = "ranking-2";
        else if (posicao === 3) posClass = "ranking-3";
        
        // Tendência simulada (comparação com período anterior)
        let tendencia = '<span class="tendencia-stable"><i class="fas fa-minus"></i> 0</span>';
        
        return `
            <tr class="${posClass}">
                <td><strong>${posicao}º</strong></td>
                <td style="text-align: left; font-weight: 600;">${item.equipe}</td>
                <td><strong>${item.scoreFinal.toFixed(2)}</strong><br><span class="badge ${badgeClass(item.classificacaoVinculo)}">${item.classificacaoVinculo}</span></td>
                <td><strong>${item.mediaQualidade.toFixed(1)}%</strong></td>
                <td>${item.c1.toFixed(1)}%</td>
                <td>${item.c2.toFixed(1)}%</td>
                <td>${item.c3.toFixed(1)}%</td>
                <td>${item.c4.toFixed(1)}%</td>
                <td>${item.c5.toFixed(1)}%</td>
                <td>${item.c6.toFixed(1)}%</td>
                <td>${item.c7.toFixed(1)}%</td>
                <td>${tendencia}</td>
            </tr>
        `;
    }).join('');
}

// Renderizar cards de destaque
function renderDestaques(ranking) {
    const container = document.getElementById("destaquesGrid");
    
    // Melhor C2 (Desenvolvimento Infantil)
    const melhorC2 = [...ranking].sort((a, b) => b.c2 - a.c2)[0];
    // Melhor C4 (Diabetes)
    const melhorC4 = [...ranking].sort((a, b) => b.c4 - a.c4)[0];
    // Maior evolução (simulado)
    const maiorEvolucao = ranking[0];
    
    container.innerHTML = `
        <div class="destaque-card">
            <div class="destaque-title"><i class="fas fa-child"></i> Melhor C2 - Desenvolvimento Infantil</div>
            <div class="destaque-item"><span>🏆 Equipe</span><span><strong>${melhorC2.equipe}</strong></span></div>
            <div class="destaque-item"><span>📊 Percentual</span><span><strong>${melhorC2.c2.toFixed(1)}%</strong></span></div>
            <div class="destaque-item"><span>⭐ Classificação</span><span class="badge ${badgeClass(classificarVinculo(melhorC2.scoreFinal))}">${classificarVinculo(melhorC2.scoreFinal)}</span></div>
        </div>
        <div class="destaque-card">
            <div class="destaque-title"><i class="fas fa-heartbeat"></i> Melhor C4 - Diabetes</div>
            <div class="destaque-item"><span>🏆 Equipe</span><span><strong>${melhorC4.equipe}</strong></span></div>
            <div class="destaque-item"><span>📊 Percentual</span><span><strong>${melhorC4.c4.toFixed(1)}%</strong></span></div>
            <div class="destaque-item"><span>⭐ Classificação</span><span class="badge ${badgeClass(classificarVinculo(melhorC4.scoreFinal))}">${classificarVinculo(melhorC4.scoreFinal)}</span></div>
        </div>
        <div class="destaque-card">
            <div class="destaque-title"><i class="fas fa-crown"></i> Líder do Ranking</div>
            <div class="destaque-item"><span>🏆 Equipe</span><span><strong>${maiorEvolucao.equipe}</strong></span></div>
            <div class="destaque-item"><span>📊 Score Final</span><span><strong>${maiorEvolucao.scoreFinal.toFixed(2)}</strong></span></div>
            <div class="destaque-item"><span>⭐ Média Qualidade</span><span><strong>${maiorEvolucao.mediaQualidade.toFixed(1)}%</strong></span></div>
        </div>
    `;
}

// Atualizar todo o ranking
function atualizarRanking() {
    const ordenarPor = document.getElementById("ordenarPor").value;
    const ranking = calcularRanking(ordenarPor);
    
    renderStatsGrid(ranking);
    renderPodium(ranking);
    renderRankingTable(ranking, ordenarPor);
    renderDestaques(ranking);
    
    // Atualizar título do período
    const data = getCurrentData();
    document.querySelector(".header-content p").innerHTML = `Valença do Piauí - PI | ${data.label}`;
}

// Alternar período
function setPeriodo(periodo) {
    currentPeriodo = periodo;
    
    // Atualizar botões
    document.querySelectorAll(".periodo-btn").forEach(btn => {
        if (btn.dataset.periodo === periodo) {
            btn.classList.add("active");
        } else {
            btn.classList.remove("active");
        }
    });
    
    atualizarRanking();
}

// Alternar tema
function toggleTema() {
    document.body.classList.toggle("dark-mode");
    const btn = document.getElementById("temaBtn");
    if (document.body.classList.contains("dark-mode")) {
        btn.innerHTML = '<i class="fas fa-sun"></i> Claro';
    } else {
        btn.innerHTML = '<i class="fas fa-moon"></i> Escuro';
    }
}

// Event listeners
document.addEventListener("DOMContentLoaded", () => {
    atualizarRanking();
    
    // Botões de período
    document.querySelectorAll(".periodo-btn").forEach(btn => {
        btn.addEventListener("click", () => setPeriodo(btn.dataset.periodo));
    });
    
    // Botão de tema
    document.getElementById("temaBtn").addEventListener("click", toggleTema);
    
    // Botão atualizar ranking
    document.getElementById("btnAtualizarRanking").addEventListener("click", atualizarRanking);
    
    // Salvar tema preferido
    if (localStorage.getItem("rankingTema") === "dark") {
        document.body.classList.add("dark-mode");
        document.getElementById("temaBtn").innerHTML = '<i class="fas fa-sun"></i> Claro';
    }
});

// Salvar tema ao alterar
document.addEventListener("click", (e) => {
    if (e.target.closest("#temaBtn")) {
        localStorage.setItem("rankingTema", document.body.classList.contains("dark-mode") ? "dark" : "light");
    }
});