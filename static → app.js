// ============================================================
// PULSE MUSIC STUDIO
// COMPLETE MUSIC PLAYER + DASHBOARD
// ============================================================


// ============================================================
// SONGS FROM FLASK
// ============================================================

const songs = { songstojson};


// ============================================================
// DOM
// ============================================================

const audio = document.getElementById("audio");

const playButton =
    document.getElementById("playButton");

const quickPlay =
    document.getElementById("quickPlay");

const previousButton =
    document.getElementById("previousButton");

const nextButton =
    document.getElementById("nextButton");

const shuffleButton =
    document.getElementById("shuffleButton");

const repeatButton =
    document.getElementById("repeatButton");

const volume =
    document.getElementById("volume");

const progressTrack =
    document.getElementById("progressTrack");

const progressFill =
    document.getElementById("progressFill");

const currentTime =
    document.getElementById("currentTime");

const duration =
    document.getElementById("duration");

const playerTitle =
    document.getElementById("playerTitle");

const playerArtist =
    document.getElementById("playerArtist");

const playerCover =
    document.getElementById("playerCover");

const favoriteButton =
    document.getElementById("favoriteButton");

const searchInput =
    document.getElementById("searchInput");

const recentList =
    document.getElementById("recentList");


// ============================================================
// STATE
// ============================================================

let currentSong = 0;

let isPlaying = false;

let shuffle = false;

let repeat = false;

let favorite = false;

let recentSongs = [];

let totalPlays = 1248;


// ============================================================
// CHECK MUSIC
// ============================================================

if (songs.length === 0) {

    console.warn(
        "No music files found."
    );

}


// ============================================================
// VOLUME
// ============================================================

audio.volume = 0.8;


// ============================================================
// LOAD SONG
// ============================================================

function loadSong(index) {

    if (songs.length === 0) {
        return;
    }


    if (index < 0) {
        index = songs.length - 1;
    }


    if (index >= songs.length) {
        index = 0;
    }


    currentSong = index;


    const song =
        songs[currentSong];


    audio.src =
        song.url;


    playerTitle.textContent =
        song.name;


    playerArtist.textContent =
        "Pulse Artist";


    playerCover.className =
        `player-cover cover-${(index % 5) + 1}`;


    playerCover.textContent =
        "♪";


    currentTime.textContent =
        "0:00";


    duration.textContent =
        "0:00";


    progressFill.style.width =
        "0%";


    updateSongCards();

}


// ============================================================
// PLAY
// ============================================================

function playSong() {

    if (songs.length === 0) {

        alert(
            "Music folder mein MP3 file add karo."
        );

        return;
    }


    audio.play()
        .then(() => {

            isPlaying = true;

            totalPlays++;

            updatePlayerButton();

            addRecentSong(currentSong);

            updatePlayCount();

        })
        .catch(error => {

            console.error(
                "Playback error:",
                error
            );

        });

}


// ============================================================
// PAUSE
// ============================================================

function pauseSong() {

    audio.pause();

    isPlaying = false;

    updatePlayerButton();

}


// ============================================================
// TOGGLE
// ============================================================

function togglePlay() {

    if (isPlaying) {

        pauseSong();

    } else {

        playSong();

    }

}


// ============================================================
// PLAYER BUTTON
// ============================================================

function updatePlayerButton() {

    playButton.textContent =
        isPlaying
            ? "❚❚"
            : "▶";

}


// ============================================================
// NEXT
// ============================================================

function nextSong() {

    if (songs.length === 0) {
        return;
    }


    let nextIndex;


    if (shuffle) {

        nextIndex =
            Math.floor(
                Math.random() *
                songs.length
            );


        while (
            nextIndex === currentSong &&
            songs.length > 1
        ) {

            nextIndex =
                Math.floor(
                    Math.random() *
                    songs.length
                );

        }

    } else {

        nextIndex =
            currentSong + 1;


        if (
            nextIndex >=
            songs.length
        ) {

            nextIndex = 0;

        }

    }


    loadSong(nextIndex);

    playSong();

}


// ============================================================
// PREVIOUS
// ============================================================

function previousSong() {

    if (songs.length === 0) {
        return;
    }


    if (audio.currentTime > 3) {

        audio.currentTime = 0;

        return;

    }


    let previousIndex =
        currentSong - 1;


    if (previousIndex < 0) {

        previousIndex =
            songs.length - 1;

    }


    loadSong(previousIndex);

    playSong();

}


// ============================================================
// CONTROLS
// ============================================================

playButton.addEventListener(
    "click",
    togglePlay
);


quickPlay.addEventListener(
    "click",
    togglePlay
);


previousButton.addEventListener(
    "click",
    previousSong
);


nextButton.addEventListener(
    "click",
    nextSong
);


// ============================================================
// SHUFFLE
// ============================================================

shuffleButton.addEventListener(
    "click",
    () => {

        shuffle =
            !shuffle;


        shuffleButton.classList.toggle(
            "active",
            shuffle
        );

    }
);


// ============================================================
// REPEAT
// ============================================================

repeatButton.addEventListener(
    "click",
    () => {

        repeat =
            !repeat;


        repeatButton.classList.toggle(
            "active",
            repeat
        );

    }
);


// ============================================================
// FAVORITE
// ============================================================

favoriteButton.addEventListener(
    "click",
    () => {

        favorite =
            !favorite;


        favoriteButton.textContent =
            favorite
                ? "♥"
                : "♡";


        favoriteButton.classList.toggle(
            "active",
            favorite
        );


        const counter =
            document.getElementById(
                "favoriteCount"
            );


        if (counter) {

            counter.textContent =
                favorite
                    ? "37"
                    : "36";

        }

    }
);


// ============================================================
// VOLUME
// ============================================================

volume.addEventListener(
    "input",
    () => {

        audio.volume =
            Number(
                volume.value
            );

    }
);


// ============================================================
// TIME UPDATE
// ============================================================

audio.addEventListener(
    "timeupdate",
    () => {

        if (!audio.duration) {
            return;
        }


        const percentage =
            (
                audio.currentTime /
                audio.duration
            ) * 100;


        progressFill.style.width =
            `${percentage}%`;


        currentTime.textContent =
            formatTime(
                audio.currentTime
            );

    }
);


// ============================================================
// METADATA
// ============================================================

audio.addEventListener(
    "loadedmetadata",
    () => {

        duration.textContent =
            formatTime(
                audio.duration
            );

    }
);


// ============================================================
// ENDED
// ============================================================

audio.addEventListener(
    "ended",
    () => {

        isPlaying = false;


        if (repeat) {

            audio.currentTime = 0;

            playSong();

        } else {

            nextSong();

        }

    }
);


// ============================================================
// FORMAT TIME
// ============================================================

function formatTime(seconds) {

    if (
        isNaN(seconds) ||
        !isFinite(seconds)
    ) {

        return "0:00";

    }


    const minutes =
        Math.floor(
            seconds / 60
        );


    const secondsLeft =
        Math.floor(
            seconds % 60
        );


    return (
        minutes +
        ":" +
        String(secondsLeft)
            .padStart(2, "0")
    );

}


// ============================================================
// PROGRESS SEEK
// ============================================================

progressTrack.addEventListener(
    "click",
    event => {

        if (!audio.duration) {
            return;
        }


        const rect =
            progressTrack.getBoundingClientRect();


        const position =
            event.clientX -
            rect.left;


        const percentage =
            position /
            rect.width;


        audio.currentTime =
            percentage *
            audio.duration;

    }
);


// ============================================================
// RECENT SONGS
// ============================================================

function addRecentSong(index) {

    recentSongs =
        recentSongs.filter(
            item =>
                item !== index
        );


    recentSongs.unshift(
        index
    );


    recentSongs =
        recentSongs.slice(
            0,
            4
        );


    renderRecentSongs();

}


// ============================================================
// RENDER RECENT
// ============================================================

function renderRecentSongs() {

    recentList.innerHTML = "";


    if (songs.length === 0) {

        recentList.innerHTML =
            `
            <div class="empty-state">
                No songs available.
            </div>
            `;

        return;
    }


    let list =
        recentSongs.length
            ? recentSongs
            : songs
                .slice(
                    0,
                    4
                )
                .map(
                    (_, index) =>
                        index
                );


    list.forEach(
        index => {

            const song =
                songs[index];


            if (!song) {
                return;
            }


            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "recent-item";


            item.innerHTML =
                `
                <div class="recent-cover cover-${(index % 5) + 1}">
                    ♪
                </div>

                <div class="recent-info">

                    <strong>
                        ${escapeHTML(song.name)}
                    </strong>

                    <span>
                        Pulse Artist
                    </span>

                </div>
                `;


            item.addEventListener(
                "click",
                () => {

                    loadSong(index);

                    playSong();

                }
            );


            recentList.appendChild(
                item
            );

        }
    );

}


// ============================================================
// ESCAPE HTML
// ============================================================

function escapeHTML(text) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        text;


    return div.innerHTML;

}


// ============================================================
// SONG CARDS
// ============================================================

function updateSongCards() {

    document
        .querySelectorAll(
            ".top-song"
        )
        .forEach(
            card => {

                const index =
                    Number(
                        card.dataset.song
                    );


                card.style.opacity =
                    index === currentSong
                        ? "1"
                        : "0.8";

            }
        );

}


// ============================================================
// TOP SONG CLICK
// ============================================================

document
    .querySelectorAll(
        ".top-song"
    )
    .forEach(
        card => {

            card.addEventListener(
                "click",
                () => {

                    const index =
                        Number(
                            card.dataset.song
                        );


                    if (
                        songs[index]
                    ) {

                        loadSong(
                            index
                        );

                        playSong();

                    }

                }
            );

        }
    );


// ============================================================
// LIBRARY
// ============================================================

document
    .querySelectorAll(
        ".library-card"
    )
    .forEach(
        card => {

            card.addEventListener(
                "click",
                () => {

                    const index =
                        Number(
                            card.dataset.song
                        );


                    if (
                        songs[index]
                    ) {

                        loadSong(
                            index
                        );

                        playSong();

                    }

                }
            );

        }
    );


// ============================================================
// DISCOVER
// ============================================================

document
    .querySelectorAll(
        "[data-song]"
    )
    .forEach(
        element => {

            if (
                element.classList.contains(
                    "top-song"
                ) ||
                element.classList.contains(
                    "library-card"
                )
            ) {
                return;
            }


            element.addEventListener(
                "click",
                event => {

                    event.stopPropagation();


                    const index =
                        Number(
                            element.dataset.song
                        );


                    if (
                        songs[index]
                    ) {

                        loadSong(
                            index
                        );

                        playSong();

                    }

                }
            );

        }
    );


// ============================================================
// SEARCH
// ============================================================

searchInput.addEventListener(
    "input",
    () => {

        const query =
            searchInput.value
                .toLowerCase()
                .trim();


        document
            .querySelectorAll(
                ".library-card"
            )
            .forEach(
                card => {

                    const title =
                        card.dataset.title
                            || "";


                    card.style.display =
                        !query ||
                        title.includes(
                            query
                        )
                            ? ""
                            : "none";

                }
            );


        if (!query) {
            return;
        }


        const match =
            songs.find(
                song =>
                    song.name
                        .toLowerCase()
                        .includes(
                            query
                        )
            );


        if (match) {

            const index =
                songs.indexOf(
                    match
                );


            loadSong(index);

        }

    }
);


// ============================================================
// NAVIGATION
// ============================================================

const menuItems =
    document.querySelectorAll(
        ".menu-item"
    );


const pages =
    document.querySelectorAll(
        ".page"
    );


function openPage(pageName) {

    menuItems.forEach(
        item => {

            item.classList.toggle(
                "active",
                item.dataset.page ===
                pageName
            );

        }
    );


    pages.forEach(
        page => {

            page.classList.remove(
                "active-page"
            );

        }
    );


    const target =
        document.getElementById(
            `${pageName}Page`
        );


    if (target) {

        target.classList.add(
            "active-page"
        );

    }

}


menuItems.forEach(
    item => {

        item.addEventListener(
            "click",
            () => {

                openPage(
                    item.dataset.page
                );

            }
        );

    }
);


// ============================================================
// VIEW ALL
// ============================================================

document
    .querySelectorAll(
        "[data-page-button]"
    )
    .forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    openPage(
                        button.dataset.pageButton
                    );

                }
            );

        }
    );


// ============================================================
// UPLOAD
// ============================================================

const uploadButton =
    document.getElementById(
        "uploadButton"
    );


const uploadLibraryButton =
    document.getElementById(
        "uploadLibraryButton"
    );


const musicFiles =
    document.getElementById(
        "musicFiles"
    );


if (uploadButton) {

    uploadButton.addEventListener(
        "click",
        () => {

            musicFiles.click();

        }
    );

}


if (uploadLibraryButton) {

    uploadLibraryButton.addEventListener(
        "click",
        () => {

            musicFiles.click();

        }
    );

}


musicFiles.addEventListener(
    "change",
    () => {

        if (
            musicFiles.files.length
        ) {

            document
                .getElementById(
                    "uploadForm"
                )
                .submit();

        }

    }
);


// ============================================================
// LISTENING CHART
// ============================================================

let listeningChart;


function createListeningChart() {

    const canvas =
        document.getElementById(
            "listeningChart"
        );


    if (!canvas) {
        return;
    }


    const context =
        canvas.getContext(
            "2d"
        );


    listeningChart =
        new Chart(
            context,
            {
                type: "line",

                data: {

                    labels: [
                        "Mon",
                        "Tue",
                        "Wed",
                        "Thu",
                        "Fri",
                        "Sat",
                        "Sun"
                    ],

                    datasets: [

                        {
                            label:
                                "Listening Hours",

                            data: [
                                2.5,
                                4.1,
                                3.2,
                                5.4,
                                4.8,
                                7.1,
                                6.3
                            ],

                            borderColor:
                                "#a7ff19",

                            backgroundColor:
                                "rgba(167,255,25,.08)",

                            fill: true,

                            tension: .4,

                            pointRadius: 4,

                            pointBackgroundColor:
                                "#a7ff19",

                            pointBorderColor:
                                "#11151a",

                            pointBorderWidth:
                                2

                        }

                    ]

                },

                options: {

                    responsive: true,

                    maintainAspectRatio: false,

                    plugins: {

                        legend: {
                            display: false
                        }

                    },

                    scales: {

                        y: {

                            beginAtZero: true,

                            grid: {
                                color:
                                    "rgba(255,255,255,.06)"
                            },

                            ticks: {
                                color:
                                    "#69727d",

                                font: {
                                    size: 9
                                }
                            }

                        },

                        x: {

                            grid: {
                                display: false
                            },

                            ticks: {
                                color:
                                    "#69727d",

                                font: {
                                    size: 9
                                }
                            }

                        }

                    }

                }

            }
        );

}


// ============================================================
// ANALYTICS CHART
// ============================================================

function createAnalyticsChart() {

    const canvas =
        document.getElementById(
            "analyticsChart"
        );


    if (!canvas) {
        return;
    }


    const context =
        canvas.getContext(
            "2d"
        );


    new Chart(
        context,
        {
            type: "bar",

            data: {

                labels: [
                    "May",
                    "Jun",
                    "Jul",
                    "Aug",
                    "Sep",
                    "Oct"
                ],

                datasets: [

                    {
                        label:
                            "Listening Hours",

                        data: [
                            22,
                            31,
                            28,
                            41,
                            38,
                            49
                        ],

                        backgroundColor:
                            "#a7ff19",

                        borderRadius: 7

                    }

                ]

            },

            options: {

                responsive: true,

                maintainAspectRatio: false,

                plugins: {

                    legend: {
                        display: false
                    }

                },

                scales: {

                    y: {

                        beginAtZero: true,

                        grid: {
                            color:
                                "rgba(255,255,255,.06)"
                        },

                        ticks: {
                            color:
                                "#69727d"
                        }

                    },

                    x: {

                        grid: {
                            display: false
                        },

                        ticks: {
                            color:
                                "#69727d"
                        }

                    }

                }

            }

        }
    );

}


// ============================================================
// CHART PERIOD
// ============================================================

const chartPeriod =
    document.getElementById(
        "chartPeriod"
    );


if (chartPeriod) {

    chartPeriod.addEventListener(
        "change",
        () => {

            if (!listeningChart) {
                return;
            }


            if (
                chartPeriod.value ===
                "month"
            ) {

                listeningChart.data.labels = [
                    "Week 1",
                    "Week 2",
                    "Week 3",
                    "Week 4"
                ];


                listeningChart.data.datasets[0].data = [
                    18,
                    24,
                    31,
                    42
                ];

            } else {

                listeningChart.data.labels = [
                    "Mon",
                    "Tue",
                    "Wed",
                    "Thu",
                    "Fri",
                    "Sat",
                    "Sun"
                ];


                listeningChart.data.datasets[0].data = [
                    2.5,
                    4.1,
                    3.2,
                    5.4,
                    4.8,
                    7.1,
                    6.3
                ];

            }


            listeningChart.update();

        }
    );

}


// ============================================================
// PLAY COUNT
// ============================================================

function updatePlayCount() {

    const element =
        document.getElementById(
            "playsCount"
        );


    if (element) {

        element.textContent =
            totalPlays
                .toLocaleString();

    }

}


// ============================================================
// KEYBOARD
// ============================================================

document.addEventListener(
    "keydown",
    event => {

        if (
            event.code === "Space" &&
            event.target.tagName !== "INPUT" &&
            event.target.tagName !== "TEXTAREA"
        ) {

            event.preventDefault();

            togglePlay();

        }


        if (
            event.code === "ArrowRight"
        ) {

            nextSong();

        }


        if (
            event.code === "ArrowLeft"
        ) {

            previousSong();

        }

    }
);


// ============================================================
// INITIALIZE
// ============================================================

renderRecentSongs();

createListeningChart();

createAnalyticsChart();


if (songs.length > 0) {

    loadSong(0);

}


console.log(
    "Pulse Music Studio loaded successfully."
);
// =====================================================
// REAL MP3 PLAYER
// =====================================================

const audioPlayer =
    document.getElementById("audioPlayer");


// Play uploaded song
function playUploadedSong(songUrl, songTitle) {

    audioPlayer.src = songUrl;

    audioPlayer.play();

    const currentTitle =
        document.getElementById("currentTitle");

    const currentArtist =
        document.getElementById("currentArtist");

    if (currentTitle) {
        currentTitle.textContent = songTitle;
    }

    if (currentArtist) {
        currentArtist.textContent = "Uploaded Song";
    }
}


// Stop old simulated player when real audio starts
audioPlayer.addEventListener(
    "play",
    function () {

        console.log(
            "Playing:",
            audioPlayer.src
        );

    }
);