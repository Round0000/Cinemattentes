const puppeteer = require("puppeteer");

async function scrape(url) {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto(url, { waitUntil: "networkidle2" });

  const response = await page.evaluate(() => {
    const results = document.querySelectorAll(
      'div[class^="ProductListItem__Container"]'
    );

    const movies = [];

    for (let i = 0; i < results.length; i++) {
      const item = results[i];
      if (item.innerText.includes("2021") && item.innerText.includes("Film")) {
        movies.push(item.querySelector("h3").parentElement.href);
      }
    }

    return movies;
  });

  await page.goto(response[0], { waitUntil: "networkidle2" });

  const movieData = await page.evaluate(() => {
    const data = {
      title: document.querySelector("h1").innerText.trim(),
      real: document.querySelector("[itemprop=director]").innerText.trim(),
      img: document.querySelector(".pvi-hero-poster").src,
      genres: document.querySelector("h4").innerText.trim(),
      date: document.querySelector("[datetime]").innerText,
      cast: document.querySelector(".pvi-productDetails-workers").innerText,
      plot: document.querySelector('[data-rel="small-resume"]').innerText
    };

    return data;
  });

  //

  await browser.close();

  console.log("FIRST RESPONSE FROM SCRAP FUNCTION :", movieData);
  return response;
}

const data = scrape(
  "https://www.senscritique.com/search?q=matrix%20resurrections"
).then((res) => {
  console.log("final result", res);
  return res;
});

return data;

// console.log(data.link);

// getGate(data.link);

results.forEach((item) => {
  if (item.innerText.includes("2021") && item.innerText.includes("Film")) {
    console.log(item.querySelector("h3").innerText);
  }
});
