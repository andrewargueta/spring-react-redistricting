package Lions.demo.entity;

public class BoxAndWhisker {
    private Double median;
    private Double q1;
    private Double q2;
    private Double min;
    private Double max;
    private int districtingId;

    public BoxAndWhisker(double median, double q1, double q2, double min, double max) {
        this.median = median;
        this.q1 = q1;
        this.q2 = q2;
        this.min = min;
        this.max = max;
    }

    public Double getMedian() {
        return this.median;
    }

    public void setMedian(Double median) {
        this.median = median;
    }

    public Double getQ1() {
        return this.q1;
    }

    public void setQ1(Double q1) {
        this.q1 = q1;
    }

    public Double getQ2() {
        return this.q2;
    }

    public void setQ2(Double q2) {
        this.q2 = q2;
    }

    public Double getMin() {
        return this.min;
    }

    public void setMin(Double min) {
        this.min = min;
    }

    public Double getMax() {
        return this.max;
    }

    public void setMax(Double max) {
        this.max = max;
    }

    
}
