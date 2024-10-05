#!/usr/bin/env python
# coding: utf-8

# In[22]:


import os
import geopandas as gpd
import numpy as np
import pandas as pd
from shapely.geometry import shape
from census import Census
import matplotlib.pyplot as plt


# In[23]:


def get_blockgroup_population(census_gdf, census_api_key=""):
    # Check for the census API key. First, look in the census_api_key parameter, then in the 'census_api_key.txt' file in the current directory
    if not census_api_key and os.path.exists("census_api_key.txt"):
        # Read the API key from the file
        with open("census_api_key.txt", "r") as file:
            census_api_key = file.read().strip()
    elif not census_api_key:
        raise ValueError("No API key was provided, and the 'census_api_key.txt' file is not found or empty. Please provide a valid API key from https://api.census.gov/data/key_signup.html.")

    # Gets state and county FIPS code. This assumes all entries are within same state, but allows for variability in number of counties
    state_fips = census_gdf.STATEFP[0]
    county_fips = census_gdf.COUNTYFP.unique()
    
    # Initialize the Census API with the provided key
    c = Census(census_api_key)

    census_pop = []

    # Retrieve census data by block group for the specified state and county
    # B01003_001E: Total population
    for county_fip in county_fips:
        data = c.acs5.state_county_blockgroup('B01003_001E', state_fips, county_fip, Census.ALL)
        census_pop.extend(data)

    census_pop_gdf = gpd.GeoDataFrame(census_pop)

    census_pop_gdf.rename(columns={'B01003_001E': 'POP'}, inplace=True)

    # Create the 'GEOID' column by concatenating the 'state', 'county', 'tract', and 'block group' fields
    census_pop_gdf['GEOID'] = census_pop_gdf['state'] + census_pop_gdf['county'] + census_pop_gdf['tract'] + census_pop_gdf['block group']

    # Deletes extraneous columns
    census_pop_gdf = census_pop_gdf.drop(columns=['state', 'county', 'tract', 'block group'])

    census_gdf = census_gdf.merge(census_pop_gdf, on='GEOID', how='left')
    census_gdf = census_gdf.set_geometry('geometry')

    # Calculate area in square kilometers
    area_sqkm = (census_gdf['ALAND']) / 10**6

    # Create population density column
    census_gdf['POPDENSITY'] = census_gdf['POP'] / area_sqkm

    # Calculate normalized population density
    census_gdf['NORMPOPDENSITY'] = (census_gdf['POPDENSITY'] - census_gdf['POPDENSITY'].min()) / \
    (census_gdf['POPDENSITY'].max() - census_gdf['POPDENSITY'].min())

    # Calculate percentile rank for NORMPOPDENSITY and create NORMPOPDENSITY_ADJ column
    census_gdf['NORMPOPDENSITY_ADJ'] = census_gdf['NORMPOPDENSITY'].rank(pct=True)

    return census_gdf


census_gdf = gpd.read_file('atl_bg.geojson')
census_gdf = get_blockgroup_population(census_gdf, census_api_key = "bb8ddb8b99dc18f4759d67d905c25e1486077c4d")


# In[25]:

# Construct the output path relative to your current script location
output_path = os.path.join("..", "geojson_outputs", "atlanta_pdi.geojson")

# Save the GeoDataFrame to the specified output path
census_gdf.to_file(output_path, driver="GeoJSON")


# In[ ]:





