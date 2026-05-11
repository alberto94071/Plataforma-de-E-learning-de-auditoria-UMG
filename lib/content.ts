export interface Question {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

export interface Module {
  slug: string;
  title: string;
  icon: string;
  color: string;
  description: string;
  content: string;
  questions: Question[];
}

export const MODULES: Module[] = [
  {
    slug: "principios-fundamentales",
    title: "Principios Fundamentales",
    icon: "⚖️",
    color: "#f59e0b",
    description: "Bases éticas y técnicas que rigen la profesión contable y de auditoría.",
    content: `PRINCIPIOS FUNDAMENTALES DE AUDITORÍA

1. INTEGRIDAD
El auditor debe ser recto y honesto en todas sus relaciones profesionales y de negocios. La integridad implica trato justo y veracidad. Un auditor íntegro no acepta información que sabe es materialmente errónea, ni se asocia con declaraciones que considera falsas.

2. OBJETIVIDAD
El auditor no debe permitir que sesgos, conflictos de interés o influencias indebidas anulen sus juicios profesionales o de negocios. La objetividad es la aplicación imparcial del análisis de la evidencia sin que las emociones, preferencias personales o presiones externas influyan en las conclusiones.

3. COMPETENCIA PROFESIONAL Y DEBIDO CUIDADO
El auditor tiene el deber de mantener conocimiento y aptitud profesional al nivel requerido para asegurar que el cliente reciba servicios profesionales competentes basados en los desarrollos actuales de la práctica, legislación y técnicas. El auditor debe actuar diligentemente y de conformidad con las normas técnicas y profesionales aplicables.

4. CONFIDENCIALIDAD
El auditor debe respetar la confidencialidad de la información obtenida en el transcurso de las relaciones profesionales y de negocios, y no debe revelar ninguna de estas informaciones a terceros sin la debida autorización, a menos que haya un derecho u obligación legal o profesional de hacerlo.

5. COMPORTAMIENTO PROFESIONAL
El auditor debe cumplir con las leyes y regulaciones relevantes y evitar cualquier acción que desacredite a la profesión. El comportamiento profesional impone la obligación al auditor de cumplir con las leyes y regulaciones, evitar conductas que el profesional razonablemente sabría que podrían desacreditar la profesión.

INDEPENDENCIA EN AUDITORÍA
La independencia comprende:
• Independencia mental: El estado mental que permite la expresión de una conclusión sin verse afectado por influencias que comprometan el juicio profesional.
• Independencia aparente: Evitar hechos y circunstancias que sean tan significativos que un tercero informado concluya que la integridad, objetividad o escepticismo profesional del auditor han sido comprometidos.

ESCEPTICISMO PROFESIONAL
Actitud que incluye una mente cuestionadora, alerta ante condiciones que pueden indicar una posible declaración errónea, y una evaluación crítica de la evidencia. El escepticismo profesional significa que el auditor no asume que la gerencia es deshonesta, pero tampoco asume su honestidad incuestionable.`,
    questions: [
      {
        question: "¿Cuál principio fundamental obliga al auditor a mantener sus conocimientos actualizados?",
        options: ["Integridad", "Competencia Profesional y Debido Cuidado", "Confidencialidad"],
        correct: 1,
        explanation: "La Competencia Profesional exige que el auditor mantenga su aptitud profesional mediante el aprendizaje continuo y la actualización en normas técnicas.",
      },
      {
        question: "La independencia mental implica que el auditor:",
        options: [
          "Nunca debe comunicarse con la gerencia",
          "Expresa conclusiones sin verse afectado por influencias que comprometan su juicio",
          "Solo trabaja con información pública",
        ],
        correct: 1,
        explanation: "La independencia mental permite al auditor actuar con integridad y objetividad, evitando presiones que sesguen su opinión profesional.",
      },
      {
        question: "El escepticismo profesional en auditoría significa:",
        options: [
          "Asumir que la gerencia siempre es deshonesta",
          "Asumir que la gerencia siempre es honesta",
          "Mantener una mente cuestionadora y evaluar críticamente la evidencia",
        ],
        correct: 2,
        explanation: "El escepticismo no es desconfianza ciega, sino una actitud de alerta ante posibles errores o fraudes, evaluando siempre la evidencia con rigor.",
      },
    ],
  },
  {
    slug: "estados-financieros",
    title: "Estados Financieros",
    icon: "📊",
    color: "#6366f1",
    description: "Conjunto completo de informes financieros que presentan la situación de una entidad.",
    content: `ESTADOS FINANCIEROS

DEFINICIÓN
Los estados financieros son informes que reflejan la situación económica, financiera y los cambios que experimenta la empresa a una fecha o período determinado. Son preparados de acuerdo con Principios de Contabilidad Generalmente Aceptados (PCGA) o Normas Internacionales de Información Financiera (NIIF).

CONJUNTO COMPLETO DE ESTADOS FINANCIEROS (NIC 1)
Según la NIC 1, un conjunto completo de estados financieros incluye:

1. ESTADO DE SITUACIÓN FINANCIERA (Balance General)
Presenta los activos, pasivos y patrimonio de la entidad en una fecha específica. Refleja la ecuación: Activos = Pasivos + Patrimonio.
• Activos: Recursos controlados por la entidad como resultado de sucesos pasados.
• Pasivos: Obligaciones presentes de la entidad que se esperan liquidar en el futuro.
• Patrimonio: Participación residual en los activos después de deducir los pasivos.

2. ESTADO DE RESULTADOS Y OTRO RESULTADO INTEGRAL
Presenta el desempeño financiero de la entidad durante un período. Incluye:
• Ingresos ordinarios
• Costos de ventas
• Gastos de operación
• Utilidad o pérdida del período
• Otro resultado integral (partidas que no se reconocen en resultados)

3. ESTADO DE CAMBIOS EN EL PATRIMONIO
Muestra los cambios en el patrimonio durante el período, incluyendo el resultado integral total, el efecto de cambios retroactivos y las transacciones con propietarios.

4. ESTADO DE FLUJOS DE EFECTIVO (NIC 7)
Proporciona información sobre los cambios históricos en el efectivo y equivalentes. Se clasifica en:
• Actividades de Operación: Flujos de las actividades principales generadoras de ingresos.
• Actividades de Inversión: Adquisición y disposición de activos a largo plazo.
• Actividades de Financiación: Cambios en préstamos y patrimonio.

5. NOTAS A LOS ESTADOS FINANCIEROS
Contienen información adicional relevante que no se presenta en los estados principales. Incluyen las políticas contables significativas, juicios, estimaciones e incertidumbres clave.

CARACTERÍSTICAS CUALITATIVAS
• Relevancia: La información es capaz de influir en las decisiones económicas.
• Representación fiel: La información es completa, neutral y libre de errores materiales.
• Comparabilidad: Los usuarios pueden comparar estados de diferentes períodos.
• Verificabilidad: Distintos observadores independientes llegan a un consenso.
• Oportunidad: La información está disponible para tomadores de decisiones en el momento adecuado.
• Comprensibilidad: La información es comprensible para usuarios con conocimiento razonable.`,
    questions: [
      {
        question: "¿Cuántos estados financieros forman un conjunto completo según la NIC 1?",
        options: ["3 estados", "5 estados", "7 estados"],
        correct: 1,
        explanation: "Según la NIC 1, el conjunto completo incluye: Situación Financiera, Resultados, Cambios en Patrimonio, Flujos de Efectivo y Notas.",
      },
      {
        question: "El Estado de Flujos de Efectivo se clasifica en:",
        options: [
          "Corrientes, no corrientes y diferidos",
          "Operación, Inversión y Financiación",
          "Activos, pasivos y patrimonio",
        ],
        correct: 1,
        explanation: "La NIC 7 establece que los flujos deben agruparse en actividades de operación (giro normal), inversión (activos fijos) y financiación (capital y deuda).",
      },
      {
        question: "¿Qué característica cualitativa implica que la información influye en decisiones económicas?",
        options: ["Comprensibilidad", "Relevancia", "Verificabilidad"],
        correct: 1,
        explanation: "La relevancia es fundamental: la información contable debe ser útil para predecir o confirmar resultados y así influir en las decisiones de los usuarios.",
      },
    ],
  },
  {
    slug: "elementos-estados-financieros",
    title: "Elementos de los Estados Financieros",
    icon: "🔍",
    color: "#10b981",
    description: "Definición y características de activos, pasivos, patrimonio, ingresos y gastos.",
    content: `ELEMENTOS DE LOS ESTADOS FINANCIEROS

Los elementos directamente relacionados con la medida de la situación financiera son activos, pasivos y patrimonio. Los relacionados con la medida del rendimiento son ingresos y gastos.

1. ACTIVOS
Definición (Marco Conceptual IASB): Un activo es un recurso económico presente controlado por la entidad como resultado de sucesos pasados.

Características:
• Control: La entidad tiene la capacidad de obtener los beneficios económicos futuros que fluirán del activo.
• Recurso económico presente: Tiene el potencial de producir beneficios económicos.
• Suceso pasado: El activo existe como resultado de transacciones o hechos anteriores.

Clasificación:
• Activos Corrientes: Efectivo, inversiones a corto plazo, cuentas por cobrar, inventarios, gastos prepagados.
• Activos No Corrientes: Propiedad, planta y equipo; activos intangibles; inversiones a largo plazo.

2. PASIVOS
Definición: Una obligación presente de la entidad de transferir un recurso económico como resultado de sucesos pasados.

Características:
• Obligación presente: La entidad tiene la responsabilidad de cumplir con la obligación.
• Transferencia de recurso económico: Implica transferencia de efectivo, bienes, servicios o renuncia a derechos.
• Suceso pasado: Surgió de transacciones anteriores.

Clasificación:
• Pasivos Corrientes: Cuentas por pagar, préstamos a corto plazo, obligaciones acumuladas.
• Pasivos No Corrientes: Préstamos bancarios a largo plazo, obligaciones por pensiones.

3. PATRIMONIO
Es la participación residual en los activos de la entidad, una vez deducidos todos sus pasivos. Incluye capital social aportado, primas de emisión, reservas y resultados acumulados.
Fórmula: Patrimonio = Activos – Pasivos

4. INGRESOS
Incrementos en los activos o disminuciones de pasivos que dan lugar a aumentos del patrimonio, distintos de los relacionados con aportaciones de propietarios.

Tipos:
• Ingresos Ordinarios: Ventas de bienes, prestación de servicios, uso por terceros de activos.
• Ganancias: Otras partidas que cumplen la definición de ingresos (venta de activos).

5. GASTOS
Decrementos en los activos o aumentos de pasivos que dan lugar a disminuciones del patrimonio, distintos de los relacionados con distribuciones a propietarios.

Principio del Devengado: Los ingresos y gastos se reconocen cuando se producen, independientemente del cobro o pago en efectivo.`,
    questions: [
      {
        question: "Según el Marco Conceptual del IASB, ¿qué define a un activo?",
        options: [
          "Todo bien físico que posee la empresa",
          "Recurso económico presente controlado por la entidad como resultado de sucesos pasados",
          "Cualquier derecho de cobro a favor de la empresa",
        ],
        correct: 1,
        explanation: "La clave de un activo no es solo la propiedad, sino el CONTROL y el potencial de generar beneficios económicos futuros.",
      },
      {
        question: "La fórmula del Patrimonio es:",
        options: [
          "Activos + Pasivos",
          "Activos – Pasivos",
          "Ingresos – Gastos",
        ],
        correct: 1,
        explanation: "El Patrimonio representa la parte residual de los activos una vez deducidas todas las obligaciones (Pasivos) de la entidad.",
      },
      {
        question: "¿Qué principio establece que los ingresos y gastos se reconocen cuando se producen, independientemente del cobro?",
        options: ["Principio de Prudencia", "Principio del Devengado", "Principio de Negocio en Marcha"],
        correct: 1,
        explanation: "El devengo asegura que los estados financieros reflejen las transacciones en el período correcto, sin importar cuándo se mueva el efectivo.",
      },
    ],
  },
  {
    slug: "negocio-en-marcha",
    title: "Negocio en Marcha",
    icon: "🏢",
    color: "#ec4899",
    description: "Supuesto fundamental sobre la continuidad operativa de la entidad.",
    content: `NEGOCIO EN MARCHA (GOING CONCERN)

DEFINICIÓN
El principio de negocio en marcha (o empresa en funcionamiento) establece que la entidad continuará en operaciones en el futuro previsible. Al preparar los estados financieros, la gerencia debe evaluar la capacidad de la entidad para continuar como negocio en marcha.

BASE CONTABLE
Cuando los estados financieros se preparan sobre la base del negocio en marcha, la entidad asume que:
• Tiene la intención de liquidar sus operaciones o cesar en su actividad.
• No tiene otra alternativa más realista que hacerlo.

Si la gerencia tiene conocimiento de incertidumbres significativas relacionadas con eventos o condiciones que puedan generar dudas importantes sobre la continuidad, se revelará en los estados financieros.

RESPONSABILIDADES DEL AUDITOR (NIA 570)
La NIA 570 establece las obligaciones del auditor respecto al negocio en marcha:

1. EVALUACIÓN DEL AUDITOR
El auditor debe:
• Evaluar la adecuación del uso por parte de la gerencia de la base contable del negocio en marcha.
• Determinar si existe incertidumbre material relacionada con el negocio en marcha.
• Obtener evidencia suficiente y adecuada sobre la adecuación del uso de la hipótesis.

2. INDICADORES DE RIESGO
Financieros:
• Situación de patrimonio neto negativo o capital circulante negativo.
• Préstamos a plazo fijo próximos a vencer sin perspectivas realistas de renovación.
• Indicadores financieros clave adversos.
• Pérdidas operativas sustantivas o deterioro significativo de los activos.

Operativos:
• Intenciones de la gerencia de liquidar la entidad o de cesar en sus operaciones.
• Pérdida de miembros clave de la gerencia sin sustitución.
• Pérdida de un mercado fundamental, de un cliente clave o de una franquicia o licencia.

De otro tipo:
• Incumplimiento de requisitos de capital u otros requisitos legales.
• Procedimientos legales o reguladores pendientes contra la entidad.
• Cambios en legislación o política gubernamental con impactos adversos.

3. PROCEDIMIENTOS DE AUDITORÍA
• Análisis y discusión de flujos de efectivo, beneficios y otras previsiones con la gerencia.
• Análisis y discusión de los últimos estados financieros intermedios.
• Examen de los términos de bonos y préstamos y determinación de incumplimientos.
• Obtener y revisar informes de acciones regulatorias.

CONCLUSIÓN Y EFECTOS EN EL INFORME
• Uso adecuado + sin incertidumbre material: Opinión sin salvedades.
• Uso adecuado + incertidumbre material con revelación adecuada: Opinión sin salvedades + párrafo de énfasis.
• Uso adecuado + incertidumbre material sin revelación adecuada: Opinión con salvedades o adversa.
• Uso inadecuado: Opinión adversa.`,
    questions: [
      {
        question: "¿Qué NIA regula las responsabilidades del auditor respecto al Negocio en Marcha?",
        options: ["NIA 315", "NIA 570", "NIA 700"],
        correct: 1,
        explanation: "La NIA 570 es la norma específica que guía al auditor para evaluar si la empresa puede continuar operando en el futuro previsible.",
      },
      {
        question: "Si existe una incertidumbre material sobre el negocio en marcha pero la revelación es adecuada, el auditor emite:",
        options: [
          "Opinión adversa",
          "Opinión sin salvedades con párrafo de énfasis",
          "Abstención de opinión",
        ],
        correct: 1,
        explanation: "Si la empresa explica bien sus problemas financieros, el auditor no da salvedad, pero añade un Párrafo de Énfasis para advertir al lector.",
      },
      {
        question: "¿Cuál de los siguientes es un indicador financiero de riesgo para la continuidad?",
        options: [
          "Aumento en ventas anuales",
          "Patrimonio neto negativo o capital circulante negativo",
          "Incorporación de nuevos empleados clave",
        ],
        correct: 1,
        explanation: "Un patrimonio neto negativo indica que las deudas superan a los activos, lo que pone en grave riesgo la continuidad operativa de la empresa.",
      },
    ],
  },
  {
    slug: "reconocimiento-medicion",
    title: "Reconocimiento y Medición",
    icon: "📏",
    color: "#14b8a6",
    description: "Criterios para incorporar y cuantificar los elementos en los estados financieros.",
    content: `RECONOCIMIENTO Y MEDICIÓN

RECONOCIMIENTO
El reconocimiento es el proceso de incorporar en el estado de situación financiera o en el estado de resultados una partida que cumpla la definición de un elemento y que satisfaga los criterios de reconocimiento.

CRITERIOS DE RECONOCIMIENTO (Marco Conceptual)
Una partida que cumple la definición de un elemento se reconoce si:
1. Es probable que fluya a o desde la entidad cualquier beneficio económico futuro asociado con la partida.
2. La partida tiene un costo o valor que puede medirse con fiabilidad.

RECONOCIMIENTO DE ACTIVOS
Un activo se reconoce cuando:
• Es probable que los beneficios económicos futuros fluyan hacia la entidad.
• El activo tiene un costo o valor que puede medirse con fiabilidad.
No se reconoce un activo cuando el desembolso no generará beneficios económicos futuros más allá del período actual (se reconoce como gasto).

RECONOCIMIENTO DE PASIVOS
Un pasivo se reconoce cuando:
• Sea probable que, al vencer, deban entregarse recursos que incorporen beneficios económicos.
• El importe por el que se realizará la cancelación pueda ser medido de forma fiable.

BASES DE MEDICIÓN
1. COSTO HISTÓRICO
Los activos se registran al importe de efectivo pagado o al valor razonable del pago en el momento de la adquisición. Es la base de medición más común.

2. COSTO CORRIENTE
Los activos se mantienen al importe de efectivo que debería pagarse si un activo igual u otro equivalente se adquiriese en la actualidad.

3. VALOR REALIZABLE (DE LIQUIDACIÓN)
Los activos se mantienen al importe de efectivo que podría obtenerse en el momento actual por la venta no forzada de los activos.

4. VALOR PRESENTE
Los activos se mantienen al valor presente, descontado, de las entradas de efectivo netas futuras que se espera genere la partida en el curso normal de la operación.

5. VALOR RAZONABLE (NIIF 13)
El precio que sería recibido por vender un activo o pagado por transferir un pasivo en una transacción ordenada entre participantes de mercado en la fecha de medición. Jerarquía de valor razonable:
• Nivel 1: Precios cotizados en mercados activos.
• Nivel 2: Datos observables distintos a los de nivel 1.
• Nivel 3: Datos no observables (modelos internos).

DETERIORO DE VALOR (NIC 36)
Una entidad evaluará en cada fecha de presentación si existe algún indicio de que un activo puede haber sufrido una pérdida por deterioro. Si existe, se estimará el importe recuperable del activo.
Importe recuperable = Máximo(Valor razonable menos costos de venta, Valor en uso)`,
    questions: [
      {
        question: "¿Cuáles son los dos criterios del Marco Conceptual para reconocer una partida?",
        options: [
          "Que sea un activo y tenga valor histórico",
          "Probabilidad de flujo de beneficios económicos y medición fiable",
          "Que sea aprobada por la gerencia y el auditor",
        ],
        correct: 1,
        explanation: "Para 'subir' una cifra a los estados financieros, debe ser probable que genere beneficios y debe poder medirse en dinero con fiabilidad.",
      },
      {
        question: "El Valor Razonable según NIIF 13 se define como:",
        options: [
          "El costo original del activo ajustado por inflación",
          "El precio recibido al vender un activo en una transacción ordenada entre participantes del mercado",
          "El valor en libros menos la depreciación acumulada",
        ],
        correct: 1,
        explanation: "El Valor Razonable es un precio de mercado (precio de salida) entre partes interesadas que actúan de forma informada y voluntaria.",
      },
      {
        question: "Según la NIC 36, el Importe Recuperable de un activo es:",
        options: [
          "El costo histórico del activo",
          "El mínimo entre valor razonable y valor en uso",
          "El máximo entre valor razonable menos costos de venta y valor en uso",
        ],
        correct: 2,
        explanation: "La norma es optimista: el valor recuperable es lo máximo que podrías obtener ya sea vendiéndolo o usándolo.",
      },
    ],
  },
  {
    slug: "sociedades-mercantiles",
    title: "Sociedades Mercantiles",
    icon: "🏛️",
    color: "#f97316",
    description: "Marco legal de las entidades mercantiles en Guatemala según el Código de Comercio.",
    content: `SOCIEDADES MERCANTILES EN GUATEMALA

DEFINICIÓN
Una sociedad mercantil es el contrato mediante el cual dos o más personas se obligan a hacer aportaciones en dinero, en bienes o en trabajo, para la explotación de una actividad económica, con el fin de dividir entre sí las ganancias o pérdidas que de ello resulten.

MARCO LEGAL
Las sociedades mercantiles en Guatemala se rigen por el Código de Comercio, Decreto 2-70 del Congreso de la República.

TIPOS DE SOCIEDADES (Artículo 10 Código de Comercio)

1. SOCIEDAD COLECTIVA
• Los socios responden de manera subsidiaria, ilimitada y solidariamente por las obligaciones sociales.
• La razón social se forma con el nombre completo de uno o varios socios seguido de "y Compañía".
• Todas las resoluciones requieren unanimidad, salvo pacto en contrario.

2. SOCIEDAD EN COMANDITA SIMPLE
• Existen dos tipos de socios: Gestores (responsabilidad ilimitada) y Comanditarios (responsabilidad limitada al monto de su aportación).
• La razón social se forma con el nombre de los socios gestores.

3. SOCIEDAD DE RESPONSABILIDAD LIMITADA (S.R.L.)
• El capital está dividido en aportaciones no representadas por títulos valores.
• Los socios responden hasta el límite de su aportación.
• Máximo 20 socios.
• El capital mínimo es Q.2,000.00 y debe estar totalmente pagado al constituirse.

4. SOCIEDAD ANÓNIMA (S.A.)
• Es la forma más común en Guatemala.
• El capital está dividido en acciones y los socios responden solo por el valor de sus acciones.
• Las acciones pueden ser nominativas (con nombre del propietario) o al portador.
• Órganos: Asamblea General de Accionistas, Consejo de Administración, Gerencia y Auditoría.
• Capital mínimo: Q.5,000.00; debe estar suscrito en su totalidad y pagado al menos el 25%.

5. SOCIEDAD EN COMANDITA POR ACCIONES
• El capital de los socios comanditarios está dividido en acciones.
• Los socios gestores tienen responsabilidad ilimitada y solidaria.

AUDITORÍA EN SOCIEDADES ANÓNIMAS
• La Asamblea General puede nombrar auditores externos o internos.
• El Código de Comercio y la legislación fiscal obligan a ciertas sociedades a tener auditoría externa.
• Las sociedades que cotizan en bolsa deben presentar estados financieros auditados.

DISOLUCIÓN Y LIQUIDACIÓN
Causas de disolución: Cumplimiento del plazo, consecución del objeto social, voluntad de los socios, pérdida total del capital, reducción a menos del mínimo legal, entre otras.`,
    questions: [
      {
        question: "¿Cuál es el número máximo de socios en una Sociedad de Responsabilidad Limitada en Guatemala?",
        options: ["10 socios", "20 socios", "50 socios"],
        correct: 1,
        explanation: "El Artículo 79 del Código de Comercio de Guatemala establece que el número de socios no podrá exceder de veinte.",
      },
      {
        question: "En una Sociedad Anónima, ¿qué porcentaje mínimo del capital suscrito debe estar pagado al constituirse?",
        options: ["10%", "25%", "50%"],
        correct: 1,
        explanation: "Para las Sociedades Anónimas, el Artículo 89 establece que debe pagarse al menos el 25% del capital suscrito (mínimo Q.5,000).",
      },
      {
        question: "¿Cuál es la forma societaria más común en Guatemala donde los socios responden solo por el valor de sus acciones?",
        options: ["Sociedad Colectiva", "Sociedad en Comandita Simple", "Sociedad Anónima (S.A.)"],
        correct: 2,
        explanation: "La Sociedad Anónima es la más utilizada porque limita la responsabilidad de los socios al monto de sus acciones, protegiendo su patrimonio personal.",
      },
    ],
  },
  {
    slug: "normas-nia-niif-nic",
    title: "Normas: NIA, NIIF y NIC",
    icon: "📋",
    color: "#8b5cf6",
    description: "Marco normativo internacional aplicable a la contabilidad y auditoría.",
    content: `NORMAS INTERNACIONALES: NIA, NIIF Y NIC

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
NIA — NORMAS INTERNACIONALES DE AUDITORÍA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Emitidas por: IAASB (International Auditing and Assurance Standards Board)

Las NIAs establecen los requerimientos y orientaciones para la realización de auditorías de estados financieros. Son de aplicación obligatoria para los auditores miembros del IGCPA en Guatemala.

NIAs MÁS RELEVANTES:
• NIA 200: Objetivos globales del auditor independiente
• NIA 240: Responsabilidades del auditor con respecto al fraude
• NIA 315: Identificación y valoración de riesgos de incorrección material
• NIA 320: Materialidad en la planificación y ejecución de la auditoría
• NIA 500: Evidencia de auditoría
• NIA 570: Empresa en funcionamiento (Negocio en Marcha)
• NIA 700: Formación de la opinión y emisión del informe

MATERIALIDAD (NIA 320)
La materialidad es el umbral por debajo del cual las incorrecciones son evaluadas como no significativas. Una información es material si su omisión puede influir en las decisiones económicas de los usuarios.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
NIIF — NORMAS INTERNACIONALES DE INFORMACIÓN FINANCIERA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Emitidas por: IASB (International Accounting Standards Board)

Las NIIF son el conjunto de normas contables de aceptación mundial. En Guatemala, el Instituto Guatemalteco de Contadores Públicos y Auditores (IGCPA) ha adoptado las NIIF completas para entidades de interés público y las NIIF para PYMES para entidades más pequeñas.

NIIF RELEVANTES:
• NIIF 9: Instrumentos Financieros
• NIIF 13: Medición del Valor Razonable
• NIIF 15: Ingresos de Contratos con Clientes (reconocimiento en 5 pasos)
• NIIF 16: Arrendamientos
• NIIF 17: Contratos de Seguro

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
NIC — NORMAS INTERNACIONALES DE CONTABILIDAD
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Las NICs son las normas anteriores a las NIIF. Siguen vigentes hasta que el IASB las reemplace por NIIF.

NICs FUNDAMENTALES:
• NIC 1: Presentación de estados financieros
• NIC 2: Inventarios (métodos: FIFO o Costo promedio ponderado)
• NIC 7: Estado de flujos de efectivo
• NIC 8: Políticas contables, cambios en estimaciones y errores
• NIC 12: Impuesto a las ganancias
• NIC 16: Propiedades, planta y equipo (depreciación)
• NIC 19: Beneficios a empleados
• NIC 36: Deterioro del valor de los activos
• NIC 37: Provisiones, pasivos contingentes y activos contingentes
• NIC 38: Activos intangibles

NIC 2 — INVENTARIOS
Los inventarios se medirán al costo o al valor neto realizable, el que sea menor. Los métodos permitidos son FIFO (primeras entradas, primeras salidas) y costo promedio ponderado. El método LIFO no está permitido bajo NIC 2.

ADOPCIÓN EN GUATEMALA
El IGCPA estableció la adopción de NIIF completas obligatoria para entidades de interés público (bancos, aseguradoras, empresas cotizadas) y NIIF para PYMES para el resto de entidades comerciales, industriales y de servicios.`,
    questions: [
      {
        question: "¿Qué organismo emite las Normas Internacionales de Auditoría (NIAs)?",
        options: ["IASB", "IAASB", "IGCPA"],
        correct: 1,
        explanation: "Mientras que el IASB emite normas de contabilidad (NIIF), el IAASB es el encargado de las normas de auditoría a nivel mundial.",
      },
      {
        question: "Según la NIC 2, ¿qué métodos de valoración de inventarios están permitidos?",
        options: [
          "LIFO y FIFO",
          "FIFO y Costo Promedio Ponderado",
          "LIFO y Costo Promedio Ponderado",
        ],
        correct: 1,
        explanation: "La NIC 2 prohíbe el método LIFO (Últimas entradas, primeras salidas) por no reflejar adecuadamente el flujo físico y valor de los inventarios.",
      },
      {
        question: "¿Qué NIA regula la identificación y valoración de riesgos de incorrección material?",
        options: ["NIA 200", "NIA 315", "NIA 500"],
        correct: 1,
        explanation: "La NIA 315 es fundamental para la planificación, pues obliga al auditor a entender la entidad y su entorno para detectar riesgos de error o fraude.",
      },
    ],
  },
];

export const TOTAL_MODULES = MODULES.length; // 7
export const POINTS_PER_CORRECT = 10;
export const QUESTIONS_PER_MODULE = 3;
export const MAX_SCORE_PER_MODULE = QUESTIONS_PER_MODULE * POINTS_PER_CORRECT; // 30
export const MAX_TOTAL_SCORE = TOTAL_MODULES * MAX_SCORE_PER_MODULE; // 210
export const DIPLOMA_THRESHOLD = 150; // Need 150 of 210 points
export const MIN_CORRECT_TO_PASS = 2; // Must get at least 2/3 correct per module

export function getModuleBySlug(slug: string): Module | undefined {
  return MODULES.find((m) => m.slug === slug);
}
