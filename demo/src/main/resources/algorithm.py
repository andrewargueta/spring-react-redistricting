import json
import networkx as nx
import matplotlib.pyplot as plt
import random

import sys

    # def compactness(compactness_str):
    #     if compactness_str == "VERYCOMPACT":
    #         return 
    #     elif compactness_str == "COMPACT":
    #         return
    #     elif compactness_str == "SOMEWHATCOMPACT":
    #         return

def showGraph(G):
    nx.draw(G, with_labels=False)
    plt.draw()
    plt.show()

def generate_precinct(jsonpath):
    precinct_graph=nx.Graph()

    with open(jsonpath) as jsonfile:
        data = json.load(jsonfile)
    
    for precinct in data:
        geoId = precinct["geoId"]
        totPop = precinct["totPop"]
        neighbors = precinct["neighbors"].split(" ")
        precinct_graph.add_node(geoId, population=totPop)
        
        for neighbor in neighbors:
            precinct_graph.add_edge(geoId, neighbor)
    return precinct_graph

def generate_district(precinct_graph, numOfDistrict):
    district_graph = None
    district_clusters = {} # All nodes in one cluster
    while True:
        n1 = random.choice(list(precinct_graph.nodes()))
        n2 = random.choice(list(precinct_graph[n1]))
        
        # Provide a representation of all contracted nodes in a cluster
        if n1 in district_clusters:
            if n2 in district_clusters:
                district_clusters[n1].extend(district_clusters[n2])
                del district_clusters[n2]
            else:
                district_clusters[n1].append(n2)
        else:
            district_clusters[n1] = [n1]
            if n2 in district_clusters:
                district_clusters[n1].extend(district_clusters[n2])
                del district_clusters[n2]
            else:
                district_clusters[n1].append(n2)

        district_graph = nx.contracted_nodes(precinct_graph, n1, n2, self_loops=False, copy=False)

        if numOfDistrict==district_graph.order():
            break
    
    # Patch up nodes that were never picked to be combined
    for precinct in district_graph:
        if precinct not in district_clusters:
            district_clusters[precinct] = [precinct]

    return district_graph, district_clusters, list(district_graph.edges())


def combine_district(precinct_graph, district_clusters, district_edges):
    selected_edge = random.choice(district_edges)
    # print("selected_edge", selected_edge, "from", district_edges)
    cluster1 = district_clusters[selected_edge[0]]
    cluster2 = district_clusters[selected_edge[1]]
    selected_clusters = [cluster1, cluster2]

    combined_district = cluster1 + cluster2

    combined_subgraph = precinct_graph.subgraph(combined_district)

    return combined_subgraph, selected_clusters, selected_edge

def generate_spanningtree(graph):
    mst = nx.minimum_spanning_tree(graph, algorithm='kruskal')
    return mst

def calculate_ideal_pop(precinct_graph, numOfDistrict):
    total = 0
    for precinct in precinct_graph:
        total += precinct_graph.nodes[precinct]['population']
    
    return total // numOfDistrict

def calculate_district_population(precinct_graph, district):
    total_pop = 0
    for precinct in district:
        total_pop += precinct_graph.nodes[precinct]['population']

    return total_pop

# TODO COMPACTNESS
def calculate_district_compactness(precinct_graph, total_edge, district):
    cut_edge_count = 0
    for precinct1 in district:
        edges = precinct_graph.edges(precinct1)
        num_edges = len(edges)
        for precinct2 in district:
            if precinct1 != precinct2:
                if precinct_graph.has_edge(precinct1, precinct2):
                    num_edges -= 1
        cut_edge_count += num_edges
    return total_edge/cut_edge_count

def check_acceptability(precinct_graph, population_var, ideal_pop, new_districts):
    lower_range = ideal_pop - (0.5 * population_var * ideal_pop)
    upper_range = ideal_pop + (0.5 * population_var * ideal_pop)

    acceptable = 0
    for district in new_districts:
        new_district_population = calculate_district_population(precinct_graph, district)
        # new_district_compactness = calculate_district_compactness(precinct_graph, total_edge, district)
        if lower_range <= new_district_population and new_district_population <= upper_range:
            acceptable += 1

    if acceptable != 2:
        return False
    return True

def check_improvement(precinct_graph, population_var, ideal_pop, old_districts, new_districts):
    old_districts_populations = []
    for district in old_districts:
        old_districts_populations.append(calculate_district_population(precinct_graph, district))

    improved = 0
    for district in new_districts:
        new_district_population = calculate_district_population(precinct_graph, district)
        for old_district_population in old_districts_populations:
            # so long as the new_district improve against one of the old_district its consider an improvement
            if abs(ideal_pop - new_district_population) < abs(ideal_pop - old_district_population):
                improved += 1
                break
    
    if improved != 2:
        return False
    return True

def generate_new_districts_list(spanning_tree, precinct_graph, population_var, ideal_pop, old_districts):
    acceptable_districts_list = []
    improved_districts_list = []

    for edge in spanning_tree.edges:
        temp_tree = spanning_tree.copy()
        temp_tree.remove_edge(edge[0], edge[1])
        new_districts_generator = nx.connected_components(temp_tree)

        new_districts = []
        for new_district in new_districts_generator:
            new_districts.append(list(new_district))

        if check_acceptability(precinct_graph, population_var, ideal_pop, new_districts):
            acceptable_districts_list.append(new_districts)
        elif check_improvement(precinct_graph, population_var, ideal_pop, old_districts, new_districts):
            improved_districts_list.append(new_districts)

    return acceptable_districts_list, improved_districts_list

def select_new_districts(acceptable_districts_list, improved_districts_list, district_clusters, old_districts, district_edge):
    if len(acceptable_districts_list) != 0:
        del district_clusters[district_edge[0]]
        del district_clusters[district_edge[1]]

        new_districts = random.choice(acceptable_districts_list)
        new_district_edge = []
        for district in new_districts:
            district_clusters[district[0]] = district
            new_district_edge.append(district[0])

    elif len(improved_districts_list) != 0:
        del district_clusters[district_edge[0]]
        del district_clusters[district_edge[1]]

        new_districts = random.choice(improved_districts_list)
        new_district_edge = []
        for district in new_districts:
            district_clusters[district[0]] = district
            new_district_edge.append(district[0])

def connected_clusters(precinct_graph, cluster1, cluster2):
    for precinctA in cluster1:
        for precinctB in cluster2:
            if precinct_graph.has_edge(precinctA, precinctB):
                return True
    return False

# how do we know the connection between these newly generated districts with other districts
def reconfigure_district_edges(precinct_graph, district_clusters):
    districts = list(district_clusters.keys())
    new_district_edges = []
    for i in range(len(districts)):
        cluster1 = district_clusters[districts[i]]
        for j in range(i+1, len(districts)):
            cluster2 = district_clusters[districts[j]]
            
            if connected_clusters(precinct_graph, cluster1, cluster2):
                new_district_edges.append((districts[i], districts[j]))

    return new_district_edges

def main():
    jobId = sys.argv[1]
    numOfPlans = int(sys.argv[2])
    population_var = float(sys.argv[3])
    state = sys.argv[4]
    jsonpath = "demo/src/main/resources/static/"
    numOfDistrict = 0
    if state == "Mississippi":
        numOfDistrict = 4
        jsonpath += "mississippi.json"
    elif state == "Texas":
        numOfDistrict = 32
        jsonpath += "texas.json"
    elif state == "Alabama":
        numOfDistrict = 7
        jsonpath += "alabama.json"
    else:
        print("Wrong state name")
        exit()
    max_iteration = 1

    precinct_graph = generate_precinct(jsonpath)
    # print("------------------------------------------------------------")
    # print(precinct_graph.nodes(data=True))
    # showGraph(precinct_graph)

    ideal_pop = calculate_ideal_pop(precinct_graph, numOfDistrict)
    # print("------------------------------------------------------------")
    # print(ideal_pop)

    # Loop here for numOfPlans
    result = dict()

    for n in range(0, numOfPlans):
        district_graph, district_clusters, district_edges = generate_district(precinct_graph.copy(), numOfDistrict)
        # print("------------------------------------------------------------")
        # print(district_graph.nodes(data=True))
        # print("------------------------------------------------------------")
        # print("init", district_clusters)
        # showGraph(district_graph)

        for i in range(0, max_iteration):
            print("Interation:", i+1)
            # print("------------------------------------------------------------")
            combined_subgraph, old_districts, district_edge = combine_district(precinct_graph, district_clusters, district_edges)
            # print("------------------------------------------------------------")
            # print(combined_subgraph.nodes(data=True))
            # showGraph(combined_subgraph)

            spanning_tree = generate_spanningtree(combined_subgraph)
            # showGraph(spanning_tree)

            acceptable_districts_list, improved_districts_list = generate_new_districts_list(spanning_tree, precinct_graph, population_var, ideal_pop, old_districts)
            # print("------------------------------------------------------------")
            # print("acceptable", acceptable_districts_list)
            # print("------------------------------------------------------------")
            # print("improved", improved_districts_list)
            # print("------------------------------------------------------------")

            # print("prev", district_clusters)
            select_new_districts(acceptable_districts_list, improved_districts_list, district_clusters, old_districts, district_edge)
            # print("curr", district_clusters)

            district_edges = reconfigure_district_edges(precinct_graph, district_clusters)

            # print()

        district_idx = 0
        result_districts = {}
        for key in district_clusters:
            result_districts[jobId+'_'+str(n)+'_'+str(district_idx)] = district_clusters[key]
            district_idx += 1

        result[jobId +'_'+ str(n)] = result_districts

    result_path = 'demo/src/main/resources/static/result_' + state + '.json'
    with open(result_path, 'w') as result_file:
        json.dump(result, result_file, indent=4, sort_keys=True)

    print("done")

if __name__ == "__main__":
    main()