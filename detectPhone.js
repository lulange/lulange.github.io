const desktopChangelog = document.getElementById("desktop-changelog");
const desktopOtherstuff = document.getElementById("desktop-otherstuff");
const header = document.getElementById("main-header");
const altFlex = document.getElementById("alt-flex");

if (window.innerWidth < window.innerHeight) {
  desktopChangelog.style.display = "none";
  desktopOtherstuff.style.display = "none";

  header.style.display = "block";
  header.style.padding = "2%";

  altFlex.style.width = "100%";
  altFlex.style.display = "flex";
} else {
  altFlex.style.display = "none";
}

let footers = document.getElementsByTagName("footer");

if (footers[0] !== undefined) {
  footers[0].style.position = "absolute";
  footers[0].style.right = "0px";
  if (window.innerHeight > document.body.scrollHeight + 80) {
    footers[0].style.top = window.innerHeight - 80 + "px";
  } else {
    footers[0].style.top = document.height - 80 + "px";
  }
}

window.addEventListener("resize", function(e) {
  if (window.innerWidth < window.innerHeight) {
    desktopChangelog.style.display = "none";
    desktopOtherstuff.style.display = "none";

    header.style.display = "block";
    header.style.padding = "2%";

    altFlex.style.width = "100%";
    altFlex.style.display = "flex";
  } else {
    const altFlex = document.getElementById("alt-flex");
    altFlex.style.display = "none";

    desktopChangelog.style.display = "block";
    desktopOtherstuff.style.display = "block";

    header.style.display = "";
    header.style.padding = "";
  }


  if (footers[0] !== undefined) {
    footers[0].style.position = "absolute";
    footers[0].style.right = "0px";
    if (window.innerHeight > document.body.scrollHeight + 80) {
      footers[0].style.top = window.innerHeight - 80 + "px";
    } else {
      footers[0].style.top = document.height - 80 + "px";
    }
  }
});

document.addEventListener("resize" function() {
  if (window.innerWidth < window.innerHeight) {
    desktopChangelog.style.display = "none";
    desktopOtherstuff.style.display = "none";

    header.style.display = "block";
    header.style.padding = "2%";

    altFlex.style.width = "100%";
    altFlex.style.display = "flex";
  } else {
    const altFlex = document.getElementById("alt-flex");
    altFlex.style.display = "none";

    desktopChangelog.style.display = "block";
    desktopOtherstuff.style.display = "block";

    header.style.display = "";
    header.style.padding = "";
  }


  if (footers[0] !== undefined) {
    footers[0].style.position = "absolute";
    footers[0].style.right = "0px";
    if (window.innerHeight > document.body.scrollHeight + 80) {
      footers[0].style.top = window.innerHeight - 80 + "px";
    } else {
      footers[0].style.top = document.height - 80 + "px";
    }
  }
});
