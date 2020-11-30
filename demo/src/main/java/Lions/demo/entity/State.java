package Lions.demo.entity;

import java.util.*;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import Lions.demo.enums.*;

@Entity
@Table(name = "States")
public class State {
    private String name;
    private String symbol;
    private List<CongressionalDistrict> districts;
    private List<Precinct> precincts;

    public State(){

    }

    public State(String name){
        this.name = name;
    }

    @Id
    @Column(name = "name")
    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Column(name = "symbol")
    public String getSymbol() {
        return this.symbol;
    }

    public void setSymbol(String symbol) {
        this.symbol = symbol;
    }

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "state")
    public List<CongressionalDistrict> getDistricts() {
        return this.districts;
    }

    public void setDistricts(List<CongressionalDistrict> districts) {
        this.districts = districts;
    }

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "state")
    public List<Precinct> getPrecincts() {
        return this.precincts;
    }

    public void setPrecincts(List<Precinct> precincts) {
        this.precincts = precincts;
    }

    public void generateHeatMaps(List<MinorityGroup> minGroups){
        
    }
}
