import express from 'express'
import Sentiment from 'sentiment'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url';

const app = express();
const PORT = 3000;
const sentiment = new Sentiment()

app.use(express.json({ limit: '1mb' }))

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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = path.join(__dirname, 'google-10000-english-no-swears.txt');
const fileContent = fs.readFileSync(filePath, 'utf8');
const wordsArray = fileContent
        .split(/\r?\n/)
        .map(word => word.trim())
        .filter(word => word.length > 1)
const commonWords = new Set(wordsArray)


function analyzeSentiment(text) {
    const analyzedSentiment = sentiment.analyze(text)

    return {
        score: analyzedSentiment.score,
        comparative: analyzedSentiment.comparative,
        positive: analyzedSentiment.positive.length,
        negative: analyzedSentiment.negative.length,
        sentimentResult: analyzedSentiment.comparative > 0 ? 'Positive' :
                         analyzedSentiment.comparative < 0 ? 'Negative' : 'Neutral'
    }
}


function analyzeFrequencyStrictFiltered(text) {
    const rawWords = text.toLowerCase().match(/\b[\w']+\b/g) || [];
    
    const strictFilteredWords = rawWords.filter(word => {
        if (stopWords.has(word) || /(.)\1{2,}/.test(word) || !commonWords.has(word)) {
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
        totalWordsStrictFiltered: rawWords.length,
        uniqueWordsStrictFiltered: Object.keys(strictWordCounts).length,
        topTenWordsStrictFiltered: strictSortedWords,
        avgSentenceLengthStrictFiltered: parseFloat(strictAvgSentenceLength),
        totalSentencesStrictFiltered: strictSentences.length
    };
}


function analyzeFrequencyFiltered(text) {
    const rawWords = text.toLowerCase().match(/\b[\w']+\b/g) || [];
    
    const filteredWords = rawWords.filter(word => {
        if (stopWords.has(word) || /(.)\1{2,}/.test(word)) {
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
    console.log(filteredWords)

    
    const filteredWordCounts = filteredWords.reduce((acc, word) => {
        acc[word] = (acc[word] || 0) + 1;
        return acc;
    }, {});

    console.log(filteredWordCounts)

    const filteredSortedWords = Object.entries(filteredWordCounts)
        .sort(([, countA], [, countB]) => countB - countA)
        .slice(0, 10)
        .map(([word, count]) => ({ word, count }));
    console.log(filteredSortedWords)
        
    const filteredSentences = text.match(/[^.!?]+[.!?]+/g) || [];
    const filteredAvgSentenceLength = filteredSentences.length > 0 ? (rawWords.length / filteredSentences.length).toFixed(2) : 0;
    
    return {
        totalWordsFiltered: rawWords.length,
        uniqueWordsFiltered: Object.keys(filteredWordCounts).length,
        topTenWordsFiltered: filteredSortedWords,
        avgSentenceLengthFiltered: parseFloat(filteredAvgSentenceLength),
        totalSentencesFiltered: filteredSentences.length
    };
}


function analyzeFrequencyUnfiltered(text) {
    const rawWords = text.toLowerCase().match(/\b[\w']+\b/g) || [];

    const unfilteredWords = rawWords.filter(() => {
        return true
    });

    const wordCounts = unfilteredWords
        .reduce((acc, word) => {
            acc[word] = (acc[word] || 0) + 1;
            return acc;
        }, {});
     
    const sortedWords = Object.entries(wordCounts)
        .sort(([, countA], [, countB]) => countB - countA)
        .slice(0, 10)
        .map(([word, count]) => ({ word, count }));
    console.log(sortedWords)
        
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


function analyzeText(text, filterIntensity = 1) {
    let frequencyMetrics

    try {    
            switch (filterIntensity) {
                case 1:
                    frequencyMetrics = analyzeFrequencyUnfiltered
                    break
                case 2:
                    frequencyMetrics = analyzeFrequencyFiltered
                    break
                case 3:
                    frequencyMetrics = analyzeFrequencyStrictFiltered
                    break
                default: 
                    throw new Error(`Invalid filter intensity: ${filterIntensity}`)
                }

            return frequencyMetrics(text)

    } catch (error) {
        console.error("Analysis pipeline error:", error);
        return { error: 'An unexpected internal error occurred during analysis.' };
    }
}



function processText(text, filterIntensity) {
    try {
        const sentimentMetrics = analyzeSentiment(text)
        const frequencyMetrics = analyzeText(text, filterIntensity);

        return {
            sentimentMetrics,
            frequencyMetrics: frequencyMetrics,
            filterLevel: filterIntensity
            };

    } catch (error) {
        console.error("Analysis pipeline error:", error);
        return { error: error.message || 'An unexpected internal error occurred during analysis.' };
    }
}


app.get('/analyze', (req, res) => {
    const input = `Paragraph padding begins now: The ongoing development process requires continuous verification. Modern systems often integrate machine learning components, which necessitate large, high-quality datasets for tr'aining and testing purposes. Without a controlled environment, anomalies can disrupt operations, leading to inaccurate results or system failures. The developers responsibility includes anticipating these challenges and preemptively coding robust e'rror handling mechanisms. Error messages must be informative, guiding the user toward a resolution rather than leaving them confused. Effective documentation is just as vital as clean code. The architecture of a service like this demands careful planning, especially when scaling to accommodate thousands of concurrent requests. Scalability is not merely a feature; its a fundamental requirement for commercial success on platforms like RapidAPI. The decision to use Node.js and Express is a strong one due to their asynchronous nature and efficiency in handling I/O operations, which are common in API design. This efficiency translates directly into lower hosting costs and faster response times, providing a competitive edge in the marketplace. We continue to increase the word count to meet the precise character target. The methodology employed here is purely iterative, adding prose until the character count reaches the threshold. This ensures an organic text distribution rather than artificial repetition. The goal remains simple: provide exactly ten thousand characters of usable English text. A detailed analysis of text analysis methodologies reveals a variety of approaches, from simple dictionary lookups (like AFINN for sentiment) to complex deep learning models (like BERT for nuanced context). Your current approach of using simple frequency filtering and a dictionary-based sentiment analyzer is smart because its fast, cheap, and easy to maintain. Performance is king when hosting a public AP'I. Latency can drastically affect user satisfaction and, consequently, your API ratings. Therefore, minimizing the number of expensive operations is always the priority. The stop words list you defined is crucial for efficiency, as it drastically reduces the number of tokens passed to the word count reducer. The use of JavaScript Sets for stop words is an optimal performance choice, offering O(1) lookups, which is faster than iterating through an array. The quality of the input data dictates the quality of the output analysis, so the filtering process to remove digits, short words, and repeated characters is essential for generating clean, meaningful metrics. We are approaching the target character count rapidly now. The final few sentences will complete the 10,000 character block. Please ensure you copy all text to accurately test your API limit. We appreciate your attention to detail in testing. This should be the end of the text. (This final line is padding). (More padding). (Final check). (Almost there). (Completed). (End of 10k). (Final word).Since a typical English word is estimated to be ≈5 characters long (including the space), 10,000 characters is roughly equivalent to 2,000 words.Here is a block of text that is approximately 10,000 characters long, designed to simulate continuous, functional English prose for testing your API's character limit enforcementThis text is generated to provide a data sample containing approximately 10,000 characters (or 10KB) for testing your API's character count enforcement and analysis functions. It simulates the length of a very long article, a detailed technical manual, or several pages of prose.The text includes a variety of sentence structures, punctuation marks, and common English vocabulary to ensure comprehensive coverage for your word frequency, sentiment, and potential readability analyses. This consistent padding is required to reach the target character count accurately, thereby allowing you to confidently test the boundaries of your Basic (Free) Tier limit of 10,000 characters.Testing the lower limit of your pricing structure is crucial. If your code successfully reads the x-rapidapi-subscription: BASIC header and correctly processes this exact block of text (returning a 200 OK response), you can be certain that your enforcement logic works. If you submit a text sample that is, for instance, 10,001 characters long, your server should immediately return a 403 Forbidden error, proving the monetization boundary is functional.For frequency analysis, the text maintains standard word repetition. For sentiment analysis, it uses a mix of neutral, positive, and negative terms: We are happy to provide this excellent sample, but the process of generating perfectly random yet coherent text can be a little frustrating and tedious. We hope this provides immense value and proves your API is robust and reliable. Never doubt the importance of rigorous testing.The average sentence length has been deliberately kept moderate to prevent excessively high scores in any future readability index you implement (like Flesch-Kincaid). Complex words are integrated randomly to challenge your stricter filtering tiers. Remember that the accuracy of the character count relies on how the string is transmitted via JSON and your Express server's encoding, but the difference should be negligible. This extended padding ensures the text hits the required length.Paragraph padding begins now: The ongoing development process requires continuous verification. Modern systems often integrate machine learning components, which necessitate large, high-quality datasets for training and testing purposes. Without a controlled environment, anomalies can disrupt operations, leading to inaccurate results or system failures. The developer's responsibility includes anticipating these challenges and preemptively coding robust error handling mechanisms. Error messages must be informative, guiding the user toward a resolution rather than leaving them confused. Effective documentation is just as vital as clean code. The architecture of a service like this demands careful planning, especially when scaling to accommodate thousands of concurrent requests. Scalability is not merely a feature; it's a fundamental requirement for commercial success on platforms like RapidAPI. The decision to use Node.js and Express is a strong one due to their asynchronous nature and efficiency in handling I/O operations, which are common in API design. This efficiency translates directly into lower hosting costs and faster response times, providing a competitive edge in the marketplace. We continue to increase the word count to meet the precise character target. The methodology employed here is purely iterative, adding prose until the character count reaches the threshold. This ensures an organic text distribution rather than artificial repetition. The goal remains simple: provide exactly ten thousand characters of usable English text.A detailed analysis of text analysis methodologies reveals a variety of approaches, from simple dictionary lookups (like AFINN for sentiment) to complex deep learning models (like BERT for nuanced context). Your current approach of using simple frequency filtering and a dictionary-based sentiment analyzer is smart because it's fast, cheap, and easy to maintain. Performance is king when hosting a public API. Latency can drastically affect user satisfaction and, consequently, your API ratings. Therefore, minimizing the number of expensive operations is always the priority. The stop words list you defined is crucial for efficiency, as it drastically reduces the number of tokens passed to the word count reducer. The use of JavaScript Sets for stop words is an optimal performance choice, offering O(1) lookups, which is faster than iterating through an array. The quality of the input data dictates the quality of the output analysis, so the filtering process to remove digits, short words, and repeated characters is essential for generating clean, meaningful metrics. We are approaching the target character count rapidly now. The final few sentences will complete the 10,000 character block. Please ensure you copy all text to accurately test your API limit. We appreciate your attention to detail in testing. This should be the end of the text. (This final line is padding). (More padding). (Final checkudes anticipating these challenges and preemptively coding robust error handling mechanisms. Error messages must be informative, guiding the user toward a resolution rather than leaving them confused. Effective documentation is just as vital as clean code. The architecture of a service like this demands careful planning, especially when scaling to accommodate thousands of concurrent requests. Scalability is not merely a feature; it's a fundamental requirement for commercial success on platforms like RapidAPI. The decision to use Node.js and Express is a strong one due to their asynchronous nature and efficiency in handling I/O operations, which are common in API design. This efficiency translates directly into lower hosting costs and faster response times, providing a competitive edge in the marketplace. We continue to increase the word count to meet the precise character target. The methodology employed here is purely iterative, adding prose until the character count reaches the threshold. This ensures an organic text distribution rather than artificial repetition. The goal remains simple: provide exactly ten thousand characters of usable English text.A detailed analysis of text analysis methodologies reveals a variety of approaches, from simple dictionary lookups (like AFINN for sentiment) to complex deep learning models (like BERT for nuanced context). Your current approach of using simple frequency filtering and a dictionary-based sentiment analyzer is smart because it's fast, cheap, and easy to maintain. Performance is king when hosting a public API. Latency can drastically affect user satisfaction and, consequently, your API ratings. Therefore, minimizing the number of expensive operations is always the priority. The stop words list you defined is crucial for efficiency, as it drastically reduces the number of tokens passed to the word count reducer. The use of JavaScript Sets for stop words is an optimal performance choice, offering O(1) lookups, which is faster than iterating through an array. The quality of the input data dictates the quality of the output analysis, so the filtering process to remove digits, short words, and repeated characters is essential for generating clean, meaningful metrics. We are approaching the target character count rapidly now. The final few sentences will complete the 10,000 character block. Please ensure you copy all text to accurately test your API limit. We appreciate your attention to detail in testing. This should be the end of the text. (This final line is padding). (More padding). (Final check). (Almost there).`
    const intensity = 2

    const charCount = input ? input.length : 0;

    if (!input || typeof input != 'string') { 
        return res.status(400).json({error: "Missing input or wrong type"})
    }

    const userTier = 'PRO'

    const TIER_LIMITS = {
        'BASIC': 10000,     
        'PRO': 100000,      
        'ULTRA': 500000,    
        'MEGA': 1000000     
    };

    const maxChars = TIER_LIMITS[userTier] || TIER_LIMITS['BASIC'] 

    if (charCount > maxChars) {
        return res.status(403).json({ 
            error: `Request size (${charCount} characters) exceeds the ${userTier} tier limit of ${maxChars}. Please upgrade your subscription.` 
        });
    }

    const returnThings = processText(input, intensity)

    return res.json(returnThings)
})

app.post('/analyze', (req, res) => {
    const text = req.body.text
    const intensity = parseInt(req.body.filterIntensity, 10) || 1
    const charCount = text ? text.length : 0;

    if (!input || typeof text != 'string') { 
        return res.status(400).json({error: "Missing text or wrong type"})
    }

    const userTier = 'PRO'

    const TIER_LIMITS = {
        'BASIC': 10000,     
        'PRO': 100000,      
        'ULTRA': 500000,    
        'MEGA': 1000000     
    };

    const maxChars = TIER_LIMITS[userTier] || TIER_LIMITS['BASIC'] 

    if (charCount > maxChars) {
        return res.status(403).json({ 
            error: `Request size (${charCount} characters) exceeds the ${userTier} tier limit of ${maxChars}. Please upgrade your subscription.` 
        });
    }

    const result = processText(text, intensity)

    if (result.error) { 
        return res.status(500).json({error: result.error})
    }

    res.json(result)
})


app.listen(PORT, () => {
    console.log(`Text Analyzer API running at http://localhost:${PORT}`);
    console.log(`Ready to receive POST requests to http://localhost:${PORT}/analyze`);
});
