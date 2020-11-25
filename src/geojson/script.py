# import pandas
# import geopandas

# gdf = geopandas.read_file("texas-precinct.json") # geojson file
# pdf = pandas.read_csv("MERGED_STATE_POP_DATA_TX.csv") # CSV file

# joined_gdf = gdf.merge(pdf, on="GEOID10")
# print(joined_gdf)
# joined_gdf.to_file("texas-precinct-merged.json", driver="GeoJSON")