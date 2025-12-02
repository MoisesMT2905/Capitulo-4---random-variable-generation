import javax.swing.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

/**
 * Generador de variables aleatorias usando Método de Composición
 * Basado en Ejemplo 4.7 del Capítulo 4
 */
public class CompositionGenerator {
    private Random random;
    
    public CompositionGenerator() {
        this.random = new Random();
    }
    
    /**
     * Genera muestras de una distribución compuesta (Ejemplo 4.7 - Triangular)
     * f(x) = A₁f₁(x) + A₂f₂(x)
     * donde A₁ = (b-a)/(c-a), A₂ = (c-b)/(c-a)
     */
    public double[] generateSamples(String distribution, int numSamples, double p, 
                                   double lambda, double a, double b, double c, JTextArea resultsArea) {
        double[] samples = new double[numSamples];
        
        if (distribution.equals("Triangular")) {
            return generateTriangular(numSamples, a, b, c, resultsArea);
        } else if (distribution.equals("Mezcla Exponencial")) {
            return generateMixtureExponential(numSamples, p, lambda, resultsArea);
        }
        
        return samples;
    }
    
    /**
     * Distribución triangular por composición (Ejemplo 4.7)
     * Dividir en dos áreas: A₁ para [a,b] y A₂ para [b,c]
     */
    private double[] generateTriangular(int numSamples, double a, double b, double c, JTextArea resultsArea) {
        double[] samples = new double[numSamples];
        
        // Calcular áreas
        double A1 = (b - a) / (c - a);  // Probabilidad de elegir f₁
        double A2 = (c - b) / (c - a);  // Probabilidad de elegir f₂
        
        resultsArea.append(String.format("Distribución Triangular: f(x) en [%.2f, %.2f, %.2f]\n", a, b, c));
        resultsArea.append(String.format("Área 1 (A1):  %.4f (para [%.2f, %.2f])\n", A1, a, b));
        resultsArea.append(String.format("Área 2 (A2):  %.4f (para [%.2f, %.2f])\n", A2, b, c));
        resultsArea.append("\nPrimeras 15 muestras:\n");
        resultsArea.append("-".repeat(80) + "\n");
        resultsArea.append("Num | R1 (selección) | Sub-dist | R2 (valor) | Valor X  | Origen\n");
        resultsArea.append("-".repeat(80) + "\n");
        
        int count1 = 0;  // Muestras de f₁
        int count2 = 0;  // Muestras de f₂
        
        for (int i = 0; i < numSamples; i++) {
            // Paso 5: Generar R₁
            double R1 = random.nextDouble();
            
            // Paso 6: Seleccionar distribución
            String subDist;
            double x;
            
            if (R1 <= A1) {
                // Seleccionar f₁ para [a,b] - f(x) = 2(x-a)/((b-a)(c-a))
                subDist = "f₁";
                // Transformada inversa: x = a + (b-a)*sqrt(R₂)
                double R2 = random.nextDouble();
                x = a + (b - a) * Math.sqrt(R2);
                count1++;
                
                if (i < 15) {
                    resultsArea.append(String.format("%3d | %.4f        | %s       | %.4f      | %.4f    | Sub-dist 1\n",
                        i + 1, R1, subDist, R2, x));
                }
            } else {
                // Seleccionar f₂ para [b,c] - f(x) = 2(c-x)/((c-b)(c-a))
                subDist = "f₂";
                // Transformada inversa: x = c - (c-b)*sqrt(R₂)
                double R2 = random.nextDouble();
                x = c - (c - b) * Math.sqrt(R2);
                count2++;
                
                if (i < 15) {
                    resultsArea.append(String.format("%3d | %.4f        | %s       | %.4f      | %.4f    | Sub-dist 2\n",
                        i + 1, R1, subDist, R2, x));
                }
            }
            
            samples[i] = x;
        }
        
        resultsArea.append("\n");
        resultsArea.append("RESUMEN DE COMPOSICIÓN\n");
        resultsArea.append("-".repeat(80) + "\n");
        resultsArea.append(String.format("Muestras de f₁: %d (%.2f%%)\n", count1, (double)count1/numSamples*100));
        resultsArea.append(String.format("Muestras de f₂: %d (%.2f%%)\n", count2, (double)count2/numSamples*100));
        resultsArea.append(String.format("Proporción esperada A1: %.4f\n", A1));
        resultsArea.append(String.format("Proporción esperada A2: %.4f\n", A2));
        
        return samples;
    }
    
    /**
     * Mezcla de exponenciales
     * f(x) = p*λ₁*e^(-λ₁x) + (1-p)*λ₂*e^(-λ₂x)
     */
    private double[] generateMixtureExponential(int numSamples, double p, double lambda, JTextArea resultsArea) {
        double[] samples = new double[numSamples];
        
        resultsArea.append(String.format("Mezcla de Exponenciales: p=%.4f (Exp1), 1-p=%.4f (Exp2)\n", p, 1-p));
        resultsArea.append(String.format("λ₁ = %.4f, λ₂ = %.4f\n", lambda, lambda/2));
        resultsArea.append("\nPrimeras 15 muestras:\n");
        resultsArea.append("-".repeat(80) + "\n");
        resultsArea.append("Num | R1 (selección) | Componente | R2         | Valor X\n");
        resultsArea.append("-".repeat(80) + "\n");
        
        int count1 = 0;
        int count2 = 0;
        
        for (int i = 0; i < numSamples; i++) {
            double R1 = random.nextDouble();
            double R2 = random.nextDouble();
            double x;
            String component;
            
            if (R1 <= p) {
                // Componente 1: Exponencial con λ
                x = -Math.log(R2) / lambda;
                component = "Exp(λ)";
                count1++;
            } else {
                // Componente 2: Exponencial con λ/2
                x = -Math.log(R2) / (lambda / 2);
                component = "Exp(λ/2)";
                count2++;
            }
            
            if (i < 15) {
                resultsArea.append(String.format("%3d | %.4f        | %9s | %.4f      | %.4f\n",
                    i + 1, R1, component, R2, x));
            }
            
            samples[i] = x;
        }
        
        resultsArea.append("\n");
        resultsArea.append("RESUMEN\n");
        resultsArea.append("-".repeat(80) + "\n");
        resultsArea.append(String.format("Muestras Exp(λ):   %d (%.2f%%)\n", count1, (double)count1/numSamples*100));
        resultsArea.append(String.format("Muestras Exp(λ/2): %d (%.2f%%)\n", count2, (double)count2/numSamples*100));
        
        return samples;
    }
}
