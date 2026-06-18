import streamlit as st
import pickle
import pandas as pd
import numpy as np
import ast
import re
from pathlib import Path

st.set_page_config(page_title="Recommend Appartments")

BASE_DIR = Path(__file__).resolve().parents[1]
APARTMENTS_PATH = BASE_DIR.parent / 'data_collection' / 'appartments.csv'
COSINE_SIM1_PATH = BASE_DIR / 'datasets' / 'cosine_sim1.pkl'
COSINE_SIM2_PATH = BASE_DIR / 'datasets' / 'cosine_sim2.pkl'
COSINE_SIM3_PATH = BASE_DIR / 'datasets' / 'cosine_sim3.pkl'

def distance_to_meters(distance_str):
    if pd.isna(distance_str):
        return np.nan

    distance_str = str(distance_str).strip()
    if not distance_str:
        return np.nan

    match = re.search(r'([\d.]+)\s*([a-zA-Z]*)', distance_str.replace(',', ''))
    if not match:
        return np.nan

    value = float(match.group(1))
    distance_label = (match.group(2) or '').lower() or distance_str.lower()

    if 'km' in distance_label:
        return value * 1000
    if 'meter' in distance_label or distance_label.endswith('m'):
        return value

    return value


def load_location_matrix():
    apartments_df = pd.read_csv(APARTMENTS_PATH)
    location_matrix = {}

    for _, row in apartments_df.iterrows():
        if row.get('PropertyName') == 'PropertyName' or row.get('LocationAdvantages') == 'LocationAdvantages':
            continue

        distances = {}
        try:
            location_advantages = ast.literal_eval(row['LocationAdvantages'])
        except (ValueError, SyntaxError):
            continue

        for location, distance in location_advantages.items():
            distances[location] = distance_to_meters(distance)

        location_matrix[row['PropertyName']] = distances

    return pd.DataFrame.from_dict(location_matrix, orient='index')


location_df = load_location_matrix()

with open(COSINE_SIM1_PATH, 'rb') as file:
    cosine_sim1 = pickle.load(file)

with open(COSINE_SIM2_PATH, 'rb') as file:
    cosine_sim2 = pickle.load(file)

with open(COSINE_SIM3_PATH, 'rb') as file:
    cosine_sim3 = pickle.load(file)


def recommend_properties_with_scores(property_name, top_n=5):
    cosine_sim_matrix = 0.5 * cosine_sim1 + 0.8 * cosine_sim2 + 1 * cosine_sim3
    # cosine_sim_matrix = cosine_sim3

    # Get the similarity scores for the property using its name as the index
    sim_scores = list(enumerate(cosine_sim_matrix[location_df.index.get_loc(property_name)]))

    # Sort properties based on the similarity scores
    sorted_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)

    # Get the indices and scores of the top_n most similar properties
    top_indices = [i[0] for i in sorted_scores[1:top_n + 1]]
    top_scores = [i[1] for i in sorted_scores[1:top_n + 1]]

    # Retrieve the names of the top properties using the indices
    top_properties = location_df.index[top_indices].tolist()

    # Create a dataframe with the results
    recommendations_df = pd.DataFrame({
        'PropertyName': top_properties,
        'SimilarityScore': top_scores
    })

    return recommendations_df


st.title('Select Location and Radius')

selected_location = st.selectbox('Location',sorted(location_df.columns.to_list()))

radius = st.number_input('Radius in Kms')

if st.button('Search'):
    result_ser = location_df[location_df[selected_location] < radius*1000][selected_location].sort_values()

    for key, value in result_ser.items():
        st.text(str(key) + " " + str(round(value/1000)) + ' kms')

st.title('Recommend Appartments')
selected_appartment = st.selectbox('Select an appartment',sorted(location_df.index.to_list()))

if st.button('Recommend'):
    recommendation_df = recommend_properties_with_scores(selected_appartment)

    st.dataframe(recommendation_df)



