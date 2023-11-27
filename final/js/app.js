//HeaderMouseAware
document.addEventListener("DOMContentLoaded",function() {
    var container = document.getElementById("ex1"),
        inner = document.getElementById("inner");

    var mouse = {
      _x: 0,
      _y: 0,
      x: 0,
      y: 0,
      updatePosition: function(event) {
        var e = event || window.event;
        this.x = e.clientX - this._x;
        this.y = (e.clientY - this._y) * -1;
      },
      setOrigin: function(e) {
        this._x = e.offsetLeft + Math.floor(e.offsetWidth / 2);
        this._y = e.offsetTop + Math.floor(e.offsetHeight / 2);
      },
      show: function() {
        return "(" + this.x + ", " + this.y + ")";
      }
    };
    mouse.setOrigin(container);
  
    //----------------------------------------------------
  
    var counter = 0;
    var refreshRate = 10;
    var isTimeToUpdate = function() {
      return counter++ % refreshRate === 0;
    };
  
    //----------------------------------------------------
  
    var onMouseEnterHandler = function(event) {
      update(event);
    };
  
    var onMouseLeaveHandler = function() {
      inner.style = "";
    };
  
    var onMouseMoveHandler = function(event) {
      if (isTimeToUpdate()) {
        update(event);
      }
    };
  
    //----------------------------------------------------
  
    var update = function(event) {
      mouse.updatePosition(event);
      updateTransformStyle(
        (mouse.y / inner.offsetHeight / 2).toFixed(2),
        (mouse.x / inner.offsetWidth / 2).toFixed(2)
      );
    };
  
    var updateTransformStyle = function(x, y) {
      var style = "rotateX(" + x + "deg) rotateY(" + y + "deg)";
      inner.style.transform = style;
      inner.style.mozTranform = style;
      inner.style.msTransform = style;
      inner.style.oTransform = style;
    };
  
    //--------------------------------------------------------
  
    container.onmousemove = onMouseMoveHandler;
    container.onmouseleave = onMouseLeaveHandler;
    container.onmouseenter = onMouseEnterHandler;
  });

//ScrollZoom
let img = document.querySelector(".bckg");

function changeWidth() {
  var scrollVal = window.pageYOffset;
  var scrollSlow = scrollVal / 8;

  img.style.scale = Math.min(Math.max(scrollSlow, 80), 100) + "%";
}

window.addEventListener(
  "scroll",
  function () {
    requestAnimationFrame(changeWidth);
  },
  false
);

//HoverMarquee
$(".slider").on('mouseenter mouseleave', function(event) {
  var direction = getDirection(this, event);
  animateOverlay(this, direction, event.type === 'mouseenter');
});

function animate(element, values, duration) {
  element.style.transitionDuration = duration + 'ms';
  for (var property in values) {
  	element.style[property] = values[property] + 'px';
  }
}

function animateOverlay(parent, slideDirection, isHover) {
	var overlay = parent.querySelector('.overlay');
	var top = 0, left = 0;
  if (slideDirection === 0) top = -parent.offsetHeight;
  if (slideDirection === 2) top = parent.offsetHeight;
  isHover ? showAnimation(overlay, top, left) : hideAnimation(overlay, top, left);
}

function showAnimation(overlay, top, left) {
  animate(overlay, {
    top: top,
    left: left
  }, 0);
  animate(overlay, {
    left: 0,
    top: 0
  }, 400);
}

function hideAnimation(overlay, top, left) {
  animate(overlay, {
    left: left,
    top: top
  }, 300);
}



// 0:top 2:bottom
function getDirection(element, event) {
  let bg2 = document.querySelector('.bg2');
  let body = document.querySelector('body');
  let bg2Position =  Math.abs(body.getBoundingClientRect().top - bg2.getBoundingClientRect().top);
  var x = event.pageX - element.offsetLeft;
  var y = Math.abs(element.offsetTop - event.pageY) - bg2Position;
  console.log(y, element.offsetHeight / 2);
  return (y < element.offsetHeight / 2) ? (0) : (2);
}

//GalleryBox
const images = document.getElementsByClassName("image");

let globalIndex = 0,
    last = { x: 0, y: 0 };

const activate = (image, x, y) => {
  image.style.left = `${x}px`;
  image.style.top = `${y}px`;
  image.style.zIndex = globalIndex;

  
  image.dataset.status = "active";

  last = { x, y };
}

const distanceFromLast = (x, y) => {
  return Math.hypot(x - last.x, y - last.y);
}

const handleOnMove = e => {
  let bg2 = document.querySelector('.gallery_board');
  let body = document.querySelector('body');
  let bg2Position =  Math.abs(body.getBoundingClientRect().top - bg2.getBoundingClientRect().top);
  console.log(e.pageY, bg2Position);
  if(e.pageY > bg2Position){
    if(distanceFromLast(e.clientX, e.clientY) > (window.innerWidth / 20)) {
      const lead = images[globalIndex % images.length],
            tail = images[(globalIndex - 5) % images.length];
      activate(lead, e.clientX, e.clientY);

      if(tail) tail.dataset.status = "inactive";

      globalIndex++;
    }}
}

window.onmousemove = e => handleOnMove(e);

window.ontouchmove = e => handleOnMove(e.touches[0]); 


window.onbeforeunload = function () {
  window.scrollTo(0, 0);
}