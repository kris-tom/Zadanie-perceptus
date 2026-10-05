# Perceptus - Aplikacja do szyfrowania wiadomości

To jest projekt aplikacji webowej stworzony w ramach zadania rekrutacyjnego na stanowisko Junior Full Stack Developer. Aplikacja pozwala użytkownikom na logowanie się oraz bezpieczne szyfrowanie i odszyfrowywanie własnych wiadomości.

## Główne funkcje
- **Konta użytkowników:** Rejestracja i logowanie zabezpieczone tokenami JWT.
- **Prywatność (Izolacja danych):** Każdy użytkownik ma dostęp tylko do swoich własnych wiadomości.
- **Silne szyfrowanie:** Treść wiadomości jest szyfrowana w bazie algorytmem AES-256. Hasła są bezpiecznie hashowane.
- **Odporność na ataki:** Aplikacja jest zabezpieczona m.in. przed SQL Injection oraz XSS.
- **Responsywność i dostępność:** Interfejs dopasowuje się do ekranów telefonów i komputerów oraz posiada etykiety ułatwiające pracę czytnikom ekranowym (a11y).

## Technologie
- **Frontend:** React (Vite), JavaScript, CSS
- **Backend:** Java 17, Spring Boot 3, Spring Security, Spring Data JPA
- **Baza danych:** PostgreSQL
- **Infrastruktura:** Docker, Docker Compose

---

## Jak uruchomić projekt lokalnie?

Aplikacja jest w pełni skonteneryzowana. Do jej uruchomienia wymagany jest jedynie zainstalowany **Docker** oraz **Docker Compose**. Nie musisz instalować na komputerze Javy, Node.js ani bazy danych.

### Krok po kroku:

1. **Pobierz repozytorium** na swój dysk:
   
   git clone https://github.com/kris-tom/Zadanie-perceptus.git

2. **Przejdź do głównego folderu**(tam gdzie znajduje się plik docker-compose.yml)


3. **Uruchomienie aplikacji dockerem**
   
   docker-compose up --build

4.**Testowanie aplikacji**

  frontend:http://localhost:5173
  backend:http://localhost:8080