import express from 'express'

const app = express();
const PORT = 3000;


function analyzeFrequencyFiltered(text) {
    const rawWords = text.toLowerCase().match(/\b\w+\b/g) || [];

    const stopWords = new Set([
        'a', 'an', 'the', 'is', 'it', 'and', 'but', 'or', 'to', 'of', 'in', 'on', 'with', 
        'for', 'at', 'by', 'up', 'down', 'out', 'off', 'over', 'under', 'through', 'about', 
        'from', 'into', 'onto', 'upon', 'then', 'now', 'once', 'just', 'too', 'very', 'only', 
        'can', 'could', 'will', 'would', 'shall', 'should', 'may', 'might', 'must', 'i', 'me', 
        'my', 'mine', 'you', 'your', 'yours', 'he', 'him', 'his', 'she', 'her', 'hers', 'we', 
        'us', 'our', 'ours', 'they', 'them', 'their', 'theirs', 'who', 'whom', 'whose', 'which', 
        'what', 'where', 'when', 'why', 'how', 'am', 'are', 'was', 'were', 'be', 'been', 'being', 
        'do', 'does', 'did', 'having', 'has', 'have', 'had', 'not', 'no', 'don', 't', 's', 'll', 
        're', 've', 'm', 'd', 'this', 'that', 'these', 'those', 'as', 'if', 'because', 'before', 
        'after', 'while', 'so', 'than', 'though', 'until', 'wherever', 'whenever', 'whether', 
        'either', 'neither', 'both', 'some', 'any', 'all', 'many', 'much', 'more', 'most', 'such', 
        'own', 'same', 'other', 'also', 'get', 'go', 'come', 'take', 'make', 'say', 'see', 'look', 
        'know', 'think', 'feel', 'tell', 'give', 'put', 'like', 'than' 
    ]);

    const validWordDictionary = new Set([
        'sending', 'test', 'data', 'analyzer', 'sentence', 'nice', 'long', 
        'year', 'great', 'time', 'book', 'word', 'testing', 'new', 'dictionary', 'filter',
        'person', 'world', 'life', 'hand', 'part', 'child', 'eye', 'woman', 'place', 
        'problem', 'fact', 'company', 'number', 'group', 'system', 'business', 'process', 
        'market', 'money', 'level', 'family', 'order', 'report', 'service', 'client', 
        'project', 'result', 'action', 'story', 'media', 'quality', 'value', 'editor', 
        'video', 'clip', 'share', 'upload', 'render', 'speed', 'control', 'click', 'drag',
        'software', 'feature', 'section', 'header', 'limit', 'rule', 'design', 'look',
        'feel', 'find', 'show', 'keep', 'help', 'ready', 'able', 'clear', 'sure', 
        'simple', 'true', 'false', 'better', 'future', 'past', 'present', 'digital', 
        'legal', 'privacy', 'term', 'policy', 'user', 'account', 'security', 'consent',
        'information', 'collect', 'protect', 'provide', 'improve', 'manage', 'delete',
        'custom', 'preset', 'export', 'power', 'trim', 'batch', 'server', 'cloud', 'game',
        'home', 'office', 'school', 'street', 'city', 'state', 'country', 'area', 'room',
        'door', 'name', 'friend', 'mother', 'father', 'brother', 'sister', 'family', 'team',
        'force', 'power', 'light', 'sound', 'energy', 'water', 'food', 'earth', 'sun', 'moon',
        'music', 'art', 'science', 'history', 'study', 'education', 'program', 'internet',
        'model', 'method', 'theory', 'issue', 'topic', 'reason', 'change', 'mind', 'body',
        'access', 'allow', 'appear', 'believe', 'bring', 'build', 'close', 'cover', 'develop',
        'drive', 'expect', 'explain', 'figure', 'follow', 'grow', 'happen', 'listen', 'live',
        'maintain', 'meet', 'move', 'open', 'raise', 'remain', 'remember', 'return', 'run',
        'speak', 'spend', 'stand', 'start', 'suggest', 'support', 'turn', 'understand',
        'wait', 'walk', 'watch', 'write', 'win', 'lose', 'free', 'safe', 'easy', 'hard',
        'full', 'empty', 'main', 'major', 'minor', 'local', 'global', 'public', 'private',
        'social', 'special', 'clear', 'common', 'current', 'different', 'difficult', 'early',
        'final', 'financial', 'foreign', 'former', 'happy', 'heavy', 'high', 'human', 'kind',
        'large', 'late', 'least', 'likely', 'low', 'necessary', 'open', 'possible', 'potential',
        'present', 'real', 'recent', 'serious', 'short', 'single', 'total', 'whole', 'strong',
        'weak', 'simple', 'complex', 'online', 'offline', 'source', 'type', 'format', 'system',
        'option', 'choice', 'purpose', 'methodology', 'framework', 'challenge', 'solution'
    ]);
    
    const strictFilteredWords = rawWords.filter(word => {
        if (stopWords.has(word) || /(.)\1{2,}/.test(word) || !validWordDictionary.has(word)) {
            console.log(`[not KEPT 1] '${word}'`);
            return false
        }
        if (!isNaN(word) || /\d/.test(word)) {
            console.log(`[not KEPT 2] '${word}'`);
            return false
        }
        if (word.length <= 2) {
            console.log(`[not KEPT 3] '${word}'`);
            return false}
        console.log(`[KEPT] '${word}': passed all checks.`);
        return true
    });
    console.log(strictFilteredWords)

    
    const strictWordCounts = strictFilteredWords.reduce((acc, word) => {
        acc[word] = (acc[word] || 0) + 1;
        return acc;
    }, {});

    console.log(strictWordCounts)

    const strictSortedWords = Object.entries(strictWordCounts)
        .sort(([, countA], [, countB]) => countB - countA)
        .slice(0, 10)
        .map(([word, count]) => ({ word, count }));
    console.log(strictSortedWords)
        
    const strictSentences = text.match(/[^.!?]+[.!?]+/g) || [];
    const strictAvgSentenceLength = strictSentences.length > 0 ? (rawWords.length / strictSentences.length).toFixed(2) : 0;
    
    return {
        totalWordsFiltered: rawWords.length,
        uniqueWordsFiltered: Object.keys(strictWordCounts).length,
        topTenWordsFiltered: strictSortedWords,
        avgSentenceLengthFiltered: parseFloat(strictAvgSentenceLength),
        totalSentencesFiltered: strictSentences.length
    };
}


function analyzeFrequencyUnfiltered(text) {
    const rawWords = text.toLowerCase().match(/\b\w+\b/g) || [];

    const wordCounts = rawWords
        .filter(() => {
            return true
        })
        .reduce((acc, word) => {
            acc[word] = (acc[word] || 0) + 1;
            return acc;
        }, {});
     
    const sortedWords = Object.entries(wordCounts)
        .sort(([, countA], [, countB]) => countB - countA)
        .slice(0, 10)
        .map(([word, count]) => ({ word, count }));
    console.log(strictSortedWords)
        
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
    const avgSentenceLength = sentences.length > 0 ? (rawWords.length / sentences.length).toFixed(2) : 0;
    
    return {
        totalWords: rawWords.length,
        uniqueWords: Object.keys(wordCounts).length,
        topTenWordsTotal: sortedWords,
        avgSentenceLength: parseFloat(avgSentenceLength),
        totalSentences: sentences.length
    };
}


function processSingleText(text) {
    try {
        const frequencyMetrics = analyzeFrequencyFiltered(text);

        return {
            frequencyMetrics: frequencyMetrics,
            metadata: {
                timestamp: new Date().toISOString(),
            }
        };

    } catch (error) {
        console.error("Analysis pipeline error:", error);
        return { error: 'An unexpected internal error occurred during analysis.' };
    }
}


app.get('/analyzetest', (req, res) => {
    const input = 'Sendidr134ng.........in i ni i i ii iiii .....ffff......12.324dfs.d.he.her..adffdff. ffff and tehsting 3 testing the information in the analyzer'

    const returnThings = processSingleText(input)

    return res.json({
            mode: 'single',
            analysis: returnThings
        })
})

app.listen(PORT, () => {
    console.log(`Text Analyzer API running at http://localhost:${PORT}`);
    console.log(`Ready to receive POST requests to http://localhost:${PORT}/analyze`);
});
