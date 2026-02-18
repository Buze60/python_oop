class tweet:
    def __init__(self,content):
        self.content = content
        
    def post(self):
        return f"Tweet posted: {self.content}"
        
class Instagram:
    def __init__(self,content):
        self.content = content
        
    def post(self):
        
        return f"Instagram post: {self.content}"
    
class Facebaook:
    def __init__(self,content):
        self.content = content
        
    def post(self):
        return f"Facebook post: {self.content}"
    
    
    
    
def social_media_post(post):
    return post.post()

tweet_post = tweet("Elon Musk said 'money can't buy happiness'")
instagram_post = Instagram("the way to get started is to quit talking and begin doing")
facebook_post = Facebaook("The only way to do great work is to love what you do")

print(social_media_post(tweet_post))
print(social_media_post(instagram_post))
print(social_media_post(facebook_post))