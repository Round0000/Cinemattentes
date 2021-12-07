const chromium = require("chrome-aws-lambda");

exports.handler = async (event, context) => {
  const pageToScrap = JSON.parse(event.body).pageToScrap;

  if (!pageToScrap)
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Page URL not defined" }),
    };

  const browser = await chromium.puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath,
    headless: chromium.headless,
  });

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
      plot: document.querySelector('[data-rel="small-resume"]').innerText,
    };

    return data;
  });

  //

  await browser.close();

  console.log("FIRST RESPONSE FROM SCRAP FUNCTION :", movieData);

  console.log(movieData);
  return {
    statusCode: 200,
    body: JSON.stringify(movieData),
  };
};
