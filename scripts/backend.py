import sys
import requests
import json

commands = {}

def get(url) :
	r = requests.get(url)
	return json.loads(r.text)

def getbytag(tag) :
	return get(
		f"https://api.rule34.xxx/index.php?page=dapi&s=post&q=index&tags={tag}&json=1&limit=1000"
	)

def addEntry(func) :
	name = func.__name__
	commands[name] = func
	return func

@addEntry
def childTags(tag) :
	posts = getbytag(tag)

	childtags = {}
	for i in posts :
		for k in i["tags"].split(" ") :
			if k in childtags :
				childtags[k] += 1
			else :
				childtags[k] = 1

	childtags = {i: childtags[i] for i in childtags if childtags[i]>=5}

	print(json.dumps(childtags))

if __name__=="__main__" :
	cmd = sys.argv[1]
	inputs = sys.argv[2:]

	commands[cmd](*inputs)
