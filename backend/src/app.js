const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const logger = require('koa-logger');
const cors = require('kcors');

const database = require('./database');

/** CREATE AND CONF THE WEB SERVER **/

const app = module.exports = new Koa();

app.use(logger());

app.use(cors({ credentials: true }));
app.use(bodyParser());

/** METHODS TO RESPOND TO THE ROUTES **/


//kaikki
const listChats = async (ctx) => {
  let options = {};

  let result = await database.Chat.findAll(options);
  let chats = await Promise.all(result.map(chat => chat.toJSON()));

  let response = {
    results: chats,
  };

  ctx.body = response;
};

//huonekohtaisesti
const listChatsByRoom = async (ctx) => {
  let room = ctx.params.room;
  let options = {
  	where:{
  		room: room
  	}
  };

  let result = await database.Chat.findAll(options);
  let chats = await Promise.all(result.map(chat => chat.toJSON()));

  let response = {
    results: chats,
  };

  ctx.body = response;
};

const createChat = async (ctx) => {
  const params = ctx.request.body;
  let room = ctx.params.room;

  const chat = await database.Chat.create({
  	message: params.message,
  	room: room,
  });

  ctx.body = await chat.toJSON();
  ctx.status = 201;
};

/** CONFIGURING THE API ROUTES **/

const publicRouter = new Router({ prefix: '/api' });

publicRouter.get('/chats', listChats);
publicRouter.get('/chats/:room', listChatsByRoom);

publicRouter.post('/chats/:room', createChat);


app.use(publicRouter.routes());
app.use(publicRouter.allowedMethods());
