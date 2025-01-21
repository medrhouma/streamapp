'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components';

type PaymentType = 'card' | 'paypal' | 'apple';

const lightTheme = {
  background: '#f5f7fa',
  color: '#333',
  borderColor: '#ccc',
  inputBackground: '#fff',
  hoverBackground: '#f1f9ff',
  selectedBorderColor: '#007BFF',
  selectedBackgroundColor: '#f1f9ff',
  buttonBackground: '#007BFF',
  buttonHoverBackground: '#0056b3',
  modalBackground: '#fff',
  modalText: '#333',
};

const darkTheme = {
  background: '#1e1e1e',
  color: '#333', // Changement de la couleur du texte en bleu clair
  borderColor: '#555',
  inputBackground: '#2a2a2a',
  hoverBackground: '#333',
  selectedBorderColor: '#6C63FF',
  selectedBackgroundColor: '#333',
  buttonBackground: '#6C63FF',
  buttonHoverBackground: '#5348C0',
  modalBackground: '#2a2a2a',
  modalText: '#61dafb', // Changement de la couleur du texte de la boîte de dialogue en bleu clair
};

const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${(props: any) => props.theme.background};
    color: ${(props: any) => props.theme.color};
    transition: background-color 0.3s ease, color 0.3s ease;
  }
`;

const PaymentPage = () => {
  const router = useRouter();
  const [selectedMethod, setSelectedMethod] = useState<PaymentType>('card');
  const [formData, setFormData] = useState({
    name: '',
    city: '',
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvc: ''
  });
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleMethodSelect = (method: PaymentType) => {
    setSelectedMethod(method);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.city || !formData.cardNumber || !formData.expiryMonth || !formData.expiryYear || !formData.cvc) {
      setError('Please complete all fields before proceeding.');
      return;
    }

    setError('');
    setIsLoading(true);

    // Simulate a loading delay
    setTimeout(() => {
      setIsLoading(false);
      setShowSuccessModal(true);
    }, 2000);
  };

  const toggleTheme = () => setIsDarkMode((prev) => !prev);

  const closeModal = () => {
    setShowSuccessModal(false);
    router.push('/stream');
  };

  const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i);
  const months = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <GlobalStyle />
      <PaymentPageContainer>
        

        <h2 className="form-title">Payment Method</h2>
        <p className="form-description">Add a new payment method to your account.</p>

        <MethodSelection>
          <PaymentMethod
            className={selectedMethod === 'card' ? 'selected' : ''}
            onClick={() => handleMethodSelect('card')}
          >
            <MethodIcon>💳</MethodIcon>
            <span>Card</span>
          </PaymentMethod>

          <PaymentMethod
            className={selectedMethod === 'paypal' ? 'selected' : ''}
            onClick={() => handleMethodSelect('paypal')}
          >
            <MethodIcon>🪙</MethodIcon>
            <span>Paypal</span>
          </PaymentMethod>

          <PaymentMethod
            className={selectedMethod === 'apple' ? 'selected' : ''}
            onClick={() => handleMethodSelect('apple')}
          >
            <MethodIcon>📱</MethodIcon>
            <span>Apple Pay</span>
          </PaymentMethod>
        </MethodSelection>

        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <label>Name</label>
            <Input
              type="text"
              name="name"
              placeholder="First Last"
              onChange={handleInputChange}
              value={formData.name}
            />
          </InputGroup>

          <InputGroup>
            <label>City</label>
            <Input
              type="text"
              name="city"
              onChange={handleInputChange}
              value={formData.city}
            />
          </InputGroup>

          <InputGroup>
            <label>Card number</label>
            <Input
              type="text"
              name="cardNumber"
              onChange={handleInputChange}
              value={formData.cardNumber}
            />
          </InputGroup>

          <ExpiryGroup>
            <InputGroup>
              <label>Expires</label>
              <Select
                name="expiryMonth"
                onChange={handleInputChange}
                value={formData.expiryMonth}
              >
                <option value="">Month</option>
                {months.map(month => (
                  <option key={month} value={month}>{month}</option>
                ))}
              </Select>
            </InputGroup>

            <InputGroup>
              <label>Year</label>
              <Select
                name="expiryYear"
                onChange={handleInputChange}
                value={formData.expiryYear}
              >
                <option value="">Year</option>
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </Select>
            </InputGroup>

            <InputGroup>
              <label>CVC</label>
              <Input
                type="text"
                name="cvc"
                maxLength={4}
                onChange={handleInputChange}
                value={formData.cvc}
              />
            </InputGroup>
          </ExpiryGroup>

          {error && <ErrorMessage>{error}</ErrorMessage>}

          <SubmitButton type="submit" disabled={isLoading}>
            {isLoading ? " ⏳ Processing..." : "Validate"}
          </SubmitButton>
        </Form>

        {showSuccessModal && (
          <ModalOverlay>
            <Modal>
              <ModalTitle>Payment Successful!</ModalTitle>
              <ModalText>Thank you for your payment. You will be redirected shortly.</ModalText>
              <ModalButton onClick={closeModal}>Close</ModalButton>
            </Modal>
          </ModalOverlay>
        )}
      </PaymentPageContainer>
    </ThemeProvider>
  );
};

export default PaymentPage;

// Styled components
const PaymentPageContainer = styled.div`
  width: 90%;
  max-width: 500px;
  margin: 0 auto;
  padding: 30px;
  background: ${(props: any) => props.theme.background};
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  font-family: 'Roboto', sans-serif;
  transition: background-color 0.3s ease, color 0.3s ease;
`;

const ToggleButton = styled.button`
  background-color: ${(props: any) => props.theme.buttonBackground};
  color: ${(props: any) => props.theme.color};
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  margin-bottom: 20px;
  transition: all 0.3s ease;

  &:hover {
    background-color: ${(props: any) => props.theme.buttonHoverBackground};
  }
`;

const Form = styled.form`
  width: 100%;
  margin-top: 30px;
`;

const MethodSelection = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  gap: 10px;
`;

const PaymentMethod = styled.div`
  flex: 1;
  padding: 20px;
  border: 2px solid ${(props: any) => props.theme.borderColor};
  border-radius: 8px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: ${(props: any) => props.theme.inputBackground};

  &.selected {
    border-color: ${(props: any) => props.theme.selectedBorderColor};
    background-color: ${(props: any) => props.theme.selectedBackgroundColor};
  }

  &:hover {
    border-color: ${(props: any) => props.theme.selectedBorderColor};
    background-color: ${(props: any) => props.theme.hoverBackground};
  }
`;

const MethodIcon = styled.div`
  font-size: 24px;
  margin-bottom: 10px;
`;

const InputGroup = styled.div`
  margin-bottom: 20px;

  label {
    font-size: 14px;
    font-weight: 600;
    color: ${(props: any) => props.theme.color};
    margin-bottom: 8px;
    display: block;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  font-size: 16px;
  border: 1px solid ${(props: any) => props.theme.borderColor};
  border-radius: 8px;
  background-color: ${(props: any) => props.theme.inputBackground};
  color: ${(props: any) => props.theme.color};
  outline: none;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  &:focus {
    border-color: ${(props: any) => props.theme.selectedBorderColor};
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.2);
  }

  &:hover {
    border-color: ${(props: any) => props.theme.buttonHoverBackground};
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 12px;
  font-size: 16px;
  border: 1px solid ${(props: any) => props.theme.borderColor};
  border-radius: 8px;
  background-color: ${(props: any) => props.theme.inputBackground};
  color: ${(props: any) => props.theme.color};
  outline: none;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  &:focus {
    border-color: ${(props: any) => props.theme.selectedBorderColor};
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.2);
  }

  &:hover {
    border-color: ${(props: any) => props.theme.buttonHoverBackground};
  }
`;

const ExpiryGroup = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px;
`;

const SubmitButton = styled.button`
  background-color: ${(props: any) => props.theme.buttonBackground};
  color: ${(props: any) => props.theme.color};
  border: none;
  padding: 12px 20px;
  font-size: 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  margin-top: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  &:hover {
    background-color: ${(props: any) => props.theme.buttonHoverBackground};
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.p`
  color: #ff4444;
  font-size: 0.9rem;
  margin-bottom: 10px;
  text-align: center;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const Modal = styled.div`
  background-color: ${(props: any) => props.theme.modalBackground};
  color: ${(props: any) => props.theme.modalText};
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  text-align: center;
  max-width: 400px;
  width: 90%;
`;

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 15px;
`;

const ModalText = styled.p`
  font-size: 1rem;
  margin-bottom: 20px;
`;

const ModalButton = styled.button`
  background-color: ${(props: any) => props.theme.buttonBackground};
  color: ${(props: any) => props.theme.color};
  border: none;
  padding: 10px 20px;
  font-size: 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: ${(props: any) => props.theme.buttonHoverBackground};
  }
`;