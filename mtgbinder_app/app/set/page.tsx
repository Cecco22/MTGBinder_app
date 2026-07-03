"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Set = {
  id: string;
  name: string;
  code: string;
  icon_svg_uri: string; // 1. On récupère le lien de l'icône SVG officielle du set
};

export default function SetsPage() {
  const [sets, setSets] = useState<Set[]>([]);

  useEffect(() => {
    fetch("https://api.scryfall.com/sets")
      .then((res) => res.json())
      .then((data) => setSets(data.data));
  }, []);

  return (
    <div style={{ padding: "40px", fontFamily: "sans-serif", backgroundColor: "#121212", minHeight: "100vh", color: "#fff" }}>
      <h1 style={{ textAlign: "center", marginBottom: "40px", fontSize: "2.5rem" }}>Sets Magic</h1>
    
      {/* 2. Grille à 3 colonnes, responsive (s'adapte si l'écran est petit) */}
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", 
        gap: "20px", 
        maxWidth: "1200px",
        margin: "0 auto"
      }}>
        {sets.map((set) => (
          <Link 
            key={set.id} 
            href={`/set/${set.code}`}
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "120px",
              padding: "20px",
              backgroundColor: "#1e1e1e", // Fond sombre de base
              color: "white",
              textDecoration: "none",
              borderRadius: "12px",
              textAlign: "center",
              fontWeight: "bold",
              boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
              transition: "transform 0.2s, border-color 0.2s",
              border: "2px solid #333",
              position: "relative", // OBLIGATOIRE pour pouvoir positionner l'icône derrière le texte
              overflow: "hidden"    // Coupe l'icône si elle dépasse du bouton
            }}
            // Petits effets de survol pour faire pro
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "scale(1.03)";
              e.currentTarget.style.borderColor = "#0070f3";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.borderColor = "#333";
            }}
          >
            {/* 3. L'IMAGE DE FOND SEMI-TRANSPARENTE */}
            <img 
              src={set.icon_svg_uri} 
              alt=""
              style={{
                position: "absolute",
                width: "80px",
                height: "80px",
                opacity: "0.15", // Épaisseur de la transparence (0.15 = 15% d'opacité)
                pointerEvents: "none", // Empêche de bloquer le clic sur le texte
                // Le filtre inversé et blanc permet de faire ressortir l'icône sur fond sombre
                filter: "brightness(0) invert(1)", 
                zIndex: 1
              }}
            />

            {/* 4. Le texte du bouton, surélevé pour passer au-dessus de l'icône */}
            <span style={{ zIndex: 2, fontSize: "1.1rem", marginBottom: "5px" }}>{set.name}</span>
            <span style={{ zIndex: 2, color: "#888", fontSize: "0.9rem" }}>({set.code.toUpperCase()})</span>
          </Link>
        ))}
      </div>
    </div>
  );
}