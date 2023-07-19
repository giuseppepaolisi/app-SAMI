//const puppeteer = require('puppeteer');
//const axios = require('axios');

(async () => {
  try {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    //await page.setContent('<html><body><h1>Hello World</h1></body></html>'); // Inserisci qui il tuo HTML con la tabella
    const url = '/prodPocket/produzione/pocket';
    
    //Scarico contenuto html
    const response = await axios.get(url);
    const htmlContent = response.data;

    // Imposta il contenuto HTML nella pagina
    await page.setContent(htmlContent);

    await page.emulateMediaType('screen'); 

    
    // Modifica il percorso e il nome del file PDF come desideri
    await page.pdf({ path: 'output1.pdf', format: 'A4', printBackground: true });

    await browser.close();

    console.log('PDF generato correttamente.');
  } catch (error) {
    console.error('Si è verificato un errore:', error);
  }
})();
