print("================================Multiple Inheritance================================")
class Parent:
    
    pre_conditions = {
        "religious": "Orthodox christian",
        "Nationality":"Ethiopian",
        "Family Members":"Simachew Dubale's Family meember"
    }
    def __init__(self,name):
        self.name = name
        

    def displayPreconditions(self):
        for key,value in self.pre_conditions.items():
            familyMeneber = input(f"Is the child {key}: {value}? (yes/no) ").lower()
            if familyMeneber.lower() == "no":
                print(f"The child is not {value} {key}")
            
            if familyMeneber.lower() == "yes":
                print(f"the child is {value}")
                
        
        
class Wealth(Parent):
    pass
    
class childTwo(Parent,Warning):
    pass



child = childTwo("Ali")
print(child.displayPreconditions())
   
   

    


