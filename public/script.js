let data;

document
  .querySelector('button[type="submit"]')
  .addEventListener("click", (e) => {
    e.preventDefault();

    // const pageToScrap = document.getElementById("page").value;
    const pageToScrap = "https://www.senscritique.com/search?q=matrix%20resurrections";

    if (!pageToScrap)
      return (document.getElementById("result").textContent =
        "Please enter a page URL");

    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({ pageToScrap: pageToScrap }),
    };

    document.getElementById("result").textContent = "Please wait...";

    fetch("/.netlify/functions/getData", options)
      .then((res) => res.json())
      .then((res) => {
        console.log("res inside script.js ======> ", res);
      })
      .catch((err) => {
        console.log(err);
        document.getElementById(
          "result"
        ).textContent = `Error: ${err.toString()}`;
      });
  });
