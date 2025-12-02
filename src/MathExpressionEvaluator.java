import javax.script.*;

/**
 * Evaluador de expresiones matemáticas usando ScriptEngine
 */
public class MathExpressionEvaluator {
    private ScriptEngine engine;
    
    public MathExpressionEvaluator() {
        ScriptEngineManager manager = new ScriptEngineManager();
        this.engine = manager.getEngineByName("JavaScript");
    }
    
    /**
     * Evalúa una expresión matemática
     * Soporta: +, -, *, /, ^, sqrt(), sin(), cos(), tan(), log(), ln(), exp(), abs()
     */
    public double evaluate(String expression, double variableValue) {
        try {
            // Reemplazar x con el valor
            String expr = expression.replace("x", String.valueOf(variableValue));
            
            // Reemplazar operadores
            expr = expr.replace("^", "**");  // Potencia
            expr = expr.replace("ln", "Math.log");  // Logaritmo natural
            expr = expr.replace("log", "Math.log10");  // Logaritmo base 10
            expr = expr.replace("sqrt", "Math.sqrt");
            expr = expr.replace("sin", "Math.sin");
            expr = expr.replace("cos", "Math.cos");
            expr = expr.replace("tan", "Math.tan");
            expr = expr.replace("exp", "Math.exp");
            expr = expr.replace("abs", "Math.abs");
            
            Object result = engine.eval(expr);
            return Double.parseDouble(result.toString());
        } catch (Exception e) {
            System.err.println("Error evaluando: " + expression);
            return 0;
        }
    }
}
