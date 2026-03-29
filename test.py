# reverse given string

class ReverseString:
    def __init__(self,string):
        self.string = string
        
    def reverse(self):
        return f"{self.string[::-1]}"
    
rs = ReverseString("Hello World")
print(rs.reverse())

input_string = input("Enter a string to reverse: ")
list_string = []
for i in len(input_string)-1:
    if i == 