"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

type Card = {
  id: string;
  name: string;
  set: string;
  image_uris?: {
    normal: string;
  };
  card_faces?: {
    image_uris?: {
      normal: string;
    };
  }[];
};

export default function CardsPage() {
  const params = useParams();
  const setCode = params.setCode; 

  const [cards, setCards] = useState<Card[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [ownedCards, setOwnedCards] = useState<string[]>(() => {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("my_magic_collection");
    return saved ? JSON.parse(saved) : [];
  }
  return [];
});

  useEffect(() => {
    if (!setCode) return;

    fetch(`https://api.scryfall.com/cards/search?q=set:${setCode}`)
      .then((res) => {
        if (!res.ok) {
          if (res.status === 404) {
            return { data: [] }; 
          }
          throw new Error("Erreur serveur API");
        }
        return res.json();
      })
      .then((data) => {
        if (data.data) {
          setCards(data.data);
        }
      })
      .catch((err) => {
        console.error(err);
        setError("Aucune carte trouvée ou extension inconnue pour ce code.");
      });
  }, [setCode]);

  // Capteur 2 : Sauvegarder automatiquement dès que la collection change
  useEffect(() => {
    // On n'enregistre pas un tableau vide inutilement au tout premier démarrage
    if (ownedCards.length > 0 || localStorage.getItem("my_magic_collection")) {
      localStorage.setItem("my_magic_collection", JSON.stringify(ownedCards));
    }
  }, [ownedCards]); // Ce useEffect se déclenche à CHAQUE fois que 'ownedCards' est modifié

  if (error) {
    return <div>{error}</div>;
  }

  const toggleCard = (cardId: string) => {
    setOwnedCards((prevOwned) => {
      // Si la carte est déjà possédée, on la retire du tableau
      if (prevOwned.includes(cardId)) {
        const updated = prevOwned.filter((id) => id !== cardId);
        return updated;
      } 
      // Sinon, on l'ajoute au tableau
      else {
        const updated = [...prevOwned, cardId];
        return updated;
      }
    });
  };

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      {/* Ton super bouton de retour rouge bien configuré */}
      <Link   
        href={`../set`}
        style={{
          display: "block",
          padding: "12px 20px",
          backgroundColor: "#ff0000",
          color: "white",
          textDecoration: "none",
          borderRadius: "8px",
          textAlign: "center",
          fontWeight: "bold",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          transition: "background-color 0.2s",
          maxWidth: "200px",
          marginBottom: "20px"
        }}
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#660000")}
        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#ff0000")}
      > 
        Retour aux sets
      </Link>

      <h1>Card Magic</h1>

      {/* Une seule condition propre pour gérer l'affichage */}
      {cards.length === 0 ? (
        <p>Aucune carte trouvée pour ce set ou chargement...</p>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)", // Ajuste ici pour passer en 4x4 ou 5x5 !
          gap: "20px",
          padding: "20px",
          maxWidth: "80vw",
          margin: "0 auto"
        }}>
          {cards.map((card) => {
            const imageUrl = card.image_uris?.normal || card.card_faces?.[0]?.image_uris?.normal;

            return (
              <div 
                key={card.id} 
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center"
                }}
              >
                {imageUrl ? (
                  <img 
                    src={imageUrl} 
                    alt={card.name} 
                    // 1. AJOUT DU CLIC : On appelle notre fonction avec l'ID de la carte
                    onClick={() => toggleCard(card.id)}
                    style={{
                      width: "100%",
                      borderRadius: "4.7%",
                      boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                      cursor: "pointer", // Change le curseur en petite main pour montrer qu'on peut cliquer
                      
                      // 2. EFFET VISUEL : Si le tableau 'ownedCards' contient l'ID, couleur normale (100%), sinon grisé
                      filter: ownedCards.includes(card.id) ? "none" : "grayscale(100%)",
                      opacity: ownedCards.includes(card.id) ? "1" : "0.4",
                      
                      // Petite animation fluide quand la carte change d'état
                      transition: "filter 0.3s ease, opacity 0.3s ease"
                    }}
                  />
                ) : (
                  <p>{card.name} (Pas d image)</p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}