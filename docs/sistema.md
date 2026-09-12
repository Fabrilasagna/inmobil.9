# Sistema Inmobiliario de Alto Volumen — Vista Completa

Documento base para diseño y desarrollo. Versión 0.1 — septiembre 2026.
Pensado como referencia para desarrollar módulo por módulo (Claude Code / Cursor).

---

## 1. Visión

Sistema operativo para una inmobiliaria que administra un volumen grande de departamentos (50 → 500) con una oficina central mínima (3 personas), en zonas premium con edificios con portería.

**Tesis:** el mercado no tiene escasez de departamentos, tiene escasez de respuesta. Quien busca no recibe respuesta, recibe una sola opción, o le avisan tarde. Quien vende no sabe qué pasa con su propiedad. El sistema elimina esa fricción entre quien realmente quiere vender y quien realmente quiere comprar o alquilar.

**Diferenciales:**
1. Respuesta inmediata, siempre, con varias opciones reales.
2. Visita autónoma: el comprador acreditado entra sin coordinar con nadie, en una ventana amplia de horarios.
3. Seguridad garantizada al propietario: acreditación, portería, cámara, caja de código dinámico, fotos antes/después, respaldo económico.
4. Comprador recurrente (inversor) con atención diferenciada y acceso anticipado.

**Estrategia:** operar primero con inventario propio, medir, mejorar; luego evaluar ofrecerlo como SaaS a otras inmobiliarias con números reales como prueba.

---

## 2. Principios de diseño

- **Estándar, no personalización.** Toda propiedad entra bajo las mismas condiciones (acceso, cámara, horarios, garantía). El propietario acepta el paquete o no entra.
- **Solo edificios con portería.** Sin control de acceso físico no hay operación.
- **El humano decide y conversa; la IA prepara y persigue.** Ninguna decisión de precio, oferta o reclamo la toma una máquina sola.
- **Todo pasa por el núcleo.** Los módulos son vistas y procesos sobre un inventario central único.
- **Cada evento queda registrado.** Reservas, aperturas, entradas, fotos, mensajes: trazabilidad completa para seguridad y para mejorar.
- **Medir desde el día uno.** Los datos de feedback, motivos de freno y tiempos se capturan aunque el proceso al inicio sea manual.
- **Lo legal se aísla.** Verificación de propiedad, contratos y protección de datos se encapsulan por país para permitir expansión.

---

## 3. Mapa de módulos

| # | Módulo | Usuario principal | Automatización | Rol humano |
|---|--------|-------------------|----------------|------------|
| 1 | Captación | Propietario / oficina | Alta | Firmar con el propietario |
| 2 | Alta de propiedad | Técnico de campo | Física (proceso estándar) | Instalar y grabar |
| 3 | Publicación y distribución | Oficina | Total | Ninguno |
| 4 | Acreditación y CRM de compradores | Comprador | Total | Ninguno |
| 5 | Visita | Comprador / portería | Total | Solo ante alerta |
| 6 | Negociación y cierre | Negociador / abogado | IA prepara, humano decide | Negociar, revisar contrato |
| 7 | Núcleo operativo | Oficina / propietario | — | Supervisar, resolver excepciones |

El módulo 7 es el corazón; los demás lo alimentan y consumen.

---

## 4. Detalle por módulo

### Módulo 1 — Captación

**Objetivo:** convertir propietarios en unidades dentro del sistema, ya calificadas.

**Funciones:**
- Landing con cotizador: el propietario ingresa dirección, metros, características y recibe un rango de valor con explicación.
- Modelo de valuación: arranca con comparables de portales + LLM que explica; se afina con cada cierre propio. Los cierres propios son el activo real (el precio publicado suele estar 10-20% arriba del cierre).
- Prospección: identificación de dueños directos en la zona objetivo (proceso interno, respetando términos de uso de fuentes).
- Calificación del propietario y la propiedad: titularidad (partida registral), cargas, poder de quien firma, y si el edificio califica (portería, reglamento).
- Calificación del edificio: si ya hay acuerdo con la administración, la unidad entra por vía rápida.
- Firma del acuerdo estándar (ver sección 7).

**IA:** valuación, explicación del rango, redacción de propuesta al propietario, priorización de leads.
**Terceros:** fuente de comparables, consulta registral (SUNARP en Perú).
**Se construye:** cotizador, scoring de leads, flujo de calificación, integración con núcleo.
**Métricas:** leads por semana, tasa lead → firma, tiempo lead → firma, costo por captación.

---

### Módulo 2 — Alta de propiedad

**Objetivo:** dejar la unidad lista para visitas autónomas en una sola visita técnica.

**Proceso estándar (≈ 2 horas por unidad, una sola vez):**
1. Instalación de caja de llaves con código dinámico (o cerradura inteligente si el propietario acepta).
2. Instalación de cámara IP en hall de entrada del departamento, con aviso visible. Verificar conectividad (WiFi o router 4G).
3. Grabación 360 completa: es la línea base para comparación post-visita y el material de publicación.
4. Fotos profesionales y verificación de la ficha declarada por el propietario.
5. Prueba de acceso completa: código, apertura, cámara, evento en el núcleo.
6. Registro en portería del protocolo de la unidad.

**IA:** mejora de fotos, virtual staging, plano desde el recorrido, redacción de ficha adaptada a cada portal.
**Terceros:** cámara 360 (Insta360 / Ricoh Theta), software de recorrido (Matterport / CloudPano), hardware de acceso y cámara.
**Se construye:** checklist digital del técnico, carga de material al núcleo, generación de línea base.
**Métricas:** unidades dadas de alta por técnico por día, retrabajos.

---

### Módulo 3 — Publicación y distribución

**Objetivo:** que la unidad esté visible en todos los canales sin intervención humana.

**Funciones:**
- Distribución previa a compradores acreditados cuyo perfil de búsqueda calza (antes de portales).
- Publicación en portales: API donde exista (MercadoLibre), feed XML donde sea el mecanismo (Urbania / Adondevivir; verificar canal actual de cada portal).
- Web propia con buscador e inventario en tiempo real.
- Sincronización de estado: cuando la unidad se reserva o cierra, se despublica en todos lados el mismo día.
- Ajuste de precio: cuando el propietario baja el precio, se actualiza en todos los canales y se avisa a quienes visitaron y dijeron "precio".

**IA:** textos por portal, selección de fotos, detección de fichas desactualizadas.
**Terceros:** portales, hosting web.
**Se construye:** adaptadores por canal, cola de sincronización, web pública.
**Métricas:** tiempo alta → publicación, consultas por canal, consultas por unidad.

---

### Módulo 4 — Acreditación y CRM de compradores

**Objetivo:** conocer a cada comprador y responderle siempre, de inmediato, con opciones.

**Acreditación (una vez, para siempre):**
- Verificación de identidad: documento + biometría facial, desde el celular.
- Aceptación de términos de visita.
- Niveles: primera visita con ventana más corta o acompañante; historial limpio → acceso completo.
- Historial: visitas, feedback, ofertas, no-shows, incidencias.

**CRM automatizado:**
- Respuesta inmediata a cualquier consulta, a cualquier hora, en menos de un minuto. Si la unidad no está disponible, en el mismo mensaje van 3-5 alternativas comparables.
- Perfil de búsqueda vivo: zona, metros, presupuesto, qué descartó y por qué. Se actualiza con cada interacción.
- Cruce automático: cada captación nueva se compara contra todos los perfiles activos y se avisa a quienes calzan.
- Seguimiento con criterio: contacto solo cuando hay novedad (unidad que calza, baja de precio, unidad liberada). Sin insistencia vacía.
- Detección de inversor: varias visitas en poco tiempo, preguntas por renta esperada, compras previas → perfil inversor con acceso anticipado, vista de portafolio, alertas por rentabilidad y canal directo con negociador.

**IA:** agente conversacional con acceso a inventario, agenda y fichas; reglas explícitas de qué hace solo (informar, agendar, ofrecer alternativas) y qué deriva (oferta, reclamo, incidencia). Matching perfil ↔ unidad.
**Terceros:** verificación de identidad (Metamap, Truora, Sumsub u otro con cobertura local), WhatsApp Business API (Meta, Twilio, 360dialog).
**Se construye:** flujo de acreditación, perfil de comprador, motor de matching, orquestación del agente.
**Métricas:** tiempo consulta → primera respuesta (< 1 min), consulta → visita agendada, compradores activos, tasa de acreditación.

---

### Módulo 5 — Visita

**Objetivo:** el comprador acreditado ve la unidad cuando quiere, sin coordinar con nadie, con seguridad total para el propietario.

**Antes:**
1. Comprador elige unidad y franja; solo se muestran horarios libres dentro de la ventana del edificio (ej. 8:00-21:00), con 30 min entre visitas.
2. Confirmación con dirección, instrucciones, reglas breves y botón de cancelar. Sin código aún.
3. Se genera código de caja válido solo para esa franja.
4. Notificación a portería: nombre, foto de documento, hora, unidad. Portería confirma con un toque; sin confirmación en X horas → alerta a oficina.
5. Recordatorio 2 horas antes; sin confirmación → se libera el turno.

**Durante:**
6. 15 minutos antes, el comprador recibe el código.
7. Registro en portería con documento; coincide con la foto.
8. Apertura de caja registrada y cruzada con la reserva. Apertura sin reserva → alerta inmediata.
9. Cámara registra entrada; IA verifica cantidad de personas vs. declarado.
10. Recorrido libre. Asistente por WhatsApp responde preguntas desde la ficha.
11. Al salir: 3 fotos rápidas (living, cocina, dormitorio principal) + confirmación de puertas cerradas y llave devuelta. Cierra la visita.
12. Cámara registra salida; código invalidado.

**Después (automático):**
13. Comparación de fotos contra línea base. Diferencia → marca para revisión humana; sin diferencia → archivo.
14. Feedback por WhatsApp: ¿te interesa? (sí / no / tal vez) y ¿qué te frenó? (precio, tamaño, luz, estado, ubicación).
15. Derivación: interesado → negociador con expediente completo; no → alternativas que corrigen el freno; tal vez → seguimiento en 48 h.
16. Panel del propietario: visita realizada, sin incidencias, feedback resumido.

**Excepciones definidas:**
- No-show: turno liberado, registrado; tercer no-show → acreditación suspendida 30 días.
- Caja no abre / llave no está: botón de emergencia, oficina llama, reprogramación prioritaria.
- Cámara sin conexión: la visita sigue con registro de portería; se marca para revisión.
- Diferencia en fotos: contacto al visitante el mismo día, revisión de cámara, protocolo de garantía.

**IA:** conteo de personas, anomalías de acceso, comparación de fotos, asistente durante la visita, clasificación de feedback.
**Terceros:** caja con código dinámico y API (Igloohome, KeyCafe) o cerradura inteligente (Nuki, Yale); cámara IP con detección y nube (Reolink, Eufy, Ubiquiti); canal simple para portería (WhatsApp o enlace web).
**Se construye:** motor de reservas, generación/invalidación de códigos, cruce de eventos, alertas, flujo de fotos de salida, flujo de feedback.
**Métricas:** consulta → visita realizada (< 24 h), % visitas sin intervención humana, incidencias por visita (objetivo 3-5%), visitas por unidad hasta oferta.

---

### Módulo 6 — Negociación y cierre

**Objetivo:** el negociador llega a cada conversación sabiendo más que ambas partes; el cierre avanza solo.

**Expediente al recibir "me interesa":**
- Quién es: acreditación, historial, si es inversor recurrente.
- Qué vio y qué dijo: feedback, qué lo frenó.
- La unidad: precio, días publicada, visitas acumuladas, cuántos marcaron "precio" como freno.
- Comparables: 3-5 unidades similares con precio publicado y cierres propios si existen.
- Rango sugerido de cierre (referencia, no orden).
- Condiciones del propietario: mínimo aceptable, urgencia, forma de pago aceptada.

**Oferta:**
- El comprador la registra por escrito: monto, forma de pago, plazo, condiciones.
- Llega al propietario con contexto (comparables, visitas, feedback). Responde acepta / contraoferta / rechaza.
- Varios interesados en la misma unidad: visible a ambas partes sin revelar montos.
- Toda contraoferta pasa por el negociador humano; la IA sugiere argumentos.

**Seguimiento de no ofertantes:**
- "Tal vez": contacto a 48 h con pregunta concreta ligada a lo que dijo.
- "No, por X": alternativas que corrigen X en el mismo mensaje.
- Silencio: un intento semanal, luego queda en perfil vivo.
- Tres visitas sin oferta: llamada del negociador.

**Cierre (checklist por tipo de operación):**
- Venta: identidad y capacidad de las partes, partida registral actualizada, certificado de gravámenes, minuta, escritura pública en notaría, inscripción en SUNARP, entrega. Con banco, su cronograma manda.
- Alquiler: verificación de ingresos o garantía, contrato, firmas legalizadas, inventario de entrega (el 360 de captación sirve), depósito, llaves.
- La IA arma el borrador desde plantilla con datos cargados, pide documentos faltantes, avisa demoras. Abogado revisa antes de firma (todos en piloto; con volumen, solo los que se apartan de plantilla).

**Después del cierre:**
- Facturación de comisión ligada a la operación.
- Unidad sale del inventario; hardware se retira o pasa a otra unidad del edificio.
- Comprador queda como cliente (inversor → flujo propio; si alquila lo comprado → captación nueva).
- Propietario recibe cierre de ciclo: visitas, tiempo, precio final.

**IA:** expediente, comparables, rango sugerido, argumentos, borradores de contrato, checklist, OCR de documentos.
**Terceros:** notaría, abogado, plantillas legales por país, facturación electrónica.
**Se construye:** registro de ofertas, flujo de contraoferta, expediente de cierre, generación de documentos, facturación.
**Métricas:** "me interesa" → primera conversación (< 2 h), oferta → respuesta del propietario, % "tal vez" recuperados, operaciones activas por negociador (objetivo 30-40), oferta aceptada → firma.

---

### Módulo 7 — Núcleo operativo

**Objetivo:** una sola fuente de verdad para todo el sistema.

**Componentes:**
- Base de datos central (ver sección 5).
- Panel interno: agenda del día, alertas activas, visitas pendientes de revisión, ofertas abiertas, incidencias.
- Panel del propietario: estado de su unidad, visitas, feedback, ofertas. En piloto puede ser un reporte semanal por WhatsApp.
- Gestión de edificios: acuerdo con administración, protocolo de portería, unidades activas en el edificio.
- Incidencias: registro, asignación, resolución, vínculo con garantía.
- Métricas y reportes.

**Se construye:** todo.
**Métricas:** minutos humanos por operación (el número que vendes como SaaS), unidades por persona de oficina.

---

## 5. Modelo de datos (entidades principales)

- **Edificio**: dirección, administración, contacto de portería, protocolo de acceso, ventana horaria, reglamento, unidades.
- **Propiedad / Unidad**: edificio, características, precio, estado, propietario, hardware instalado, línea base (360 + fotos), condiciones del propietario (mínimo, urgencia, forma de pago).
- **Propietario**: identidad, titularidad verificada, acuerdo firmado, canal de contacto, unidades.
- **Comprador**: identidad verificada, nivel de acreditación, perfil de búsqueda vivo, historial, flag inversor, portafolio.
- **Reserva de visita**: unidad, comprador, franja, código, confirmación de portería, estado.
- **Evento de acceso**: apertura de caja, entrada/salida por cámara, conteo de personas, cruce con reserva.
- **Visita**: reserva, fotos de salida, resultado de comparación, feedback, derivación.
- **Oferta**: unidad, comprador, monto, condiciones, respuesta, historial de contraofertas.
- **Operación de cierre**: tipo (venta / alquiler), checklist, documentos, estado, fechas, comisión.
- **Incidencia**: tipo, unidad, visita, descripción, evidencia, resolución, aplicación de garantía.
- **Conversación**: canal, comprador o propietario, mensajes, derivaciones a humano.

**Estados de una unidad:** prospecto → calificada → firmada → en alta → publicada → con oferta → reservada → en cierre → cerrada → retirada.

---

## 6. Integraciones y proveedores

| Necesidad | Opciones a evaluar | Nota |
|-----------|--------------------|------|
| Verificación de identidad | Metamap, Truora, Sumsub | Debe validar documento local + biometría |
| Mensajería | WhatsApp Business API (Meta, Twilio, 360dialog) | Canal principal en Perú |
| Caja de llaves | Igloohome, KeyCafe | Código por franja horaria, con API |
| Cerradura inteligente | Nuki, Yale | Alternativa si el propietario acepta |
| Cámara | Reolink, Eufy, Ubiquiti | Detección de personas + grabación en nube; prever WiFi o 4G |
| Recorrido 360 | Insta360 / Ricoh Theta + Matterport / CloudPano | Línea base y publicación |
| Portales | MercadoLibre (API), Urbania / Adondevivir (feed XML) | Verificar canal vigente de cada uno |
| Consulta registral | SUNARP (Perú) | Aislar por país |
| Modelos de IA | LLM conversacional, embeddings para matching, visión para fotos y conteo, OCR para documentos | Selección por función, no un solo modelo |
| Facturación | Facturación electrónica local | Ligada a operación de cierre |

Verificar disponibilidad, soporte y precios en Perú antes de decidir cada proveedor.

---

## 7. Estándar de propiedad (lo que acepta el propietario)

Documento que define todo lo demás. Debe cubrir:

- Autorización de visitas sin acompañante para compradores acreditados.
- Instalación de caja de llaves con código dinámico (o cerradura inteligente).
- Instalación de cámara en hall de entrada, con aviso visible, finalidad declarada y consentimiento (Ley 29733 de Protección de Datos Personales).
- Ventana horaria de visitas (ej. 8:00-21:00, todos los días) durante el período acordado.
- Garantía de la empresa: alcance, monto máximo, plazo de resolución. Respaldada por póliza (responsabilidad civil + daños a contenido). Definir con abogado.
- Grabación 360 y uso de material para publicación.
- Condiciones comerciales: comisión, exclusividad, plazo.
- Reporte periódico de actividad.

## 8. Flujo de acreditación del visitante

1. Ingreso por WhatsApp o web.
2. Verificación de identidad (documento + selfie) por proveedor.
3. Aceptación de términos de visita (reglas, responsabilidad, tratamiento de datos).
4. Perfil inicial de búsqueda (zona, tipo, presupuesto, plazo).
5. Nivel 1 asignado. Primera visita con condiciones más estrictas.
6. Con historial limpio → nivel 2, acceso completo.
7. Señales de inversor → nivel inversor, flujo diferenciado.
8. Suspensión por no-shows reiterados o incidencia.

---

## 9. Cumplimiento (Perú; aislar por país)

- Protección de datos personales (Ley 29733): consentimiento, finalidad, aviso de cámaras, retención y borrado.
- Prevención de lavado de activos: inmobiliarias son sujetos obligados ante la UIF; registro de operaciones y reporte según umbrales.
- Verificación de titularidad y cargas antes de publicar.
- Contratos: venta con minuta → escritura pública → SUNARP; alquiler con contrato privado y firmas legalizadas.
- Seguro de responsabilidad por visitas autónomas.

---

## 10. Escala y límites

**Escala como software (costo casi fijo):** publicación, acreditación, agenda, acceso, monitoreo, seguimiento, documentos.

**Escala con personas (lineal, predecible):**
- Alta física: un técnico da de alta 2-3 unidades por día.
- Incidencias: 3-5% de visitas; a 500 visitas/mes ≈ 20 casos, una persona.
- Negociación: 30-40 operaciones activas por negociador.
- Captación: convencer a un propietario es humano; es el cuello de botella de crecimiento.

**Orden de magnitud:** 3 personas → 50 unidades; 100-150 unidades → +1 negociador, +1 técnico; de ahí en adelante la estructura crece por edificios. Con acuerdo con la administración, cada unidad adicional en el mismo edificio cuesta casi nada.

---

## 11. Roadmap

### Fase 0 — Definición (semanas 1-2)
- Estándar de propiedad y garantía con abogado.
- Flujo de acreditación.
- Selección de proveedores (identidad, mensajería, caja, cámara).
- Elección de edificio piloto y acuerdo con administración.

### Fase 1 — Piloto módulo 5 (semanas 3-10)
- Núcleo mínimo: unidades, compradores, reservas, eventos, incidencias.
- Acreditación + WhatsApp + reservas (primero con acompañante, sin caja).
- Luego caja y canal con portería.
- Luego cámara y comparación de fotos (revisión humana inicial).
- 5 unidades en un edificio, 6-8 semanas.
- Captación, alta y negociación manuales, pero registrando feedback y motivos desde la primera visita.

### Fase 2 — Cierre del ciclo (semanas 11-20)
- Módulo 4 completo: CRM, matching, seguimiento, perfil inversor.
- Módulo 6: expediente, ofertas, checklist de cierre, borradores.
- Panel del propietario.
- Publicación automática en portales.

### Fase 3 — Volumen (mes 6 en adelante)
- Módulo 1: cotizador y prospección.
- Módulo 2: checklist técnico y generación visual con IA.
- Gestión por edificios.
- Segundo distrito o ciudad; validar aislamiento legal por país.

### Fase 4 — SaaS
- Multi-tenant, roles, facturación, onboarding.
- Solo después de tener métricas propias de al menos 6 meses de operación.

---

## 12. Métricas maestras

| Métrica | Objetivo |
|---------|----------|
| Consulta → primera respuesta | < 1 minuto |
| Consulta → visita realizada | < 24 horas |
| % visitas sin intervención humana | > 90% |
| Incidencias por visita | < 5% |
| "Me interesa" → conversación con negociador | < 2 horas |
| Operaciones activas por negociador | 30-40 |
| Minutos humanos por operación cerrada | medir y reducir |
| Unidades por persona de oficina | > 15 |

---

## 13. Decisiones abiertas

- Proveedor de identidad, caja y cámara (probar 2 de cada uno en piloto).
- Caja vs. cerradura inteligente como estándar.
- Alcance y monto de la garantía (abogado + aseguradora).
- Nivel de exclusividad exigido al propietario.
- Si la web pública con buscador entra en fase 1 o fase 2.
- Stack tecnológico (a definir antes de fase 1).
