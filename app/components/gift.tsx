'use client';
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components';

const lightTheme = {
  background: '#ffffff',
  color: '#000000',
  borderColor: '#ddd',
  inputBackground: '#f9f9f9',
  buttonBackground: '#61dafb',
  buttonColor: '#000000',
};

const darkTheme = {
  background: '#121212',
  color: '#ffffff',
  borderColor: '#444',
  inputBackground: '#333',
  buttonBackground: '#61dafb',
  buttonColor: '#121212',
};

const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${(props: any) => props.theme.background};
    color: ${(props: any) => props.theme.color};
    transition: background-color 0.3s ease, color 0.3s ease;
  }
`;

export default function GiftPageComponent() {
  const router = useRouter();
  const [giftMessage, setGiftMessage] = useState("");
  const [selectedGiftAmount, setSelectedGiftAmount] = useState("");
  const [selectedGiftType, setSelectedGiftType] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGiftMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => setGiftMessage(e.target.value);
  const handleGiftSelection = (e: React.ChangeEvent<HTMLSelectElement>) => setSelectedGiftAmount(e.target.value);
  const handleGiftTypeSelection = (e: React.ChangeEvent<HTMLSelectElement>) => setSelectedGiftType(e.target.value);

  const handleGoToPayment = () => {
    if (!selectedGiftAmount || !selectedGiftType || !giftMessage) {
      setError("Please complete all fields before proceeding.");
      return;
    }
    setError("");
    setIsLoading(true);

    // loading delay 
    setTimeout(() => {
      setIsLoading(false);
      router.push("/payment");
    }, 2000);
  };

  

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <GlobalStyle />
      <Container>
        <Title>🎁 Send a Gift</Title>

        
        <Section>
          <Label htmlFor="giftSelection">💰 Select a Gift Amount</Label>
          <Select id="giftSelection" value={selectedGiftAmount} onChange={handleGiftSelection}>
            <option value="">--Choose an Amount--</option>

            
            <optgroup label="🎀 Petits cadeaux">
              <option value="5">£5 - Un petit geste attentionné</option>
              <option value="10">£10 - Une attention sympathique</option>
            </optgroup>

            
            <optgroup label="🎁 Cadeaux moyens">
              <option value="25">£25 - Un cadeau généreux</option>
              <option value="50">£50 - Un cadeau premium</option>
            </optgroup>

            
            <optgroup label="🌟 Cadeaux exceptionnels">
              <option value="100">£100 - Un cadeau inoubliable</option>
              <option value="200">£200 - Un cadeau luxueux</option>

            </optgroup>

          </Select>
        </Section>

        <Section>
          <Label htmlFor="giftType">🎁 Select a Gift</Label>
          <Select id="giftType" value={selectedGiftType} onChange={handleGiftTypeSelection}>
            <option value="">--Choose a Gift--</option>
            
            
            <optgroup label="🍕 Nourriture">
              <option value="Coffee Cup">☕ Coffee Cup - Une tasse de café personnalisée</option>
              <option value="Cupcake">🧁 Cupcake - Un délicieux cupcake fait maison</option>
              <option value="Pizza">🍕 Pizza - Une pizza pour se régaler</option>
              <option value="Chocolate Box">🍫 Chocolate Box - Une boîte de chocolats fins</option>
            </optgroup>

            
            
            <optgroup label="🕶️ Accessoires">
              <option value="Custom Emote">🎨 Custom Emote - Un emote personnalisé pour le stream</option>
              <option value="Streamer Merchandise">👕 Streamer Merchandise - Produits dérivés du streamer</option>
              <option value="Sunglasses">🕶️ Sunglasses - Des lunettes de soleil stylées</option>
              <option value="Watch">⌚ Watch - Une montre élégante</option>
            </optgroup>

            
            
            <optgroup label="🎉 Expériences">
              <option value="Concert Tickets">🎟️ Concert Tickets - Billets pour un concert</option>
              <option value="Spa Day">🛁 Spa Day - Une journée de détente au spa</option>
              <option value="Cooking Class">👨‍🍳 Cooking Class - Un cours de cuisine</option>
              <option value="Skydiving">🪂 Skydiving - Un saut en parachute</option>
            </optgroup>
          </Select>
        </Section>

       
       
        <Section>
          <Label htmlFor="giftMessage">✉️ Write a Message</Label>
          <Textarea
            id="giftMessage"
            value={giftMessage}
            onChange={handleGiftMessageChange}
            placeholder="Enter a short message..."
          />
        </Section>

        
        
        {error && <ErrorMessage>❌ {error}</ErrorMessage>}

        
        
        <Section>
          <SubmitButton onClick={handleGoToPayment} disabled={isLoading}>
            {isLoading ? "⏳ Processing..." : "💳 Go to Payment"}
          </SubmitButton>
        </Section>

        
        <Footer>
          <FooterText>Powered by GiftApp &copy; 2025</FooterText>
        </Footer>
      </Container>
    </ThemeProvider>  
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  min-height: 100vh;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
  transition: background-color 0.3s ease, color 0.3s ease;
`;

const Title = styled.h1`
  color: #61dafb;
  margin-bottom: 20px;
  font-size: 2rem;
  font-weight: bold;
`;

const Section = styled.div`
  margin-bottom: 15px;
  width: 100%;
  max-width: 450px;
`;

const Label = styled.label`
  font-size: 1rem;
  margin-bottom: 8px;
  display: block;
  font-weight: 500;
  color: ${(props: any) => props.theme.color};
`;

const Select = styled.select`
  width: 100%;
  padding: 10px;
  font-size: 1rem;
  border-radius: 8px;
  border: 1px solid ${(props: any) => props.theme.borderColor};
  background-color: ${(props: any) => props.theme.inputBackground};
  color: ${(props: any) => props.theme.color};
  outline: none;
  transition: background-color 0.3s ease, color 0.3s ease;
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 10px;
  font-size: 1rem;
  border-radius: 8px;
  border: 1px solid ${(props: any) => props.theme.borderColor};
  background-color: ${(props: any) => props.theme.inputBackground};
  color: ${(props: any) => props.theme.color};
  resize: none;
  outline: none;
  transition: background-color 0.3s ease, color 0.3s ease;
`;

const SubmitButton = styled.button`
  background-color: ${(props: any) => props.theme.buttonBackground};
  color: ${(props: any) => props.theme.buttonColor};
  font-size: 1rem;
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  width: 100%;
  margin-top: 10px;
  transition: background-color 0.3s ease, color 0.3s ease;

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const Footer = styled.div`
  margin-top: 20px;
  text-align: center;
  font-size: 0.9rem;
`;

const FooterText = styled.p`
  color: ${(props: any) => props.theme.color};
`;

const ErrorMessage = styled.p`
  color: #ff4444;
  font-size: 0.9rem;
  margin-bottom: 10px;
`;