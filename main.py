class MediaError(Exception):
    """Custom exception for media-related errors."""

    def __init__(self, message, obj):
        super().__init__(message)
        self.obj = obj

class Movie:
    """Parent class representing a movie."""
    
    def __init__(self, title, year, director, duration):
        if not title.strip():
            raise ValueError('Title cannot be empty')
        if year < 1895:
            raise ValueError('Year must be 1895 or later')
        if not director.strip():
            raise ValueError('Director cannot be empty')
        if duration <= 0:
            raise ValueError('Duration must be positive')
        self.title = title
        self.year = year
        self.director = director
        self.duration = duration

    def __str__(self):
        return f'{self.title} ({self.year}) - {self.duration} min, {self.director}'

class TVSeries(Movie):
    """Child class representing an entire TV series."""

    def __init__(self, title, year, director, duration, seasons, total_episodes):
        super().__init__(title, year, director, duration)

        if seasons < 1:
            raise ValueError('Seasons must be 1 or greater')
        if total_episodes < 1:
            raise ValueError('Total episodes must be 1 or greater')
        
        self.seasons = seasons
        self.total_episodes = total_episodes

    def __str__(self):
        return f'{self.title} ({self.year}) - {self.seasons} seasons, {self.total_episodes} episodes, {self.duration} min avg, {self.director}'

class MediaCatalogue:
    """A catalogue that can store different types of media items."""

    def __init__(self):
        self.items = []

    def add(self, media_item):
        if not isinstance(media_item, Movie):
            raise MediaError('Only Movie or TVSeries instances can be added', media_item)
        self.items.append(media_item)

    def get_movies(self):
        return [item for item in self.items if type(item) is Movie]

    def get_tv_series(self):
        return [item for item in self.items if isinstance(item, TVSeries)]
    
    def __str__(self):
        if not self.items:
            return 'Media Catalogue (empty)'
        
        movies = self.get_movies()
        series = self.get_tv_series()

        result = f'Media Catalogue ({len(self.items)} items):\n\n'
        if movies:
            result += '=== MOVIES ===\n'
            for i, movie in enumerate(movies, 1):
                result += f'{i}. {movie}\n'
        if series:
            result += '=== TV SERIES ===\n'
            for i, tv in enumerate(series, 1):
                result += f'{i}. {tv}\n'
        
        return result

catalogue = MediaCatalogue()

try:
    print("================= Add valid media items==================")
    number = int(input("\n1. Add Movie\n2. Add TV Series\n3. View Catalogue\n4. Exit\nChoose an option (1-4): "))
    while number!=4:
        if number == 1:
            title = input("Enter movie title: ")
            year = int(input("Enter movie year: "))
            director = input("Enter movie director: ")
            duration = int(input("Enter movie duration (minutes): "))
            movie = Movie(title, year, director, duration)
            catalogue.add(movie)
        elif number == 2:
            title = input("Enter series title: ")
            year = int(input("Enter series year: "))
            director = input("Enter series director: ")
            duration = int(input("Enter average episode duration (minutes): "))
            seasons = int(input("Enter number of seasons: "))
            total_episodes = int(input("Enter total number of episodes: "))
            series = TVSeries(title, year, director, duration, seasons, total_episodes)
            catalogue.add(series)
        elif number == 3:
            print(catalogue)
        elif number == 4:
            break
        else:
            print("Invalid option. Please try again.")
        number = int(input("\n1. Add Movie\n2. Add TV Series\n3. View Catalogue\n4. Exit\nChoose an option (1-4): "))


except ValueError as e:
    print(f'Validation Error: {e}')
except MediaError as e:
    print(f'Media Error: {e}')
    print(f'Unable to add {e.obj}: {type(e.obj)}')
