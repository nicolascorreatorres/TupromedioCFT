  
let promModGlobal = 0;
let autoCalcularActivo = false;
let autoCalcularFinalActivo = false; // <-- NUEVA VARIABLE

function lanzarConfeti() { confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: ['#2563EB', '#10B981', '#F97316'] }); }

// Función encargada de cargar los datos externos al iniciar la página
async function cargarDatosInstitucion() {
    try {
        const respuesta = await fetch('datos.json');
        if (!respuesta.ok) {
            throw new Error('No se pudo cargar el archivo datos.json');
        }
        datos = await respuesta.json();
        
        // Una vez cargados los datos, rellenamos el selector de carreras
        cargarCarreras();
    } catch (error) {
        console.error("Error al inicializar los datos:", error);
    }
}


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

    //-----VALIDACIÓN-----
    
    if (el.classList.contains('pct') || el.closest('.input-pct-wrapper')) {
        // Validación para PORCENTAJES (0 a 100)
        if (val < 0) { el.value = 0; val = 0; }
        if (val > 100) { el.value = 100; val = 100; }
        
      
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

//Cargar las carreras 
function cargarCarreras() {
    const sel = document.getElementById("carrera");
    if (!sel) return; 
    
    // Limpiar antes de cargar
    sel.innerHTML = `<option value="">Seleccione carrera...</option>`;
    
    // 'datos' es la variable que está en asignaturas.js
    for (let id in datos) {
        sel.innerHTML += `<option value="${id}">${datos[id].nombre}</option>`;
    }
}

// Cargar Semestres según la Carrera seleccionada
function cargarSemestres() {
    const cId = document.getElementById("carrera").value;
    const selSem = document.getElementById("semestre");
    const selAsig = document.getElementById("asignatura");
    
    // Limpiamos los selectores dependientes
    selSem.innerHTML = `<option value="">Seleccione semestre...</option>`;
    selAsig.innerHTML = `<option value="">Seleccione asignatura...</option>`;
    selAsig.disabled = true;
    
    if (cId && datos[cId] && datos[cId].semestres) {
        selSem.disabled = false;
        const semestres = datos[cId].semestres;
        
        // Recorremos las llaves (ej: "seme1", "seme2") para extraer su nombre ("Primer Semestre")
        for (let semId in semestres) {
            const nombreSemestre = semestres[semId].nombre;
            selSem.innerHTML += `<option value="${semId}">${nombreSemestre}</option>`;
        }
    } else {
        selSem.disabled = true;
    }
    limpiarTodo(); 
}

// Cargar Asignaturas según el Semestre seleccionado
function cargarAsignaturas() {
    const cId = document.getElementById("carrera").value;
    const semId = document.getElementById("semestre").value;
    const selAsig = document.getElementById("asignatura");
    
    selAsig.innerHTML = `<option value="">Seleccione asignatura...</option>`;
    
    if (cId && semId && datos[cId].semestres[semId]) {
        selAsig.disabled = false;
        // Apuntamos directamente al objeto "asignaturas" dentro del semestre
        const asigs = datos[cId].semestres[semId].asignaturas;
        
        for (let id in asigs) {
            selAsig.innerHTML += `<option value="${id}">${asigs[id].nombre}</option>`;
        }
    } else {
        selAsig.disabled = true;
    }
    limpiarTodo();
}

//Resetear la interfaz visual al cambiar filtros
function limpiarTodo() {
    document.getElementById("contenedor").innerHTML = "";
    document.getElementById("resultadoModulo").innerHTML = "";
    document.getElementById("resultadoFinal").innerHTML = "";
    document.getElementById("examen").value = "";
    document.getElementById("examen").disabled = true;
    document.getElementById("btnCalcularFinal").disabled = true;
    promModGlobal = 0;
}

//Marcar errores cuando no se ingresa nada
function marcarError(el, msg) {
    if (!el) return;
    limpiarError(el);
    
    // Solo marcamos error si el campo tiene algún texto/valor escrito que sea incorrecto
    if (el.value !== "") {
        el.classList.add("input-error");
        
        if (msg) {
            const errorDiv = document.createElement("div");
            errorDiv.className = "error-text"; 
            errorDiv.innerText = msg;
            
            const parent = el.closest('.input-pct-wrapper') || el.parentElement;
            parent.style.position = "relative";
            parent.appendChild(errorDiv);
        }
    }
}

//Eliminar los errores
function limpiarError(el) {
    if (!el) return;
    el.classList.remove("input-error");
    el.classList.remove("nota-ok");
    const parent = el.closest('.input-pct-wrapper') || el.parentElement;
    const error = parent.querySelector(".error-text");
    if (error) error.remove();
}

//Obtener las esctructura de noras de las asignaturas
function obtenerEstructura(horas) {
    if (horas === 36) {
        return [{p:30}, {p:40, min:2, max:5}, {p:30}]; 
    } else if (horas === 54) {
        return [{p:30}, {p:40, min:3, max:5}, {p:30}];
    } else {
        return [{p:25}, {p:25, min:3, max:5}, {p:25}, {p:25}];
    }
}

//Generar la esctructura de notas de la asignatura
//Generar la esctructura de notas de la asignatura
function generar() {
    const cId = document.getElementById("carrera").value;
    const semId = document.getElementById("semestre").value;
    const aId = document.getElementById("asignatura").value;
    const cont = document.getElementById("contenedor");

    // --- LIMPIAR RESULTADOS ANTERIORES ---
    document.getElementById("resultadoModulo").innerHTML = ""; 
    document.getElementById("resultadoFinal").innerHTML = "";  
    document.getElementById("examen").value = "";             
    promModGlobal = 0;                                        
   
    autoCalcularActivo = false;
    autoCalcularFinalActivo = false;

    if (!cId || !semId || !aId) { cont.innerHTML = ""; return; }
    
    // CORRECCIÓN AQUÍ: Se añade .asignaturas antes de [aId]
    const asignaturaData = datos[cId].semestres[semId].asignaturas[aId];
    const horas = asignaturaData.horas;
    
    const estructura = obtenerEstructura(horas);
    cont.innerHTML = "";

    estructura.forEach((parcial, i) => {
        const div = document.createElement("div");
        div.className = "parcial";
        
        let html = "";
        if (parcial.min) {
            html = `<h3>Parcial ${i+1} Acumulativas (${parcial.p}%)</h3>`;
        } else {
            html = `<h3>Parcial ${i+1} (${parcial.p}%)</h3>`;
        }
        
        if (parcial.min) {
           html += `<div id="grupo${i}"></div>
                        <button id="btnAdd${i}" class="btn-green" onclick="agregarNota(${i}, ${parcial.max}, false, ${parcial.min})">
                        <i class="fa-solid fa-plus-circle"></i> Agregar Nota Acumulativa
                        </button>
                        <button id="btnDel${i}" class="btn-red" onclick="quitarNota(${i}, ${parcial.min})">
                        <i class="fa-solid fa-circle-minus"></i> Eliminar Nota Acumulativa
                        </button>
                        <div id="infoP${i}"></div>`;
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

// Agregar nota acumulativa
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
    // Bloquea o desbloquea botones según el mínimo 
    document.getElementById(`btnAdd${idx}`).disabled = (grupo.children.length >= max);
    document.getElementById(`btnDel${idx}`).disabled = (grupo.children.length <= minRef);
    if(!isInit) calcPorcentaje(idx);
    recalcularSiAplica();
    actualizarNumeracionNotas(idx);
}

//Eliminar nota acumulatica
function quitarNota(idx, min) {
    const grupo = document.getElementById(`grupo${idx}`);
    
    if (grupo.children.length > min) {
        grupo.removeChild(grupo.lastChild);
    }
    document.getElementById(`btnAdd${idx}`).disabled = false;
    document.getElementById(`btnDel${idx}`).disabled = (grupo.children.length <= min);
    calcPorcentaje(idx);
    recalcularSiAplica(); 
    actualizarNumeracionNotas(idx);
}

//Calcular los porcentajes de la acumulativa
function calcPorcentaje(idx, el = null) {
    if(el) {
        limpiarError(el);
        if (el.value.length > 1 && el.value.startsWith('0') && !el.value.startsWith('0.')) {
            el.value = el.value.replace(/^0+/, '');
        }
        if (el.value.includes('.')) {
            let partes = el.value.split('.');
            if (partes[1].length > 1) {
                el.value = partes[0] + '.' + partes[1].substring(0, 1);
            }
        }
        let val = parseFloat(el.value);
        if (val <= 0) {
            el.value = ''; 
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
    
    // --- BARRA DE PROGRESO VISUAL DINÁMICA ---
    const porcentajeAncho = Math.min(sumaP, 100);
    const claseProgreso = esCien ? 'progress-complete' : '';

    box.innerHTML = `
        <div style="margin-top:15px; display: flex; flex-direction: column; gap: 10px;">
            <div style="border: 2px solid ${esCien ? '#10B981' : '#EF4444'}; color: ${esCien ? '#10B981' : '#EF4444'}; background: white; padding: 8px; border-radius: 12px; text-align: center; font-weight: 700; font-size: 0.9rem;">
                Porcentaje: ${sumaP}%
                <div class="progress-bar-container">
                    <div class="progress-bar-fill ${claseProgreso}" style="width: ${porcentajeAncho}%;"></div>
                </div>
            </div>
            <div style="background: ${esAprobado && esCien ? '#f0fdf4' : '#fef2f2'}; border: 2px solid ${esAprobado && esCien ? '#10B981' : '#ef4444'}; border-radius: 12px; padding: 15px; text-align: center;">
                <div style="color: #6b7280; font-size: 0.75rem; font-weight: 800; text-transform: uppercase; margin-bottom: 5px;">Nota Parcial 2</div>
                <div style="color: ${esAprobado && esCien ? '#10B981' : '#ef4444'}; font-size: 2rem; font-weight: 800; line-height: 1;">
                    ${promedioParcial.toFixed(2)}
                </div>
            </div>
        </div>
    `;
   
    const parcialContenedor = box.closest('.parcial');
    if (esAprobado && esCien) {
        parcialContenedor.classList.add('borde-aprobado');
        parcialContenedor.classList.remove('borde-reprobado');
    } else {
        parcialContenedor.classList.add('borde-reprobado');
        parcialContenedor.classList.remove('borde-aprobado');
    }

    // DISPARAR CÁLCULO EN TIEMPO REAL AUTOMÁTICO
    calcularModulos(false); 
}

//Calcular Promedio
// Marcar errores solo cuando el valor ingresado es inválido (no por estar vacío)
function marcarError(el, msg) {
    if (!el) return;
    limpiarError(el);
    
    // Solo marcamos error si el campo tiene algún texto/valor escrito que sea incorrecto
    if (el.value !== "") {
        el.classList.add("input-error");
        
        if (msg) {
            const errorDiv = document.createElement("div");
            errorDiv.className = "error-text"; 
            errorDiv.innerText = msg;
            
            const parent = el.closest('.input-pct-wrapper') || el.parentElement;
            parent.style.position = "relative";
            parent.appendChild(errorDiv);
        }
    }
}

// Eliminar los errores
function limpiarError(el) {
    if (!el) return;
    el.classList.remove("input-error");
    el.classList.remove("nota-ok");
    const parent = el.closest('.input-pct-wrapper') || el.parentElement;
    const error = parent.querySelector(".error-text");
    if (error) error.remove();
}

// Calcular Promedio en tiempo real (Optimizado para no mostrar alertas molestas si está en blanco)
// Calcular Promedio en tiempo real con explicación detallada de eximición
function calcularModulos(esManual = true) {
    document.getElementById("resultadoFinal").innerHTML = "";
    
    const cSel = document.getElementById("carrera");
    const semSel = document.getElementById("semestre"); 
    const aSel = document.getElementById("asignatura");
    const resDiv = document.getElementById("resultadoModulo");
    
    const cId = cSel.value;
    const semId = semSel.value; 
    const aId = aSel.value;

    // 1. Validar si faltan selecciones principales
    if (!cId || !semId || !aId) { 
        resDiv.innerHTML = ""; 
        return; 
    }

    const infoAsignatura = datos[cId].semestres[semId].asignaturas[aId];
    const estructura = obtenerEstructura(infoAsignatura.horas);
    
    let promedioGlobal = 0;
    let hayCamposLlenos = false;
    let parcialesReprobados = []; 

    // 2. Recorrer y calcular notas de la estructura
    estructura.forEach((p, i) => {
        const numParcial = i + 1;
        
        if (p.min) {
            const filas = document.getElementById(`grupo${i}`).children;
            let notaFinalDelParcial = 0;
            let sumaP = 0;
            
            for (let r of filas) {
                const nI = r.querySelector('.n-val');
                const pI = r.querySelector('.p-val');
                
                if (nI.value !== "" || pI.value !== "") {
                    hayCamposLlenos = true;
                }

                const n = parseFloat(nI.value) || 0;
                const pr = parseFloat(pI.value) || 0;
                
                notaFinalDelParcial += (n * (pr/100));
                sumaP += pr;
            }
            
            if (notaFinalDelParcial < 3.995 && sumaP > 0) {
                parcialesReprobados.push(`Parcial ${numParcial} (${notaFinalDelParcial.toFixed(2)})`);
            }
            promedioGlobal += notaFinalDelParcial * (p.p / 100);
        } else {
            const input = document.getElementById(`p${i}`);
            if (input.value !== "") {
                hayCamposLlenos = true;
            }
            const val = parseFloat(input.value) || 0;
            
            if (val > 0 && val < 4.0) {
                parcialesReprobados.push(`Parcial ${numParcial} (${val.toFixed(1)})`);
            }
            promedioGlobal += val * (p.p / 100);
        }
    });

    const metaInput = document.getElementById("metaNota");

    // 3. Si no hay campos llenos, limpiar todo y bloquear simulador
    if (!hayCamposLlenos) {
        resDiv.innerHTML = "";
        promModGlobal = 0;
        autoCalcularActivo = false;
        actualizarEstadoBotonFinal();
        
        if (metaInput) {
            metaInput.disabled = true;
            metaInput.value = "";
            document.getElementById("resultadoMeta").innerHTML = "";
        }
        return;
    }

    // 4. Actualizar variables globales y calcular estados
    promModGlobal = promedioGlobal;
    const tieneNotaBaja = parcialesReprobados.length > 0;
    const alcanzaPromedioEximicion = promedioGlobal >= 4.995;
    const exi = (alcanzaPromedioEximicion && !tieneNotaBaja);

    if (exi && esManual) lanzarConfeti();

    // 5. Controlar el estado del Simulador de Meta (desbloquear si ya hay promedio)
    if (metaInput) {
        if (promModGlobal > 0) {
            metaInput.disabled = false;
        } else {
            metaInput.disabled = true;
            metaInput.value = "";
            document.getElementById("resultadoMeta").innerHTML = "";
        }
    }

    // 6. Construcción del mensaje detallado con FontAwesome
    let msj = "";

    if (exi) {
        msj = `<span class="status-msg success">
                <i class="fa-solid fa-circle-check"></i> Eximido de dar Examen
               </span>`;
    } else {
        let detalleMotivo = "";
        if (alcanzaPromedioEximicion && tieneNotaBaja) {
            detalleMotivo = `Nota roja en ${parcialesReprobados.join(", ")}`;
        } else if (!alcanzaPromedioEximicion && tieneNotaBaja) {
            detalleMotivo = `Promedio bajo 5.0 y nota roja en ${parcialesReprobados.join(", ")}`;
        } else {
            detalleMotivo = `Promedio insuficiente (mínimo 5.0 para eximirse)`;
        }

        msj = `<span class="status-msg warning">
                <i class="fa-solid fa-triangle-exclamation"></i> <b>Rinde Examen:</b> ${detalleMotivo}
               </span>`;
    }
    
    resDiv.innerHTML = `Promedio (70%): <span class="nota-grande ${exi ? 'aprobado' : 'reprobado'}">${promedioGlobal.toFixed(2)}</span><div style="margin-top:10px;">${msj}</div>`;
    autoCalcularActivo = true;
    actualizarEstadoBotonFinal();
}



//Calcular nota final
function calcularFinal(esManual = true) { 
    const resFinalDiv = document.getElementById("resultadoFinal");
    const exI = document.getElementById("examen");
    
    if (promModGlobal === 0) { 
        resFinalDiv.innerHTML = `<span class="status-msg warning"><i class="fa-solid fa-triangle-exclamation"></i> Calcula primero el promedio del módulo</span>`; 
        return; 
    }

    if (exI.value === "") {
        if (document.getElementById("resultadoModulo").innerText.includes("Eximido")) {
            const nf = promModGlobal;
            
            if (esManual) lanzarConfeti(); 

            resFinalDiv.innerHTML = `Nota Final (Eximido): <span class="nota-grande aprobado">${nf.toFixed(2)}</span><div style="margin-top: 10px;"><span class="status-msg success"><i class="fa-solid fa-award"></i> APROBADO</span></div>`;
            autoCalcularFinalActivo = true;

            if (esManual) {
                resFinalDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return; 
        } else {
            return marcarError(exI, "Nota de examen requerida");
        }
    }

    const exV = parseFloat(exI.value);
    if (isNaN(exV)) return marcarError(exI, "Nota inválida");

    const nf = (promModGlobal * 0.7) + (exV * 0.3);
    const ok = nf >= 3.95; 

    if (ok && esManual) lanzarConfeti(); 

    const estadoHtml = ok 
        ? `<span class="status-msg success"><i class="fa-solid fa-award"></i> APROBADO</span>`
        : `<span class="status-msg warning"><i class="fa-solid fa-circle-xmark"></i> REPROBADO</span>`;

    resFinalDiv.innerHTML = `Nota Final: <span class="nota-grande ${ok ? 'aprobado' : 'reprobado'}">${nf.toFixed(2)}</span><div style="margin-top: 10px;">${estadoHtml}</div>`;
    autoCalcularFinalActivo = true;

    if (esManual) {
        resFinalDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

//Bloquear boton nota final
function actualizarEstadoBotonFinal() {
    const inputExamen = document.getElementById("examen"); 
    
    if (promModGlobal > 0) {
        inputExamen.disabled = false; 
    } else {
        inputExamen.disabled = true;  
    }
}

// Detectar cambios automáticamente en cualquier input o select
function recalcularSiAplica() {
    if (autoCalcularActivo) {
        calcularModulos(false); 
        
        if (autoCalcularFinalActivo) {
            calcularFinal(false); 
        }
    }
}
// Escucha cada vez que se teclea o cambia un número en toda la página
document.addEventListener('input', function(e) {
    if (e.target.tagName === 'INPUT' && e.target.type === 'number') {
        // Si cambia cualquier input numérico, recalculamos los módulos y la nota final automáticamente en segundo plano
        calcularModulos(false);
        if (document.getElementById("examen").value !== "") {
            calcularFinal(false);
        }
        calcularMeta(); // Actualiza el simulador en tiempo real
    }
});


function actualizarNumeracionNotas(idx) {
    const grupo = document.getElementById(`grupo${idx}`);
    if (!grupo) return;
    
    const inputsDeNotas = grupo.querySelectorAll('.n-val'); 

    inputsDeNotas.forEach((input, i) => {
        const numero = i + 1;
        input.placeholder = `Acumulativa ${numero} (Ej: 5.5)`;
    });
}

function calcularMeta() {
    const metaInput = document.getElementById("metaNota");
    const resMetaDiv = document.getElementById("resultadoMeta");
    
    if (!metaInput || metaInput.value === "") {
        if(resMetaDiv) resMetaDiv.innerHTML = "";
        return;
    }

    if (promModGlobal === 0) {
        resMetaDiv.innerHTML = `<div style="margin-top: 10px;"><span class="status-msg warning"><i class="fa-solid fa-triangle-exclamation"></i> Primero completa las notas de tus parciales para usar el simulador.</span></div>`;
        return;
    }

    const metaVal = parseFloat(metaInput.value);
    
    // Fórmula inversa: Nota Final = (PromMódulos * 0.7) + (Examen * 0.3)
    // Despejamos Examen: Examen = (Meta - (PromMódulos * 0.7)) / 0.3
    const notaExamenNecesaria = (metaVal - (promModGlobal * 0.7)) / 0.3;

    if (notaExamenNecesaria > 7.0) {
        resMetaDiv.innerHTML = `<div style="margin-top: 10px;"><span class="status-msg warning"><i class="fa-solid fa-circle-xmark"></i> Matemáticamente imposible llegar a un ${metaVal.toFixed(1)} (necesitarías un ${notaExamenNecesaria.toFixed(1)} en el examen).</span></div>`;
    } else if (notaExamenNecesaria <= 1.0) {
        resMetaDiv.innerHTML = `<div style="margin-top: 10px;"><span class="status-msg success"><i class="fa-solid fa-award"></i> ¡Ya tienes asegurada tu meta! Incluso con un 1.0 en el examen alcanzas o superas el ${metaVal.toFixed(1)}.</span></div>`;
    } else {
        resMetaDiv.innerHTML = `<div style="margin-top: 10px;">
            <span class="status-msg info">
                <i class="fa-solid fa-lightbulb"></i>
                <div class="status-text">Para obtener un <b>${metaVal.toFixed(1)}</b> final, necesitas sacarte al menos un <b style="font-size: 1.05rem;">${notaExamenNecesaria.toFixed(1)}</b> en el examen.</div>
            </span>
        </div>`;
    }
}
window.onload = cargarDatosInstitucion;

