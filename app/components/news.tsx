'use client';
import React, { useEffect, useState } from 'react';

export default function NewsPage() {
    interface Article {
        title: string;
        description: string;
        publishedAt: string;
        urlToImage?: string;
        url: string;
    }

    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [darkMode, setDarkMode] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [articlesPerPage] = useState(12); // Nombre d'articles par page

    // Fonction pour récupérer les articles
    const fetchArticles = async () => {
        try {
            const response = await fetch('https://newsapi.org/v2/everything?q=medical&apiKey=ccde240987bb4a8ebf29220da6b6caae');
            const data = await response.json();
            if (data.status === 'ok') {
                setArticles(data.articles.slice(3) || []); // Exclure les trois premiers articles
            } else {
                setError('Failed to fetch news. Reason: ' + data.message);
            }
            setLoading(false);
        } catch (error) {
            setError('An error occurred while fetching the news.');
            setLoading(false);
        }
    };

    // Charger les articles au montage du composant
    useEffect(() => {
        fetchArticles();
    }, []);

    // Gestion de la recherche
    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
        setCurrentPage(1); // Réinitialiser à la première page lors d'une nouvelle recherche
    };

    // Basculer entre le mode sombre et le mode clair
    const toggleTheme = () => {
        setDarkMode(!darkMode);
    };

    // Filtrer les articles en fonction de la recherche
    const filteredArticles = articles.filter((article) => {
        const query = searchQuery.toLowerCase();
        return (
            (article.title && article.title.toLowerCase().includes(query)) ||
            (article.description && article.description.toLowerCase().includes(query))
        );
    });

    // Calculer les index des articles à afficher
    const indexOfLastArticle = currentPage * articlesPerPage;
    const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
    const currentArticles = filteredArticles.slice(indexOfFirstArticle, indexOfLastArticle);

    // Changer de page
    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
        <div className={`container ${darkMode ? 'dark' : 'light'}`}>
            <h1 className="title">Medical News</h1>

            {/* Barre de recherche */}
            <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={handleSearch}
                className="searchInput"
            />

            {/* Affichage des états de chargement et d'erreur */}
            {loading && <p className="loading">Loading...</p>}
            {error && <p className="error">{error}</p>}

            {/* Liste des articles */}
            <div className="newsList">
                {currentArticles.length > 0 ? (
                    currentArticles.map((article, index) => (
                        <div key={index} className="newsItem">
                            <h2 className="newsTitle">{article.title}</h2>
                            <p className="newsDescription">{article.description}</p>
                            <p className="newsDate">
                                Published on: {new Date(article.publishedAt).toLocaleDateString()}
                            </p>
                            {article.urlToImage && (
                                <img
                                    src={article.urlToImage}
                                    alt={article.title}
                                    className="newsImage"
                                />
                            )}
                            <a href={article.url} target="_blank" rel="noopener noreferrer" className="newsLink">
                                Read more
                            </a>
                        </div>
                    ))
                ) : (
                    !loading && <p>No articles found matching your search.</p>
                )}
            </div>

            {/* Pagination */}
            <div className="pagination">
                <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="paginationButton"
                >
                    Previous
                </button>
                <span className="pageNumber">{currentPage}</span>
                <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={indexOfLastArticle >= filteredArticles.length}
                    className="paginationButton"
                >
                    Next
                </button>
            </div>

            {/* Styles */}
            <style jsx>{`
                :root {
                    --background-light: #f9f9f9;
                    --background-dark: #1c1c1c;
                    --text-light: #000;
                    --text-dark: #fff;
                    --button-bg: #0070f3;
                    --card-background-light: #ffffff;
                    --card-background-dark: #2c2c2c;
                }
                .container {
                    padding: 20px;
                    background-color: var(--background-light);
                    color: var(--text-light);
                    font-family: Arial, sans-serif;
                }
                .dark {
                    background-color: var(--background-dark);
                    color: var(--text-dark);
                }
                .light {
                    background-color: var(--background-light);
                    color: var(--text-light);
                }
                .title {
                    text-align: center;
                    color: var(--button-bg);
                    font-size: 2.5rem;
                    margin-bottom: 20px;
                }
                .searchInput {
                    display: block;
                    width: 100%;
                    max-width: 600px;
                    padding: 10px;
                    margin: 0 auto 20px;
                    border-radius: 8px;
                    border: 1px solid #ccc;
                    background-color: var(--background-light);
                    color: var(--text-light);
                    font-size: 1rem;
                }
                .loading {
                    text-align: center;
                    font-size: 1.2rem;
                    color: var(--text-light);
                }
                .error {
                    text-align: center;
                    font-size: 1.2rem;
                    color: #f44336;
                }
                .newsList {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 20px;
                    padding: 20px;
                }
                .newsItem {
                    background-color: var(--card-background-light);
                    border-radius: 8px;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                    overflow: hidden;
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                }
                .dark .newsItem {
                    background-color: var(--card-background-dark);
                }
                .newsItem:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
                }
                .newsTitle {
                    font-size: 1.5rem;
                    color: var(--button-bg);
                    margin: 15px;
                }
                .newsDescription {
                    font-size: 1rem;
                    color: var(--text-light);
                    margin: 0 15px 15px;
                }
                .newsDate {
                    font-size: 0.9rem;
                    color: var(--text-light);
                    margin: 0 15px 15px;
                }
                .newsImage {
                    width: 100%;
                    height: 200px;
                    object-fit: cover;
                }
                .newsLink {
                    display: block;
                    text-align: center;
                    padding: 10px;
                    background-color: var(--button-bg);
                    color: var(--text-dark);
                    text-decoration: none;
                    font-weight: bold;
                    transition: background-color 0.3s ease;
                }
                .newsLink:hover {
                    background-color: #005bb5;
                }
                .pagination {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    margin-top: 20px;
                }
                .paginationButton {
                    padding: 10px 20px;
                    margin: 0 10px;
                    background-color: var(--button-bg);
                    color: var(--text-dark);
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 1rem;
                    font-weight: 600;
                    transition: all 0.3s ease;
                }
                .paginationButton:disabled {
                    background-color: #ccc;
                    cursor: not-allowed;
                }
                .paginationButton:hover:not(:disabled) {
                    background-color: #005bb5;
                    transform: scale(1.05);
                }
                .paginationButton:active:not(:disabled) {
                    transform: scale(1);
                }
                .pageNumber {
                    font-size: 1.2rem;
                    color: var(--text-light);
                }

                @media (max-width: 768px) {
                    .newsList {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>
        </div>
    );
}