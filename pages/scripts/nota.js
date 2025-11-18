/* Autor: Felipe Batista Bastos */

window.onload = async () => {
    const nome = localStorage.getItem("docenteName");
    const email = localStorage.getItem("docenteEmail");

    if (!nome || !email) {
        window.location.href = "login.html";
        return;
    }

    document.getElementById("docenteDisplay").textContent = nome;

    await carregarCursos();
};

/* 1. Carregar cursos */
async function carregarCursos() {
    const selectCurso = document.getElementById("select-curso");
    const docenteEmail = localStorage.getItem("docenteEmail");

    const rInst = await fetch(`http://localhost:3000/instituicoes/listar?docenteEmail=${encodeURIComponent(docenteEmail)}`);
    const instituicoes = await rInst.json();

    selectCurso.innerHTML = "";

    for (let inst of instituicoes) {
        const rCurso = await fetch(`http://localhost:3000/cursos/listar/${inst.ID_INSTITUICAO}`);
        const cursos = await rCurso.json();

        cursos.forEach(c => {
            let op = document.createElement("option");
            op.value = c.ID_CURSO;
            op.textContent = `${c.NOME} (${inst.NOME})`;
            selectCurso.appendChild(op);
        });
    }

    selectCurso.addEventListener("change", carregarDisciplinas);
    carregarDisciplinas();
}

/* 2. Carregar disciplinas */
async function carregarDisciplinas() {
    const idCurso = document.getElementById("select-curso").value;
    const selectDisc = document.getElementById("select-disciplina");

    const r = await fetch(`http://localhost:3000/disciplinas/listar/${idCurso}`);
    const disciplinas = await r.json();

    selectDisc.innerHTML = "";

    disciplinas.forEach(d => {
        let op = document.createElement("option");
        op.value = d.ID_DISCIPLINA;
        op.textContent = `${d.NOME} (${d.CODIGO})`;
        selectDisc.appendChild(op);
    });

    selectDisc.addEventListener("change", carregarTurmas);
    carregarTurmas();
}

/* 3. Carregar turmas */
async function carregarTurmas() {
    const idDisciplina = document.getElementById("select-disciplina").value;
    const selectTurma = document.getElementById("select-turma");

    const r = await fetch(`http://localhost:3000/turmas/listar/${idDisciplina}`);
    const turmas = await r.json();

    selectTurma.innerHTML = "";

    turmas.forEach(t => {
        let op = document.createElement("option");
        op.value = t.ID_TURMA;
        op.textContent = `${t.NOME} (${t.CODIGO})`;
        selectTurma.appendChild(op);
    });

    selectTurma.addEventListener("change", carregarNotas);
    carregarNotas();
}

/* 4. Carregar notas */
async function carregarNotas() {
    const idTurma = document.getElementById("select-turma").value;
    const lista = document.getElementById("lista-notas");
    const msgVazia = document.getElementById("msg-lista-vazia");

    const r = await fetch(`http://localhost:3000/nota/listar/${idTurma}`);
    const notas = await r.json();

    lista.innerHTML = "";

    if (!notas || notas.length === 0) {
        msgVazia.style.display = "block";
        return;
    }

    msgVazia.style.display = "none";

    notas.forEach(n => {
        adicionarNotaNaLista(lista, n);
    });
}

/* 5. Montar lista */
function adicionarNotaNaLista(container, nota) {
    const div = document.createElement("div");
    div.className = "list-item";

    const left = document.createElement("strong");
    left.textContent = `${nota.ALUNO} (${nota.MATRICULA})`;

    const input = document.createElement("input");
    input.type = "number";
    input.min = "0";
    input.max = "10";
    input.step = "0.01";
    input.value = nota.VALOR;
    input.className = "nota-edit";

    const btn = document.createElement("button");
    btn.textContent = "Salvar";
    btn.className = "edit-btn";

    btn.onclick = async () => {
        const novoValor = parseFloat(input.value);

        const resp = await fetch("http://localhost:3000/nota/atualizar", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idNota: nota.ID_NOTA, novoValor })
        });

        const json = await resp.json();
        if (json.success) alert("Nota atualizada!");
        else alert("Erro: " + json.error);
    };

    div.appendChild(left);
    div.appendChild(input);
    div.appendChild(btn);

    container.appendChild(div);
}