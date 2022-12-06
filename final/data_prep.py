import numpy as np
import pandas as pd

water = pd.read_csv("../data/World-Water-Conflicts-2022.csv")

new_water = []
for idx, row in water.iterrows():
    if row.Start == row.End:
        new_water.append({'Country': row['Main Country'], 'Year': row.Start, 'Original Index': idx})
    else:
        for y in range(row.Start, row.End + 1):
            new_water.append({'Country': row['Main Country'], 'Year': y, 'Original Index': idx})
new_water = pd.DataFrame(new_water)

new_w_agg = new_water.groupby(['Country', 'Year']).aggregate('count').reset_index()
new_w_agg = new_w_agg.pivot(index='Country', columns='Year', values='Original Index').fillna(0).astype(int).reset_index()
new_w_agg['Total'] = new_w_agg.sum(axis='columns')
new_w_agg = pd.melt(new_w_agg, id_vars=['Country'], value_name='Count').sort_values(['Country', 'Year'])
new_w_agg.to_csv('../data/water_agg.csv')

countries = list(new_w_agg['Country'].unique())

un_mena_raw = pd.read_csv('../data/un_mena.csv')
un_mena_raw.replace(['Palestinian', 'Syrian Arab Rep.'], ['Palestine', 'Syria'])
un_mena_water = un_mena_raw[un_mena_raw['Country of origin'].isin(countries)]
un_mena_water_agg = un_mena_water[['Country of origin', 'Year', 'Total']].groupby(['Country of origin', 'Year']).aggregate(sum).reset_index()
un_mena_water_agg.to_csv('../data/un_mena_water_agg.csv')

un_small = un_mena_raw[['Year', 'Country of origin', 'Country of asylum', 'Total']].rename(columns={'Country of origin': 'Origin', 'Country of asylum': 'Asylum'})
un_clean = un_small.loc[un_small['Origin'].isin(countries) & un_small['Asylum'].isin(countries)]

un_asy = un_small.loc[~un_small['Origin'].isin(countries) & un_small['Asylum'].isin(countries)]
un_asy = un_asy.groupby(['Year', 'Asylum']).sum().reset_index()
un_asy['Origin'] = ['Other']*len(un_asy)
un_asy = un_asy[['Year', 'Origin', 'Asylum', 'Total']]

un_org = un_small.loc[un_small['Origin'].isin(countries) & ~un_small['Asylum'].isin(countries)]
un_org = un_org.groupby(['Year', 'Origin']).sum().reset_index()
un_org['Asylum'] = ['Other'] * len(un_org)
un_org = un_org[['Year', 'Origin', 'Asylum', 'Total']]

un_chord = pd.concat([un_clean, un_org, un_asy], ignore_index=True)

order = countries + ['Other']

un_list = []
for y in un_chord.Year.unique():
    year = un_chord[un_chord.Year == y].drop('Year', axis=1).pivot(index='Origin', columns='Asylum').fillna(0).astype(int)
    year.columns = year.columns.get_level_values(level=1)
    for c in countries:
        if c in year.columns and c in year.index:
            continue
        elif c in year.columns:
            year.loc[c] = [0] * len(year.columns)
        elif c in year.index:
            year[c] = [0] * len(year.index)
        else:
            year.loc[c] = [0] * len(year.columns)
            year[c] = [0] * len(year.index)
    year = year[order]
    year = year.reindex(order)
    un_list.append({'Year': y, 'Data': year.values.tolist()})


un_chord_tot = un_chord.drop('Year', axis=1).groupby(['Origin', 'Asylum']).sum().reset_index().pivot(index='Origin', columns='Asylum').fillna(0).astype(int)

un_chord_tot.columns = un_chord_tot.columns.get_level_values(level=1)
un_chord_tot.loc['Israel'] = [0] * len(un_chord_tot.columns)
un_chord_tot['Palestine'] = [0] * len(un_chord_tot.index)
un_chord_tot = un_chord_tot[order]
un_chord_tot = un_chord_tot.reindex(order)
un_list.append({'Year': 1000, 'Data': un_chord_tot.values.tolist()})

pd.DataFrame(un_list).to_json('./CAPP30239_FA22/data/un_mena_chord.json', orient="records")