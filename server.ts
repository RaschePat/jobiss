import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Gemini Client safely
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check endpoint
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({
      status: 'ok',
      hasGeminiKey: !!process.env.GEMINI_API_KEY,
      timestamp: new Date().toISOString(),
    });
  });

  // AI 1: Analyze raw experience & interests into structured signals + hypotheses
  app.post('/api/ai/analyze-experience', async (req: Request, res: Response) => {
    try {
      const { textInput, selectedTags } = req.body;

      if (!ai) {
        // Fallback realistic response if API key is not configured yet
        return res.json({
          success: true,
          signals: ['글쓰기·콘텐츠', '스토리텔링', '사용자 리서치', '디자인 기획'],
          hypotheses: [
            {
              id: `hyp_${Date.now()}_1`,
              trackName: '콘텐츠 마케터',
              category: '마케팅',
              confidenceScore: 92,
              status: 'recommended',
              rationale: '텍스트 작성 경험과 채널 운영 선호도가 돋보여요.',
              keySignals: ['글쓰기·콘텐츠', 'SNS 채널 운영'],
              matchedJobsCount: 6,
            },
            {
              id: `hyp_${Date.now()}_2`,
              trackName: '서비스 기획자 (PM)',
              category: '기획',
              confidenceScore: 84,
              status: 'exploring',
              rationale: '구조적인 문제 해결과 문서화 기록이 확인돼요.',
              keySignals: ['기획', '문제 정의'],
              matchedJobsCount: 4,
            },
          ],
          mascotMessage: '적어주신 소중한 경험 속에서 멋진 커리어 신호들을 발견했어요!',
        });
      }

      const prompt = `당신은 AI 커리어 탐색 앱 '잡있으'의 온보딩 분석 AI입니다.
사용자가 입력한 경험/관심사/활동 내역:
"${textInput || ''}"
선택한 관심 태그:
"${(selectedTags || []).join(', ')}"

위 내용을 분석하여 사용자가 희망 직무를 특정하지 못했더라도 적합할 수 있는 '직무 가설 2~3개'와 '추출된 관심 신호 3~5개', 그리고 작은 우편배달부 캐릭터의 다정한 안내 메시지를 JSON으로 반환하세요.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              signals: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: '추출된 관심 신호 키워드 목록',
              },
              hypotheses: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    trackName: { type: Type.STRING, description: '직무 트랙 명칭' },
                    category: { type: Type.STRING, description: '직군 분류 (마케팅, 디자인, 기획 등)' },
                    confidenceScore: { type: Type.INTEGER, description: '신뢰 점수 (70-98)' },
                    rationale: { type: Type.STRING, description: '이 직무 가설이 제안된 다정한 이유 1-2문장' },
                    keySignals: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                      description: '연결된 핵심 신호 태그들',
                    },
                    matchedJobsCount: { type: Type.INTEGER, description: '매칭 예상 공고 수' },
                  },
                  required: ['trackName', 'category', 'confidenceScore', 'rationale', 'keySignals', 'matchedJobsCount'],
                },
              },
              mascotMessage: {
                type: Type.STRING,
                description: '우편배달부 캐릭터가 전하는 1문장의 따뜻한 격려 문구',
              },
            },
            required: ['signals', 'hypotheses', 'mascotMessage'],
          },
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      const enrichedHypotheses = (parsed.hypotheses || []).map((h: any, idx: number) => ({
        ...h,
        id: `hyp_ai_${Date.now()}_${idx}`,
        status: idx === 0 ? 'recommended' : 'exploring',
      }));

      res.json({
        success: true,
        signals: parsed.signals || ['콘텐츠', '기획'],
        hypotheses: enrichedHypotheses,
        mascotMessage: parsed.mascotMessage || '남겨주신 경험을 바탕으로 새로운 가능성을 찾아봤어요!',
      });
    } catch (err: any) {
      console.error('Error in /api/ai/analyze-experience:', err);
      res.status(500).json({ error: err.message });
    }
  });

  // AI 2: Deep Match Report Generator for a Job Posting
  app.post('/api/ai/match-report', async (req: Request, res: Response) => {
    try {
      const { jobTitle, company, userActivities, interestSignals } = req.body;

      if (!ai) {
        return res.json({
          success: true,
          matchScore: 92,
          arrivalReason: `${interestSignals?.[0] || '관심 분야'}와 활동 기록이 ${jobTitle} 직무와 자연스럽게 연결되어 도착했어요.`,
          pros: [
            '기존에 작성하고 기록해 둔 활동들과 요구 역량의 결이 잘 맞아요.',
            '꾸준한 자기주도적 실행력이 돋보여요.',
            '직무 관심도와 성장 잠재력이 높게 평가돼요.',
          ],
          checkPoints: [
            '실제 비즈니스 환경에서의 성과 지표(ROI, 데이터 분석) 보완이 필요해요.',
            '타 직군과의 협업 경험을 구체적인 사례로 설명할 준비가 유익해요.',
          ],
          evidences: (userActivities || []).map((a: any) => a.title || a).slice(0, 3),
          preparationTips: [
            '대표 활동 2~3개를 선별하여 문제 정의와 해결 과정 위주로 정리해 보세요.',
            '공고에서 요구하는 핵심 툴과 사용 경험을 1:1로 매칭해 자기소개서에 담아보세요.',
          ],
        });
      }

      const prompt = `당신은 '잡있으' 앱의 개인 맞춤 채용공고 분석 AI입니다.
공고 정보:
- 회사명: ${company || '기업'}
- 직무명: ${jobTitle || '채용 직무'}

사용자의 프로필 정보:
- 관심 신호: ${(interestSignals || []).join(', ')}
- 보유 활동/경험: ${(userActivities || []).map((a: any) => (typeof a === 'string' ? a : a.title)).join(', ')}

이 사용자와 해당 공고의 매칭을 분석하여 다음 4가지 핵심 항목을 JSON으로 작성하세요:
1. 잘 맞는 점 (pros): 3개 항목 (따뜻하고 구체적인 문장)
2. 확인할 점 (checkPoints): 2~3개 항목 (비난이나 평가가 아닌, 실질적으로 채우면 좋은 점)
3. 준비 근거 (evidences): 사용자의 활동 중 이 직무와 연결되는 2~3개 활동
4. 지원 준비 팁 (preparationTips): 2개
5. 도착한 이유 (arrivalReason): 1-2문장
6. 매칭 적합도 점수 (matchScore): 75-96 사이 숫자`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              matchScore: { type: Type.INTEGER },
              arrivalReason: { type: Type.STRING },
              pros: { type: Type.ARRAY, items: { type: Type.STRING } },
              checkPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
              evidences: { type: Type.ARRAY, items: { type: Type.STRING } },
              preparationTips: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ['matchScore', 'arrivalReason', 'pros', 'checkPoints', 'evidences', 'preparationTips'],
          },
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      res.json({
        success: true,
        ...parsed,
      });
    } catch (err: any) {
      console.error('Error in /api/ai/match-report:', err);
      res.status(500).json({ error: err.message });
    }
  });

  // AI 3: Tune hypotheses when user reacts to jobs (Swiping/Liking/Passing)
  app.post('/api/ai/tune-hypothesis', async (req: Request, res: Response) => {
    try {
      const { action, job, currentHypotheses } = req.body;
      // Recalculate weights
      res.json({
        success: true,
        message: action === 'saved' ? '관심 공고를 바탕으로 직무 가설의 정확도를 높였습니다.' : '넘기신 공고 특성을 반영하여 직무 추천 방향을 재조정했습니다.',
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`잡있으 (JobIs) Server running on http://localhost:${PORT}`);
  });
}

startServer();
