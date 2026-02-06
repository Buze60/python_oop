class Wallet:
   def __init__(self):
       self.__balance = 0

   def __validate(self, amount):
       if amount < 0:
           raise ValueError('Amount must be positive')

   def deposit(self, amount):
       self.__validate(amount)
       self.__balance += amount

   def withdraw(self, amount):
       self.__validate(amount)
       if amount > self.__balance:
           raise ValueError('Insufficient funds')
       self.__balance -= amount
   @property
   def get_balance(self):
       return self.__balance

acct_one = Wallet()
acct_one.deposit(3)
print(acct_one.get_balance) # 3

acct_one.deposit(50)
print(acct_one.get_balance) # 53

