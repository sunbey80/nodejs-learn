var http = require('http')
var path = require('path')
var fs = require('fs')
var url = require('url')

var routes = {
	'/a': function(req, res){
		res.end('/a, query is:' + JSON.stringify(req.query))
	},
	'/b': function(req, res){
		res.end('match /b')
	},
	'/a/c': function(req, res){
		res.end('match /a/c')
	},
	'/search': function(req, res){
		res.end('username='+ req.body.username +', password='+ req.body.password)
	}
}

var server = http.createServer(function(req, res){
	routePath(req, res)
})
server.listen(3000)
console.log('server is listening on port 3000...')

function routePath(req, res){
	console.log(url.parse(req.url))
	var pathObj = url.parse(req.url, true)
	var handleFn = routes[pathObj.pathname]
	if(handleFn){
		req.query = pathObj.query

		//handle POST data
		var body = ''
		req.on('data', function(chunk){
			body += chunk
		}).on('end', function(){
			req.body = parseBody(body)
			handleFn(req, res)
		})
	}else{
		staticRoot(path.join(__dirname, 'static'), req, res)
	}
}

function staticRoot(staticPath, req, res){
	var pathObj = url.parse(req.url, true)

	if(pathObj.pathname === '/'){
		pathObj.pathname += 'index.html'
	}
	var filePath = path.join(staticPath, pathObj.pathname)

	// var fileContent = fs.readFileSync(filePath, 'binary')
	// res.write(fileContent, 'binary')
	// res.end()

	fs.readFile(filePath, 'binary', function(err, fileContent){
		if(err){
			console.log(404)
			res.writeHead(404, 'Not Found')
			res.end('404 Not Found!')
		}else{
			console.log(200)
			res.writeHead(200, 'OK')
			res.write(fileContent, 'binary')
			res.end()
		}
	})
}

function parseBody(body){
	var obj ={}
	body.split('&').forEach(function(str){
		obj[str.split('=')[0]] = str.split('=')[1]
	})
	return obj
}



