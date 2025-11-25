const { OpenAI } = require('openai');

// Initialize OpenAI client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

/**
 * Generate enhanced student report from teacher's brief note
 * @param {Object} data - Student and context data
 * @returns {Promise<Object>} Enhanced report with sections
 */
exports.generateStudentReport = async (data) => {
    const { studentName, teacherNote, context, options = {} } = data;

    // Build comprehensive prompt
    const prompt = buildPrompt(studentName, teacherNote, context, options);

    try {
        const completion = await openai.chat.completions.create({
            model: process.env.OPENAI_MODEL || 'gpt-4',
            messages: [
                {
                    role: 'system',
                    content: `Bạn là giáo viên chủ nhiệm chuyên nghiệp tại Việt Nam, đang viết báo cáo học tập chi tiết cho học sinh tiểu học.
          
Nhiệm vụ: Mở rộng nhận xét ngắn của giáo viên thành báo cáo đầy đủ, có cấu trúc và actionable.

Nguyên tắc:
- Viết bằng tiếng Việt chuẩn, dễ hiểu
- Tone khuyến khích, xây dựng, không dùng từ tiêu cực
- Đề xuất phải CỤ THỂ, THỰC TẾ, DỄ THỰC HIỆN
- Phù hợp lứa tuổi tiểu học (6-11 tuổi)
- Sử dụng emoji phù hợp để dễ đọc`
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            temperature: 0.7,
            max_tokens: 1000
        });

        const reportText = completion.choices[0].message.content;

        // Parse sections from the response
        const sections = parseReportSections(reportText);

        return {
            success: true,
            enhancedReport: reportText,
            sections,
            tokensUsed: completion.usage.total_tokens,
            confidence: calculateConfidence(context)
        };

    } catch (error) {
        console.error('OpenAI API Error:', error);
        throw new Error(`Failed to generate report: ${error.message}`);
    }
};

/**
 * Build prompt for OpenAI
 */
function buildPrompt(studentName, teacherNote, context, options) {
    const { recentGrades = [], attendanceRate = 0, previousComments = [] } = context;
    const { tone = 'encouraging', includeActionPlan = true, tags = [] } = options;

    // Format grades data
    const gradesText = recentGrades.length > 0
        ? recentGrades.map(g => `- ${g.subject}: ${g.score}/10`).join('\n')
        : '- Chưa có dữ liệu điểm';

    // Format tags
    const tagsText = tags.length > 0 ? `\n- Các đặc điểm nổi bật: ${tags.join(', ')}` : '';

    return `
THÔNG TIN HỌC SINH:
- Tên: ${studentName}
- Nhận xét ngắn của giáo viên: "${teacherNote || 'Dựa trên các đặc điểm đã chọn'}"${tagsText}

DỮ LIỆU HỌC TẬP GẦN ĐÂY:
${gradesText}
- Tỷ lệ chuyên cần: ${attendanceRate}%

YÊU CẦU:
1. Mở rộng nhận xét của giáo viên thành báo cáo đầy đủ
2. Sử dụng dữ liệu điểm số để minh chứng (nhưng KHÔNG nêu điểm chính xác)
3. Tone: ${tone} - luôn tích cực và khuyến khích
4. Viết bằng tiếng Việt, ngắn gọn, dễ hiểu

CẤU TRÚC BÁO CÁO (Bắt buộc theo format này):

## 📝 Nhận xét chung
[Viết 1 đoạn văn ngắn (2-3 câu) tóm tắt tình hình học tập và thái độ của học sinh. Dựa trên nhận xét gốc.]

## ✨ Điểm mạnh
[Liệt kê 2-3 điểm mạnh cụ thể dựa trên nhận xét và điểm số. Mỗi điểm 1 câu ngắn gọn.]

## ⚠️ Cần cải thiện
[Nêu 1-2 khía cạnh cần cải thiện. Dùng ngôn từ tích cực, không tiêu cực. Mỗi điểm 1 câu.]

${includeActionPlan ? `
## 💡 Đề xuất cải thiện

### 📚 Cho em:
[Liệt kê 3-4 hành động CỤ THỂ, DỄ LÀM cho học sinh. Mỗi điểm 1 câu ngắn.]

### 👨‍👩‍👧 Cho phụ huynh:
[Liệt kê 3-4 cách PHỤ HUYNH có thể hỗ trợ con. Phải thực tế, không quá nặng nề. Mỗi điểm 1 câu.]

### 📖 Tài liệu tham khảo:
[Gợi ý 2-3 loại tài liệu/hoạt động học tập phù hợp. Mỗi điểm 1 câu ngắn, KHÔNG cần link cụ thể.]
` : ''}

LƯU Ý QUAN TRỌNG:
- Chỉ tập trung vào 1-2 môn học chính được nhắc trong nhận xét
- KHÔNG đề cập điểm số chính xác (chỉ nói "tiến bộ", "tốt", "cần cải thiện")
- Đề xuất phải ACTIONABLE - có thể làm ngay được
- Độ dài: Mỗi section 3-4 câu, tổng cộng không quá 300 từ
- Sử dụng emoji phù hợp ở đầu mỗi section đã chỉ định
`;
}

/**
 * Parse report sections from AI response
 */
function parseReportSections(reportText) {
    const sections = {
        general: '',
        strengths: [],
        improvements: [],
        actionPlan: {
            forStudent: [],
            forParent: []
        },
        resources: []
    };

    try {
        // Extract General Assessment (📝 section)
        const generalMatch = reportText.match(/##\s*📝\s*Nhận xét chung\s*([\s\S]*?)(?=##|$)/i);
        if (generalMatch) {
            sections.general = generalMatch[1].trim();
        }

        // Extract strengths (✨ section)
        const strengthsMatch = reportText.match(/##\s*✨\s*Điểm mạnh\s*([\s\S]*?)(?=##|$)/i);
        if (strengthsMatch) {
            sections.strengths = strengthsMatch[1]
                .split('\n')
                .filter(line => line.trim() && (line.trim().startsWith('-') || line.trim().startsWith('•')))
                .map(line => line.replace(/^[-•]\s*/, '').trim());
        }

        // Extract improvements (⚠️ section)
        const improvementsMatch = reportText.match(/##\s*⚠️\s*Cần cải thiện\s*([\s\S]*?)(?=##|$)/i);
        if (improvementsMatch) {
            sections.improvements = improvementsMatch[1]
                .split('\n')
                .filter(line => line.trim() && line.trim().startsWith('-'))
                .map(line => line.replace(/^-\s*/, '').trim());
        }

        // Extract student action plan (📚 section)
        const studentPlanMatch = reportText.match(/###\s*📚\s*Cho em:?\s*([\s\S]*?)(?=###|##|$)/i);
        if (studentPlanMatch) {
            sections.actionPlan.forStudent = studentPlanMatch[1]
                .split('\n')
                .filter(line => line.trim() && line.trim().match(/^[\d\-\•]/))
                .map(line => line.replace(/^[\d\-\•\.\)]\s*/, '').trim());
        }

        // Extract parent action plan (👨‍👩‍👧 section)
        const parentPlanMatch = reportText.match(/###\s*👨‍👩‍👧\s*Cho phụ huynh:?\s*([\s\S]*?)(?=###|##|$)/i);
        if (parentPlanMatch) {
            sections.actionPlan.forParent = parentPlanMatch[1]
                .split('\n')
                .filter(line => line.trim() && line.trim().match(/^[\d\-\•]/))
                .map(line => line.replace(/^[\d\-\•\.\)]\s*/, '').trim());
        }

        // Extract resources (📖 section)
        const resourcesMatch = reportText.match(/###\s*📖\s*Tài liệu tham khảo:?\s*([\s\S]*?)(?=###|##|$)/i);
        if (resourcesMatch) {
            sections.resources = resourcesMatch[1]
                .split('\n')
                .filter(line => line.trim() && line.trim().match(/^[\d\-\•]/))
                .map(line => line.replace(/^[\d\-\•\.\)]\s*/, '').trim());
        }
    } catch (error) {
        console.error('Error parsing sections:', error);
    }

    return sections;
}

/**
 * Calculate confidence score based on available data
 */
function calculateConfidence(context) {
    let score = 0.5; // Base score

    if (context.recentGrades && context.recentGrades.length > 0) {
        score += 0.2;
    }

    if (context.attendanceRate > 0) {
        score += 0.15;
    }

    if (context.previousComments && context.previousComments.length > 0) {
        score += 0.15;
    }

    return Math.min(score, 1.0);
}

/**
 * Generate quick summary (for preview/notification)
 */
exports.generateQuickSummary = async (studentName, teacherNote) => {
    try {
        const completion = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'system',
                    content: 'Tóm tắt nhận xét giáo viên thành 1 câu ngắn gọn (max 50 từ).'
                },
                {
                    role: 'user',
                    content: `Học sinh: ${studentName}\nNhận xét: ${teacherNote}\n\nTóm tắt:`
                }
            ],
            temperature: 0.5,
            max_tokens: 100
        });

        return completion.choices[0].message.content.trim();
    } catch (error) {
        return teacherNote; // Fallback to original note
    }
};
