const Koa = require('koa');
const app = new Koa()

// trust proxy
app.proxy = true

// sessions
const convert = require('koa-convert')
const session = require('koa-generic-session')
app.keys = ['your-session-secret']
app.use(convert(session()))

// body parser
const bodyParser = require('koa-bodyparser')
app.use(bodyParser())

// authentication
require('./auth')
const passport = require('koa-passport')
app.use(passport.initialize())
app.use(passport.session())

// routes
const fs    = require('fs')
const route = require('koa-route')

app.use(route.get('/', function(ctx) {
  ctx.type = 'html'
  ctx.body = fs.createReadStream('views/login.html')
}))

app.use(route.post('/custom', function(ctx, next) {
  return passport.authenticate('local', function(user, info, status) {
    if (user === false) {
      ctx.status = 401
      ctx.body = { success: false }
    } else {
      ctx.body = { success: true }
      return ctx.login(user)
    }
  })(ctx, next)
}))

// POST /login
app.use(route.post('/login',
  passport.authenticate('local', {
    successRedirect: '/app',
    failureRedirect: '/'
  })
))

app.use(route.get('/logout', function(ctx) {
  ctx.logout()
  ctx.redirect('/')
}))

// Require authentication for now
app.use(function(ctx, next) {
  if (ctx.isAuthenticated()) {
    return next()
  } else {
    ctx.redirect('/')
  }
})

app.use(route.get('/app', function(ctx) {
  ctx.type = 'html'
  ctx.body = fs.createReadStream('views/app.html')
}))

// start server
const port = process.env.PORT || 3000
app.listen(port, () => console.log('Server listening on', port))
