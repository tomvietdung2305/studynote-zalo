require('dotenv').config();
const { OpenAI } = require('openai');

async function testOpenAI() {
    console.log('Testing OpenAI API...');
    console.log('API Key:', process.env.OPENAI_API_KEY ? '✅ SET' : '❌ NOT SET');
    console.log('Model:', process.env.OPENAI_MODEL || 'gpt-4');

    if (!process.env.OPENAI_API_KEY) {
        console.error('❌ OPENAI_API_KEY not found in environment');
        process.exit(1);
    }

    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
    });

    try {
        console.log('\n🚀 Calling OpenAI API...');
        const completion = await openai.chat.completions.create({
            model: process.env.OPENAI_MODEL || 'gpt-4',
            messages: [
                {
                    role: 'system',
                    content: 'Bạn là giáo viên chuyên nghiệp.'
                },
                {
                    role: 'user',
                    content: 'Hãy viết 1 câu ngắn về học sinh: Em học tốt, toán giỏi'
                }
            ],
            max_tokens: 50
        });

        console.log('\n✅ SUCCESS!');
        console.log('Response:', completion.choices[0].message.content);
        console.log('Tokens used:', completion.usage.total_tokens);

    } catch (error) {
        console.error('\n❌ ERROR:', error.message);
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        }
        process.exit(1);
    }
}

testOpenAI();
