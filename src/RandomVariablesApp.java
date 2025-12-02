import javax.swing.*;
import java.awt.*;
import java.awt.event.*;

/**
 * Aplicación principal para generar variables aleatorias no-uniformes
 * Implementa tres métodos: Transformada Inversa, Rechazo y Composición
 * Basado en Capítulo 4 - Simulación: Un enfoque práctico (Raúl Coss Bu)
 */
public class RandomVariablesApp extends JFrame {
    
    public RandomVariablesApp() {
        setTitle("Generador de Variables Aleatorias No-Uniformes");
        setSize(500, 300);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setLocationRelativeTo(null);
        setResizable(false);
        
        // Panel principal
        JPanel mainPanel = new JPanel(new GridLayout(3, 1, 10, 10));
        mainPanel.setBorder(BorderFactory.createEmptyBorder(20, 20, 20, 20));
        
        // Botón para Transformada Inversa
        JButton btnInverseTransform = new JButton("1. Método de Transformada Inversa");
        btnInverseTransform.setFont(new Font("Arial", Font.BOLD, 14));
        btnInverseTransform.addActionListener(e -> new InverseTransformWindow());
        mainPanel.add(btnInverseTransform);
        
        // Botón para Método de Rechazo
        JButton btnRejection = new JButton("2. Método de Rechazo");
        btnRejection.setFont(new Font("Arial", Font.BOLD, 14));
        btnRejection.addActionListener(e -> new RejectionWindow());
        mainPanel.add(btnRejection);
        
        // Botón para Método de Composición
        JButton btnComposition = new JButton("3. Método de Composición");
        btnComposition.setFont(new Font("Arial", Font.BOLD, 14));
        btnComposition.addActionListener(e -> new CompositionWindow());
        mainPanel.add(btnComposition);
        
        add(mainPanel);
        setVisible(true);
    }
    
    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> new RandomVariablesApp());
    }
}
