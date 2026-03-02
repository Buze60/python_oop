class Movie:
    def __init__(self, title, year, director, duration):
        self.title = title
        self.year = year
        self.director = director
        self.duration = duration

    def __str__(self):
        return f'{self.title} ({self.year}) - {self.duration} min, {self.director}'


movie1 = Movie('የወንዶች ጉዳይ 1', 2023, 'ዳኔኢል ሞላ', 120)
movie2 = Movie('የወንዶች ጉዳይ 2', 2024, 'አንድ ሰብ አስተዋፅኦ', 130)
print(movie1)
print(movie2)