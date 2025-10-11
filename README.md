Comprehensive Text Analyzer API
Analyze any English text for Sentiment, Readability, and Word Frequency with a single API call. This service is fast, efficient, and provides deep linguistic metrics to help you understand your content better.

Endpoint
The service uses a single endpoint: POST /analyze. This method is used to send the text input and processing options to the server to perform a full linguistic analysis.

Input (Request Body)
The API accepts a single JSON object in the request body with the following structure.

Input JSON Object Structure:

JSON

{
  "text": "string",
  "filterIntensity": 1
}
Input Parameters
text: (string, Required) The English text you want to analyze.

filterIntensity: (integer, Optional, Defaults to 1) Controls the level of filtering applied specifically to the word frequency analysis.

filterIntensity Levels Explained
The filterIntensity parameter determines which words are included in the frequency count:

1 (Unfiltered): No filtering is applied. Used for calculating the total word count and identifying the most common raw tokens, including stop words.

2 (Filtered): Removes stop words, numbers, and words that are less than 3 characters long. Used for core vocabulary and content topic analysis.

3 (Strict Filtered): Applies Level 2 criteria AND filters out any word not found in a large corpus of 10,000 common English words. Used for advanced content quality and commonality checks.

Output (Response Body)
The API returns a comprehensive JSON object containing three main sections of metrics: sentimentMetrics, readabilityMetrics, and frequencyMetrics.

1. Sentiment Metrics (sentimentMetrics)
This section provides metrics on the text's emotional tone.

score (integer): The overall raw calculated sentiment score (sum of positive/negative word weights).

comparative (number): The normalized sentiment score (score divided by the number of words). This is the core metric for relative analysis.

positive (integer): The count of positive words detected.

negative (integer): The count of negative words detected.

sentimentResult (string): A simple label based on the comparative score: "Positive", "Negative", or "Neutral".

2. Readability Metrics (readabilityMetrics)
These metrics use the Flesch-Kincaid formulas to objectively assess how easy the text is to read.

readabilityScore (number): The Flesch Reading Ease Score (FRES). Higher scores mean easier to read.

readabilityGradeLevel (number): The Flesch-Kincaid Grade Level (FKGL). Estimates the US school grade level required to understand the text.

totalSyllables (integer): The total syllable count in the text.

3. Frequency Metrics (frequencyMetrics)
The structure of this object depends on the filterIntensity used, and includes various word and sentence counts, and an array of the top 10 most frequent words.

Word Counts:

totalWords* (integer): The total number of raw words detected. (Field name varies based on filter, e.g., totalWords, totalWordsFiltered, etc.)

uniqueWords* (integer): The count of unique words remaining after the filter is applied. (Field name varies based on filter).

Top Words:

topTenWords* (array of objects): An array of the 10 most frequent words and their counts, structured as [{word: "string", count: integer}].

Sentence Metrics:

totalSentences (integer): The total number of sentences detected.

avgSentenceLength (number): The average number of words per sentence.

Reference:

filterLevel (integer): The filter intensity level used for this analysis.

Limits and Constraints
The API enforces a character limit based on your current RapidAPI subscription tier. Exceeding this limit will result in a 403 Forbidden error.

Tier Limits
The maximum number of characters allowed per request for each tier is:

BASIC: 10,000 characters (Approx. 2,000 words).

PRO: 100,000 characters (Approx. 20,000 words).

ULTRA: 500,000 characters (Approx. 100,000 words).

MEGA: 1,000,000 characters (Approx. 200,000 words).

Error Responses
The API returns standard HTTP status codes with a JSON error object:

Status Code	Error Detail	Condition
400 Bad Request	Missing or Invalid Input	Occurs if the text field is missing from the request body or is not a string.
403 Forbidden	Limit Exceeded	Occurs if the input text size (in characters) exceeds the maximum limit for your current subscription tier.
500 Internal Server Error	Analysis Pipeline Failure	An unexpected error occurred during processing. This is typically related to insufficient input text for calculations like readability.
