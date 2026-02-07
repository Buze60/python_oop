class EmployeeDatabase:
    def __init__(self,name,age,department,id,salary):
        self.name = name
        self.age = age
        self.department = department
        self.id = id
        self.__salary = salary
        self.employees = []
    @property
    def get_salary(self):
        return f"the salary of the user with id: {self.id}  is {self.__salary}"
    def get_employee_data(self,ID):
        if not isinstance(ID,str):
            raise ValueError("ID must be a string")
        if not isinstance(self.age,int):
            raise ValueError("Age must be an integer")
        self.employees.append({
            "id": self.id,
            "name": self.name,
            "age": self.age,
            "department": self.department,
            "__salary": self.__salary
        })
        if ID in [emp["id"] for emp in self.employees]:
        
            return {
                "name": self.name,
                "age": self.age,
                "department": self.department,
                "ID": self.id,
                "salary": self.__salary
            }
            
        else:
            raise ValueError(f"Employee with ID {self.id} does not exist")
            
            
employee = EmployeeDatabase("Buze",27,"SOFTWARE","buz123",400000)

print(employee.get_employee_data("buz123"))
print(employee.get_salary)