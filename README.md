# Michael's Media Anthology
A nerdy website that tracks stats about the music I enjoy.

## Origin
This project started out as a spreadsheet where I would create graphs from a dataset of my favorite music albums. I wanted to introduce more datasets, but I disliked the idea of manually creating new sheets and graphs for each dataset.

So, I decided to design a simple website that would read from a database and automatically create hundreds of graphs and organize everything exactly the way I want it.

## How it works
- Google Sheets is used as a database to store information about songs and albums (artist, release year, etc.)
- Google Cloud Console API is used to pull the data from a public sheet and process various statistics using JavaScript
- Google Charts API is used to create graphs

<!-- ## Supported features
- For each dataset:
    - View album stats
        - **Art**
            - All album art
        - **Era**
            - Year distribution
            - Decade distribution
        - **Stats**
            - Number of albums
            - Number of songs
            - Top nationalities
        - **Artists**
            - Top artists
        - **List**
            - View albums and sort with 1/2/3/4 etc.
    - View song stats -->

## Planned features
- Reduced load times
- The ability to isolate favorite / recitable songs
- Better tab navigation
- Inserting custom datasets
- Other media