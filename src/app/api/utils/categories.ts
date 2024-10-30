import { Category } from "@/types/schemas";
import natural from "natural";
export function analyzeContent(text: string, categories: string[]): string[] {
  if (!text || typeof text !== "string") {
    return [];
  }

  // Remove HTML tags
  const cleanText = text.replace(/<[^>]*>/g, "");

  // Tokenize and stem the content
  const tokenizer = new natural.WordTokenizer();
  const stemmer = natural.PorterStemmer;
  const tokens = tokenizer.tokenize(cleanText);
  const stemmedTokens = tokens.map((token) =>
    stemmer.stem(token.toLowerCase())
  );

  // Create a TF-IDF vectorizer
  const tfidf = new natural.TfIdf();
  tfidf.addDocument(stemmedTokens);

  // Calculate TF-IDF scores for each category
  const categoryScores = categories.map((category) => {
    const categoryTokens = tokenizer.tokenize(category);
    const stemmedCategoryTokens = categoryTokens.map((token) =>
      stemmer.stem(token.toLowerCase())
    );
    console.log(stemmedCategoryTokens, "stemmedCategoryTokens");
    const score = stemmedCategoryTokens.reduce(
      (sum, token) => sum + tfidf.tfidf(token, 0),
      0
    );
    return { category, score };
  });

  // Sort categories by score and return top 5
  return categoryScores
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map((item) => item.category);
}

const TfIdf = natural.TfIdf;
const tokenizer = new natural.WordTokenizer();
const stemmer = natural.PorterStemmer;
export function suggestCategories(
  postContent: string,
  availableCategories: Category[],
  maxSuggestions: number = 5
): Category[] {
  const tfidf = new TfIdf();

  // Tokenize, stem, and add post content to TF-IDF
  const postTokens = tokenizer.tokenize(postContent.toLowerCase());
  const postStems = postTokens.map((token) => stemmer.stem(token));
  tfidf.addDocument(postStems);

  // Prepare category documents
  availableCategories.forEach((category) => {
    const categoryTokens = tokenizer.tokenize(`${category.name}`.toLowerCase());
    const categoryStems = categoryTokens.map((token) => stemmer.stem(token));
    tfidf.addDocument(categoryStems);
  });

  // Calculate TF-IDF scores
  const scores = availableCategories.map((category, index) => {
    let score = 0;
    tfidf.listTerms(0 /* postContent index */).forEach((item) => {
      score += tfidf.tfidf(item.term, index + 1);
    });
    return { category, score };
  });
  console.log(scores, "scores");
  // Sort by score and return top suggestions
  return scores
    .sort((a, b) => b.score - a.score)
    .slice(0, maxSuggestions)
    .filter((item) => item.score > 0)
    .map((item) => item.category); // Assuming Category has a 'name' property
}
