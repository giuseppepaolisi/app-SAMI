# App-SAMI

Questo repository contiene il codice sorgente dell'applicazione SAMI basata su Express e MongoDB.

## Istruzioni per l'avvio dell'applicazione

Seguire i passi seguenti per avviare l'applicazione localmente:

1. Clonare il repository sul proprio computer.

2. Navigare nella cartella `src`.

3. Creare un file `development.env` all'interno della cartella `env`. Assicurarsi di fornire le corrette variabili di ambiente necessarie per la connessione al database MongoDB e altre configurazioni dell'applicazione.

4. Assicurarsi di avere Docker installato sul computer. Per ulteriori istruzioni sull'installazione di Docker, fare riferimento alla documentazione ufficiale di Docker.

5. Eseguire il comando Docker per costruire l'immagine dell'applicazione:
```bash
docker build -t nome_immagine:latest .
```
Sostituire `nome_immagine` con il nome desiderato per l'immagine.

6. Dopo aver costruito con successo l'immagine Docker, eseguire il comando Docker per avviare il container:

```bash
docker run -d -p 3000:3001 --name nome_container nome_immagine:latest
```
Sostituire `nome_container` con il nome desiderato per il container.

7. L'applicazione sarà ora accessibile all'indirizzo `http://localhost:3000`. Aprire il browser e digitare l'URL per accedere all'applicazione.

## Note

Assicurarsi di configurare correttamente le variabili di ambiente nel file `development.env` prima di avviare l'applicazione. Inoltre, è possibile personalizzare altre impostazioni dell'applicazione nel file `development.env` a seconda delle esigenze specifiche del progetto.

Per arrestare e rimuovere il container Docker, utilizzare i seguenti comandi:

```bash
docker stop nome_container
docker rm nome_container
```


