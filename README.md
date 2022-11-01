# CAPP30239_FA22

## Sam Pavlekovsky

This site contains the classwork, homework, and project work for Data Visualization, CAPP 30239. Each week has a folder containing subdirectories for those three categories, where applicable. (Class files are predominantly examples provided by the teacher.)

[Week 1](./week_01/README.md)

[Week 2](./week_02/README.md)

[Week 3](./week_03/README.md)

[Week 4](./week_04/README.md)

[Week 5](./week_05/README.md)

### Project Information

In my project I will visualize trends in water-related conflict and refugee flows. Specifically, I will look at the Middle East and North Africa since 2010. Last year I took a course called Hydropolitics where we talked about these topics, and I wanted to make some visualizations since I could not find any existing right now. It also opens the possibility of making a dual site in Arabic and English, if I am up for the challenge and have enough time. Credits to Dr. Michael Tiboris, professor for Hydropolitics.

I have pulled water conflict data from the [Pacific Institute](https://pacinst.org)'s Water Conflict Chronology [here](https://www.worldwater.org/water-conflict/). This is a csv which lists water-related conflicts pulled from journalism and research, including timespan, location, and descriptions.

I found refugee data from the [World Bank](https://data.worldbank.org/) and the [United Nations High Commissioner for Refugees (UNHCR)](https://www.unhcr.org/refugee-statistics/download/). These are also csvs. The World Bank data lists refugee "stocks" - the term for number of refugees - by country of asylum and country of origin separately. I have calculated yearly changes. The UNHCR data has refugees, asylum seekers, and other persons of interest broken down by both country of origin and asylum, allowing me to approximate refugee flows between countries. In addition, there is a separate table for refugees in Palestine under the jurisdiction of the United Nations Relief and Works Agency. I need to investigate differences between the World Bank and UNHCR data. Though both are counting refugees, I believe they have different methods or sources of information for the count.

A point of concern is that for the UNHCR data not every pair of countries is represented for each year in the dataset. I will need to figure out how to handle this in my visualizations.