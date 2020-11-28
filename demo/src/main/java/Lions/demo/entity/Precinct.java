package Lions.demo.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.PrimaryKeyJoinColumn;
import javax.persistence.SecondaryTable;
import javax.persistence.Table;

@Entity
@Table(name = "allprecincts", schema = "lions")
//@SecondaryTable(name = "texasprecinctneighbors", schema = "lions", pkJoinColumns = @PrimaryKeyJoinColumn(name = "geoId"))
public class Precinct {
    private String geoId;
    private String name;
    private String county;
    private int totPop;
    private int hispTotal;
    private int blackTotal;
    private int aianTotal;
    private int asianTotal;
    private int totVap;
    private int hispVap;
    private int blackVap;
    private int aianVap;
    private int asianVap;
    private String coordinates;
    private String neighbors;

    public Precinct(){
        
    }

    @Id
    @Column(name = "geoID")
    public String getGeoId() {
        return this.geoId;
    }

    public void setGeoId(String geoId) {
        this.geoId = geoId;
    }

    @Column(name = "Name")
    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Column(name = "county")
    public String getCounty() {
        return this.county;
    }

    public void setCounty(String county) {
        this.county = county;
    }

    @Column(name = "totPop")
    public int getTotPop() {
        return this.totPop;
    }

    public void setTotPop(int totPop) {
        this.totPop = totPop;
    }

    @Column(name = "hispTotal")
    public int getHispTotal() {
        return this.hispTotal;
    }

    public void setHispTotal(int hispTotal) {
        this.hispTotal = hispTotal;
    }

    @Column(name = "blackTotal")
    public int getBlackTotal() {
        return this.blackTotal;
    }

    public void setBlackTotal(int blackTotal) {
        this.blackTotal = blackTotal;
    }

    @Column(name = "aianTotal")
    public int getAianTotal() {
        return this.aianTotal;
    }

    public void setAianTotal(int aianTotal) {
        this.aianTotal = aianTotal;
    }

    @Column(name = "asianTotal")
    public int getAsianTotal() {
        return this.asianTotal;
    }

    public void setAsianTotal(int asianTotal) {
        this.asianTotal = asianTotal;
    }

    @Column(name = "totVap")
    public int getTotVap() {
        return this.totVap;
    }

    public void setTotVap(int totVap) {
        this.totVap = totVap;
    }

    @Column(name = "hispVap")
    public int getHispVap() {
        return this.hispVap;
    }

    public void setHispVap(int hispVap) {
        this.hispVap = hispVap;
    }

    @Column(name = "blackVap")
    public int getBlackVap() {
        return this.blackVap;
    }

    public void setBlackVap(int blackVap) {
        this.blackVap = blackVap;
    }

    @Column(name = "aianVap")
    public int getAianVap() {
        return this.aianVap;
    }

    public void setAianVap(int aianVap) {
        this.aianVap = aianVap;
    }

    @Column(name = "asianVap")
    public int getAsianVap() {
        return this.asianVap;
    }

    public void setAsianVap(int asianVap) {
        this.asianVap = asianVap;
    }
    
    @Column(name = "coordinates")
    public String getCoordinates() {
        return this.coordinates;
    }

    public void setCoordinates(String coordinates) {
        this.coordinates = coordinates;
    }

    //@Column(name = "neighbors", table = "texasprecinctneighbors")
    @Column(name = "neighbors")
    public String getNeighbors() {
        return this.neighbors;
    }

    public void setNeighbors(String neighbors) {
        this.neighbors = neighbors;
    }
}
