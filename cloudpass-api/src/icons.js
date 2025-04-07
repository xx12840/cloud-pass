// 图标管理处理函数
export const handleIcons = {
  // 上传图标
  async upload(request) {
    try {
      // 解析 multipart/form-data
      const formData = await request.formData();
      const iconFile = formData.get('icon');

      if (!iconFile) {
        return new Response(JSON.stringify({
          success: false,
          message: '未提供图标文件'
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // 生成唯一ID
      const id = crypto.randomUUID();

      // 获取文件类型
      const contentType = iconFile.type;

      // 上传到 R2 存储桶
      await request.env.ICONS_BUCKET.put(`icons/${id}`, iconFile.stream(), {
        httpMetadata: {
          contentType
        }
      });

      // 构建图标 URL
      const iconUrl = `${request.url.split('/icons')[0]}/icons/${id}`;

      return new Response(JSON.stringify({
        success: true,
        message: '图标上传成功',
        id,
        url: iconUrl
      }), {
        status: 201,
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      return new Response(JSON.stringify({
        success: false,
        message: '上传图标失败',
        error: error.message
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  },

  // 获取图标
  async get(request) {
    try {
      const { id } = request.params;

      // 从 R2 存储桶获取图标
      const icon = await request.env.ICONS_BUCKET.get(`icons/${id}`);

      if (!icon) {
        return new Response('图标不存在', {
          status: 404
        });
      }

      // 返回图标
      return new Response(icon.body, {
        headers: {
          'Content-Type': icon.httpMetadata.contentType,
          'Cache-Control': 'public, max-age=31536000' // 缓存一年
        }
      });
    } catch (error) {
      return new Response(JSON.stringify({
        success: false,
        message: '获取图标失败',
        error: error.message
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
};