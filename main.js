// document.querySelector('a-scene').setAttribute('hello-world', '');

AFRAME.registerComponent('hello-world', {
    init: function () {
      console.log('Hello, World!');
    }
});

AFRAME.registerComponent('set-stars', {
    init: function() {
        var coordenadas = [
        {
            constelacao: { x: 0, y: 12, z: -13 },
            estrela1: { x: 18.05943, y: 1.6, z: -4.37369 },
            estrela2: { x: 21.0724, y: 8.4112, z: 3.70871 },
            estrela3: { x: 10.48846, y: 16.60277, z: -0.8941 },
            estrela4: { x: 2.07132, y: 13.71825, z: -9.23096 },
            estrela5: { x: -8.18114, y: 19.48466, z: -3.88721 }
        }
        ];
        var coordenadaAtiva = coordenadas[Math.floor(Math.random() * coordenadas.length)];
        console.log(coordenadaAtiva);

        // Seta as coordenadas Constelação e estrelas
        this.el.object3D.position.set(coordenadaAtiva.constelacao.x, coordenadaAtiva.constelacao.y, coordenadaAtiva.constelacao.z);
        this.estrelas = this.el.querySelectorAll('.clickable');
        
        // Usando arrow function para preservar o contexto de `this`
        for (let i = 0; i < this.estrelas.length; i++) {
            this.estrelas[i].object3D.position.set(coordenadaAtiva['estrela' + (i + 1)].x, coordenadaAtiva['estrela' + (i + 1)].y, coordenadaAtiva['estrela' + (i + 1)].z);

            this.estrelas[i].setAttribute('look-at', '#camera-target');
            this.estrelas[i].addEventListener('mouseenter', (e) => this.colidiuStar(e));
        }

        this.targetStar = 0;
        this.activeStar(this.targetStar);
    },

    activeStar: function (numStar) {
        this.targetStar = numStar;
        this.estrelas[numStar].setAttribute('opacity', 1);
    },

    colidiuStar: function (e) {
        console.log(e.target.id);
        console.log(this.estrelas[this.targetStar].id);  // Agora `this.estrelas` não será mais `undefined`
        if(e.target.id == this.estrelas[this.targetStar].id && this.targetStar < 4) {
            this.targetStar++;
            this.activeStar(this.targetStar);
        }
    }
});


// AFRAME.registerComponent('set-stars', {
//     init: function() {
//         var coordenadas = [
//         {
//             constelacao: { x: 0, y: 12, z: -13 },
//             estrela1: { x: 18.05943, y: 1.6, z: -4.37369 },
//             estrela2: { x: 21.0724, y: 8.4112, z: 3.70871 },
//             estrela3: { x: 10.48846, y: 16.60277, z: -0.8941 },
//             estrela4: { x: 2.07132, y: 13.71825, z: -9.23096 },
//             estrela5: { x: -8.18114, y: 19.48466, z: -3.88721 }
//         }
//         ];
//         var coordenadaAtiva = coordenadas[Math.floor(Math.random()*coordenadas.length)];
//         console.log(coordenadaAtiva);

//         // Seta as coordenadas Constelaçao e estrelas
//         this.el.object3D.position.set(coordenadaAtiva.constelacao.x, coordenadaAtiva.constelacao.y, coordenadaAtiva.constelacao.z);
//         this.estrelas = this.el.querySelectorAll('.clickable');
//         for(let i = 0; i < this.estrelas.length; i++) {
//             this.estrelas[i].object3D.position.set(coordenadaAtiva['estrela' + (i+1)].x, coordenadaAtiva['estrela' + (i+1)].y, coordenadaAtiva['estrela' + (i+1)].z);

//             this.estrelas[i].setAttribute('look-at', '#camera-target');
//             this.estrelas[i].addEventListener('mouseenter', this.colidiuStar, this);

//         }

//         this.targetStar = 0;
//         // console.log(this.estrelas[this.targetStar].id)
//         this.activeStar(this.targetStar);
//         // estrelas[targetStar].setAttribute('opacity', 1);

//         // estrelas[targetStar].addEventListener('mouseenter', function (e) {
//         //   targetStar++;
//         //   console.log(targetStar);
//         //   estrelas[targetStar].setAttribute('opacity', 1);
//         // });
//     },
//     activeStar: function (numStar) {
//         this.targetStar = numStar;
//         this.estrelas[numStar].setAttribute('opacity', 1);
//     },
//     colidiuStar: function (e) {
//         console.log(e.target.id);
//         console.log(this.estrelas);
//         // if(e.target.id == this.estrelas[this.targetStar].id && this.targetStar < 4) {
//         //     this.targetStar++;
//         //     // this.targetStar++;
//         //     this.activeStar(this.targetStar);
//         //     alert(this.targetStar);

//         // }
    
//         // if(e == this.entity.children[this.targetStar].name) {
//         //     alert('Fim do jogo');
//         // }
//     }
// });

AFRAME.registerComponent('scale-on-mouseenter', {
// schema: {
//   to: {default: '2.5 2.5 2.5', type: 'vec3'}
// },

    init: function () {
        var data = this.data;

        var el = this.el;
        this.el.addEventListener('mouseenter', function (e) {
        console.log(e.target)
        el.object3D.scale.set(1.3, 1.3, 1.3);
        });
        this.el.addEventListener('mouseleave', function () {
        el.object3D.scale.set(1, 1, 1);
        });
    }
});