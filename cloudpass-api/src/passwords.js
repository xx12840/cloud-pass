// 密码管理处理函数
export const handlePasswords = {
  // 获取所有密码
  async getAll(request) {
    try {
      // 从 KV 存储中获取所有密码
      const passwords = await getAllPasswords(request.env.PASSWORDS_KV);

      return new Response(JSON.stringify(passwords), {
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      return new Response(JSON.stringify({
        success: false,
        message: '获取密码失败',
        error: error.message
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  },

  // 获取单个密码
  async getById(request) {
    try {
      const { id } = request.params;

      // 从 KV 存储中获取密码
      const password = await request.env.PASSWORDS_KV.get(`password:${id}`, 'json');

      if (!password) {
        return new Response(JSON.stringify({
          success: false,
          message: '密码不存在'
        }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      return new Response(JSON.stringify(password), {
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      return new Response(JSON.stringify({
        success: false,
        message: '获取密码失败',
        error: error.message
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  },

  // 创建密码
  async create(request) {
    try {
      // 解析请求体
      const passwordData = await request.json();

      // 生成唯一ID
      const id = crypto.randomUUID();

      // 添加元数据
      const newPassword = {
        id,
        ...passwordData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // 存储到 KV
      await request.env.PASSWORDS_KV.put(`password:${id}`, JSON.stringify(newPassword));

      // 更新索引
      await updatePasswordIndex(request.env.PASSWORDS_KV, id);

      return new Response(JSON.stringify({
        success: true,
        message: '密码创建成功',
        password: newPassword
      }), {
        status: 201,
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      return new Response(JSON.stringify({
        success: false,
        message: '创建密码失败',
        error: error.message
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  },

  // 更新密码
  async update(request) {
    try {
      const { id } = request.params;

      // 获取现有密码
      const existingPassword = await request.env.PASSWORDS_KV.get(`password:${id}`, 'json');

      if (!existingPassword) {
        return new Response(JSON.stringify({
          success: false,
          message: '密码不存在'
        }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // 解析请求体
      const passwordData = await request.json();

      // 更新密码
      const updatedPassword = {
        ...existingPassword,
        ...passwordData,
        id, // 确保 ID 不变
        updatedAt: new Date().toISOString()
      };

      // 存储到 KV
      await request.env.PASSWORDS_KV.put(`password:${id}`, JSON.stringify(updatedPassword));

      return new Response(JSON.stringify({
        success: true,
        message: '密码更新成功',
        password: updatedPassword
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      return new Response(JSON.stringify({
        success: false,
        message: '更新密码失败',
        error: error.message
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  },

  // 删除密码
  async delete(request) {
    try {
      const { id } = request.params;

      // 检查密码是否存在
      const existingPassword = await request.env.PASSWORDS_KV.get(`password:${id}`, 'json');

      if (!existingPassword) {
        return new Response(JSON.stringify({
          success: false,
          message: '密码不存在'
        }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // 从 KV 中删除密码
      await request.env.PASSWORDS_KV.delete(`password:${id}`);

      // 更新索引
      await removePasswordFromIndex(request.env.PASSWORDS_KV, id);

      return new Response(JSON.stringify({
        success: true,
        message: '密码删除成功'
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      return new Response(JSON.stringify({
        success: false,
        message: '删除密码失败',
        error: error.message
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
};

// 获取所有密码
async function getAllPasswords(kv) {
  // 获取密码索引
  const index = await getPasswordIndex(kv);

  // 如果索引为空，返回空数组
  if (!index || !index.length) {
    return [];
  }

  // 批量获取所有密码
  const promises = index.map(id => kv.get(`password:${id}`, 'json'));
  const passwords = await Promise.all(promises);

  // 过滤掉不存在的密码
  return passwords.filter(Boolean);
}

// 获取密码索引
async function getPasswordIndex(kv) {
  const index = await kv.get('password_index', 'json');
  return index || [];
}

// 更新密码索引
async function updatePasswordIndex(kv, id) {
  const index = await getPasswordIndex(kv);

  // 如果 ID 不在索引中，添加它
  if (!index.includes(id)) {
    index.push(id);
    await kv.put('password_index', JSON.stringify(index));
  }
}

// 从索引中移除密码
async function removePasswordFromIndex(kv, id) {
  const index = await getPasswordIndex(kv);

  // 从索引中移除 ID
  const newIndex = index.filter(item => item !== id);

  // 更新索引
  await kv.put('password_index', JSON.stringify(newIndex));
}