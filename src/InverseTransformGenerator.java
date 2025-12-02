import java.util.Random;

/**
 * Generador de variables aleatorias usando Transformada Inversa
 * Basado en Ejemplos 4.1, 4.3, 4.4 del Capítulo 4
 */
public class InverseTransformGenerator {
    private Random random;
    
    public InverseTransformGenerator() {
        this.random = new Random();
    }
    
    /**
     * Genera muestras según distribución seleccionada
     */
    public double[] generateSamples(String distribution, int numSamples, double lambda, double a, double b) {
        double[] samples = new double[numSamples];
        
        switch (distribution) {
            case "Exponencial":
                // f(x) = λ * e^(-λx), x ≥ 0
                // F(x) = 1 - e^(-λx)
                // x = -ln(R) / λ
                for (int i = 0; i < numSamples; i++) {
                    double R = random.nextDouble();
                    samples[i] = -Math.log(R) / lambda;
                }
                break;
                
            case "Uniforme":
                // f(x) = 1/(b-a), a ≤ x ≤ b
                // F(x) = (x-a)/(b-a)
                // x = a + (b-a)*R
                for (int i = 0; i < numSamples; i++) {
                    double R = random.nextDouble();
                    samples[i] = a + (b - a) * R;
                }
                break;
                
            case "Weibull":
                // f(x) = (k/λ) * (x/λ)^(k-1) * e^(-(x/λ)^k)
                // F(x) = 1 - e^(-(x/λ)^k)
                // x = λ * (-ln(R))^(1/k)
                for (int i = 0; i < numSamples; i++) {
                    double R = random.nextDouble();
                    samples[i] = lambda * Math.pow(-Math.log(R), 1.0 / lambda);
                }
                break;
                
            default:
                // Uniforme por defecto
                for (int i = 0; i < numSamples; i++) {
                    samples[i] = random.nextDouble();
                }
        }
        
        return samples;
    }
}
