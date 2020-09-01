let extraInfo = {};

//Input field and search buttons
const songInput = document.getElementById("songInput");
const searchButton = document.getElementById("searchBtn");
const fancyResult = document.getElementById("fancy-result");
const singleLyrics = document.getElementById("single-lyrics");
const lyricsContainer = document.getElementById("lyrics");
const lyricsTitle = document.querySelector("#single-lyrics h2");

//SearchButton functionality
searchButton.addEventListener("click", function () {
  if (songInput.value) {
    fancyResult.innerHTML = "";
    fetchMusic(songInput.value);
    toggleElement(singleLyrics, fancyResult);
    extraInfo.songInput = songInput.value;
    songInput.value = "";
  } else {
    alert("Please enter a song name.");
  }
});

//Load data by song title
async function loadSongByTitle(title) {
  const res = await fetch(`https://api.lyrics.ovh/suggest/${title}`);
  const data = await res.json();
  return data;
}

//Render data to HTML
function fetchMusic(title) {
  const musics = loadSongByTitle(title);
  musics.then((musics) => {
    const musicList = musics.data;
    for (let i = 0; i < musicList.length; i++) {
      const music = musicList[i];
      const albumName = music.album.title;
      const artistName = music.artist.name;
      const title = music.title;
      extraInfo.cover = music.album.cover;
      extraInfo.songLink = music.link;

      fancyResult.innerHTML += `<div class="single-result row align-items-center my-3 p-3">
                                <div class="col-md-3">
                                    <img src = '${extraInfo.cover}' alt='cover' >
                                </div>
                                <div class="col-md-6">
                                    <h3 class="lyrics-name">${title}</h3>
                                    <p class="author lead">Album by <span>${artistName}</span></p>
                                </div>
                                <div class="col-md-3 text-md-right text-center">
                                    <button onclick="getLyrics('${artistName}','${title}')" class="btn btn-success">Get Lyrics</button>
                                </div>
                                </div>`;
      if (i === 10) {
        break;
      }
    }
  });
}

//Load lyrics
async function loadLyrics(artistName, title) {
  const res = await fetch(`https://api.lyrics.ovh/v1/${artistName}/${title}`);
  const data = await res.json();
  return data;
}

//getLyrics by artistName and title
function getLyrics(artistName, title) {
  toggleElement(fancyResult, singleLyrics);
  const lyrics = loadLyrics(artistName, title);
  let albumCover = document.getElementById("albumCover");

  lyrics.then((lyric) => {
    if (lyric.lyrics) {
      lyricsContainer.innerHTML = lyric.lyrics;
      albumCover.src = extraInfo.cover;
    } else {
      lyricsContainer.innerHTML = "Sorry! Lyrics not available.";
      albumCover.src = "";
    }
    const goToButton = document.querySelector(".btn.go-back");
    goToButton.onclick = function () {
      fancyResult.innerHTML = "";
      fetchMusic(extraInfo.songInput);
      toggleElement(singleLyrics, fancyResult);
    };

    lyricsTitle.innerHTML = title + " - " + artistName;
  });
}

//change Element display state
function toggleElement(hideElement, displayElement) {
  hideElement.style.display = "none";
  displayElement.style.display = "block";
}