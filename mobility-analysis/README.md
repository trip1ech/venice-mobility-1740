# Venice Mobility Analysis

This repository contains scripts, processed data, and resources for analyzing human mobility and the transport network of Venice in the 18th century. The project focuses on cleaning and preparing road network geometries, integrating *traghetto* ferry routes, and performing agent-based mobility simulations.

## Project Overview

### 1. Notebooks
- **`street-network-cleaning.ipynb`**  
  This notebook performs *geometry engineering* and cleaning operations on the road network data. Some processes, such as snapping and buffering, were carried out in QGIS.  
  - **Input**: `rawdata/1808_street_network_geometries_rde_20241204.geojson`  
  - **Output**: `1808_street_cleaned.geojson`

- **`mobility-analysis.ipynb`**  
  This notebook focuses on *mobility analysis*:
  - **Land Use Classification**: Classifies properties based on functional keywords.
  - **Agent Simulation**: Simulates agent movement between home and workplace locations.
  - **Input**: Cleaned road network, *catastici* data, and district boundaries.  
  - **Output**: Mobility flow results and visualizations.

- **`data-exploration.ipynb`**  
  A testing notebook used for preliminary data inspection and analysis.

### 2. Data Files
All raw input data are stored in the **`rawdata/`** folder:
- **`rawdata/1808_street_network_geometries_rde_20241204.geojson`**  
  Original street network data provided by *Venice Time Machine*.

- **`rawdata/1740_redrawn_parishes_cleaned_wikidata_standardised.geojson`**  
  Administrative district boundaries provided by *Venice Time Machine*.

- **`rawdata/catastici_1740_full_geojson_20240917.geojson`**  
  The full dataset containing properties and their functional classification.

- **`rawdata/catastici_1740.csv`**  
  A CSV version of the *catastici* dataset, converted from the original GeoJSON for ease of tabular analysis.

### Processed Outputs
- **`1808_street_cleaned.geojson`**  
  The cleaned and fully connected street network after geometry engineering and manual corrections.

- **`1808_street_traghetto_route.geojson`**  
  An integrated transport network combining:  
  - **Roads** (from the cleaned street network).  
  - **Traghetti routes** (digitized based on historical maps).  
  - The `Type` field distinguishes between `road` and `traghetto`.

## Workflow Summary

1. **Geometry Engineering**:  
   - Cleaned the road network geometry to ensure connectivity.  
   - Fixed disconnected components using QGIS tools and manual editing.  

2. **Mobility Analysis**:  
   - Classified property functions using the `function` column in the *catastici* dataset.  
   - Identified agents who rented or owned multiple properties.  
   - Simulated agent movements between home and workplace locations using the cleaned network and added *traghetto* routes.

3. **Visualization and Results**:  
   - Static and interactive visualizations were generated to analyze traffic flow, spatial patterns, and *traghetto* significance.

## Folder Structure