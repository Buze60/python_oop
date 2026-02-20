class Animal:
    def speak(self):
        return "I am an animal"
class Cat(Animal):
    def speak(self):
        return "Meow!"
class Dog(Animal):
    def speak(self):
        return "Woof! woof!!"
class Cow(Animal):
    def speak(self):
        return "Moo! Moo!! moo!!!"
    
def sound(animal):
    return animal.speak()
    
print(sound(Cat()))
print(sound(Dog()))
print(sound(Cow()))