import javax.swing.*;
import javax.swing.table.DefaultTableModel;
import java.awt.*;
import java.util.*;

/**
 * Ventana para el Método de Transformada Inversa
 * F(x) = R → x = F⁻¹(R)
 */
public class InverseTransformWindow extends JFrame {
    private JComboBox<String> distributionCombo;
    private JTextField lambdaField, aField, bField;
    private JSpinner samplesSpinner;
    private JTextArea resultsArea;
    private JTable histogramTable;
    private MathExpressionEvaluator evaluator;
    
    public InverseTransformWindow() {
        setTitle("Método de Transformada Inversa - F(x) = R");
        setSize(900, 700);
        setLocationRelativeTo(null);
        setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE);
        
        evaluator = new MathExpressionEvaluator();
        
        // Panel de selección de distribución
        JPanel distributionPanel = new JPanel(new GridLayout(2, 4, 10, 10));
        distributionPanel.setBorder(BorderFactory.createTitledBorder("Distribución Predefinida"));
        
        distributionPanel.add(new JLabel("Distribución:"));
        String[] distributions = {"Exponencial", "Uniforme", "Weibull", "Personalizada"};
        distributionCombo = new JComboBox<>(distributions);
        distributionCombo.addActionListener(e -> updateParameterFields());
        distributionPanel.add(distributionCombo);
        
        distributionPanel.add(new JLabel("λ (lambda/shape):"));
        lambdaField = new JTextField("2.0");
        distributionPanel.add(lambdaField);
        
        distributionPanel.add(new JLabel("a (mín):"));
        aField = new JTextField("0");
        distributionPanel.add(aField);
        
        distributionPanel.add(new JLabel("b (máx):"));
        bField = new JTextField("1");
        distributionPanel.add(bField);
        
        distributionPanel.add(new JLabel("Muestras:"));
        samplesSpinner = new JSpinner(new SpinnerNumberModel(100, 1, 100000, 1));
        distributionPanel.add(samplesSpinner);
        
        JButton btnGenerate = new JButton("Generar Muestras");
        btnGenerate.addActionListener(e -> generateSamples());
        distributionPanel.add(btnGenerate);
        
        // Panel de resultados
        JPanel resultsPanel = new JPanel(new BorderLayout(10, 10));
        resultsPanel.setBorder(BorderFactory.createTitledBorder("Resultados y Estadísticas"));
        
        resultsArea = new JTextArea(15, 50);
        resultsArea.setFont(new Font("Courier New", Font.PLAIN, 10));
        resultsArea.setEditable(false);
        JScrollPane scrollPane = new JScrollPane(resultsArea);
        resultsPanel.add(scrollPane, BorderLayout.CENTER);
        
        // Panel de histograma
        JPanel histogramPanel = new JPanel(new BorderLayout());
        histogramPanel.setBorder(BorderFactory.createTitledBorder("Histograma (primeras 10 clases)"));
        
        String[] columnNames = {"Clase", "Rango", "Frecuencia", "Representación"};
        DefaultTableModel tableModel = new DefaultTableModel(columnNames, 0);
        histogramTable = new JTable(tableModel);
        histogramPanel.add(new JScrollPane(histogramTable), BorderLayout.CENTER);
        
        // Agregar paneles al contenedor principal
        JPanel mainPanel = new JPanel(new BorderLayout(10, 10));
        mainPanel.setBorder(BorderFactory.createEmptyBorder(10, 10, 10, 10));
        mainPanel.add(distributionPanel, BorderLayout.NORTH);
        mainPanel.add(resultsPanel, BorderLayout.CENTER);
        mainPanel.add(histogramPanel, BorderLayout.SOUTH);
        
        add(mainPanel);
        setVisible(true);
    }
    
    private void updateParameterFields() {
        String selected = (String) distributionCombo.getSelectedItem();
        switch (selected) {
            case "Exponencial":
                lambdaField.setText("2.0");
                aField.setText("0");
                bField.setText("10");
                break;
            case "Uniforme":
                lambdaField.setText("N/A");
                aField.setText("0");
                bField.setText("1");
                break;
            case "Weibull":
                lambdaField.setText("2.0");
                aField.setText("0");
                bField.setText("5");
                break;
        }
    }
    
    private void generateSamples() {
        try {
            String selected = (String) distributionCombo.getSelectedItem();
            int numSamples = (int) samplesSpinner.getValue();
            double[] samples = new double[numSamples];
            
            resultsArea.setText("");
            resultsArea.append("=" .repeat(80) + "\n");
            resultsArea.append("MÉTODO DE TRANSFORMADA INVERSA: x = F⁻¹(R)\n");
            resultsArea.append("=" .repeat(80) + "\n\n");
            
            InverseTransformGenerator generator = new InverseTransformGenerator();
            samples = generator.generateSamples(selected, numSamples, 
                Double.parseDouble(lambdaField.getText()),
                Double.parseDouble(aField.getText()),
                Double.parseDouble(bField.getText()));
            
            // Mostrar primeras muestras
            resultsArea.append("Primeras 20 muestras generadas:\n");
            resultsArea.append("-".repeat(80) + "\n");
            for (int i = 0; i < Math.min(20, numSamples); i++) {
                resultsArea.append(String.format("%3d: %.6f\n", i + 1, samples[i]));
            }
            resultsArea.append("\n");
            
            // Estadísticas
            double mean = Arrays.stream(samples).average().orElse(0);
            double min = Arrays.stream(samples).min().orElse(0);
            double max = Arrays.stream(samples).max().orElse(0);
            double variance = calculateVariance(samples, mean);
            
            resultsArea.append("ESTADÍSTICAS\n");
            resultsArea.append("-".repeat(80) + "\n");
            resultsArea.append(String.format("Muestras generadas: %d\n", numSamples));
            resultsArea.append(String.format("Media:              %.6f\n", mean));
            resultsArea.append(String.format("Mínimo:             %.6f\n", min));
            resultsArea.append(String.format("Máximo:             %.6f\n", max));
            resultsArea.append(String.format("Varianza:           %.6f\n", variance));
            resultsArea.append(String.format("Desviación Est.:    %.6f\n", Math.sqrt(variance)));
            
            // Generar histograma
            updateHistogram(samples);
            
        } catch (NumberFormatException ex) {
            JOptionPane.showMessageDialog(this, "Error: Ingrese valores numéricos válidos", 
                "Error de Entrada", JOptionPane.ERROR_MESSAGE);
        }
    }
    
    private void updateHistogram(double[] samples) {
        DefaultTableModel model = (DefaultTableModel) histogramTable.getModel();
        model.setRowCount(0);
        
        double min = Arrays.stream(samples).min().orElse(0);
        double max = Arrays.stream(samples).max().orElse(1);
        int numClasses = Math.min(10, (int) Math.sqrt(samples.length));
        double classWidth = (max - min) / numClasses;
        
        int[] frequencies = new int[numClasses];
        for (double sample : samples) {
            int classIndex = (int) ((sample - min) / classWidth);
            if (classIndex >= numClasses) classIndex = numClasses - 1;
            if (classIndex >= 0) frequencies[classIndex]++;
        }
        
        int maxFreq = Arrays.stream(frequencies).max().orElse(1);
        for (int i = 0; i < numClasses; i++) {
            double rangeStart = min + i * classWidth;
            double rangeEnd = rangeStart + classWidth;
            String bars = "█".repeat((int) (frequencies[i] * 40 / maxFreq));
            model.addRow(new Object[]{i + 1, 
                String.format("[%.2f, %.2f)", rangeStart, rangeEnd),
                frequencies[i], bars});
        }
    }
    
    private double calculateVariance(double[] samples, double mean) {
        return Arrays.stream(samples)
            .map(x -> Math.pow(x - mean, 2))
            .average()
            .orElse(0);
    }
}
