import { useState } from 'react'
import './App.css'

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [authStatus, setAuthStatus] = useState('')

  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('')
  
  // Nowe stany do obsługi zaszyfrowanych i odszyfrowanych wiadomości
  const [encryptedMessages, setEncryptedMessages] = useState([])
  const [decryptedText, setDecryptedText] = useState('')

const handleRegister = async () => {
    if (!username || !password) {
      setAuthStatus('Błąd: Wpisz login i hasło!')
      return
    }
    try {
      const response = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })
      
      const text = await response.text()
      
      if (response.ok) {
        setAuthStatus(text) 
      } else {
        setAuthStatus(`Błąd: ${text}`)
      }
    } catch {
      setAuthStatus('Błąd: Brak połączenia z serwerem.')
    }
  }

  const handleLogin = async () => {
    if (!username || !password) {
      setAuthStatus('Wpisz login i hasło!')
      return
    }
    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })
      if (response.ok) {
        const jwt = await response.text()
        setToken(jwt)
        localStorage.setItem('token', jwt)
        setAuthStatus('Zalogowano pomyślnie!')
      } else {
        setAuthStatus('Błąd: Nieprawidłowy login lub hasło.')
      }
    } catch {
      setAuthStatus('Błąd: Brak połączenia z serwerem.')
    }
  }

  const handleLogout = () => {
    setToken('')
    localStorage.removeItem('token')
    setEncryptedMessages([])
    setDecryptedText('')
    setStatus('')
    setAuthStatus('Wylogowano.')
  }

  const handleEncrypt = async () => {
    if (!message) {
      setStatus('Wpisz najpierw wiadomość!')
      return
    }

    try {
      const response = await fetch('http://localhost:8080/api/msg/enc', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content: message })
      })

      if (response.ok) {
        setStatus('Sukces: Wiadomość zaszyfrowana i zapisana w bazie!')
        setMessage('')
        // Opcjonalnie: od razu odśwież listę wiadomości po dodaniu nowej
        fetchEncryptedMessages()
      } else {
        setStatus('Błąd: Backend odrzucił żądanie (kod 401/403 - sprawdź token).')
      }
    } catch {
      setStatus('Błąd: Brak połączenia z serwerem.')
    }
  }

  // Funkcja pobierająca listę wszystkich zaszyfrowanych wiadomości z bazy
  const fetchEncryptedMessages = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/msg/all', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        setEncryptedMessages(data)
        setStatus('Sukces: Zaszyfrowane wiadomości pobrane.')
      } else {
        setStatus('Błąd: Brak uprawnień do pobrania wiadomości.')
      }
    } catch {
      setStatus('Błąd: Brak połączenia z serwerem.')
    }
  }

  // Funkcja wysyłająca jedną wybraną wiadomość do odszyfrowania na serwerze
  const handleDecodeSingle = async (encryptedContent) => {
    try {
      const response = await fetch('http://localhost:8080/api/msg/decode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content: encryptedContent })
      })

      if (response.ok) {
        const text = await response.text()
        setDecryptedText(text)
        setStatus('Pomyślnie odszyfrowano wybraną wiadomość.')
      } else {
        setDecryptedText('Błąd deszyfrowania.')
      }
    } catch {
      setDecryptedText('Błąd połączenia z serwerem.')
    }
  }

  return (
    <div className="app-container">
      <h2>Perceptus - Szyfrowanie AES-256 + Auth JWT</h2>

      {!token ? (
        <div className="auth-card">
          <h3>Panel logowania</h3>
          <input
            type="text"
            placeholder="Login"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="input-field"
            aria-label="Wpisz swój login"
          />
          <input
            type="password"
            placeholder="Hasło"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field"
            aria-label="Wpisz swoje hasło"
          />
          <button onClick={handleLogin} className="btn btn-primary btn-margin-right">
            Zaloguj
          </button>
          <button onClick={handleRegister} className="btn btn-secondary">
            Zarejestruj
          </button>
          <p className={`status-text ${authStatus.includes('Błąd') ? 'status-error' : 'status-success'}`}>
            {authStatus}
          </p>
        </div>
      ) : (
        <div>
          <button onClick={handleLogout} className="btn btn-danger">
            Wyloguj się
          </button>

          <div style={{ marginBottom: '30px' }}>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Wpisz wiadomość do zaszyfrowania..."
              className="textarea-field"
            />
            <br />
            <button onClick={handleEncrypt} className="btn btn-primary" style={{ marginTop: '10px' }}>
              Zaszyfruj i Zapisz (POST)
            </button>
            <p className={`status-text ${status.includes('Błąd') ? 'status-error' : 'status-success'}`}>
              {status}
            </p>
          </div>

          <hr className="section-divider" />

          <div>
            <button onClick={fetchEncryptedMessages} className="btn btn-success" style={{ marginBottom: '15px' }}>
              Pobierz z bazy (Zaszyfrowane)
            </button>

            {/* Wyświetlanie wyniku po kliknięciu odszyfrowania */}
            {decryptedText && (
              <div style={{ padding: '15px', backgroundColor: '#e2f0d9', color: '#2e7d32', borderRadius: '5px', marginBottom: '20px', border: '1px solid #c8e6c9' }}>
                <strong>Wynik odszyfrowania:</strong> {decryptedText}
              </div>
            )}

            <ul className="message-list">
              {encryptedMessages.map((msg, index) => (
                <li key={index} className="message-item" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <span style={{ wordBreak: 'break-all', fontSize: '0.9em', color: '#555' }}>
                    <strong>Ciąg znaków:</strong> {msg.content}
                  </span>
                  <button 
                    onClick={() => handleDecodeSingle(msg.content)} 
                    className="btn btn-secondary" 
                    style={{ alignSelf: 'flex-start', padding: '5px 10px', fontSize: '0.8em' }}
                  >
                    Odszyfruj tę wiadomość
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}

export default App