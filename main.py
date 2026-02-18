class Cat:
   def speak(self):
       return "A cat meow"

class Bird:
   def speak(self):
       return "A bird tweet"
  
class Monkey:
   def speak(self):
       return "A monkey ooh ooh aah aah ooh ooh aah aah"

def animal_sound(animal):
   print(animal.speak())

animal_sound(Cat())
animal_sound(Bird())
animal_sound(Monkey())