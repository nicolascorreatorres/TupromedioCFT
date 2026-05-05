  
let promModGlobal = 0;
let autoCalcularActivo = false;
let autoCalcularFinalActivo = false; // <-- NUEVA VARIABLE

function lanzarConfeti() { confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: ['#2563EB', '#10B981', '#F97316'] }); }

function validarNota(el) {
    limpiarError(el);
    el.classList.remove("nota-reprobada", "nota-ok");
    const parcialContenedor = el.closest('.parcial');

    if (el.value === "") {
        if (parcialContenedor) {
            parcialContenedor.classList.add('borde-reprobado');
            parcialContenedor.classList.remove('borde-aprobado');
        }
        marcarError(el, "Requerido");
        return;
    }
 
    // <-- NUEVO: Limitar a máximo 1 decimal mientras el usuario teclea -->
    if (el.value.includes('.')) {
        let partes = el.value.split('.');
        if (partes[1].length > 1) {
            el.value = partes[0] + '.' + partes[1].substring(0, 1);
        }
    }

    let val = parseFloat(el.value);

    // --- NUEVA LÓGICA DE VALIDACIÓN ---
    
    // Si el input tiene la clase 'pct' o está dentro de un 'input-pct-wrapper'
    if (el.classList.contains('pct') || el.closest('.input-pct-wrapper')) {
        // Validación para PORCENTAJES (0 a 100)
        if (val < 0) { el.value = 0; val = 0; }
        if (val > 100) { el.value = 100; val = 100; }
        
        // Los porcentajes no suelen marcar el borde del parcial como reprobado, 
        // así que solo validamos que sea un número correcto.
    } else {
        // Validación para NOTAS (1 a 7)
        if (val < 1) { el.value = 1; val = 1; }
        if (val > 7) { el.value = 7; val = 7; }

        // Aplicar colores de aprobado/reprobado solo a las NOTAS
        if (val < 4) {
            el.classList.add("nota-reprobada");
            if (parcialContenedor) {
                parcialContenedor.classList.add('borde-reprobado');
                parcialContenedor.classList.remove('borde-aprobado');
            }
        } else {
            el.classList.add("nota-ok");
            if (parcialContenedor) {
                parcialContenedor.classList.add('borde-aprobado');
                parcialContenedor.classList.remove('borde-reprobado');
            }
        }
    }
}

function cargarCarreras() {
    const sel = document.getElementById("carrera");
    if (!sel) return; // Seguridad por si el ID cambió
    
    // Limpiar antes de cargar
    sel.innerHTML = `<option value="">Seleccione carrera...</option>`;
    
    // 'datos' es la variable que está en asignaturas.js
    for (let id in datos) {
        sel.innerHTML += `<option value="${id}">${datos[id].nombre}</option>`;
    }
}

function cargarSemestres() {
    const cId = document.getElementById("carrera").value;
    const selSem = document.getElementById("semestre");
    const selAsig = document.getElementById("asignatura");
    
    // Limpiamos los selectores que dependen de este
    selSem.innerHTML = `<option value="">Seleccione semestre...</option>`;
    selAsig.innerHTML = `<option value="">Seleccione asignatura...</option>`;
    selAsig.disabled = true;
    
    if (cId && datos[cId].semestres) {
        selSem.disabled = false;
        // Obtenemos las claves de los semestres (ej: "Semestre 1", "Semestre 2")
        Object.keys(datos[cId].semestres).forEach(sem => {
            selSem.innerHTML += `<option value="${sem}">${sem}</option>`;
        });
    } else {
        selSem.disabled = true;
    }
    limpiarTodo(); // Función para borrar cálculos previos si el usuario cambia la carrera
}

function cargarAsignaturas() {
    const cId = document.getElementById("carrera").value;
    const semId = document.getElementById("semestre").value;
    const selAsig = document.getElementById("asignatura");
    
    selAsig.innerHTML = `<option value="">Seleccione asignatura...</option>`;
    
    if (cId && semId && datos[cId].semestres[semId]) {
        selAsig.disabled = false;
        const asigs = datos[cId].semestres[semId];
        for (let id in asigs) {
            selAsig.innerHTML += `<option value="${id}">${asigs[id].nombre}</option>`;
        }
    } else {
        selAsig.disabled = true;
    }
    limpiarTodo();
}

// Función auxiliar para resetear la interfaz visual al cambiar filtros
function limpiarTodo() {
    document.getElementById("contenedor").innerHTML = "";
    document.getElementById("resultadoModulo").innerHTML = "";
    document.getElementById("resultadoFinal").innerHTML = "";
    document.getElementById("examen").value = "";
    document.getElementById("examen").disabled = true;
    document.getElementById("btnCalcularFinal").disabled = true;
    promModGlobal = 0;
}

function marcarError(el, msg) {
    limpiarError(el);
    el.classList.add("input-error");
    
    if (msg) {
        const errorDiv = document.createElement("div");
        errorDiv.className = "error-text"; 
        errorDiv.innerText = msg;
        
        // Buscamos el div que envuelve al input
        // En parcial 1 es el .parcial > div, en el 2 es el .acum > div
        const parent = el.closest('.input-pct-wrapper') || el.parentElement;
        parent.style.position = "relative"; // Nos aseguramos que tenga posicion relativa
        parent.appendChild(errorDiv);
    }
}

function limpiarError(el) {
    el.classList.remove("input-error");
    el.classList.remove("nota-ok");
    const error = el.parentNode.querySelector(".error-text");
    if (error) error.remove();
}

function obtenerEstructura(horas) {
    if (horas === 36) {
        return [{p:30}, {p:40, min:2, max:5}, {p:30}]; 
    } else if (horas === 54) {
        return [{p:30}, {p:40, min:3, max:5}, {p:30}];
    } else {
        return [{p:25}, {p:25, min:3, max:5}, {p:25}, {p:25}];
    }
}

function generar() {
    const cId = document.getElementById("carrera").value;
    const semId = document.getElementById("semestre").value; // <--- Nueva variable
    const aId = document.getElementById("asignatura").value;
    const cont = document.getElementById("contenedor");

    // --- NUEVAS LÍNEAS PARA LIMPIAR RESULTADOS ANTERIORES ---
    document.getElementById("resultadoModulo").innerHTML = ""; // Limpia el promedio 70%
    document.getElementById("resultadoFinal").innerHTML = "";  // Limpia la nota final
    document.getElementById("examen").value = "";             // Limpia el input del examen
    promModGlobal = 0;                                         // Resetea la variable lógica
    // -------------------------------------------------------
    autoCalcularActivo = false;
    autoCalcularFinalActivo = false;

    if (!cId || !semId || !aId) { cont.innerHTML = ""; return; }
    
    const asignaturaData = datos[cId].semestres[semId][aId];
    const horas = asignaturaData.horas;
    
    const estructura = obtenerEstructura(horas);
    cont.innerHTML = "";

    estructura.forEach((parcial, i) => {
        const div = document.createElement("div");
        div.className = "parcial";
        // <-- NUEVO: Verificamos si es el parcial de acumulativas para cambiar el título
        let html = "";
        if (parcial.min) {
            html = `<h3>Parcial ${i+1} - Acumulativas (${parcial.p}%)</h3>`;
        } else {
            html = `<h3>Parcial ${i+1} (${parcial.p}%)</h3>`;
        }
        
        if (parcial.min) {
            html += `<div id="grupo${i}"></div>
                        <div id="infoP${i}"></div>
                        <button id="btnAdd${i}" class="btn-green" onclick="agregarNota(${i}, ${parcial.max}, false, ${parcial.min})">
                        <i class="fa-solid fa-plus-circle"></i> Agregar Nota Acumulativa
                        </button>
                        <button id="btnDel${i}" class="btn-red" onclick="quitarNota(${i}, ${parcial.min})">
                        <i class="fa-solid fa-circle-minus"></i> Eliminar Nota Acumulativa
                        </button>`;
        } else {
            html += `<input type="number" id="p${i}" min="1" max="7" step="0.1" placeholder="Ej: 5.5" oninput="validarNota(this)">`;
        }
        
        div.innerHTML = html;
        cont.appendChild(div);
        
        if (parcial.min) {
            for(let n=0; n < parcial.min; n++) {
                agregarNota(i, parcial.max, true, parcial.min);
            }
        }
    });

    actualizarEstadoBotonFinal();
}

// Ajuste en agregarNota para manejar el botón de eliminar correctamente desde el inicio
function agregarNota(idx, max, isInit = false, minRef = 3) {
    const grupo = document.getElementById(`grupo${idx}`);
    if (grupo.children.length < max) {
        const row = document.createElement("div");
        row.className = "acum";
        row.innerHTML = `
            <div>
                <input type="number" min="1" max="7" step="0.1" class="n-val" placeholder="Ej: 5.5" 
                    oninput="validarNota(this); calcPorcentaje(${idx})">
            </div>
            <div class="input-pct-wrapper">
                <input type="number" min="1" max="100" placeholder="Porcentaje" class="p-val" 
                    oninput="calcPorcentaje(${idx}, this)">
            </div>`;
        grupo.appendChild(row);
    }
    // Bloquea o desbloquea botones según el mínimo real (minRef)
    document.getElementById(`btnAdd${idx}`).disabled = (grupo.children.length >= max);
    document.getElementById(`btnDel${idx}`).disabled = (grupo.children.length <= minRef);
    if(!isInit) calcPorcentaje(idx);
    recalcularSiAplica(); // <-- NUEVO
    actualizarNumeracionNotas(idx);
}

function quitarNota(idx, min) {
    const grupo = document.getElementById(`grupo${idx}`);
    // Ahora usa el parámetro 'min' que viene de la estructura
    if (grupo.children.length > min) {
        grupo.removeChild(grupo.lastChild);
    }
    document.getElementById(`btnAdd${idx}`).disabled = false;
    document.getElementById(`btnDel${idx}`).disabled = (grupo.children.length <= min);
    calcPorcentaje(idx);
    recalcularSiAplica(); // <-- NUEVO
    actualizarNumeracionNotas(idx);
}

function calcPorcentaje(idx, el = null) {
    if(el) {
        limpiarError(el);
        
        // 1. Evitar múltiples ceros a la izquierda (ej. "00005" -> "5"). 
        // Ignoramos si empieza con "0." para no bloquear decimales como "0.5"
        if (el.value.length > 1 && el.value.startsWith('0') && !el.value.startsWith('0.')) {
            el.value = el.value.replace(/^0+/, '');
        }

        // <-- NUEVO: Limitar a máximo 1 decimal mientras el usuario teclea -->
        if (el.value.includes('.')) {
            let partes = el.value.split('.');
            if (partes[1].length > 1) {
                el.value = partes[0] + '.' + partes[1].substring(0, 1);
            }
        }

        let val = parseFloat(el.value);
        
        // 2. Prevenir el 0% y números negativos
        if (val <= 0) {
            el.value = ''; // Lo vaciamos para obligar al usuario a poner un valor > 0
        } else if (val > 100) {
            el.value = 100;
        }
    }
    
    const grupo = document.getElementById(`grupo${idx}`).children;
    let sumaP = 0;
    let promedioParcial = 0;
    
    for (let r of grupo) {
        const inputN = r.querySelector('.n-val');
        const inputP = r.querySelector('.p-val');
        
        let n = parseFloat(inputN.value) || 0;
        let p = parseFloat(inputP.value) || 0;

        if (el && el.classList.contains('p-val')) {
            if (sumaP + p > 100) {
                p = 100 - sumaP;
                inputP.value = p;
            }
        }
        
        sumaP += p;
        promedioParcial += (n * (p / 100));
    }

    const box = document.getElementById(`infoP${idx}`);
    const esCien = (sumaP === 100);
    const esAprobado = (promedioParcial >= 4.0);
    
    box.innerHTML = `
        <div style="margin-top:15px; display: flex; flex-direction: column; gap: 10px;">
            <div style="border: 2px solid ${esCien ? '#10B981' : '#EF4444'}; color: ${esCien ? '#10B981' : '#EF4444'}; background: white; padding: 8px; border-radius: 12px; text-align: center; font-weight: 700; font-size: 0.9rem;">
                Porcentaje: ${sumaP}%
            </div>
            <div style="background: ${esAprobado && esCien ? '#f0fdf4' : '#fef2f2'}; border: 2px solid ${esAprobado && esCien ? '#10B981' : '#ef4444'}; border-radius: 12px; padding: 15px; text-align: center;">
                <div style="color: #6b7280; font-size: 0.75rem; font-weight: 800; text-transform: uppercase; margin-bottom: 5px;">Promedio de Parcial 2</div>
                <div style="color: ${esAprobado && esCien ? '#10B981' : '#ef4444'}; font-size: 2rem; font-weight: 800; line-height: 1;">
                    ${promedioParcial.toFixed(2)}
                </div>
            </div>
        </div>
    `;
    // ... (dentro de calcPorcentaje, al final)
    const parcialContenedor = box.closest('.parcial');
    if (esAprobado && esCien) {
        parcialContenedor.classList.add('borde-aprobado');
        parcialContenedor.classList.remove('borde-reprobado');
    } else {
        parcialContenedor.classList.add('borde-reprobado');
        parcialContenedor.classList.remove('borde-aprobado');
    }
}


function calcularModulos(esManual = true) {
    document.getElementById("resultadoFinal").innerHTML = "";
    
    // Capturamos los 3 selectores
    const cSel = document.getElementById("carrera");
    const semSel = document.getElementById("semestre"); // <-- NUEVO
    const aSel = document.getElementById("asignatura");
    const resDiv = document.getElementById("resultadoModulo");
    
    const cId = cSel.value;
    const semId = semSel.value; // <-- NUEVO
    const aId = aSel.value;

    // 1. VALIDACIÓN DE LOS 3 SELECTORES (Aquí se pinta de rojo el semestre)
    if (!cId || !semId || !aId) { 
        if (!cId) marcarError(cSel); 
        if (!semId) marcarError(semSel); 
        if (!aId) marcarError(aSel);
        resDiv.innerHTML = `<b style="color:var(--color-danger)">⚠️ Selecciona carrera, semestre y asignatura</b>`; 
        setTimeout(() => { limpiarError(cSel); limpiarError(semSel); limpiarError(aSel); }, 2000);
        return; 
    }

    // 2. CAMBIO DE RUTA: Buscamos las horas incluyendo el semestre
    const infoAsignatura = datos[cId].semestres[semId][aId];
    const estructura = obtenerEstructura(infoAsignatura.horas);
    
    let promedioGlobal = 0;
    let hayError = false;
    let incumplimientoReglamento = false; 

    // 3. VALIDACIÓN DE CAMPOS DE NOTAS (Al arreglar la ruta, esto volverá a funcionar)
    estructura.forEach((p, i) => {
        if (p.min) {
            const filas = document.getElementById(`grupo${i}`).children;
            let notaFinalDelParcial = 0;
            let sumaP = 0;
            for (let r of filas) {
                const nI = r.querySelector('.n-val');
                const pI = r.querySelector('.p-val');
                const n = parseFloat(nI.value);
                const pr = parseFloat(pI.value);

                if (isNaN(n)) { marcarError(nI, "Requerido"); hayError = true; }
                if (isNaN(pr)) { marcarError(pI, "Requerido"); hayError = true; }
                
                notaFinalDelParcial += (n * (pr/100));
                sumaP += pr;
            }
            if (sumaP !== 100) hayError = true;
            if (notaFinalDelParcial < 3.995) incumplimientoReglamento = true; 
            promedioGlobal += notaFinalDelParcial * (p.p / 100);
        } else {
            const input = document.getElementById(`p${i}`);
            const val = parseFloat(input.value);
            if (isNaN(val)) { marcarError(input, "Requerido"); hayError = true; }
            if (val < 4.0) incumplimientoReglamento = true;
            promedioGlobal += val * (p.p / 100);
        }
    });

    if (hayError) { resDiv.innerHTML = `<b style="color:var(--color-danger)">⚠️ Revisa los campos y que el porcentaje de parcial 2 sea 100%</b>`; return; }

    promModGlobal = promedioGlobal;
    const exi = (promedioGlobal >= 4.995 && !incumplimientoReglamento);
    if (exi && esManual) lanzarConfeti();

    let msj = exi 
        ? ` 🎉 Eximido de dar Examen` 
        : (promedioGlobal >= 4.995 ? ` ☹️ Rinde Examen (Nota parcial menor a 4)` : ` ☹️ Rinde Examen`);
    
    resDiv.innerHTML = `Promedio (70%): <span class="nota-grande ${exi?'aprobado':'reprobado'}">${promedioGlobal.toFixed(2)}</span> <b>${msj}</b>`;
    autoCalcularActivo = true;
    actualizarEstadoBotonFinal();

    if (esManual) {
        resDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

function calcularFinal(esManual = true) { 
    const resFinalDiv = document.getElementById("resultadoFinal");
    const exI = document.getElementById("examen");
    
    if (promModGlobal === 0) { 
        resFinalDiv.innerHTML = `<span class="aviso-naranja">⚠️ Calcula primero el promedio del módulo</span>`; 
        return; 
    }

    // CASO 1: EL INPUT DEL EXAMEN ESTÁ VACÍO
    if (exI.value === "") {
        if (document.getElementById("resultadoModulo").innerText.includes("Eximido")) {
            const nf = promModGlobal;
            
            if (esManual) lanzarConfeti(); 

            resFinalDiv.innerHTML = `Nota Final (Eximido): <span class="nota-grande aprobado">${nf.toFixed(2)}</span> <b>🎉 APROBADO</b>`;
            autoCalcularFinalActivo = true;

            // <-- SCROLL PARA EL ALUMNO EXIMIDO
            if (esManual) {
                resFinalDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return; // Aquí se detiene la función, por eso necesitamos el scroll arriba también
        } else {
            return marcarError(exI, "Nota de examen requerida");
        }
    }

    // CASO 2: EL ALUMNO RINDE EXAMEN (HAY NOTA ESCRITA)
    const exV = parseFloat(exI.value);
    if (isNaN(exV)) return marcarError(exI, "Nota inválida");

    const nf = (promModGlobal * 0.7) + (exV * 0.3);
    const ok = nf >= 3.95; 

    if (ok && esManual) lanzarConfeti(); 

    resFinalDiv.innerHTML = `Nota Final: <span class="nota-grande ${ok?'aprobado':'reprobado'}">${nf.toFixed(2)}</span> <b>${ok?'🎉 APROBADO':'❌ REPROBADO'}</b>`;
    autoCalcularFinalActivo = true;

    // <-- SCROLL PARA EL ALUMNO QUE RINDIÓ EXAMEN
    if (esManual) {
        resFinalDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}


function actualizarEstadoBotonFinal() {
    const btn = document.getElementById("btnCalcularFinal");
    const inputExamen = document.getElementById("examen"); // Referencia al input
    
    if (promModGlobal > 0) {
        btn.disabled = false;
        inputExamen.disabled = false; // Se desbloquea
    } else {
        btn.disabled = true;
        inputExamen.disabled = true;  // Se bloquea
    }
}

// Detectar cambios automáticamente en cualquier input o select

function recalcularSiAplica() {
    if (autoCalcularActivo) {
        calcularModulos(false); 
        
        if (autoCalcularFinalActivo) {
            calcularFinal(false); // <-- LE PASAMOS FALSE PARA APAGAR EL CONFETI
        }
    }
}
// Escucha cada vez que se teclea o cambia un número en toda la página
document.addEventListener('input', function(e) {
    if (e.target.tagName === 'INPUT' && e.target.type === 'number') {
        recalcularSiAplica();
    }
});

function actualizarNumeracionNotas(idx) {
    const grupo = document.getElementById(`grupo${idx}`);
    if (!grupo) return;
    
    // Buscamos solo los inputs de notas (que en tu código tienen la clase 'n-val')
    const inputsDeNotas = grupo.querySelectorAll('.n-val'); 

    inputsDeNotas.forEach((input, i) => {
        const numero = i + 1;
        input.placeholder = `Acumulativa ${numero} (Ej: 5.5)`;
    });
}

window.onload = cargarCarreras;

