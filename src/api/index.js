import Router from 'koa-router';
import exchange from '../exchange';
import { NOT_FOUND, TIMED_OUT, CW_RESPONSE_INVALID_TOKEN } from '../exchange/CWExchange';

const debug = require('debug')('laa:cwc:api');

const router = new Router();

export default router;

router.post('/auth/:userId', ctx => {

  const { params } = ctx;
  const { userId } = params;

  debug('auth', userId);

  ctx.body = exchange.sendAuth(parseInt(userId, 0));

});

router.post('/token/:userId/:authCode', ctx => {

  const { params } = ctx;
  const { userId, authCode } = params;

  debug('token', userId, authCode);

  ctx.body = exchange.sendGrantToken(parseInt(userId, 0), authCode);

});

router.get('/profile/:userId', async ctx => {

  const { userId } = ctx.params;

  debug('GET /profile', userId);

  try {
    ctx.body = await exchange.requestProfile(parseInt(userId, 0));
  } catch (err) {

    const { response } = ctx;

    if (err === NOT_FOUND) {
      response.status = 404;
    } else if (err === TIMED_OUT) {
      response.status = 504;
    } else if (err === CW_RESPONSE_INVALID_TOKEN) {
      response.status = 404;
      ctx.body = CW_RESPONSE_INVALID_TOKEN;
    } else {
      throw new Error(err);
    }

  }

});

router.get('/stock/:userId', async ctx => {

  const { userId } = ctx.params;

  debug('GET /stock', userId);

  try {
    ctx.body = await exchange.requestStock(parseInt(userId, 0));
  } catch (err) {

    const { response } = ctx;

    if (err === NOT_FOUND) {
      response.status = 404;
    } else if (err === TIMED_OUT) {
      response.status = 504;
    } else if (err === CW_RESPONSE_INVALID_TOKEN) {
      response.status = 404;
      ctx.body = CW_RESPONSE_INVALID_TOKEN;
    } else {
      throw new Error(err);
    }

  }

});

router.post('/buy/:itemCode', async ctx => {

  const { params: { itemCode }, query: { userId, quantity, price } } = ctx;

  debug('POST /buy', userId, `${itemCode}_${quantity}_${price}`);

  try {
    ctx.body = await exchange.wantToBy(parseInt(userId, 0), { itemCode, quantity, price });
  } catch (err) {

    const { response } = ctx;

    if (err === NOT_FOUND) {
      response.status = 404;
    } else if (err === TIMED_OUT) {
      response.status = 504;
    } else if (err === CW_RESPONSE_INVALID_TOKEN) {
      response.status = 404;
      ctx.body = CW_RESPONSE_INVALID_TOKEN;
    } else {
      throw new Error(err);
    }

  }

});

router.get('/info', async ctx => {

  debug('GET /info');

  try {
    ctx.body = await exchange.getInfo();
  } catch (err) {

    const { response } = ctx;

    if (err === NOT_FOUND) {
      response.status = 404;
    } else if (err === TIMED_OUT) {
      response.status = 504;
    } else if (err === CW_RESPONSE_INVALID_TOKEN) {
      response.status = 404;
      ctx.body = CW_RESPONSE_INVALID_TOKEN;
    } else {
      throw new Error(err);
    }

  }

});
