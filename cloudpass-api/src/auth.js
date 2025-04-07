// 处理身份验证
export async function handleAuth(request) {
  // 解析请求体
  const { username, password } = await request.json();

  // 获取环境变量中的管理员凭据
  const adminUsername = request.env.ADMIN_USERNAME || 'admin';
  const adminPassword = request.env.ADMIN_PASSWORD || 'admin';

  // 验证凭据
  if (username === adminUsername && password === adminPassword) {
    // 生成 JWT 令牌
    const token = generateJWT({ username }, request.env.JWT_SECRET);

    return new Response(JSON.stringify({
      success: true,
      token,
      message: '登录成功'
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } else {
    return new Response(JSON.stringify({
      success: false,
      message: '用户名或密码错误'
    }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// 生成 JWT 令牌
function generateJWT(payload, secret) {
  // 在实际应用中，应该使用专门的 JWT 库

  // 创建 header
  const header = {
    alg: 'HS256',
    typ: 'JWT'
  };

  // 添加过期时间（24小时）
  const now = Math.floor(Date.now() / 1000);
  payload.iat = now;
  payload.exp = now + 24 * 60 * 60;

  // 编码 header 和 payload
  const headerB64 = btoa(JSON.stringify(header));
  const payloadB64 = btoa(JSON.stringify(payload));

  // 在实际应用中，应该使用 HMAC-SHA256 生成签名
  // 这里使用简化的签名方法
  const signature = btoa(secret + '.' + headerB64 + '.' + payloadB64);

  // 组合 JWT
  return `${headerB64}.${payloadB64}.${signature}`;
}