import javax.swing.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

/**
 * Generador de variables aleatorias usando Método de Rechazo
 * Basado en Ejemplos 4.5, 4.6 del Capítulo 4
 */
public class RejectionGenerator {
    private Random random;
    private int totalAttempts;
    private int acceptedCount;
    
    public RejectionGenerator() {
        this.random = new Random();
    }
    
    /**
     * f(x) = 2x, 0 ≤ x ≤ 1 (Ejemplo 4.5)
     */
    private double empiricalFunction(double x) {
        if (x >= 0 && x <= 1) {
            return 2 * x;
        }
        return 0;
    }
    
    /**
     * Distribución triangular (Ejemplo 4.6)
     * f(x) = 2(x-a)/((c-a)(b-a)) para a ≤ x ≤ b
     * f(x) = -2(x-c)/((c-a)(c-b)) para b ≤ x ≤ c
     */
    private double triangularFunction(double x, double a, double b, double c) {
        if (x >= a && x <= b) {
            return 2 * (x - a) / ((c - a) * (b - a));
        } else if (x > b && x <= c) {
            return -2 * (x - c) / ((c - a) * (c - b));
        }
        return 0;
    }
    
    public double[] generateSamples(String distribution, int numSamples, double M, double a, double b, JTextArea resultsArea) {
        List<Double> accepted = new ArrayList<>();
        totalAttempts = 0;
        acceptedCount = 0;
        
        resultsArea.append(String.format("Parámetros: M=%.2f, a=%.2f, b=%.2f\n", M, a, b));
        resultsArea.append(String.format("Método: Generar R₁ ∈ [%.2f,%.2f], R₂ uniforme\n", a, b));
        resultsArea.append(String.format("Aceptar si: R₂ ≤ f(x)/M\n\n"));
        resultsArea.append("Primeras 15 intentos:\n");
        resultsArea.append("-".repeat(80) + "\n");
        resultsArea.append("Intento | R₁      | R₂      | f(x)    | M       | f(x)/M  | Aceptado?\n");
        resultsArea.append("-".repeat(80) + "\n");
        
        int displayedAttempts = 0;
        
        while (accepted.size() < numSamples) {
            totalAttempts++;
            
            // Paso 1 y 2: Generar R₁ y R₂
            double R1 = a + (b - a) * random.nextDouble();
            double R2 = random.nextDouble();
            
            // Paso 3: Evaluar función
            double fx = 0;
            switch (distribution) {
                case "Empírica f(x)=2x":
                    fx = empiricalFunction(R1);
                    break;
                case "Triangular":
                    fx = triangularFunction(R1, a, (a+b)/2, b);
                    break;
                case "Beta":
                    fx = betaFunction(R1);
                    break;
            }
            
            // Paso 4: Condición de aceptación
            boolean accept = R2 <= (fx / M);
            if (accept) {
                accepted.add(R1);
                acceptedCount++;
            }
            
            // Mostrar primeros intentos
            if (displayedAttempts < 15) {
                resultsArea.append(String.format("%7d | %.4f   | %.4f   | %.4f   | %.4f   | %.4f   | %s\n",
                    totalAttempts, R1, R2, fx, M, fx/M, accept ? "✓ SÍ" : "✗ NO"));
                displayedAttempts++;
            }
        }
        
        double acceptanceRate = (double) acceptedCount / totalAttempts * 100;
        resultsArea.append("\n");
        resultsArea.append("RESUMEN\n");
        resultsArea.append("-".repeat(80) + "\n");
        resultsArea.append(String.format("Total de intentos:        %d\n", totalAttempts));
        resultsArea.append(String.format("Muestras aceptadas:       %d\n", acceptedCount));
        resultsArea.append(String.format("Tasa de aceptación:       %.2f%%\n", acceptanceRate));
        resultsArea.append(String.format("Eficiencia esperada 1/M:  %.2f%%\n", 100.0 / M));
        
        return accepted.stream().mapToDouble(Double::doubleValue).toArray();
    }
    
    /**
     * Distribución Beta simplificada
     */
    private double betaFunction(double x) {
        if (x >= 0 && x <= 1) {
            return 2 * x; // Aproximación simple
        }
        return 0;
    }
}
