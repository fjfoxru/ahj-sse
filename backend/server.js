const http = require('http');
const Koa = require('koa');
const Router = require('koa-router');
const { streamEvents } = require('http-event-stream');
const uuid = require('uuid');

const app = new Koa();

app.use(async (ctx, next) => {
  const origin = ctx.request.get('Origin');
  if (!origin) {
    return await next();
  }

  const headers = { 'Access-Control-Allow-Origin': '*', };

  if (ctx.request.method !== 'OPTIONS') {
    ctx.response.set({ ...headers });
    try {
      return await next();
    } catch (e) {
      e.headers = { ...e.headers, ...headers };
      throw e;
    }
  }

  if (ctx.request.get('Access-Control-Request-Method')) {
    ctx.response.set({
      ...headers,
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH',
    });

    if (ctx.request.get('Access-Control-Request-Headers')) {
      ctx.response.set('Access-Control-Allow-Headers', ctx.request.get('Access-Control-Request-Headers'));
    }

    ctx.response.status = 204;
  }
});

const router = new Router();

function getRandomInRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const seeObjects = [
  {
    id: uuid.v4(),
    data: JSON.stringify({field: 'Идёт перемещение мяча по полю, игроки и той, и другой команды активно пытаются атаковать'}),
    event: 'action'
  },
  {
    id: uuid.v4(),
    data: JSON.stringify({field: 'Нарушение правил, будет штрафной удар'}),
    event: 'freekick'
  },
  {
    id: uuid.v4(),
    data: JSON.stringify({field: 'Отличный удар! И Г-О-Л!'}),
    event: 'goal'
  }
];


router.get('/sse', async (ctx) => {
  const allMessages = [];
  streamEvents(ctx.req, ctx.res, {
    async fetch() {
      return allMessages;
    },
    stream(sse) {
      const interval = setInterval(() => {
        const randomEvent = getRandomInRange(0,2);
        allMessages.push(seeObjects[randomEvent]);
        sse.sendEvent(seeObjects[randomEvent]);
      }, 3000);
      return () => clearInterval(interval);
    }
  });

  ctx.respond = false;
});

app.use(router.routes()).use(router.allowedMethods());

const port = process.env.PORT || 7070;
const server = http.createServer(app.callback())
server.listen(port);
