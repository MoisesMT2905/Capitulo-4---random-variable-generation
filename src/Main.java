import javax.swing.*;

/**
 * Punto de entrada principal para la aplicación
 */
public class Main {
    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> {
            new RandomVariablesApp();
        });
    }
}
