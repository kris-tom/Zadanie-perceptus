import { useState, useEffect } from 'react'
import './App.css'

// Wyłącznie dekoracja tła ekranu logowania (nie są to prawdziwe dane)
const CIPHER_DECOR = 'q8Vn3xT+uR0mZk7LpA2eYhW9cBfS1dJgO5iNvXtU4wEyHrQ6aMzK/lPb8CsDj0FoGn2VxTu7RmZk3LpAeYhW1cBfS5dJgO9iNvXtU4wEyHrQ6aMzK8lPbCsDj0FoGn+VxTu2RmZk7Lp'.repeat(14)

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [authStatus, setAuthStatus] = useState('')

  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('')

  // Stany do obsługi zaszyfrowanych i odszyfrowanych wiadomości
  const [encryptedMessages, setEncryptedMessages] = useState([])
  const [decryptedText, setDecryptedText] = useState('')

  // Automatyczne pobieranie wiadomości po zalogowaniu (gdy pojawi się token)
  useEffect(() => {
    if (token) {
      fetchEncryptedMessages()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

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
      setAuthStatus('Błąd: Wpisz login i hasło!')
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
        setPassword('')
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
    setUsername('')
    setPassword('')
    setEncryptedMessages([])
    setDecryptedText('')
    setStatus('')
    setAuthStatus('Wylogowano.')
  }

  const handleEncrypt = async () => {
    if (!message) {
      setStatus('Błąd: Wpisz najpierw wiadomość!')
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
        // Automatyczne odświeżenie listy po dodaniu nowej
        fetchEncryptedMessages()
      } else {
        setStatus('Błąd: Backend odrzucił żądanie (kod 401/403 - sprawdź token).')
      }
    } catch {
      setStatus('Błąd: Brak połączenia z serwerem.')
    }
  }

  // Pobiera listę wszystkich zaszyfrowanych wiadomości z bazy
  const fetchEncryptedMessages = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/msg/all', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        setEncryptedMessages(data.reverse())
        setStatus('Sukces: Zaszyfrowane wiadomości pobrane.')
      } else {
        setStatus('Błąd: Brak uprawnień do pobrania wiadomości.')
      }
    } catch {
      setStatus('Błąd: Brak połączenia z serwerem.')
    }
  }

  // Wysyła jedną wybraną wiadomość do odszyfrowania na serwerze
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
        setStatus('Sukces: Pomyślnie odszyfrowano wybraną wiadomość.')
      } else {
        setDecryptedText('Błąd deszyfrowania.')
      }
    } catch {
      setDecryptedText('Błąd połączenia z serwerem.')
    }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(decryptedText)
      setStatus('Sukces: Skopiowano do schowka.')
    } catch {
      setStatus('Błąd: Nie udało się skopiować do schowka.')
    }
  }

  // ---------- EKRAN LOGOWANIA ----------
  if (!token) {
    return (
      <div className="auth-screen">
        <aside className="auth-aside">
          <div>
            <h1 className="brand-mark">Perceptus</h1>
            <p className="auth-lead">
              Wiadomości szyfrowane AES-256, dostępne tylko po zalogowaniu.
            </p>
          </div>
          <div className="auth-cipher" aria-hidden="true">{CIPHER_DECOR}</div>
        </aside>

        <div className="auth-main">
          <div className="auth-card">
            <h2 className="auth-title">Zaloguj się</h2>

            <label className="field-label" htmlFor="username">Login</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input-field"
              autoComplete="username"
            />

            <label className="field-label" htmlFor="password">Hasło</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              autoComplete="current-password"
            />

            <button onClick={handleLogin} className="btn btn-primary">
              Zaloguj
            </button>

            {authStatus && (
              <p className={`status-text ${authStatus.includes('Błąd') ? 'status-error' : 'status-success'}`}>
                {authStatus}
              </p>
            )}

            <p className="auth-footer">
              Nie masz konta?{' '}
              <button onClick={handleRegister} className="link">
                Zarejestruj się
              </button>
            </p>
          </div>
        </div>
      </div>
    )
  }

  // ---------- PANEL PO ZALOGOWANIU ----------
  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="sidebar-head">
          <h2 className="app-brand">🔒 Perceptus</h2>
          <button onClick={handleLogout} className="btn btn-secondary btn-sm">
            Wyloguj się
          </button>
        </div>

        {username && <p className="sidebar-user">Zalogowano jako {username}</p>}

        <div className="sidebar-title">
          <span>Twoje wiadomości</span>
          <span className="badge">{encryptedMessages.length}</span>
        </div>

        {encryptedMessages.length === 0 ? (
          <p className="hint sidebar-empty">Brak zapisanych wiadomości.</p>
        ) : (
          <ul className="message-list">
            {encryptedMessages.map((msg, index) => (
              <li key={index} className="message-item">
                <span className="message-text" title={msg.content}>{msg.content}</span>
                <button
                  onClick={() => handleDecodeSingle(msg.content)}
                  className="btn btn-secondary"
                >
                  Odszyfruj
                </button>
              </li>
            ))}
          </ul>
        )}
      </aside>

      <main className="workspace">
        <section className="reader">
          <div className="reader-meta">
            <span className="badge">AES-256</span>
            <span className="badge">Prywatne</span>
          </div>
          <h1 className="reader-title">Odszyfrowana wiadomość</h1>

          <div className={`reader-body ${decryptedText ? '' : 'is-empty'}`}>
            {decryptedText || 'Wybierz wiadomość z listy i kliknij „Odszyfruj”, a jej treść pojawi się tutaj.'}
          </div>

          <div className="reader-actions">
            <button
              onClick={() => setDecryptedText('')}
              className="btn btn-secondary btn-sm"
              disabled={!decryptedText}
            >
              Wyczyść
            </button>
            <button
              onClick={handleCopy}
              className="btn btn-secondary btn-sm"
              disabled={!decryptedText}
            >
              Kopiuj
            </button>
          </div>
        </section>

        <section className="composer">
          <div className="composer-row">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Wpisz wiadomość do zaszyfrowania..."
              className="textarea-field"
              aria-label="Nowa wiadomość"
            />
            <button onClick={handleEncrypt} className="btn btn-primary">
              Zaszyfruj i zapisz
            </button>
          </div>
          <div className="composer-meta">
            <p className="hint">Wiadomość zostanie zaszyfrowana przed zapisem.</p>
            {status && (
              <p className={`status-text ${status.includes('Błąd') ? 'status-error' : 'status-success'}`}>
                {status}
              </p>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}

export default App