//Initialize audio context, multiplatform.
			var audioContext = window.AudioContext || window.webkitAudioContext;
			var aCtx = new audioContext();
			//Initialize canvas context.
			var canvas = document.getElementById("synth_container");
			var vCtx = canvas.getContext('2d');
			//Globals:
			var octaveOffset = 1;

			var oscillators = {}, fxs = [];

			var analyser = aCtx.createAnalyser();
			analyser.connect(aCtx.destination);
      analyser.fftSize = 512;
      var dataArray = new Uint8Array(analyser.fftSize);

			var master = aCtx.createGain();
			master.gain.value = 5.0;

      var filter = aCtx.createBiquadFilter();

			//Global Envelope:
			var attack = 22, decay = 200, sustain = 0.3, release = 500;

			var noteFreqMap = {
				C4: 261.6,
				Db4: 277.2,
				D4: 293.7,
				Eb4: 311.1,
				E4: 329.6,
				F4: 349.2,
				Gb4: 370.0,
				G4: 392.0,
				Ab4: 415.3,
				A4: 440.0,
				Bb4: 466.2,
				B4: 493.9,
				C5: 523.2
			};

			var noteKeyMap = {
				C: 90,
				Db: 83,
				D: 88,
				Eb: 68,
				E: 67,
				F: 86,
				Gb: 71,
				G: 66,
				Ab: 72,
				A: 78,
				Bb: 74,
				B: 77,
				Cup: 188
			}

			//Object declarations:
			function OscNode(frequency = 440, gain = 1, waveform = 'sawtooth'){
				this.osc = aCtx.createOscillator();
				this.amp = aCtx.createGain();

				this.osc.type = waveform;
				this.osc.frequency.value = frequency * octaveOffset;

				this.amp.gain.value = gain;
				this.amp.gain.linearRampToValueAtTime(1, aCtx.currentTime + attack/1000);
				this.amp.gain.linearRampToValueAtTime(sustain, aCtx.currentTime + decay/1000);

				this.osc.connect(this.amp);
				this.amp.connect(master);
				this.osc.start(0);
				return this;
			}

			OscNode.prototype.kill = function(){
				this.amp.gain.linearRampToValueAtTime(0, aCtx.currentTime + release/1000);
        var that = this;
				setTimeout(function(){
					that.osc.stop(0);
					that.osc.disconnect(that.amp);
					that.amp.disconnect(master);
				}, release);
			}

      master.connect(filter);
      filter.type = 'lowpass';
      filter.connect(analyser);
      filter.frequency.value = 40;

			document.onkeydown =  function(e){
				e = e || window.event;
				switch (e.which){
					case noteKeyMap.C:
						if(!oscillators[noteKeyMap.C]){
							oscillators[noteKeyMap.C] = new OscNode(noteFreqMap.C4);
						}
						break;
					case noteKeyMap.Db:
						if(!oscillators[noteKeyMap.Db]){
							oscillators[noteKeyMap.Db] = new OscNode(noteFreqMap.Db4);
						}
						break;
					case noteKeyMap.D:
						if(!oscillators[noteKeyMap.D]){
							oscillators[noteKeyMap.D] = new OscNode(noteFreqMap.D4);
						}
						break;
					case noteKeyMap.Eb:
						if(!oscillators[noteKeyMap.Eb]){
							oscillators[noteKeyMap.Eb] = new OscNode(noteFreqMap.Eb4);
						}
						break;
					case noteKeyMap.E:
						if(!oscillators[noteKeyMap.E]){
							oscillators[noteKeyMap.E] = new OscNode(noteFreqMap.E4);
						}
						break;
					case noteKeyMap.F:
						if(!oscillators[noteKeyMap.F]){
							oscillators[noteKeyMap.F] = new OscNode(noteFreqMap.F4);
						}
						break;
					case noteKeyMap.Gb:
						if(!oscillators[noteKeyMap.Gb]){
							oscillators[noteKeyMap.Gb] = new OscNode(noteFreqMap.Gb4);
						}
						break;
					case noteKeyMap.G:
						if(!oscillators[noteKeyMap.G]){
							oscillators[noteKeyMap.G] = new OscNode(noteFreqMap.G4);
						}
						break;
					case noteKeyMap.Ab:
						if(!oscillators[noteKeyMap.Ab]){
							oscillators[noteKeyMap.Ab] = new OscNode(noteFreqMap.Ab4);
						}
						break;
					case noteKeyMap.A:
						if(!oscillators[noteKeyMap.A]){
							oscillators[noteKeyMap.A] = new OscNode(noteFreqMap.A4);
						}
						break;
					case noteKeyMap.Bb:
						if(!oscillators[noteKeyMap.Bb]){
							oscillators[noteKeyMap.Bb] = new OscNode(noteFreqMap.Bb4);
						}
						break;
					case noteKeyMap.B:
						if(!oscillators[noteKeyMap.B]){
							oscillators[noteKeyMap.B] = new OscNode(noteFreqMap.B4);
						}
						break;
					case noteKeyMap.Cup:
						if(!oscillators[noteKeyMap.Cup]){
							oscillators[noteKeyMap.Cup] = new OscNode(noteFreqMap.C5);
						}
						break;
					case 49:
						octaveOffset = 0.125;
						break;
					case 50:
						octaveOffset = 0.25;
						break;
					case 51:
						octaveOffset = 0.5;
						break;
					case 52:
						octaveOffset = 1;
						break;
					case 53:
						octaveOffset = 2;
						break;
          case 48:
            filter.frequency.value *= 2;
            master.gain.value += 0.08;
            break;
          case 57:
            filter.frequency.value *= 0.5;
            master.gain.value -= 0.08;
            break;
					default: return;
				}
			};

      document.onmousedown = function(e) {
        var keywidth = window.innerWidth /12;
        e = e || window.event;
        if (e.clientX < keywidth) {
          if(!oscillators[noteKeyMap.C]){
							oscillators[noteKeyMap.C] = new OscNode(noteFreqMap.C4);
						}
          oscillators[noteKeyMap.C].kill();
          delete oscillators[noteKeyMap.C];
        } else if (e.clientX < 2 *keywidth) {
          if(!oscillators[noteKeyMap.Db]){
							oscillators[noteKeyMap.Db] = new OscNode(noteFreqMap.Db4);
						}
          oscillators[noteKeyMap.Db].kill();
          delete oscillators[noteKeyMap.Db];
        } else if (e.clientX < 3 *keywidth) {
          if(!oscillators[noteKeyMap.D]){
							oscillators[noteKeyMap.D] = new OscNode(noteFreqMap.D4);
						}
          oscillators[noteKeyMap.D].kill();
          delete oscillators[noteKeyMap.D];
        } else if (e.clientX < 4 *keywidth) {
          if(!oscillators[noteKeyMap.Eb]){
							oscillators[noteKeyMap.Eb] = new OscNode(noteFreqMap.Eb4);
						}
          oscillators[noteKeyMap.Eb].kill();
          delete oscillators[noteKeyMap.Eb];
        } else if (e.clientX < 5 *keywidth) {
          if(!oscillators[noteKeyMap.E]){
							oscillators[noteKeyMap.E] = new OscNode(noteFreqMap.E4);
						}
          oscillators[noteKeyMap.E].kill();
          delete oscillators[noteKeyMap.E];
        } else if (e.clientX < 6 *keywidth) {
          if(!oscillators[noteKeyMap.F]){
							oscillators[noteKeyMap.F] = new OscNode(noteFreqMap.F4);
						}
          oscillators[noteKeyMap.F].kill();
          delete oscillators[noteKeyMap.F];
        } else if (e.clientX < 7 *keywidth) {
          if(!oscillators[noteKeyMap.Gb]){
							oscillators[noteKeyMap.Gb] = new OscNode(noteFreqMap.Gb4);
						}
          oscillators[noteKeyMap.Gb].kill();
          delete oscillators[noteKeyMap.Gb];
        } else if (e.clientX < 8 *keywidth) {
          if(!oscillators[noteKeyMap.G]){
							oscillators[noteKeyMap.G] = new OscNode(noteFreqMap.G4);
						}
          oscillators[noteKeyMap.G].kill();
          delete oscillators[noteKeyMap.G];
        } else if (e.clientX < 9 *keywidth) {
          if(!oscillators[noteKeyMap.Ab]){
							oscillators[noteKeyMap.Ab] = new OscNode(noteFreqMap.Ab4);
						}
          oscillators[noteKeyMap.Ab].kill();
          delete oscillators[noteKeyMap.Ab];
        } else if (e.clientX < 10 *keywidth) {
          if(!oscillators[noteKeyMap.A]){
							oscillators[noteKeyMap.A] = new OscNode(noteFreqMap.A4);
						}
          oscillators[noteKeyMap.A].kill();
          delete oscillators[noteKeyMap.A];
        } else if (e.clientX < 11 *keywidth) {
          if(!oscillators[noteKeyMap.Bb]){
							oscillators[noteKeyMap.Bb] = new OscNode(noteFreqMap.Bb4);
						}
          oscillators[noteKeyMap.Bb].kill();
          delete oscillators[noteKeyMap.Bb];
        } else if (e.clientX < 12 *keywidth) {
          if(!oscillators[noteKeyMap.B]){
							oscillators[noteKeyMap.B] = new OscNode(noteFreqMap.B4);
						}
          oscillators[noteKeyMap.B].kill();
          delete oscillators[noteKeyMap.B];
        }
      };

			document.onkeyup =  function(e){
				e = e || window.event;
				switch (e.which){
					case noteKeyMap.C:
						if(oscillators[noteKeyMap.C] instanceof OscNode){
							oscillators[noteKeyMap.C].kill();
							delete oscillators[noteKeyMap.C];
						}
						break;
					case noteKeyMap.Db:
						if(oscillators[noteKeyMap.Db] instanceof OscNode){
							oscillators[noteKeyMap.Db].kill();
							delete oscillators[noteKeyMap.Db];
						}
						break;
					case noteKeyMap.D:
						if(oscillators[noteKeyMap.D] instanceof OscNode){
							oscillators[noteKeyMap.D].kill();
							delete oscillators[noteKeyMap.D];
						}
						break;
					case noteKeyMap.Eb:
						if(oscillators[noteKeyMap.Eb] instanceof OscNode){
							oscillators[noteKeyMap.Eb].kill();
							delete oscillators[noteKeyMap.Eb];
						}
						break;
					case noteKeyMap.E:
						if(oscillators[noteKeyMap.E] instanceof OscNode){
							oscillators[noteKeyMap.E].kill();
							delete oscillators[noteKeyMap.E];
						}
						break;
					case noteKeyMap.F:
						if(oscillators[noteKeyMap.F] instanceof OscNode){
							oscillators[noteKeyMap.F].kill();
							delete oscillators[noteKeyMap.F];
						}
						break;
					case noteKeyMap.Gb:
						if(oscillators[noteKeyMap.Gb] instanceof OscNode){
							oscillators[noteKeyMap.Gb].kill();
							delete oscillators[noteKeyMap.Gb];
						}
						break;
					case noteKeyMap.G:
						if(oscillators[noteKeyMap.G] instanceof OscNode){
							oscillators[noteKeyMap.G].kill();
							delete oscillators[noteKeyMap.G];
						}
						break;
					case noteKeyMap.Ab:
						if(oscillators[noteKeyMap.Ab] instanceof OscNode){
							oscillators[noteKeyMap.Ab].kill();
							delete oscillators[noteKeyMap.Ab];
						}
						break;
					case noteKeyMap.A:
						if(oscillators[noteKeyMap.A] instanceof OscNode){
							oscillators[noteKeyMap.A].kill();
							delete oscillators[noteKeyMap.A];
						}
						break;
					case noteKeyMap.Bb:
						if(oscillators[noteKeyMap.Bb] instanceof OscNode){
							oscillators[noteKeyMap.Bb].kill();
							delete oscillators[noteKeyMap.Bb];
						}
						break;
					case noteKeyMap.B:
						if(oscillators[noteKeyMap.B] instanceof OscNode){
							oscillators[noteKeyMap.B].kill();
							delete oscillators[noteKeyMap.B];
						}
						break;
					case noteKeyMap.Cup:
						if(oscillators[noteKeyMap.Cup] instanceof OscNode){
							oscillators[noteKeyMap.Cup].kill();
							delete oscillators[noteKeyMap.Cup];
						}
						break;
					default: return;
				}
			};


  function draw(){

				const width = canvas.width = window.innerWidth;
				const height = canvas.height = window.innerHeight;
        const keywidth = width/12;
        drawVisual = requestAnimationFrame(draw);
				analyser.getByteTimeDomainData(dataArray);


				vCtx.fillStyle = 'rgb(0, 0, 12)';
				vCtx.fillRect(0, 0, width, height);

				vCtx.lineWidth = 4;
				vCtx.strokeStyle = 'rgb(15, 170, 60)';

				vCtx.beginPath();

				var sliceWidth = width * 1.0 / analyser.fftSize;
				var x = 0;

				for (var i = 0; i < analyser.fftSize; i++){
					var v = dataArray[i] / 128.0;
					var y = (v+1) * height / 4;

					if(i === 0){
						vCtx.moveTo(x,y);
					} else {
						vCtx.lineTo(x,y);
					}

					x += sliceWidth;
				}
				vCtx.lineTo(width, height/4);
				vCtx.stroke();

        x = 0;

        for (var i = 0; i<=12; i++){
          vCtx.lineWidth = 2;
          vCtx.strokeStyle = 'rgb(255,255,255)';
          vCtx.beginPath();
          vCtx.moveTo(x, height);
          vCtx.lineTo(x, 0);
          vCtx.stroke();
          x += keywidth;
        }
			};

			draw();
