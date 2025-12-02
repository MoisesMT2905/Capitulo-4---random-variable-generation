import javax.swing.*;
import javax.swing.table.DefaultTableModel;
import java.awt.*;
import java.util.*;

/**
 * Ventana para el Método de Composición
 * f(x) = A₁f₁(x) + A₂f₂(x) + ...
 */
public class CompositionWindow extends JFrame {
    private JComboBox<String> distributionCombo;
    private JTextField pField, lambdaField, aField, bField, cField;
    private JSpinner samplesSpinner;
    private JTextArea resultsArea;
    private JTable histogramTable;
    
    public CompositionWindow() {
        setTitle("Método de Composición - Mezcla de Distribuciones");
        setSize(900, 700);
        setLocationRelativeTo(null);
        setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE);
        
        // Panel de selección
        JPanel selectionPanel = new JPanel(new GridLayout(3, 4, 10, 10));
        selectionPanel.setBorder(BorderFactory.createTitledBorder("Distribución Compuesta"));
        
        selectionPanel.add(new JLabel("Mezcla:"));
        String[] distributions = {"Triangular", "Mezcla Exponencial", "Personalizada"};
        distributionCombo = new JComboBox<>(distributions);
        distributionCombo.addActionListener(e -> updateParameterFields());
        selectionPanel.add(distributionCombo);
        
        selectionPanel.add(new JLabel("p (probabilidad):"));
        pField = new JTextField("0.5");
        selectionPanel.add(pField);
        
        selectionPanel.add(new JLabel("λ (parámetro):"));
        lambdaField = new JTextField("2.0");
        selectionPanel.add(lambdaField);
        
        selectionPanel.add(new JLabel("a:"));
        aField = new JTextField("0");
        selectionPanel.add(aField);
        
        selectionPanel.add(new JLabel("b:"));
        bField = new JTextField("1");
        selectionPanel.add(bField);
        
        selectionPanel.add(new JLabel("c:"));
        cField = new JTextField("2");
        selectionPanel.add(cField);
        
        selectionPanel.add(new JLabel("Muestras:"));
        samplesSpinner = new JSpinner(new SpinnerNumberModel(100, 1, 100000, 1));
        selectionPanel.add(samplesSpinner);
        
        JButton btnGenerate = new JButton("Generar Muestras");
        btnGenerate.addActionListener(e -> generateSamples());
        selectionPanel.add(btnGenerate);
        
        // Panel de resultados
        JPanel resultsPanel = new JPanel(new BorderLayout(10, 10));
        resultsPanel.setBorder(BorderFactory.createTitledBorder("Resultados"));
        
        resultsArea = new JTextArea(15, 50);
        resultsArea.setFont(new Font("Courier New", Font.PLAIN, 10));
        resultsArea.setEditable(false);
        JScrollPane scrollPane = new JScrollPane(resultsArea);
        resultsPanel.add(scrollPane, BorderLayout.CENTER);
        
        // Panel de histograma
        JPanel histogramPanel = new JPanel(new BorderLayout());
        histogramPanel.setBorder(BorderFactory.createTitledBorder("Histograma"));
        
        String[] columnNames = {"Clase", "Rango", "Frecuencia", "Representación"};
        DefaultTableModel tableModel = new DefaultTableModel(columnNames, 0);
        histogramTable = new JTable(tableModel);
        histogramPanel.add(new JScrollPane(histogramTable), BorderLayout.CENTER);
        
        JPanel mainPanel = new JPanel(new BorderLayout(10, 10));
        mainPanel.setBorder(BorderFactory.createEmptyBorder(10, 10, 10, 10));
        mainPanel.add(selectionPanel, BorderLayout.NORTH);
        mainPanel.add(resultsPanel, BorderLayout.CENTER);
        mainPanel.add(histogramPanel, BorderLayout.SOUTH);
        
        add(mainPanel);
        setVisible(true);
    }
    
    private void updateParameterFields() {
        String selected = (String) distributionCombo.getSelectedItem();
        if (selected.equals("Triangular")) {
            pField.setText("0.5");
            aField.setText("0");
            bField.setText("1");
            cField.setText("2");
        }
    }
    
    private void generateSamples() {
        try {
            String selected = (String) distributionCombo.getSelectedItem();
            int numSamples = (int) samplesSpinner.getValue();
            double p = Double.parseDouble(pField.getText());
            double lambda = Double.parseDouble(lambdaField.getText());
            double a = Double.parseDouble(aField.getText());
            double b = Double.parseDouble(bField.getText());
            double c = Double.parseDouble(cField.getText());
            
            resultsArea.setText("");
            resultsArea.append("=" .repeat(80) + "\n");
            resultsArea.append("MÉTODO DE COMPOSICIÓN: f(x) = p*f₁(x) + (1-p)*f₂(x)\n");
            resultsArea.append("=" .repeat(80) + "\n\n");
            
            CompositionGenerator generator = new CompositionGenerator();
            double[] samples = generator.generateSamples(selected, numSamples, p, lambda, a, b, c, resultsArea);
            
            // Estadísticas
            double mean = Arrays.stream(samples).average().orElse(0);
            double min = Arrays.stream(samples).min().orElse(0);
            double max = Arrays.stream(samples).max().orElse(0);
            double variance = calculateVariance(samples, mean);
            
            resultsArea.append("\nESTADÍSTICAS\n");
            resultsArea.append("-".repeat(80) + "\n");
            resultsArea.append(String.format("Muestras generadas: %d\n", numSamples));
            resultsArea.append(String.format("Media:              %.6f\n", mean));
            resultsArea.append(String.format("Mínimo:             %.6f\n", min));
            resultsArea.append(String.format("Máximo:             %.6f\n", max));
            resultsArea.append(String.format("Varianza:           %.6f\n", variance));
            
            updateHistogram(samples);
            
        } catch (NumberFormatException ex) {
            JOptionPane.showMessageDialog(this, "Error: Valores numéricos inválidos", 
                "Error", JOptionPane.ERROR_MESSAGE);
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
