import { Router } from 'itty-router';
import { handleAuth } from './auth';
import { handlePasswords } from './passwords';
import { handleIcons } from './icons';

// 创建路由器
const router = Router();

// CORS 预检请求处理
router.options('*', handleCors);

// 身份验证路由
router.post('/auth/login', handleAuth);

// 密码管理路由
router.get('/passwords', validateAuth, handlePasswords.getAll);
router.post('/passwords', validateAuth, handlePasswords.create);
router.get('/passwords/:id', validateAuth, handlePasswords.getById);
router.put('/passwords/:id', validateAuth, handlePasswords.update);
router.delete('/passwords/:id', validateAuth, handlePasswords.delete);

// 图标管理路由
router.post('/icons/upload', validateAuth, handleIcons.upload);
router.get('/icons/:id', handleIcons.get);

// 404 处理
router.all('*', () => new Response('Not Found', { status: 404 }));

// 处理 CORS 预检请求
function handleCors(request) {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    }
  });
}

// 验证 JWT 令牌
async function validateAuth(request) {
  const authHeader = request.headers.get('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return new Response('Unauthorized', { status: 401 });
  }

  const token = authHeader.split(' ')[1];

  try {
    // 验证 JWT 令牌
    const payload = await verifyJWT(token, env.JWT_SECRET);

    // 将用户信息添加到请求对象
    request.user = payload;

    // 继续处理请求
    return null;
  } catch (error) {
    return new Response('Invalid token', { status: 401 });
  }
}

// 验证 JWT 令牌
async function verifyJWT(token, secret) {
  // 这里使用简单的 JWT 验证逻辑
  // 在实际应用中，应该使用专门的 JWT 库

  const [headerB64, payloadB64, signature] = token.split('.');

  // 解码 payload
  const payload = JSON.parse(atob(payloadB64));

  // 检查令牌是否过期
  if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
    throw new Error('Token expired');
  }

  // 在实际应用中，还应该验证签名

  return payload;
}

// 添加 CORS 头部
function addCorsHeaders(response) {
  const headers = new Headers(response.headers);
  headers.set('Access-Control-Allow-Origin', '*');

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
}

// 处理请求
export default {
  async fetch(request, env, ctx) {
    // 将环境变量添加到请求对象
    request.env = env;

    // 处理 CORS 预检请求
    if (request.method === 'OPTIONS') {
      return handleCors(request);
    }

    // 路由请求
    const response = await router.handle(request);

    // 添加 CORS 头部
    return addCorsHeaders(response);
  }
};