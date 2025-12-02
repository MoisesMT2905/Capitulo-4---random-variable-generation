# Generador de Variables Aleatorias No-Uniformes

*Automatically synced with your [v0.app](https://v0.app) deployments*

[![Built with Java Swing](https://img.shields.io/badge/Built%20with-Java%20Swing-orange?style=for-the-badge&logo=java)]()
[![Based on Simulation Theory](https://img.shields.io/badge/Theory-Chapter%204%20Simulation-blue?style=for-the-badge)]()

## Descripción General

Aplicación Java con interfaz gráfica Swing para la generación de variables aleatorias no-uniformes utilizando tres métodos estadísticos fundamentales:
- **Transformada Inversa** (x = F⁻¹(R))
- **Método de Rechazo** (Aceptación/Rechazo)
- **Método de Composición** (Mezcla de distribuciones)

Basado en el **Capítulo 4** de *"Simulación: Un enfoque práctico"* de Raúl Coss Bu e **Informe 4** de la Universidad Mayor de San Simón.

## Características Principales

### 1. Método de Transformada Inversa
- Genera variables aleatorias usando: **x = F⁻¹(R)**
- Distribuciones soportadas:
  - **Exponencial**: x = -ln(R)/λ (Ejemplo 4.1)
  - **Uniforme**: x = a + (b-a)R
  - **Weibull**: x = λ(-ln(R))^(1/k) (Ejemplo 4.3)
- Muestra primeras 20 muestras, estadísticas completas e histograma

### 2. Método de Rechazo
- Implementa aceptación/rechazo: **R₂ ≤ f(x)/M**
- Distribuciones soportadas:
  - **Empírica f(x)=2x** (Ejemplo 4.5)
  - **Triangular** (Ejemplo 4.6)
  - **Beta**
- Muestra intento por intento, tabla de aceptaciones y eficiencia

### 3. Método de Composición
- Mezcla de distribuciones: **f(x) = p·f₁(x) + (1-p)·f₂(x)**
- Distribuciones soportadas:
  - **Triangular**: Descomposición en dos áreas (Ejemplo 4.7)
  - **Mezcla Exponencial**: Combinación de exponenciales
- Detalla selección de sub-distribución y generación

## Requisitos

- **Java 8 o superior** instalado
- No requiere dependencias externas (usa `java.util.Random` y `javax.swing`)

## Compilación

\`\`\`bash
# Compilar todos los archivos Java
javac src/*.java

# O compilar individualmente:
javac src/Main.java src/RandomVariablesApp.java src/InverseTransformWindow.java \
      src/RejectionWindow.java src/CompositionWindow.java \
      src/InverseTransformGenerator.java src/RejectionGenerator.java \
      src/CompositionGenerator.java src/MathExpressionEvaluator.java
\`\`\`

## Ejecución

\`\`\`bash
# Ejecutar la aplicación
java -cp src Main

# O directamente desde la clase principal:
java -cp src RandomVariablesApp
\`\`\`

## Uso de la Aplicación

1. **Ventana Principal**: Muestra 3 botones para cada método
2. **Seleccionar Método**: Haz clic en el botón correspondiente
3. **Ingresar Parámetros**: 
   - Selecciona la distribución predefinida
   - Ajusta los parámetros según sea necesario
   - Especifica el número de muestras (1 a 100,000)
4. **Generar**: Haz clic en "Generar Muestras"
5. **Ver Resultados**:
   - Panel de texto: Listado de muestras y estadísticas
   - Tabla inferior: Histograma con barras visuales ASCII

## Estructura del Proyecto

\`\`\`
src/
├── Main.java                      # Punto de entrada de la aplicación
├── RandomVariablesApp.java        # Ventana principal con 3 botones
├── InverseTransformWindow.java    # GUI - Método Transformada Inversa
├── RejectionWindow.java           # GUI - Método de Rechazo
├── CompositionWindow.java         # GUI - Método de Composición
├── InverseTransformGenerator.java # Generador - Transformada Inversa
├── RejectionGenerator.java        # Generador - Método de Rechazo
├── CompositionGenerator.java      # Generador - Método de Composición
└── MathExpressionEvaluator.java   # Evaluador de expresiones matemáticas
\`\`\`

## Ejemplos de Uso

### Transformada Inversa - Distribución Exponencial
\`\`\`
Distribución: Exponencial
λ: 2.0
Muestras: 1000

Resultado: Media ≈ 0.5, valores distribuidos exponencialmente
Fórmula: x = -ln(R)/λ
\`\`\`

### Rechazo - Función Empírica
\`\`\`
Distribución: Empírica f(x)=2x
M: 2.0
Muestras: 1000

Resultado: Tasa de aceptación ≈ 50% (1/M)
Parámetro M = cota superior de f(x)
\`\`\`

### Composición - Distribución Triangular
\`\`\`
Mezcla: Triangular
a=0, b=1, c=2
Muestras: 1000

Resultado: Distribución con modo en b
Áreas: A₁ para [a,b], A₂ para [b,c]
\`\`\`

## Estadísticas Mostradas

Para cada generador se calcula y muestra:
- **Primeras N muestras**: Listado de valores generados
- **Media**: Promedio aritmético de las muestras
- **Mínimo/Máximo**: Valores extremos
- **Varianza**: Dispersión estadística
- **Desviación Estándar**: √varianza
- **Histograma**: Representación en 10 clases con barras ASCII

### Métricas Adicionales

**Método de Rechazo:**
- Total de intentos
- Muestras aceptadas
- Tasa de aceptación (%)
- Eficiencia esperada (1/M)

**Método de Composición:**
- Muestras de f₁ (%)
- Muestras de f₂ (%)
- Proporción esperada A₁, A₂

## Fundamentos Teóricos

### Transformada Inversa
Utiliza la propiedad: si X ~ F, entonces U = F(X) ~ Uniforme(0,1)

**Algoritmo:**
1. Generar R uniforme en [0,1]
2. Calcular x = F⁻¹(R)
3. x tendrá la distribución deseada

### Método de Rechazo
Para cuando la FDA es difícil de invertir o calcular

**Algoritmo:**
1. Generar x uniforme en [a,b]
2. Generar R uniforme en [0,1]
3. Si R ≤ f(x)/M, aceptar x
4. Si no, rechazar e intentar nuevamente

### Método de Composición
Para distribuciones descomponibles en componentes simples

**Algoritmo:**
1. Generar R₁ uniforme para seleccionar sub-distribución
2. Si R₁ ≤ p, usar f₁; si no, usar f₂
3. Generar R₂ y calcular valor en sub-distribución seleccionada
4. Retornar valor generado

## Referencias Bibliográficas

- **Coss Bu, R. (2010).** *Simulación: Un enfoque práctico*. Editorial Limusa. Capítulo 4: Generación de Variables Aleatorias No-Uniformes.
- **Universidad Mayor de San Simón.** *Informe 4: Generación de Variables Aleatorias*. Carrera de Ingeniería de Sistemas.
- **Ross, S. M. (2012).** *Simulation (5th ed.)*. Academic Press.

## Build your app

Continue building your app on:

**[https://v0.app/chat/sSWgxIhSCFE](https://v0.app/chat/sSWgxIhSCFE)**

## Licencia

MIT License - Libre para usar con propósitos académicos y comerciales

## Autor

**Moisés Mamani Tito**  
Universidad Mayor de San Simón  
Carrera: Ingeniería de Sistemas  
Cochabamba, Bolivia
