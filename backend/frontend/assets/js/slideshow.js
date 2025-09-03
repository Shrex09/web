const images = [
    { bg: "mod.png", fg: "mod1.jpg" },
    { bg: "epfo.png", fg: "epfo1.jpg" },
    { bg: "kvs.png", fg: "kvs1.jpg" },
    { bg: "png.jpeg", fg: "png1.jpg" },
    { bg: "anna.jpeg", fg: "anna1.png" },
    { bg: "bks.png", fg: "bks1.jpg" },
    { bg: "bom.png", fg: "bom1.png" },
    { bg: "dbp.png", fg: "dbp1.jpg" },
    { bg: "jai.jpg", fg: "jai1.jpg" },
    { bg: "hmm.png", fg: "hmm1.jpg" },
    { bg: "jap.png", fg: "jap1.jpg" },
    { bg: "kub.jpeg", fg: "kub1.jpg" },
    { bg: "mms.png", fg: "mms1.png" },
    { bg: "rda.jpeg", fg: "rda1.png" },
    { bg: "re.png", fg: "re1.png" },
    { bg: "si.png", fg: "si1.png" },
    { bg: "st.png", fg: "st1.png" },
    { bg: "sts.jpg", fg: "sts1.png" },
    { bg: "vish.png", fg: "vish1.png" },

];

const bgBox = document.querySelector('.slideShowBgBox');
const fgImg = document.querySelector('.slideShowFgBox img');
let index = 0;

function updateSlide() {
    fgImg.style.opacity = 0;

    setTimeout(() => {

        bgBox.style.backgroundImage = `url(./assets/ssimgs/bg/${images[index].bg})`;
        fgImg.src = './assets/ssimgs/fg/' + images[index].fg;

        fgImg.style.opacity = 1;

        index = (index + 1) % images.length;
    }, 300);
}
updateSlide(); 
setInterval(updateSlide, 5000);