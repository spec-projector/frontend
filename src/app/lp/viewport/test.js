var viewport;

var reload = function () {
  if (!!viewport) {
    viewport.parentNode.removeChild(viewport);
  }

  viewport = document.createElement('meta');
  viewport.setAttribute('name', 'viewport');
  var width = window.screen.availWidth < 660 ? (window.screen.availWidth > 550 ? 'width=700' : 'width=420') : 'width=1180';
  var content = [width];
  if (/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream) {
    content.push('maximum-scale=1.0');
    content.push('user-scalable=0');
  }
  viewport.setAttribute('content', content.join(', '));
  document.head.appendChild(viewport);
};

reload();
window.addEventListener('resize', function () {
  reload();
});
