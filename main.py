print("==========================Inheritance==========================")
class Animal:
    def __init__(self, name):
        self.name = name

    def sound(self):
        return f'{self.name} makes a sound'

class Dog(Animal):
    bark = 'woof! woof!! woof!!!'
class Cat(Animal):
    meow = 'meow! meow!! meow!!!'

jack = Dog('Jack')
Tom = Cat('Tom')
print(jack.sound())  # Jack makes a sound
print(jack.bark)  # woof! woof!! woof!!!

print(Tom.sound())  # Tom makes a sound
print(Tom.meow)