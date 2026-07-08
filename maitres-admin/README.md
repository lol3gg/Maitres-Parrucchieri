# MAÎTRES Admin — Dashboard gestione salone

App **separata** dal sito pubblico. Gestisce appuntamenti, blocchi orari, ordini shop e clienti.

## Avvio rapido

### 1. API (obbligatoria — condivide dati con il sito)
```powershell
cd maitres-api
npm install
npm start
```
→ http://localhost:8787

### 2. Admin dashboard
```powershell
cd maitres-admin
python -m http.server 8788
```
→ http://localhost:8788/login.html

**PIN default:** `maitres2026`

### 3. Sito pubblico (prenotazioni collegate)
```powershell
cd ..
python -m http.server 8765
```
→ http://localhost:8765/prenota.html

## Come funziona la connessione

- Il **sito** invia prenotazioni all'API (`localhost:8787`)
- L'**admin** legge/scrive gli stessi dati
- Se uno slot è occupato o bloccato → **non appare** nel form prenotazione
- Gli ordini shop arrivano nella sezione **Ordini**

## Sezioni admin

| Sezione | Funzione |
|---------|----------|
| Dashboard | Statistiche e appuntamenti di oggi |
| Agenda | Vista per staff e data |
| Appuntamenti | Lista completa, conferma/annulla |
| Nuovo | Inserimento manuale dal salone |
| Blocchi | Pausa pranzo, ferie, slot chiusi |
| Ordini | Richieste dallo shop |
| Clienti | Storico clienti |
| Staff | Team e orari |

## Dati

Salvati in `maitres-api/data/`:
- `appointments.json`
- `orders.json`
- `blocks.json`

## Sicurezza

Cambiare PIN in produzione:
```powershell
$env:MAITRES_ADMIN_PIN = "tuo-pin-sicuro"
npm start
```
