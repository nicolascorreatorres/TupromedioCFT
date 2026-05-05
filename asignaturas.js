// asignaturas.js
const datos = {
    informatica: {
        nombre: "TNS EN INFORMÁTICA CON ESPECIALIDAD EN PROGRAMACIÓN",
        semestres: {
            "Primer Semestre": {
                int: { nombre: "INTRODUCCIÓN A LA COMPUTACIÓN, INFORMÁTICA Y PROGRAMACIÓN", horas: 90 },
                bd: { nombre: "FUNDAMENTOS DE BASES DE DATOS", horas: 54 },
                mat: { nombre: "MATEMÁTICA APLICADA A LA TECNOLOGÍA", horas: 90 },
                ing: { nombre: "INGLÉS CERTIFICABLE I", horas: 36 },
                com: { nombre: "COMPUTACIÓN CERTIFICABLE I", horas: 54 },
                val: { nombre: "CULTURA VALÓRICA I", horas: 36 },
            },
            "Tercer Semestre": {
                pro: { nombre: "PROGRAMACIÓN INTERMEDIA", horas: 36 },
                bd2: { nombre: "BASES DE DATOS II", horas: 54 },
                red: { nombre: "CIBERSEGURIDAD, CONTROL Y MONITOREO DE REDES", horas: 72 },
                rob: { nombre: "AUTOMATIZACIÓN Y ROBÓTICA I", horas: 36 },
                ing3: { nombre: "INGLÉS CERTIFICABLE III", horas: 36 },
                com3: { nombre: "COMPUTACIÓN CERTIFICABLE III", horas: 54 },
                val3: { nombre: "CULTURA VALÓRICA III", horas: 36 },
            }
        }
    },

    informatica2: {
        nombre: "TNS EN INFORMÁTICA CON ESPECIALIDAD EN CIBERSEGURIDAD",
        semestres: {
            "Primer Semestre": {
                int: { nombre: "INTRODUCCIÓN A LA COMPUTACIÓN, INFORMÁTICA Y PROGRAMACIÓN", horas: 90 },
                bd: { nombre: "FUNDAMENTOS DE BASES DE DATOS", horas: 54 },
                mat: { nombre: "MATEMÁTICA APLICADA A LA TECNOLOGÍA", horas: 90 },
                ing: { nombre: "INGLÉS CERTIFICABLE I", horas: 36 },
                com: { nombre: "COMPUTACIÓN CERTIFICABLE I", horas: 54 },
                val: { nombre: "CULTURA VALÓRICA I", horas: 36 },
            },
            "Tercer Semestre": {
                cri: { nombre: "CRIPTOGRAFÍA APLICADA A LA CIBERSEGURIDAD", horas: 90 },
                cmb: { nombre: "CIBERSEGURIDAD, CONTROL Y MONITOREO DE BASE DE DATOS", horas: 54 },
                cmr: { nombre: "CIBERSEGURIDAD, CONTROL Y MONITOREO DE REDES", horas: 72 },
                lns: { nombre: "LEGISLACIÓN Y NORMATIVAS DE CIBERSEGURIDAD", horas: 54 },
                ing3: { nombre: "INGLÉS CERTIFICABLE III", horas: 36 },
                com3: { nombre: "COMPUTACIÓN CERTIFICABLE III", horas: 54 },
                val3: { nombre: "CULTURA VALÓRICA III", horas: 36 },
            }
        }
    },

    administracion: {
        nombre: "TNS ADMINISTRACIÓN DE EMPRESAS",
        semestres: {
            "Primer Semestre": {
                admg: { nombre: "ADMINISTRACIÓN GENERAL  ", horas: 54 },
                mat: { nombre: "MATEMÁTICA", horas: 54 },
                tem: { nombre: "TALLER DE EMPRENDIMIENTO", horas: 36 },
                cog: { nombre: "CONTABILIDAD GENERAL", horas: 54 },
                iec: { nombre: "INTRODUCCIÓN A LA ECONOMÍA", horas: 54 },
                ing: { nombre: "INGLÉS CERTIFICABLE I", horas: 36 },
                com: { nombre: "COMPUTACIÓN CERTIFICABLE I", horas: 54 },
                val: { nombre: "CULTURA VALÓRICA I", horas: 36 },
            },
            "Tercer Semestre": {
                admo: { nombre: "ADMINISTRACIÓN OPERACIONAL", horas: 36 },
                tmar: { nombre: "TALLER DE MARKETING I", horas: 54 },
                gre: { nombre: "GESTIÓN DE REDES Y MANEJO ERP I", horas: 72 },
                nec: { nombre: "NEGOCIACIÓN COLECTIVA I", horas: 36 },
                llc: { nombre: "LEGISLACIÓN LABORAL Y COMERCIAL", horas: 54 },
                ing3: { nombre: "INGLÉS CERTIFICABLE III", horas: 36 },
                com3: { nombre: "COMPUTACIÓN CERTIFICABLE III", horas: 54 },
                val3: { nombre: "CULTURA VALÓRICA III", horas: 36 },
            }
        }
    },

    parvulo: {
        nombre: "TNS EDUCACIÓN PARVULARIA",
        semestres: {
            "Primer Semestre": {
                bie: { nombre: "BIENESTAR DEL NIÑO", horas: 54 },
                psd: { nombre: "PSICOLOGÍA DEL DESARROLLO I", horas: 54 },
                iep: { nombre: "INTRODUCCIÓN A LA EDUCACIÓN PARVULARIA", horas: 90 },
                adi: { nombre: "ATENCIÓN A LA DIVERSIDAD E INCLUSIÓN", horas: 54 },
                ing: { nombre: "INGLÉS CERTIFICABLE I", horas: 36 },
                com: { nombre: "COMPUTACIÓN CERTIFICABLE I", horas: 54 },
                val: { nombre: "CULTURA VALÓRICA I", horas: 36 },// ...
            },
           "Tercer Semestre": {
               bie: { nombre: "NEUROCIENCIAS PARA EL APRENDIZAJE ", horas: 36 },
                pda: { nombre: "PSICOLOGÍA DEL APRENDIZAJE ", horas: 36 },
                eve: { nombre: "EVALUACIÓN EDUCACIONAL", horas: 36 },
                pra: { nombre: "PRÁCTICA I DE OBSERVACIÓN ", horas: 72 },
                cmi: { nombre: "COMUNICACIÓN INTEGRAL", horas: 72 },
                ing3: { nombre: "INGLÉS CERTIFICABLE III", horas: 36 },
                cmp3: { nombre: "COMPUTACIÓN CERTIFICABLE III", horas: 54 },// ...
                val3: { nombre: "CULTURA VALÓRICA III", horas: 36 },// ...
            },
           
        }
    },

    educacionbasica: {
        nombre: "TNS EDUCACIÓN BÁSICA CON ESPECILIDAD EN INCLUSIÓN",
        semestres: {
            "Primer Semestre": {
                feb: { nombre: "FUNDAMENTOS DE LA EDUCACIÓN BÁSICA E INCLUSIÓN", horas: 72 },
                psd: { nombre: "PSICOLOGÍA DEL DESARROLLO Y DEL APRENDIZAJE", horas: 72 },
                cye: { nombre: "CURRÍCULUM Y EVALUACIÓN", horas: 72 },
                dlc: { nombre: "DIDÁCTICA DEL LENGUAJE Y COMUNICACIÓN", horas: 72 },
                ing: { nombre: "INGLÉS CERTIFICABLE I", horas: 36 },
                com: { nombre: "COMPUTACIÓN CERTIFICABLE I", horas: 54 },
                val: { nombre: "CULTURA VALÓRICA I", horas: 36 },// ...
            },
           "Tercer Semestre": {
                pro: { nombre: "PRÁCTICA DE OBSERVACIÓN", horas: 72 },
                tls: { nombre: "TALLER DE LENGUA DE SEÑAS", horas: 54 },
                nee: { nombre: "NECESIDADES EDUCATIVAS ESPECIALES PERMANENTES", horas: 54 },
                dcn: { nombre: "DIDÁCTICA DE LAS CIENCIAS NATURALES Y LA HISTORIA", horas: 72 },
                cem: { nombre: "CONVIVENCIA ESCOLAR Y MANEJO DE CONFLICTOS", horas: 36 },
                ing3: { nombre: "INGLÉS CERTIFICABLE III", horas: 36 },
                cmp3: { nombre: "COMPUTACIÓN CERTIFICABLE III", horas: 54 },// ...
                val3: { nombre: "CULTURA VALÓRICA III", horas: 36 },// ....
            },
        }


    },

    agropecuaria: {
        nombre: "TNS EN AGROPECUARIA",
        semestres: {
            "Primer Semestre": {
                fmp: { nombre: "FISIOLOGÍA, MORFOLOGÍA Y PROPAGACIÓN VEGETAL", horas: 72 },
                fas: { nombre: "FISIOLOGÍA, ANATOMÍA Y SANIDAD ANIMAL", horas: 90 },
                agro: { nombre: "AGROCLIMATOLOGÍA", horas: 54 },
                meb: { nombre: "MATEMÁTICA Y ESTADÍSTICA BÁSICA", horas: 72 },
                dhc: { nombre: "DESARROLLO DE HABILIDADES COMUNICATIVAS", horas: 36 },
                ing: { nombre: "INGLÉS CERTIFICABLE I", horas: 36 },
                com: { nombre: "COMPUTACIÓN CERTIFICABLE I", horas: 54 },
                val: { nombre: "CULTURA VALÓRICA I", horas: 36 },// ...
            },
           "Tercer Semestre": {
                pro: { nombre: "PRODUCCIÓN DE FRUTALES", horas: 72 },
                prop: { nombre: "PRODUCCIÓN PECUARIA II", horas: 90 },
                sdr: { nombre: "SISTEMA DE RIEGO II", horas: 36 },
                pio: { nombre: "PRODUCCIÓN INTEGRAL DE HORTALIZAS", horas: 54 },
                chs: { nombre: "CALIDAD, HIGIENE Y SEGURIDAD EN PROCESOS AGRÍCOLAS II", horas: 36 },
                ing3: { nombre: "INGLÉS CERTIFICABLE III", horas: 36 },
                cmp3: { nombre: "COMPUTACIÓN CERTIFICABLE III", horas: 54 },// ...
                val3: { nombre: "CULTURA VALÓRICA III", horas: 36 },// ....
            },
        },
    },

    enfermeria: {
        nombre: "TNS EN ENFERMERÍA",
        semestres: {
            "Primer Semestre": {
                ctb: { nombre: "CUIDADOS Y TÉCNICAS BÁSICAS EN ENFERMERÍA", horas: 72 },
                ppt: { nombre: "PROMOCIÓN Y PREVENCIÓN USO DE NUEVAS TECNOLOGÍAS", horas: 36 },
                ayf: { nombre: "ANATOMÍA Y FISIOLOGÍA", horas: 54 },
                myb: { nombre: "MICROBIOLOGÍA Y BIOSEGURIDAD", horas: 54 },
                osr: { nombre: "ORIENTACIÓN EN SALUD Y RED ASISTENCIAL", horas: 36 },
                ing: { nombre: "INGLÉS CERTIFICABLE I", horas: 36 },
                com: { nombre: "COMPUTACIÓN CERTIFICABLE I", horas: 54 },
                val: { nombre: "CULTURA VALÓRICA I", horas: 36 },// ...
            },

            "Tercer Semestre": {
                prac: { nombre: "PRÁCTICA CLÍNICA II", horas: 90 },
                cpm: { nombre: "CUIDADOS DE LA PERSONA MAYOR", horas: 54 },
                cpa: { nombre: "CUIDADOS PEDIÁTRICOS Y DEL ADOLESCENTE", horas: 54 },
                cmg: { nombre: "CUIDADOS EN MATERNIDAD Y GINECOOBSTETRICIA NEONATAL", horas: 54 },
                pau: { nombre: "PRIMEROS AUXILIOS Y URGENCIAS", horas: 54 },
                ing3: { nombre: "INGLÉS CERTIFICABLE III", horas: 36 },
                cmp3: { nombre: "COMPUTACIÓN CERTIFICABLE III", horas: 54 },// ...
                val3: { nombre: "CULTURA VALÓRICA III", horas: 36 },// ....
            },
        },
    },

    ped: {
        nombre: "TNS EN PROYECTOS ELÉCTRICOS DE DISTRIBUCIÓN",
        semestres: {
            "Primer Semestre": {
                ele: { nombre: "ELECTRICIDAD", horas: 72 },
                tme: { nombre: "TECNOLOGÍAS DE MATERIALES ELÉCTRICOS ", horas: 54 },
                mat: { nombre: "MATEMÁTICA I", horas: 54 },
                tle: { nombre: "TALLER Y LABORATORIO DE ELECTRICIDAD(L. Computación)", horas: 72 },
                ing: { nombre: "INGLÉS CERTIFICABLE I", horas: 36 },
                com: { nombre: "COMPUTACIÓN CERTIFICABLE I", horas: 54 },
                val: { nombre: "CULTURA VALÓRICA I", horas: 36 },// ...
            },

            "Tercer Semestre": {
                ipe: { nombre: "INSTALACIONES Y PROYECTOS ELÉCTRICOS", horas: 54 },
                mel: { nombre: "MÁQUINAS ELÉCTRICAS", horas: 54 },
                gee: { nombre: "GESTIÓN EMPRESARIAL", horas: 36 },
                tli: { nombre: "TALLER Y LABORATORIO DE INSTALACIONES INDUSTRIALES", horas: 54 },
                ern: { nombre: "ENERGÍAS  RENOVABLES NO CONVENCIONALES", horas: 72 },
                ing3: { nombre: "INGLÉS CERTIFICABLE III", horas: 36 },
                cmp3: { nombre: "COMPUTACIÓN CERTIFICABLE III", horas: 54 },// ...
                val3: { nombre: "CULTURA VALÓRICA III", horas: 36 },// ....
            },
        },
    }   
    // Repite para las 10 carreras...
};