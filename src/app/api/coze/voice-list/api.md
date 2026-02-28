前端获取扣子助手音色列表完整对接流程
一、准备工作
获取访问令牌：在扣子平台创建个人访问令牌（PAT），需授予 listVoice 权限
开发环境：支持 ES6+ 的现代浏览器，推荐使用 Node.js 16+
二、完整对接流程
1. 安装依赖
npm install @coze/api
2. 初始化客户端
import { CozeAPI } from "@coze/api";

const client = new CozeAPI({
  token: "your_pat_token", // 替换为你的 PAT
  baseURL: "https://api.coze.cn" // 国内环境使用该地址
});
3. 获取音色列表
async function getVoiceList() {
  try {
    const response = await client.voice.list();
    const voices = response.data;
    
    // 处理音色列表
    console.log("可用音色列表:", voices);
    
    // 示例：格式化输出音色信息
    voices.forEach(voice => {
      console.log(`
      音色ID: ${voice.id}
      名称: ${voice.name}
      类型: ${voice.type}
      支持情感: ${voice.emotions ? voice.emotions.join(', ') : '无'}
      语言: ${voice.language}
      `);
    });
    
    return voices;
  } catch (error) {
    console.error("获取音色列表失败:", error);
    throw error;
  }
}

// 调用函数
getVoiceList();
4. 音色列表结构说明
interface Voice {
  id: string; // 音色ID，用于语音合成接口
  name: string; // 音色名称
  type: "system" | "custom"; // 系统音色或自定义音色
  language: string; // 支持语言，如 "zh-CN"
  emotions?: string[]; // 支持的情感类型（仅多情感音色）
  description?: string; // 音色描述
  sample_url?: string; // 音色试听链接
}
5. 错误处理
try {
  const voices = await getVoiceList();
  // 成功处理逻辑
} catch (error) {
  if (error.response?.status === 401) {
    console.error("令牌无效或过期，请重新获取");
  } else if (error.response?.status === 403) {
    console.error("令牌权限不足，请确保包含 listVoice 权限");
  } else {
    console.error("网络错误或服务异常:", error.message);
  }
}
三、前端集成最佳实践
1. 音色选择组件示例
import React, { useState, useEffect } from 'react';

const VoiceSelector = () => {
  const [voices, setVoices] = useState<Voice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>('');

  useEffect(() => {
    getVoiceList().then(setVoices);
  }, []);

  return (
    <select 
      value={selectedVoice} 
      onChange={(e) => setSelectedVoice(e.target.value)}
    >
      <option value="">请选择音色</option>
      {voices.map(voice => (
        <option key={voice.id} value={voice.id}>
          {voice.name} ({voice.language})
        </option>
      ))}
    </select>
  );
};
2. 缓存策略
// 使用 localStorage 缓存音色列表，避免重复请求
async function getCachedVoiceList() {
  const cached = localStorage.getItem('coze_voices');
  if (cached) {
    return JSON.parse(cached);
  }
  
  const voices = await getVoiceList();
  localStorage.setItem('coze_voices', JSON.stringify(voices));
  return voices;
}
3. 实时更新
// 监听音色变化，及时更新列表
function subscribeToVoiceChanges() {
  setInterval(async () => {
    const current = await getVoiceList();
    const cached = JSON.parse(localStorage.getItem('coze_voices') || '[]');
    
    if (JSON.stringify(current) !== JSON.stringify(cached)) {
      localStorage.setItem('coze_voices', JSON.stringify(current));
      // 触发组件更新
    }
  }, 3600000); // 每小时更新一次
}
四、常见问题与解决方案
表格
问题	原因	解决方案
401 Unauthorized	令牌无效或过期	重新生成个人访问令牌
403 Forbidden	令牌权限不足	确保令牌包含 listVoice 权限
音色列表为空	网络问题或服务异常	检查网络连接，稍后重试
部分音色不可用	音色权限限制	确认音色是否在当前套餐支持范围内
五、注意事项
令牌安全：前端环境中避免直接暴露 PAT，建议通过后端代理请求
跨域问题：扣子 API 已配置 CORS，可直接在浏览器中调用
版本兼容性：确保使用最新版本的 @coze/api 包
试听功能：通过 sample_url 字段可实现音色试听功能
通过以上流程，你可以在前端项目中完整实现扣子助手音色列表的获取和管理，为后续的语音合成功能提供基