/*window.addEventListener('load', function () {
    Particles.init({
        selector: '.background',
        color: ['#DA0463', '#404B69', '#DBEDF3'],
        maxParticles: 100,
        connectParticles: true
        });
});*/

const particles = {
    "fpsLimit": 60,
    "particles": {
      "number": {
        "value": 150,
        "density": {
          "enable": true,
          "value_area": 800
        }
      },
      "color": {
        "value": ['#DA0463', '#404B69', '#DBEDF3'],
        "animation": {
          "enable": true,
          "speed": 20,
          "sync": true
        }
      },
      "shape": {
        "type": "circle",
        "stroke": {
          "width": 0
        },
        "polygon": {
          "nb_sides": 5
        },
      },
      "opacity": {
        "value": 0.5,
        "random": false,
        "anim": {
          "enable": false,
          "speed": 3,
          "opacity_min": 0.1,
          "sync": false
        }
      },
      "size": {
        "value": 3,
        "random": true,
        "anim": {
          "enable": false,
          "speed": 10,
          "size_min": 0.1,
          "sync": false
        }
      },
      "links": {
        "enable": true,
        "distance": 100,
        "color": "#ffffff",
        "opacity": 0.6,
        "width": 4
      },
      "move": {
        "enable": true,
        "speed": 1,
        "direction": "none",
        "random": false,
        "straight": false,
        "out_mode": "out",
        "attract": {
          "enable": false,
          "rotateX": 600,
          "rotateY": 1200
        }
      }
    },
    "interactivity": {
      "detect_on": "canvas",
      "events": {
        "onhover": {
          "enable": false,
          "mode": "repulse"
        },
        "onclick": {
          "enable": true,
          "mode": "push"
        },
        "resize": true
      },
      "modes": {
        "grab": {
          "distance": 400,
          "line_linked": {
            "opacity": 1
          }
        },
        "bubble": {
          "distance": 400,
          "size": 40,
          "duration": 2,
          "opacity": 0.8
        },
        "repulse": {
          "distance": 200
        },
        "push": {
          "particles_nb": 4
        },
        "remove": {
          "particles_nb": 2
        }
      }
    },
    "retina_detect": true,
    "background": {
      "color": "#340C4D",
      "image": "",
      "position": "50% 50%",
      "repeat": "no-repeat",
      "size": "cover"
    }
  };



tsParticles.load('tsparticles', particles);
