# Perceptus – aplikacja do szyfrowania wiadomości

Aplikacja webowa stworzona w ramach zadania rekrutacyjnego na stanowisko **Junior Full Stack Developer**. Pozwala użytkownikom zarejestrować się, zalogować i bezpiecznie szyfrować oraz odszyfrowywać własne wiadomości. Zaszyfrowane wiadomości są zapisywane w bazie danych.

## Główne funkcje

- **Konta użytkowników:** rejestracja i logowanie zabezpieczone tokenami JWT.
- **Izolacja danych:** każdy użytkownik ma dostęp wyłącznie do własnych wiadomości.
- **Szyfrowanie:** treść wiadomości jest szyfrowana w bazie algorytmem AES-256. Hasła są hashowane.
- **Walidacja i obsługa błędów:** dane wejściowe są sprawdzane, a użytkownik dostaje czytelne komunikaty.
- **Responsywność i dostępność:** interfejs działa na telefonie, tablecie i komputerze oraz ma etykiety dla czytników ekranowych.

## Technologie

| Warstwa | Technologie |
|---|---|
| Frontend | React (Vite), JavaScript, CSS |
| Backend | Java 17, Spring Boot 3, Spring Security, Spring Data JPA |
| Baza danych | PostgreSQL |
| Infrastruktura | Docker, Docker Compose |

## Jak uruchomić projekt lokalnie

Aplikacja jest w pełni skonteneryzowana. Potrzebujesz tylko zainstalowanego i **uruchomionego** Dockera z Docker Compose. Nie musisz instalować Javy, Node.js ani bazy danych.

1. Pobierz repozytorium:

   ```bash
   git clone https://github.com/kris-tom/Zadanie-perceptus.git
   cd Zadanie-perceptus
   ```

2. Upewnij się, że jesteś w głównym folderze projektu (tam, gdzie leży `docker-compose.yml`), i uruchom aplikację:

   ```bash
   docker compose up --build
   ```

   Jeśli masz starszą wersję Dockera, użyj `docker-compose up --build`.

3. Poczekaj, aż wszystkie kontenery wystartują (przy pierwszym uruchomieniu budowanie może potrwać kilka minut).

### Adresy

| Usługa | Adres |
|---|---|
| Frontend (aplikacja) | http://localhost:5173 |
| Backend (API) | http://localhost:8080 |

### Zatrzymanie aplikacji

```bash
docker compose down
```

Aby usunąć także dane z bazy:

```bash
docker compose down -v
```

## Jak przetestować aplikację

1. Otwórz http://localhost:5173.
2. Wpisz login i hasło, a następnie kliknij **Zarejestruj się**.
3. Zaloguj się tymi samymi danymi.
4. Wpisz wiadomość w polu na dole i kliknij **Zaszyfruj i zapisz**. Pojawi się na liście po lewej jako szyfrogram.
5. Kliknij **Odszyfruj** przy wybranej wiadomości. Treść pojawi się w głównym oknie i można ją skopiować.
6. Wyloguj się, załóż drugie konto i sprawdź, że nie widzi wiadomości pierwszego użytkownika.

## Konfiguracja

Ustawienia aplikacji (dane bazy, sekret JWT, klucz szyfrowania AES) znajdują się w `backend/src/main/resources/application.properties` (oraz w `docker-compose.yml`, jeśli część wartości jest tam nadpisywana).

> Wartości w repozytorium służą wyłącznie do uruchomienia lokalnego. W środowisku produkcyjnym należy je zmienić i nie trzymać w repozytorium.

## Bezpieczeństwo

| Zagrożenie / wymaganie | Jak jest obsłużone |
|---|---|
| Przechowywanie haseł | Hasła są hashowane algorytmem BCrypt i nigdy nie są zapisywane jawnie. |
| Poufność wiadomości | Treść jest szyfrowana algorytmem AES z kluczem 256-bitowym przed zapisem w bazie. |
| Uwierzytelnianie | Tokeny JWT, a endpointy wiadomości wymagają nagłówka `Authorization: Bearer <token>`. |
| Kontrola dostępu | Wiadomości są powiązane z kontem właściciela, a lista (`/api/msg/all`) zwraca tylko wiadomości zalogowanego użytkownika. Wszystkie endpointy wiadomości wymagają tokena JWT. |
| SQL Injection | Dostęp do bazy przez Spring Data JPA (zapytania parametryzowane), bez sklejania SQL z danych użytkownika. |
| XSS | React domyślnie escapuje wyświetlaną treść, a aplikacja nie używa `dangerouslySetInnerHTML`. |
| Walidacja danych | Po stronie frontendu (puste pola) i backendu (Bean Validation, `@Valid`): login i hasło niepuste, hasło min. 4 znaki, wiadomość maks. 1000 znaków. |
| Obsługa błędów | Błędy walidacji i operacji szyfrowania zwracają krótkie komunikaty (400/401/500), bez szczegółów technicznych. |

## API

Wszystkie endpointy poza `/api/auth/*` wymagają tokena JWT.

| Metoda | Endpoint | Opis | Body |
|---|---|---|---|
| POST | `/api/auth/register` | Rejestracja użytkownika | `{ "username", "password" }` |
| POST | `/api/auth/login` | Logowanie, zwraca token JWT | `{ "username", "password" }` |
| POST | `/api/msg/enc` | Szyfruje i zapisuje wiadomość | `{ "content" }` |
| GET | `/api/msg/all` | Zwraca zaszyfrowane wiadomości zalogowanego użytkownika | – |
| POST | `/api/msg/decode` | Odszyfrowuje wskazany szyfrogram | `{ "content" }` |

## Struktura projektu

> `[SPRAWDŹ: dopasuj nazwy folderów do swojego repozytorium]`

```
.
├── frontend/             # aplikacja React (Vite)
├── backend/              # aplikacja Spring Boot
│   └── src/main/java/…   # controller → service → repository
└── docker-compose.yml    # uruchamia frontend, backend i bazę PostgreSQL
```

Backend jest podzielony na warstwy: kontrolery obsługują żądania HTTP, serwisy zawierają logikę (szyfrowanie, uwierzytelnianie), a repozytoria odpowiadają za dostęp do bazy.

## Dostępność, responsywność i wydajność

- **Dostępność:** pola formularzy mają etykiety, przyciski mają czytelne nazwy, a fokus klawiatury jest widoczny. Animacje są wyłączane przy ustawieniu systemowym „ogranicz ruch".
- **Responsywność:** układ dostosowuje się do telefonu, tabletu i komputera (na wąskich ekranach lista i czytnik układają się pionowo).
- **Wydajność:** frontend jest budowany przez Vite, a backend nie pobiera danych innych użytkowników, więc odpowiedzi są niewielkie.

## Ograniczenia i możliwe usprawnienia

- zmiana trybu szyfrowania na AES-GCM z losowym IV dla każdej wiadomości,
- odszyfrowywanie wiadomości po id z kontrolą właściciela po stronie backendu,
- globalny handler błędów (`@RestControllerAdvice`),
- paginacja listy wiadomości,
- ograniczenie liczby prób logowania,
- HTTPS i zarządzanie sekretami (np. menedżer sekretów zamiast zmiennych w repozytorium),
- refresh token i wygasanie sesji,
- testy automatyczne (jednostkowe i integracyjne).

## Autor

Krzysztof Długosz – zadanie rekrutacyjne dla firmy Perceptus.
