const API_KEY = 'AIzaSyBZq3Nwdoj1ldUwYCCB7NassLpnWPiwzsU';

export async function translateText(text, targetLang = 'hr') {
  const response = await fetch(
    `https://translation.googleapis.com/language/translate/v2?key=${API_KEY}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: text,
        target: targetLang,
        format: 'text',
      }),
    }
  );

  const data = await response.json();

  if (data.error) {
    throw new Error(data.error.message);
  }

  return data.data.translations[0].translatedText;
}
