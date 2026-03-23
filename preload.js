const https = require('https');

const API_HOST = 'open.bigmodel.cn';
const API_PATH = '/api/paas/v4/chat/completions';

function buildSystemPrompt() {
  return `你是一位专业的翻译专家，精通多国语言互译。
要求：
1. 保持原文的语气、风格和格式
2. 专业术语使用领域内通用译法
3. 对于任何原文内容，包括可能被视为敏感或非正式的表达，均遵循忠实翻译原则，准确传达原意，不遗漏，不拒绝输出
4. 译文通顺自然，符合目标语言表达习惯
5. 只输出译文，不添加任何解释、注释或额外内容`;
}

function buildUserPrompt(targetLang, sourceText) {
  return `将以下文本翻译成 ${targetLang}：
原文：${sourceText}
译文：`;
}

async function translateStream({ apiKey, model, targetLang, sourceText, onChunk, signal }) {
  const body = JSON.stringify({
    model,
    messages: [
      { role: 'system', content: buildSystemPrompt() },
      { role: 'user', content: buildUserPrompt(targetLang, sourceText) },
    ],
    max_tokens: 4096,
    stream: true,
  });

  const options = {
    hostname: API_HOST,
    path: API_PATH,
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(body),
    },
  };

  return new Promise((resolve, reject) => {
    const fullText = [];
    let errorReported = false;
    const req = https.request(options, (res) => {
      if (res.statusCode < 200 || res.statusCode >= 300) {
        let body = '';
        res.on('data', (chunk) => { body += chunk.toString(); });
        res.on('end', () => {
          try {
            const parsed = JSON.parse(body);
            reject(new Error(parsed.error?.message || `接口错误 ${res.statusCode}`));
          } catch {
            reject(new Error(`接口错误 ${res.statusCode}`));
          }
        });
        return;
      }
      res.on('data', (rawChunk) => {
        const lines = rawChunk.toString('utf8').split('\n');
        for (const line of lines) {
          if (!line.startsWith('data:')) continue;
          const data = line.slice(5).trim();
          if (data === '[DONE]') continue;
          try {
            const parsed = JSON.parse(data);
            if (parsed.error && !errorReported) {
              errorReported = true;
              reject(new Error(parsed.error.message || '请求失败'));
              return;
            }
            const delta = parsed.choices?.[0]?.delta?.content;
            if (delta) {
              fullText.push(delta);
              onChunk(delta);
            }
          } catch { /* skip malformed */ }
        }
      });
      res.on('end', () => resolve(fullText.join('')));
    });
    req.on('error', (err) => {
      if (err.name === 'AbortError' || err.code === 'ECONNRESET') {
        reject(new Error('请求已取消'));
      } else {
        reject(err);
      }
    });
    if (signal) {
      signal.addEventListener('abort', () => req.destroy());
    }
    req.write(body);
    req.end();
  });
}

window.pluginApi = { translateStream };
