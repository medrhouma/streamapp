'use client';
import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic'; // Import dynamique pour ReactPlayer
import { FaLink, FaLinkedin, FaFacebookSquare, FaTwitterSquare, FaWhatsappSquare, FaEnvelopeSquare } from 'react-icons/fa';
import { RiShareFill, RiDownloadFill, RiHeartFill, RiSendPlaneFill, RiStarFill, RiDeleteBinFill } from 'react-icons/ri';

// Définition de l'interface Video
interface Video {
  id: number;
  title: string;
  url: string;
  thumbnail: string;
  duration: string;
  views: string;
  date: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

// Définition de l'interface Comment
interface Comment {
  id: number;
  content: string;
  userId: number;
  videoId: number;
  createdAt: string;
  user: {
    username: string;
  };
}

// Chargement dynamique de ReactPlayer avec SSR désactivé
const ReactPlayer = dynamic(() => import('react-player'), { ssr: false });

export default function StreamPage() {
  const playerRef = useRef<typeof ReactPlayer | null>(null);
  const [isClient, setIsClient] = useState(false); // Pour gérer le rendu côté client
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [darkMode, setDarkMode] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [playlist, setPlaylist] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [likes, setLikes] = useState<boolean[]>([]);
  const [favorites, setFavorites] = useState<boolean[]>([]);
  const [comments, setComments] = useState<Comment[]>([]); // État pour les commentaires
  const [newComment, setNewComment] = useState(''); // État pour le nouveau commentaire

  // Charger les vidéos, les likes, les favoris et les commentaires depuis l'API
  useEffect(() => {
    const fetchVideosAndInteractions = async () => {
      try {
        // Charge les vidéos
        const videoResponse = await fetch('/api/video');
        if (!videoResponse.ok) {
          throw new Error('Erreur lors du chargement des vidéos');
        }
        const videoData = await videoResponse.json();
        const videos = videoData.data;

        // Charge les likes pour l'utilisateur connecté
        const userId = 1; // Remplace par l'ID de l'utilisateur connecté
        const likesResponse = await fetch(`/api/like?userId=${userId}`);
        if (!likesResponse.ok) {
          throw new Error('Erreur lors du chargement des likes');
        }
        const likesData = await likesResponse.json();

        // Charge les favoris pour l'utilisateur connecté
        const favoritesResponse = await fetch(`/api/favoris?userId=${userId}`);
        if (!favoritesResponse.ok) {
          throw new Error('Erreur lors du chargement des favoris');
        }
        const favoritesData = await favoritesResponse.json();

        // Initialise l'état des likes et des favoris
        const initialLikes = videos.map((video: Video) =>
          likesData.some((like: { videoId: number }) => like.videoId === video.id)
        );
        const initialFavorites = videos.map((video: Video) =>
          favoritesData.some((favorite: { videoId: number }) => favorite.videoId === video.id)
        );

        setPlaylist(videos);
        setLikes(initialLikes);
        setFavorites(initialFavorites);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        alert('Erreur lors du chargement des données. Veuillez réessayer.');
      } finally {
        setLoading(false);
      }
    };

    fetchVideosAndInteractions();
  }, []);

  // Charger les commentaires pour la vidéo actuelle
  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/comments?videoId=${playlist[currentVideoIndex].id}`);
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des commentaires');
      }
      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors du chargement des commentaires. Veuillez réessayer.');
    }
  };

  // Ajouter un nouveau commentaire
  const handleAddComment = async () => {
    if (!newComment.trim()) {
      alert('Le commentaire ne peut pas être vide.');
      return;
    }

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: newComment,
          userId: 1, // Remplacez par l'ID de l'utilisateur connecté
          videoId: playlist[currentVideoIndex].id,
        }),
      });

      if (response.ok) {
        const addedComment = await response.json();
        setComments((prevComments) => [addedComment, ...prevComments]); // Ajouter le nouveau commentaire à la liste
        setNewComment(''); // Réinitialiser le champ de saisie
        
      } else {
        console.error('Erreur lors de l\'ajout du commentaire');
        alert('Erreur lors de l\'ajout du commentaire. Veuillez réessayer.');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Une erreur est survenue lors de l\'ajout du commentaire.');
    }
  };

  // Supprimer un commentaire
  const handleDeleteAllComments = async () => {
    const confirmDelete = window.confirm('Êtes-vous sûr de vouloir supprimer  le commentaire ?');
    if (!confirmDelete) return;

    try {
      const response = await fetch('/api/comments', {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const result = await response.json();
      alert(result.message); // Affiche un message de succès
      setComments([]); // Réinitialise la liste des commentaires dans l'état local
    } catch (error: any) {
      console.error('Erreur lors de la suppression des commentaires :', error);
      alert('Une erreur est survenue lors de la suppression des commentaires.');
    }
  };

  // Charger les commentaires lorsque la vidéo change
  useEffect(() => {
    if (playlist.length > 0) {
      fetchComments();
    }
  }, [currentVideoIndex, playlist]);

  // Gestion des favoris
  const handleFavorite = async () => {
    const currentVideo = playlist[currentVideoIndex];
    const userId = 1; // Remplace par l'ID de l'utilisateur connecté

    try {
      const response = await fetch('/api/favoris', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          videoId: currentVideo.id,
        }),
      });

      if (response.ok) {
        setFavorites((prevFavorites) => {
          const newFavorites = [...prevFavorites];
          newFavorites[currentVideoIndex] = !newFavorites[currentVideoIndex];
          return newFavorites;
        });
      } else {
        console.error('Erreur lors de l\'enregistrement du favori');
        alert('Erreur lors de l\'enregistrement du favori. Veuillez réessayer.');
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi de la requête:', error);
      alert('Une erreur est survenue lors de l\'enregistrement du favori.');
    }
  };

  // Gestion de la fin de la vidéo
  const handleEnded = () => {
    setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % playlist.length);
  };

  // Avancer ou reculer la vidéo de 5 secondes
  const addFiveSeconds = () => {
    if (playerRef.current) {
      const currentTime = (playerRef.current as any).getCurrentTime();
      (playerRef.current as any).seekTo(currentTime + 5, 'seconds');
    }
  };

  const subtractFiveSeconds = () => {
    if (playerRef.current) {
      const currentTime = (playerRef.current as any).getCurrentTime();
      (playerRef.current as any).seekTo(currentTime - 5, 'seconds');
    }
  };

  // Gestion des likes
  const handleLike = async () => {
    const currentVideo = playlist[currentVideoIndex];
    const userId = 1; // Remplace par l'ID de l'utilisateur connecté

    try {
      const response = await fetch('/api/like', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          videoId: currentVideo.id,
        }),
      });

      if (response.ok) {
        setLikes((prevLikes) => {
          const newLikes = [...prevLikes];
          newLikes[currentVideoIndex] = !newLikes[currentVideoIndex];
          return newLikes;
        });
      } else {
        console.error('Erreur lors de l\'enregistrement du like');
        alert('Erreur lors de l\'enregistrement du like. Veuillez réessayer.');
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi de la requête:', error);
      alert('Une erreur est survenue lors de l\'enregistrement du like.');
    }
  };

  // Gestion du partage
  const handleShare = () => {
    setShowShareModal(true);
  };

  // Copier le lien de partage
  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      const currentVideo = playlist[currentVideoIndex];
      navigator.clipboard
        .writeText(currentVideo.url)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
          alert('Lien copié avec succès !');
        })
        .catch(() => alert("Erreur lors de la copie du lien"));
    }
  };

  // Télécharger la vidéo
  const handleDownload = () => {
    if (typeof window !== 'undefined') {
      const currentVideo = playlist[currentVideoIndex];
      const link = document.createElement('a');
      link.href = currentVideo.url;
      link.download = currentVideo.title.replace(/[^a-z0-9]/gi, '_').toLowerCase() + '.mp4';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      alert('Téléchargement de la vidéo démarré.');
    }
  };

  // Fermer le modal de partage
  const handleCloseModal = () => {
    setShowShareModal(false);
  };

  // Vérifier si on est côté client
  useEffect(() => {
    setIsClient(true);
    if (typeof window !== 'undefined') {
      const savedMode = localStorage.getItem('darkMode');
      if (savedMode === 'true') {
        setDarkMode(true);
      }
    }
  }, []);

  // Appliquer le mode sombre
  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.body.className = darkMode ? 'dark' : 'light';
      localStorage.setItem('darkMode', darkMode.toString());
    }
  }, [darkMode]);

  // Ne rien rendre côté serveur
  if (!isClient) {
    return null;
  }

  return (
    <div className={`container ${darkMode ? 'dark' : 'light'}`}>
      <main className="main">
        <div className="contentWrapper">
          {/* Playlist à gauche */}
          <ul className="playlist">
            {loading ? (
              <p>Chargement des vidéos...</p>
            ) : Array.isArray(playlist) && playlist.length > 0 ? (
              playlist.map((video, index) => (
                <li
                  key={video.id}
                  className={`playlistItem ${index === currentVideoIndex ? 'active' : ''}`}
                  onClick={() => setCurrentVideoIndex(index)}
                >
                  <img src={video.thumbnail} alt={video.title} className="thumbnail" />
                  <div className="videoInfo">
                    <span className="videoTitle">{video.title}</span>
                    <span className="videoViews">{video.views}</span>
                    <span className="videoDate">{video.date}</span>
                    <span className="videoDuration">{video.duration}</span>
                  </div>
                </li>
              ))
            ) : (
              <p>Aucune vidéo disponible.</p>
            )}
          </ul>

          {/* Vidéo à droite */}
          <div className="videoSection">
            <h1 className="title">Frequence Medicale</h1>
            {isClient && playlist.length > 0 && (
              <ReactPlayer
                ref={playerRef}
                url={playlist[currentVideoIndex].url}
                className="video"
                controls
                width="100%"
                height="400px"
                onEnded={handleEnded}
                config={{
                  file: {
                    attributes: {
                      poster: playlist[currentVideoIndex].thumbnail,
                    },
                  },
                }}
              />
            )}
            <div className="seekButton">
              <button onClick={subtractFiveSeconds} className="controlButton" aria-label="Reculer de 5 secondes">
                -5
              </button>
              <button onClick={addFiveSeconds} className="controlButton" aria-label="Avancer de 5 secondes">
                +5
              </button>
            </div>
            <div className="videoDetails">
              <div className="videoControls">
                <button
                  className={`likeButton ${likes[currentVideoIndex] ? 'active' : ''}`}
                  onClick={handleLike}
                  aria-label="J'aime"
                >
                  <RiHeartFill className="icon" /> {likes[currentVideoIndex] ? 'Liked' : 'Like'}
                </button>
                <button
                  className={`favoriteButton ${favorites[currentVideoIndex] ? 'active' : ''}`}
                  onClick={handleFavorite}
                  aria-label="Favoris"
                >
                  <RiStarFill className="icon" /> {favorites[currentVideoIndex] ? 'Favori' : 'Ajouter aux favoris'}
                </button>
                <button className="shareButton" onClick={handleShare} aria-label="Partager">
                  <RiShareFill className="icon" /> Partager
                </button>
                <button className="downloadButton" onClick={handleDownload} aria-label="Télécharger">
                  <RiDownloadFill className="icon" /> Télécharger
                </button>
                <a href="/gift" className="giftButton">
                  <RiSendPlaneFill className="icon" /> Send Gift
                </a>
              </div>
              <h2 className="videoTitle">{playlist[currentVideoIndex]?.title}</h2>
              <p className="videoViewsDate">
                {playlist[currentVideoIndex]?.views} • {playlist[currentVideoIndex]?.date}
              </p>
              <p className="videoDescription">{playlist[currentVideoIndex]?.description}</p>
              {/* Zone de commentaire */}
              <div className="commentSection">
                <h3 className="commentTitle">Commentaires</h3>
                <textarea
                  className="commentInput"
                  placeholder="Ajouter un commentaire..."
                  rows={3}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
                <button className="commentButton" onClick={handleAddComment}>
                  Publier
                </button>
                <div className="commentsList">
                  {comments.map((comment) => (
                    <div key={comment.id} className="commentItem">
                      <p className="commentUser">{comment.user?.username || 'Anonyme'}</p>
                      <p className="commentContent">{comment.content}</p>
                      <p className="commentDate">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </p>
                      <button
                        className="deleteCommentButton"
                        onClick={() => handleDeleteAllComments()}
                        aria-label="Supprimer le commentaire"
                      >
                        <RiDeleteBinFill className="icon" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Modal de partage */}
      {showShareModal && (
        <div className="modalOverlay">
          <div className="modalContent">
            <h2 className="modalTitle">Partager la vidéo</h2>
            <div className="shareOptions">
              <button onClick={handleCopyLink} className="shareOptionButton">
                <FaLink className="icon" />
                <span>{copied ? "Lien copié !" : "Copier le lien"}</span>
              </button>
            </div>
            <div className="shareIcons">
              <a
                href={`https://facebook.com/sharer/sharer.php?u=${playlist[currentVideoIndex]?.url}`}
                target="_blank"
                rel="noopener noreferrer"
                className="shareIconButton"
              >
                <FaFacebookSquare className="icon" />
              </a>
              <a
                href={`https://twitter.com/intent/tweet?url=${playlist[currentVideoIndex]?.url}`}
                target="_blank"
                rel="noopener noreferrer"
                className="shareIconButton"
              >
                <FaTwitterSquare className="icon" />
              </a>
              <a
                href={`https://api.whatsapp.com/send?text=${playlist[currentVideoIndex]?.url}`}
                target="_blank"
                rel="noopener noreferrer"
                className="shareIconButton"
              >
                <FaWhatsappSquare className="icon" />
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${playlist[currentVideoIndex]?.url}`}
                target="_blank"
                rel="noopener noreferrer"
                className="shareIconButton"
              >
                <FaLinkedin className="icon" />
              </a>
              <a
                href={`mailto:?subject=Regarde cette vidéo&body=${playlist[currentVideoIndex]?.url}`}
                target="_blank"
                rel="noopener noreferrer"
                className="shareIconButton"
              >
                <FaEnvelopeSquare className="icon" />
              </a>
            </div>
            <button onClick={handleCloseModal} className="closeModalButton">
              &times; Fermer
            </button>
          </div>
        </div>
      )}

      <footer className="footer">
        <p className="footerText">&copy; 2025 StreamApp. All rights reserved.</p>
        <ul className="footerLinks">
          <li><a href="/privacy" className="footerLink">Privacy Policy</a></li>
          <li><a href="/about" className="footerLink">About</a></li>
          <li><a href="/contact" className="footerLink">Contact</a></li>
        </ul>
      </footer>

      <style jsx>{`
        :root {
            --background-light: #f9f9f9;
            --background-dark: #1c1c1c;
            --text-light: #000;
            --text-dark: #fff;
            --button-bg: #0070f3;
            --button-hover: #005bb5;
            --modal-bg-light: #ffffff;
            --modal-bg-dark: #2d2d2d;
            --modal-text-light: #000;
            --modal-text-dark: #fff;
            --close-button-bg-light: #ccc;
            --close-button-bg-dark: #444;
            --close-button-hover-light: #999;
            --close-button-hover-dark: #666;
        }
        .light {
            background-color: var(--background-light);
            color: var(--text-light);
        }
        .dark {
            background-color: var(--background-dark);
            color: var(--text-dark);
        }
        .container {
            display: flex;
            flex-direction: column;
            height: 100vh;
            font-family: Arial, sans-serif;
        }
        .header {
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 10px;
            border-bottom: 1px solid #ccc;
        }
        .logo {
            width: 150px;
        }
        .main {
            display: flex;
            flex: 1;
            padding: 30px 60px;
            flex-direction: column;
            margin-bottom: 40px;
        }
        .contentWrapper {
            display: flex;
            justify-content: space-between;
            width: 100%;
            flex: 1;
            flex-direction: row-reverse;
        }
        .videoSection {
            flex: 3;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            padding-left: 10px;
            position: relative;
        }
        .title {
            font-size: 2.5rem;
            text-align: center;
            margin-bottom: 10px;
            color: var(--button-bg);
            width: 100%;
            font-weight: bold;
            text-transform: uppercase;
            padding: 10px 0;
        }
        .video {
            width: 100%;
            height: 350px;
            position: relative;
        }
        .seekButton {
            position: absolute;
            top: 35%;
            left: 52%;
            transform: translate(-50%, -50%);
            display: flex;
            justify-content: space-between;
            gap: 90px;
            width: 900px;
            z-index: 10;
        }
        .seekButton button {
            padding: 15px;
            background-color: var(--button-bg);
            color: var(--text-dark);
            border: none;
            border-radius: 50%;
            cursor: pointer;
            font-size: 1.5rem;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            transition: none;
        }
        .seekButton button:active {
            transform: scale(1);
        }
        .videoDetails {
            margin-top: 20px;
            width: 100%;
        }
        .videoControls {
            display: flex;
            gap: 10px;
            margin-bottom: 20px;
        }
        .likeButton, .favoriteButton, .shareButton, .downloadButton, .giftButton {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 10px 16px;
            background-color: var(--button-bg);
            color: var(--text-dark);
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 1rem;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            transition: background-color 0.3s ease;
            text-decoration: none;
            text-align: center;
        }
        .likeButton.active {
            background-color: #ff4757;
        }
        .likeButton.active:hover {
            background-color: #ff6b81;
        }
        .favoriteButton.active {
            background-color: #ffd700;
        }
        .favoriteButton.active:hover {
            background-color: #ffdf4d;
        }
        .likeButton:hover, .favoriteButton:hover, .shareButton:hover, .downloadButton:hover, .giftButton:hover {
            background-color: var(--button-hover);
        }
        .likeButton:active, .favoriteButton:active, .shareButton:active, .downloadButton:active, .giftButton:active {
            transform: scale(0.95);
        }
        .icon {
            font-size: 1.5rem;
            color: var(--text-dark);
        }
        .videoTitle {
            font-size: 2rem;
            font-weight: bold;
        }
        .videoViewsDate {
            font-size: 0.9rem;
            color: gray;
            margin-top: 5px;
        }
        .videoDescription {
            font-size: 1rem;
            margin-top: 10px;
            color: var(--text-light);
        }
        .videoTags {
            display: flex;
            flex-wrap: wrap;
            gap: 5px;
            margin-top: 10px;
        }
        .videoTag {
            font-size: 0.8rem;
            background-color: var(--button-bg);
            color: var(--text-dark);
            padding: 5px 10px;
            border-radius: 5px;
        }
        .commentSection {
            margin-top: 20px;
            width: 100%;
        }
        .commentTitle {
            font-size: 1.2rem;
            font-weight: bold;
            margin-bottom: 10px;
        }
        .commentInput {
            width: 95%;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 5px;
            font-size: 1rem;
            resize: vertical;
            margin-bottom: 10px;
        }
        .light .commentInput {
            background-color: #ffffff;
            color: #000000;
        }
        .light .commentInput::placeholder {
            color: #666666;
        }
        .dark .commentInput {
            background-color: #2d2d2d;
            color: #ffffff;
        }
        .dark .commentInput::placeholder {
            color: #b0b0b0;
        }
        .commentButton {
            padding: 8px 20px;
            background-color: var(--button-bg);
            color: var(--text-dark);
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 1rem;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            transition: background-color 0.3s ease;
        }
        .commentButton:hover {
            background-color: var(--button-hover);
        }
        .commentButton:active {
            transform: scale(0.95);
        }
        .commentsList {
            margin-top: 20px;
        }
        .commentItem {
            background-color: ${darkMode ? '#2d2d2d' : '#f9f9f9'};
            padding: 10px;
            border-radius: 5px;
            margin-bottom: 10px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .commentUser {
            font-weight: bold;
            color: ${darkMode ? '#0070f3' : '#005bb5'};
        }
        .commentContent {
            margin-top: 5px;
            color: ${darkMode ? '#fff' : '#000'};
        }
        .commentDate {
            font-size: 0.8rem;
            color: gray;
            margin-top: 5px;
        }
        .deleteCommentButton {
            background: none;
            border: none;
            cursor: pointer;
            color: ${darkMode ? '#fff' : '#000'};
            font-size: 1.2rem;
            transition: color 0.3s ease;
        }
        .deleteCommentButton:hover {
            color: #ff4757;
        }
        .playlist {
            flex: 1;
            list-style: none;
            padding: 0;
            margin: 0;
            max-height: 80vh;
            padding-right: 20px;
        }
        .playlistItem {
            display: flex;
            align-items: center;
            padding: 6px;
            margin-bottom: 0px;
            cursor: pointer;
            border-radius: 10px;
            transition: all 0.3s ease;
            border: 2px solid transparent;
        }
        .playlistItem.active {
            background-color: rgba(0, 112, 243, 0.2);
            border: 2px solid #0070f3;
            box-shadow: 0 4px 12px rgba(0, 112, 243, 0.3);
        }
        .playlistItem.active:hover {
            background-color: rgba(0, 112, 243, 0.3);
            border-color: #005bb5;
        }
        .thumbnail {
            width: 200px;
            height: 130px;
            margin-right: 15px;
            border-radius: 5px;
            object-fit: cover;
        }
        .videoInfo {
            display: flex;
            flex-direction: column;
            gap: 5px;
        }
        .videoTitle {
            font-size: 1rem;
            color: var(--text-dark);
            font-weight: bold;
        }
        .videoViews,
        .videoDate,
        .videoDuration {
            font-size: 0.8rem;
            color: rgba(255, 255, 255, 0.7);
        }
        .footer {
            padding: 20px 0;
            text-align: center;
            border-top: 1px solid #ccc;
            background-color: var(--background-dark);
            color: var(--text-light);
        }
        .footerText {
            font-size: 1.2rem;
            color: #b0b0b0;
        }
        .footerLinks {
            list-style: none;
            padding: 0;
            display: flex;
            justify-content: center;
            gap: 20px;
            margin-top: 10px;
        }
        .footerLink {
            color: #0070f3;
            text-decoration: none;
            font-size: 0.9rem;
        }
        .footerLink:hover {
            text-decoration: underline;
        }
        /* Styles pour le modal de partage */
        .modalOverlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
            background-color: rgba(230, 220, 220, 0.41);
            animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
            from {
                opacity: 0;
            }
            to {
                opacity: 1;
            }
        }

        .modalContent {
            background-color: ${darkMode ? '#000' : '#2d2d33'};
            padding: 25px;
            border-radius: 15px;
            width: 350px;
            text-align: center;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            animation: slideIn 0.3s ease;
            color: rgba(255, 255, 255, 0.9);
        }

        @keyframes slideIn {
            from {
                transform: translateY(-20px);
                opacity: 0;
            }
            to {
                transform: translateY(0);
                opacity: 1;
            }
        }

        .modalTitle {
            font-size: 1.5rem;
            margin-bottom: 20px;
            color: ${darkMode ? 'var(--modal-text-dark)' : 'var(--modal-text-light)'};
        }

        .shareOptions {
            display: flex;
            justify-content: center;
            margin-bottom: 20px;
        }

        .shareOptionButton {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 10px 20px;
            background-color: var(--button-bg);
            color: var(--text-dark);
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 1rem;
            transition: background-color 0.3s ease, transform 0.2s ease;
            text-decoration: none;
        }

        .shareOptionButton:hover {
            background-color: var(--button-hover);
            transform: translateY(-2px);
        }

        .shareOptionButton:active {
            transform: translateY(0);
        }

        .shareIcons {
            display: flex;
            justify-content: center;
            gap: 15px;
        }

        .shareIconButton {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 15px;
            background-color: var(--button-bg);
            color: var(--text-dark);
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 2.5rem;
            transition: background-color 0.3s ease, transform 0.2s ease;
            text-decoration: none;
            gap: 5px;
        }

        .shareIconButton:hover {
            background-color: var(--button-hover);
            transform: translateY(-2px);
        }

        .shareIconButton:active {
            transform: translateY(0);
        }

        .icon {
            font-size: 2rem;
            color: var(--text-dark);
        }

        .closeModalButton {
            padding: 10px 20px;
            background-color: ${darkMode ? 'var(--close-button-bg-dark)' : 'var(--close-button-bg-light)'};
            color: ${darkMode ? 'var(--modal-text-dark)' : 'var(--modal-text-light)'};
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 1rem;
            transition: background-color 0.3s ease;
        }

        .closeModalButton:hover {
            background-color: ${darkMode ? 'var(--close-button-hover-dark)' : 'var(--close-button-hover-light)'};
        }
      `}</style>
    </div>
  );
}