import streamlit as st
import pickle
import pandas as pd
import numpy as np
from pathlib import Path

st.set_page_config(page_title="Viz Demo")

BASE_DIR = Path(__file__).resolve().parents[1]
DATA_PATH = BASE_DIR / 'datasets' / 'data_viz1.csv'
DF_PATH = BASE_DIR / 'df.pkl'
PIPELINE_PATH = BASE_DIR / 'pipeline.pkl'


def categorize_luxury(score):
    if 0 <= score < 50:
        return 'Low'
    if 50 <= score < 150:
        return 'Medium'
    if 150 <= score <= 175:
        return 'High'
    return 'Unknown'


def categorize_floor(floor):
    if 0 <= floor <= 2:
        return 'Low Floor'
    if 3 <= floor <= 10:
        return 'Mid Floor'
    if 11 <= floor <= 51:
        return 'High Floor'
    return 'Unknown'


def load_dataframe():
    if DF_PATH.exists():
        with open(DF_PATH, 'rb') as file:
            return pickle.load(file)

    df = pd.read_csv(DATA_PATH)
    df['luxury_category'] = df['luxury_score'].apply(categorize_luxury)
    df['floor_category'] = df['floorNum'].apply(categorize_floor)
    return df


df = load_dataframe()

if not PIPELINE_PATH.exists():
    st.error('Missing model artifact: pipeline.pkl. Re-run the modelling export step to generate it.')
    st.stop()

with open(PIPELINE_PATH, 'rb') as file:
    pipeline = pickle.load(file)


st.header('Enter your inputs')

# property_type
property_type = st.selectbox('Property Type', ['flat', 'house'])

# sector
sector = st.selectbox('Sector', sorted(df['sector'].unique().tolist()))

bedrooms = float(st.selectbox('Number of Bedroom', sorted(df['bedRoom'].unique().tolist())))

bathroom = float(st.selectbox('Number of Bathrooms', sorted(df['bathroom'].unique().tolist())))

balcony = st.selectbox('Balconies', sorted(df['balcony'].unique().tolist()))

property_age = st.selectbox('Property Age', sorted(df['agePossession'].unique().tolist()))

built_up_area = float(st.number_input('Built Up Area'))

servant_room = float(st.selectbox('Servant Room', [0.0, 1.0]))
store_room = float(st.selectbox('Store Room', [0.0, 1.0]))

furnishing_type = st.selectbox('Furnishing Type', sorted(df['furnishing_type'].unique().tolist()))
luxury_category = st.selectbox('Luxury Category', sorted(df['luxury_category'].unique().tolist()))
floor_category = st.selectbox('Floor Category', sorted(df['floor_category'].unique().tolist()))

if st.button('Predict'):

    # form a dataframe
    data = [[property_type, sector, bedrooms, bathroom, balcony, property_age, built_up_area, servant_room, store_room, furnishing_type, luxury_category, floor_category]]
    columns = ['property_type', 'sector', 'bedRoom', 'bathroom', 'balcony',
               'agePossession', 'built_up_area', 'servant room', 'store room',
               'furnishing_type', 'luxury_category', 'floor_category']

    # Convert to DataFrame
    one_df = pd.DataFrame(data, columns=columns)

    # predict
    base_price = np.expm1(pipeline.predict(one_df))[0]
    low = base_price - 0.22
    high = base_price + 0.22

    # display
    st.text("The price of the flat is between {} Cr and {} Cr".format(round(low, 2), round(high, 2)))