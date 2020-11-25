package Lions.demo.entity;

public class PlotData {
    private double median;
    private double q1;
    private double q2;
    private double min;
    private double max;
    private int districtingId;

    public PlotData(double median, double q1, double q2, double min, double max) {
        this.median = median;
        this.q1 = q1;
        this.q2 = q2;
        this.min = min;
        this.max = max;
    }

    public double getMedian() {
        return this.median;
    }

    public double getQ1() {
        return this.q1;
    }

    public double getQ2() {
        return this.q2;
    }

    public double getMin() {
        return this.min;
    }

    public double getMax() {
        return this.max;
    }
}
