import numpy as np
import pandas as pd

water_raw = pd.read_csv("../data/World-Water-Conflicts-2022.csv")
water = water_raw.groupby(['Main Country', 'Start']).aggregate('count').reset_index().pivot(
    index='Main Country', columns='Start', values='End').fillna(0).astype(int).reset_index()

water.to_json('../data/water_agg')