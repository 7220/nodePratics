const express = require('express')
const app = express();
const methodOverride = require('method-override');

app.use(methodOverride('_method'))
app.use(express.static(__dirname + '/public'))
app.set('view engine', 'ejs')
app.use(express.json())
app.use(express.urlencoded({extended:true}))



const { MongoClient, ObjectId } = require('mongodb')

let db
const url = 'mongodb+srv://redbelt410:jYMIXGbf7W91meji@cluster0.8exd5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
new MongoClient(url).connect().then((client)=>{
  console.log('DB연결성공')
  db = client.db('forum')
  app.listen(8080, () => {
    console.log('http://localhost:8080 에서 서버 실행 중')
})
}).catch((err)=>{
  console.log(err)
})


app.get('/', (request, response) => {
    response.sendFile(__dirname + '/index.html')
})

app.get('/about', (request, response) => {
    response.sendFile(__dirname + '/about.html')
})

app.get('/news', (request, response) => {
    // db.collection('post').insertOne({title : '무야호'})
    response.send('오늘 비옴')
})

app.get('/list', async (request, response) => {
  let result = await db.collection('post').find().toArray()
  // response.send(result[0])

  response.render('list.ejs', { posts : result })
})

app.get('/write', (request, response) => {
  response.render('write.ejs')
})

app.post('/add', async (request, response) => {
  console.log(request.body)

  try {
    if (request.body.title == '') {
      response.send('제목 어디감?')
    } else {
      await db.collection('post').insertOne({ title : request.body.title, content : request.body.content }), (err, result) =>{
      }
      response.redirect('/list')
    }
  } catch(e) {
    console.log(e)
    response.status(500).send('서버에러')
  }
  
})

app.get('/detail/:url', async (request, response) => {
  try {
    let result = await db.collection('post').findOne({ _id : new ObjectId(request.params.url) })
    if (result == null) {
      response.status(404).send(e + ' 니 머하노')
    }
    response.render('detail.ejs', { result : result })
    
  } catch(e) {
    response.status(404).send(e + '니 머하노')
  }
})

app.get('/edit/:id', async (request, response) => {
  try {
    let result = await db.collection('post').findOne({ _id : new ObjectId(request.params.id) })
    if (result == null) {
      response.status(404).send(e + ' 니 머하노')
    }
    response.render('edit.ejs', { result : result })
    
  } catch(e) {
    response.status(404).send(e + '니 머하노')
  }
})

app.put('/edit', async (request, response) => {

  await db.collection('post').updateOne( { _id : 1 }, 
    { $inc : { like : 2 } })
  // try {
  //   if ( request.body.title == '' || request.body.content == '') {
  //     response.send('제목이랑 글 적으셈')
      
  //   } else {
  //     let result = await db.collection('post').updateOne( { _id : new ObjectId(request.body.id) }, 
  //   { $set : { title : request.body.title, content : request.body.content} })
  //   console.log(result)
  //   response.redirect('/list')
  //   }
  // } catch {
  //   response.send('뭐함 ?')
  // }
})
