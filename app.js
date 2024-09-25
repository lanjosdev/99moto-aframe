AFRAME.registerComponent('init-permissions', {
    schema: {
        // Onde vai os atributos, se necessario
    },

    init: function() {
        // Editar modal de solicitação de permissões:
        // device-orientation-permission-ui="denyButtonText: Rejeitar; allowButtonText: Aceitar; deviceMotionMessage: Texto aqui"
        this.el.setAttribute('device-orientation-permission-ui', "allowButtonText: Entendi; deviceMotionMessage: Para seguir com a experiência é necessário conceder a permissões de movimentação e câmera do celular.");

        // this.el.addEventListener('deviceorientationpermissionrequested', ()=> alert('Para seguir com a experiência é necessario autorizar acesso ao movimento e câmera do celular.'));
        // this.el.addEventListener('deviceorientationpermissiongranted', ()=> alert('Status: As permissões foram concedidas!'));
        this.el.addEventListener('deviceorientationpermissionrejected', ()=> alert('Status: Permissão de movimento foi negada!'));

        // Para iOS 13+:
        this.el.addEventListener('deviceorientationpermissiongranted', this.initCamera);

        // Para dispositivos que não solicita permissão de deviceorientation:
        if(!(window.DeviceOrientationEvent && window.DeviceOrientationEvent.requestPermission)) {
            this.initCamera();
        }
    },
    
    initCamera: function() {
        const videoRef = document.getElementById('videoRef');
        const videoConstraints = {
            width: { min: 1440, ideal: 1920, max: 1920 },
            height: { min: 960, ideal: 1080, max: 1080 },
            aspectRatio: 16 / 9,
            facingMode: "environment"
        };
        
        // Verifica se o navegador suporta getUserMedia
        if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ video: videoConstraints })
                .then(stream => {
                    videoRef.srcObject = stream;
                    videoRef.play();
                })
                .catch(error => {
                    console.error('Erro ao acessar a câmera: ', error);
                });
        } 
        else {
            console.error('getUserMedia não é suportado no navegador.');
        }
    }
});


AFRAME.registerComponent('set-stars', {
    schema: {
        // Onde vai os atributos, se necessario
    },

    init: function() {
        this.miraMoto = document.getElementById('mira-moto');
        this.setaMoto = document.getElementById('seta-moto');
        this.camera = document.getElementById('camera-target');
        var coordenadas = [
            {
                estrela1: { x: 51.86, y: 39.85, z: -18.18 },
                estrela2: { x: 24.070, y: 34.85, z: 11.36 },
                estrela3: { x: 10.48, y: 40.51, z: -8.327 },
                estrela4: { x: -12.27, y: 42.94, z: -15.55 },
                estrela5: { x: -24.17, y: 42.70, z: 7.30 }
            }
        ];
        // Escolher uma coordenada ativa aleatória
        var coordenadaAtiva = coordenadas[Math.floor(Math.random() * coordenadas.length)];
        console.log(coordenadaAtiva);

        // Seta as posições da Constelação e estrelas
        // this.el.object3D.position.set(coordenadaAtiva.constelacao.x, coordenadaAtiva.constelacao.y, coordenadaAtiva.constelacao.z);
        
        // Loop pela array this.estrelas
        this.estrelas = this.el.querySelectorAll('.clickable');
        for (let i = 0; i < this.estrelas.length; i++) {
            this.estrelas[i].object3D.position.set(coordenadaAtiva['estrela' + (i + 1)].x, coordenadaAtiva['estrela' + (i + 1)].y, coordenadaAtiva['estrela' + (i + 1)].z);

            this.estrelas[i].setAttribute('look-at', '#camera-target');
            this.estrelas[i].addEventListener('mouseenter', (e) => this.collisionStar(e));
        }

        // Seta a estrela alvo do momento
        this.targetStar = 0;
        this.activeStar(this.targetStar);
    },

    tick: function (time, timeDelta) {
        // Controla seta guia estrelar
        // let local = this.estrelas[this.targetStar].object3D.getWorldPosition();
        let local = this.estrelas[this.targetStar].object3D.position.clone();
        // console.log(local);
        this.camera.object3D.worldToLocal(local);

        let angleDeg = Math.atan2(-local.y - 0, local.x - 0) * 180 / Math.PI + 180;
        angleDeg -= 90;
        
        this.setaMoto.style.transform = `translate(-50%, -50%) rotate(${angleDeg}deg)`;
    },

    activeStar: function (numStar) {
        this.targetStar = numStar;
        this.estrelas[numStar].setAttribute('opacity', 1);
        this.estrelas[numStar].setAttribute('animation', 'property: scale; to: 2 2 1; dir: alternate; dur: 1000; easing: easeInOutQuad; loop: true');
    },

    collisionStar: function (e) {
        console.log(e.target.id);
        console.log(this.estrelas[this.targetStar].id);

        if(e.target.id == this.estrelas[this.targetStar].id && this.targetStar < 4) {
            this.miraMoto.classList.add("animate-brilho");
            this.estrelas[this.targetStar].removeAttribute('animation');
            this.targetStar++;
            this.activeStar(this.targetStar);
            setTimeout(()=> this.miraMoto.classList.remove("animate-brilho"), 800);
        }
        if(e.target.id == 'star5' && this.estrelas[this.targetStar].id == 'star5') {
            alert('fim de jogo');
        }
    }
});


// AFRAME.registerComponent('look-at-target', {
//     schema: {
//       target: { type: 'selector' }
//     },
  
//     tick: function () {
//       // Obtém a posição da câmera e do alvo
//       var cameraPos = this.el.object3D.getWorldPosition();
//       var targetPos = this.data.target.object3D.getWorldPosition();
  
//       // Calcula a direção da seta
//       var direction = new THREE.Vector3();
//       direction.subVectors(targetPos, cameraPos).normalize();
  
//       // Define a rotação da seta para apontar na direção calculada
//       this.el.object3D.lookAt(targetPos);
//     }
//   });


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