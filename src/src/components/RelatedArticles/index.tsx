import React from "react";
import styles from "./index.module.sass";

export interface Article {
  title: string;
  image: string;
}

export interface RelatedArticlesProps {
  data: {
    articles: Article[];
  };
}

export interface RelatedArticleProps {
  title: string;
  image: string;
}

const RelatedArticles: React.FC<RelatedArticlesProps> = ({ data }) => {
  const related = data.articles.map((article: Article, index: number) => {
    return (
      <RelatedArticle key={`RelatedArticle${index}`} title={article.title} image={article.image} />
    );
  });

  return (
    <ul className={styles.Main}>
      <h2>Related</h2>
      {related}
    </ul>
  );
};

const RelatedArticle: React.FC<RelatedArticleProps> = ({ title, image }) => {
  return (
    <li className={styles.Related}>
      <img src={image} className={styles.image} alt={title} />
      <h3>{title}</h3>
    </li>
  );
};

export default RelatedArticles;
