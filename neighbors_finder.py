import geopandas as gp
import json
import sys

file = sys.argv[1]
state = file[:2]
df = gp.read_file(file)
df = df.to_crs(epsg = 2272)
precincts = []
ft = 200

for index, precinct in df.iterrows(): 
    precinct_neighbors_dict = {}
    neighbors = df[df.geometry.distance(precinct.geometry) <= ft].GeoID.tolist()
    neighbors = [ gid for gid in neighbors if precinct.GeoID != gid ]
    neighbors = " ".join(neighbors)
    precinct_neighbors_dict[precinct.GeoID] = neighbors
    precincts.append(precinct_neighbors_dict)

with open(state + "-precinct-neighbors.json", "w") as outfile:
    json.dump(precincts, outfile, indent = 4)