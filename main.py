class Animal:
    def __init__(self, name):
        self.name = name

    def sound(self):
        return f'{self.name} makes a sound woof!'
    

class Dog(Animal):
    
    def sound(self):
        base = super().sound()
        return f"{base} and {self.name} is eating meet"

animal1 = Dog("Jack")
print(animal1.sound())