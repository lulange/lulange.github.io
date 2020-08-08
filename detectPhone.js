if (window.innerWidth < window.innerHeight) {
  const desktopChangelog = document.getElementById("desktop-changelog");
  const desktopOtherstuff = document.getElementById("desktop-otherstuff");
  desktopChangelog.style.display = "none";
  desktopOtherstuff.style.display = "none";

  const header = document.getElementById("main-header");
  header.style.display = "block";
  header.style.padding = "2%";

  const altFlex = document.getElementById("alt-flex");
  altFlex.style.width = "100%";
  altFlex.style.display = "flex";
} else {
  const altFlex = document.getElementById("alt-flex");
  altFlex.style.display = "none";
}

let footers = document.getElementsByTagName("footer");

if (footers[0] !== undefined) {
  footers[0].style.position = "absolute";
  footers[0].style.right = "0px";
  if (window.innerHeight > document.body.scrollHeight) {
    footers[0].style.top = window.innerHeight - 80 + "px";
  } else {
    footers[0].style.top = document.height - 80 + "px";
  }
}
