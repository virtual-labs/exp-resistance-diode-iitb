//global variables for activity2
let diode_inp: HTMLInputElement;
let forward_bias_toggle_btn: HTMLInputElement;
let V_dsp: HTMLSpanElement;
let I_dsp: HTMLSpanElement;
let I_inp: HTMLInputElement;
let V_inp: HTMLInputElement;
let V_slider: HTMLInputElement;
let forward_bias = true;
let completed_first_reading_set = false;
let timeOutId;

let reading_count = 0;
let indx = 15;
let exp_setup_img: Chemistry.Custome_image;

function activity2() {
	pp.clearleftpannel();
	pp.clearrightpannel();

	pp.addoffcanvas(3);
	pp.showtitle(`<p id="exp-title">Simulation with experimental setup</p>`, 3);

	let inp_fields = `
	<div>
	   <label style='position: absolute; left: 9vw; width: 11.2vw; top: 1.5vw; font-size: 1.6vw; font-weight: 600;' for="diode" id='diode-label'>Diode</label>

	   <select onchange="diode_selected(this.value);" isDisabled="false"; name="diode" id="diode" style='position: absolute; left: 4vw; width: 15vw; height:2.5vw; top: 4vw; border: none; border-radius:5px; background-color: black; color: white; font-size: 1.2vw; text-align:center;' >
	      <option selected value="">Select diode</option>
	      <option value="1N4148">1N4148</option>
	      <option value="1N4001">1N4001</option>
	      <option value="1N5819">1N5819</option>
	  </select>
	</div>

   <div>
      <label style="font-size:1.4vw; font-weight: 600;position: absolute; top:2.5vw; right: 22vw; ">Forward Bias</label>
      <label style="font-size:1.4vw; font-weight: 600;position: absolute; right: 8vw; top:2.5vw;">Reverse Bias</label>

      <label class="switch" style="position:absolute; top:2.5vw; right: 17vw;">
         <input disabled type="checkbox" id="forward-bias-toggle" onchange="toggleBias()">
         <span class="slider"></span>
      </label>
   </div>

   <div>
      <span  class="form-control" type="text" id="voltage-dsp" style='position: absolute; left: 18vw; top:16.5vw; width: 7vw; font-size: 1.3vw; text-align:right; font-weight:800; color:White;  background-color:transparent; border:none;'>V</span>
   </div>
   
   <div>
      <span  class="form-control" type="text" id="current-dsp" style='position: absolute; left: 40.3vw; top:16.5vw; width: 7.2vw; font-size: 1.3vw; text-align:right; font-weight:800; color:White;  background-color:transparent; border:none;'>mA</span>
   </div>
   
   <div>
      <label style='position: absolute; left: 13vw;  top: 9.2vw; font-size: 1.2vw; font-weight: 600;' for="voltage" id='voltage-label'>Vary voltage using this slider</label>
      <input disabled type="range" name="voltage" id="voltage" style="position:absolute;top: 11.5vw; left: 11.5vw; width:20%;" min="0.1" max="1.4" value='0.1' step="0.1" oninput="onVoltageChange(this)">
   </div>
	`;

	pp.addtoleftpannel(inp_fields);
	a2_load_table1();

	pp.addcanvas('mycanvas');
	canvas = pp.canvas;
	context = canvas.getContext('2d');
	canvas.style.cursor = 'crosshair';
	rect = canvas.getBoundingClientRect();
	scene = new Scene();

	exp_setup_img = new Chemistry.Custome_image(
		forward_bias_setup,
		new Chemistry.Point(600, 350),
		2264 * 0.5,
		1272 * 0.5,
		canvas
	);
	scene.add(exp_setup_img);
	scene.draw();

	V_dsp = <HTMLSpanElement>document.getElementById('voltage-dsp');
	I_dsp = <HTMLSpanElement>document.getElementById('current-dsp');
	forward_bias_toggle_btn = <HTMLInputElement>(
		document.getElementById('forward-bias-toggle')
	);
	diode_inp = <HTMLInputElement>document.getElementById('diode');

	pp.showdescription(`<p class='discription_text'>Select diode</p>`, 3);

	show_panel(3);

	// add canvas sizing
	window.onload = a2_windowresize;
	window.onresize = a2_windowresize;
	a2_windowresize();
}

function a2_windowresize() {
	//canvas size
	a2_canvas_size();

	//canvas mapping
	a2_canvas_mapping();

	// a2_resizeTable();

	//draw scene
	scene.draw();
}

function a2_canvas_size() {
	canvas.width = window.innerWidth * 0.91;
	canvas.height = ((canvas.width * 1080.0) / 1920) * 0.85;
	lscale = canvas.width / 1920.0;
	document.getElementById('leftpannel').style.height =
		canvas.height + 5 + 'px';
	document.getElementById('leftpannel').style.margin = '0';
}

function a2_canvas_mapping() {
	context.translate(0, canvas.height);
	context.scale(1, -1);
}

function add_description_btn() {
	pp.showdescription(
		`<p class='discription_text'>
         Select voltage using slider.
      </p>
      <p class='discription_text'>
         Note the readings for ${
				forward_bias ? 'forward bias' : 'reverse bias'
			} in the observation table and click on verify.
      </p>
      `,
		3
	);

	pp.addtorightpannel(
		`<button id="panel1_btn" class="btn btn-primary" onclick="verify_reading()" style="position: absolute; bottom: 12vh; width: 91%;">Verify</button>`,
		3
	);
}

function diode_selected(val: string) {
	V_slider = <HTMLInputElement>document.getElementById('voltage');
	V_inp = <HTMLInputElement>(
		document.getElementById(
			`a2-${forward_bias ? 'fb' : 'rb'}-V-inp-${reading_count + 1}`
		)
	);
	I_inp = <HTMLInputElement>(
		document.getElementById(
			`a2-${forward_bias ? 'fb' : 'rb'}-I-inp-${reading_count + 1}`
		)
	);

	switch (val) {
		case '1N4148':
			I = I_4148;
			break;
		case '1N4001':
			I = I_4001;
			break;
		case '1N5819':
			I = I_5819;
			break;

		default:
			I = [];
	}

	if (I.length === 0) {
		V_slider.disabled = true;
		V_inp.disabled = true;
		I_inp.disabled = true;
		V_dsp.innerHTML = ` V`;
		I_dsp.innerHTML = ` mA`;
		forward_bias_toggle_btn.disabled = true;
	} else {
		V_slider.disabled = false;
		V_inp.disabled = false;
		I_inp.disabled = false;
		V_dsp.innerHTML = `${V[15]} V`;
		I_dsp.innerHTML = `${I[15]} mA`;
		forward_bias_toggle_btn.disabled = false;
	}

	console.log(I);

	add_description_btn();
	show_panel(3);
}

function onVoltageChange(ele: HTMLInputElement) {
	let val = Number(ele.value);

	if (forward_bias) {
		indx = Math.round((val - -1.4) * 10);
		console.log(indx);
		V_dsp.innerHTML = `${V[indx]} V`;
		I_dsp.innerHTML = `${I[indx]} mA`;

		V_inp = <HTMLInputElement>(
			document.getElementById(`a2-fb-V-inp-${reading_count + 1}`)
		);
		I_inp = <HTMLInputElement>(
			document.getElementById(`a2-fb-I-inp-${reading_count + 1}`)
		);
	} else {
		indx = Math.round((1.4 - val) * 10);
		console.log(indx);
		V_dsp.innerHTML = `${V[indx] * -1} V`;
		I_dsp.innerHTML = `${I[indx] * -1} mA`;

		V_inp = <HTMLInputElement>(
			document.getElementById(`a2-rb-V-inp-${reading_count + 1}`)
		);
		I_inp = <HTMLInputElement>(
			document.getElementById(`a2-rb-I-inp-${reading_count + 1}`)
		);
	}

	V_inp.disabled = false;
	I_inp.disabled = false;
	add_description_btn();
}

function toggleBias() {
	forward_bias = !forward_bias;
	document.getElementById('reverse-bias-note').hidden = forward_bias;
	V_inp.disabled = true;
	I_inp.disabled = true;

	if (forward_bias) {
		V_inp = <HTMLInputElement>(
			document.getElementById(`a2-fb-V-inp-${reading_count + 1}`)
		);
		I_inp = <HTMLInputElement>(
			document.getElementById(`a2-fb-I-inp-${reading_count + 1}`)
		);
		indx = 15;
		V_dsp.innerHTML = `${V[15]} V`;
		I_dsp.innerHTML = `${I[15]} mA`;

		exp_setup_img.img = forward_bias_setup;
	} else {
		V_inp = <HTMLInputElement>(
			document.getElementById(`a2-rb-V-inp-${reading_count + 1}`)
		);
		I_inp = <HTMLInputElement>(
			document.getElementById(`a2-rb-I-inp-${reading_count + 1}`)
		);

		indx = 13;
		V_dsp.innerHTML = `${V[13] * -1} V`;
		I_dsp.innerHTML = `${I[13] * -1} mA`;

		exp_setup_img.img = reverse_bias_setup;
	}

	V_inp.disabled = false;
	I_inp.disabled = false;

	forward_bias_toggle_btn.disabled = completed_first_reading_set;
	V_slider.disabled = false;
	V_slider.value = '0.1';

	scene.draw();

	add_description_btn();
	show_panel(3);
}

function a2_load_table1() {
	let tbody = ``;
	for (let i = 1; i < 6; i++) {
		tbody += `<tr>
                  <td>${i}</td>
                  <td style="width:10vw"><input disabled  type='text' class='form-control' id='a2-fb-V-inp-${i}' /></td>
                  <td style="width:10vw"><input disabled  type='text' class='form-control' id='a2-fb-I-inp-${i}' /></td>
                  <td style="width:10vw"><input disabled  type='text' class='form-control' id='a2-rb-V-inp-${i}' /></td>
                  <td style="width:10vw"><input disabled  type='text' class='form-control' id='a2-rb-I-inp-${i}' /></td>
            </tr>`;
	}

	let template = `<div id="a2-table-1" class='table-responsive' style=" width:5%; position:absolute; right:8vw; top:8vw; ">
      <div hidden class="p-2 my-2" id="reverse-bias-note" style="color:red; font-size:17px; font-weight:bold;">For reverse bias enter negative values in observation table. <br> eg:- 2 = -2</div>
      <table class='table' id="a2-datatable" style="text-align:center;">
         <thead class='table-dark'>
            <tr >
               <th rowspan="2" style="border:1px solid white;">S No.</th>
               <th colspan="2" style="border:1px solid white;">Forward Bias</th>
               <th colspan="2" style="border:1px solid white;">Reverse Bias</th>
            </tr>
            <tr>
               <th style="border:1px solid white;">Voltage (V)</th>
               <th style="border:1px solid white;">Current (mA)</th>
               <th style="border:1px solid white;">Voltage (V)</th>
               <th>Current (mA)</th>
            </tr>
            
         </thead>
         <tbody>
            ${tbody}
         </tbody>
      </table>
   </div>`;

	pp.addtoleftpannel(template);
	a2_resizeTable();
}

function a2_resizeTable() {
	let tab: HTMLDivElement = <HTMLDivElement>(
		document.getElementById('a2-table-1')
	);
	tab.style.width = window.innerWidth * 0.3 + 'px';
	tab.style.height =
		((window.innerWidth * 0.91 * 1080.0) / 1920) * 0.75 + 'px';
}

function verify_reading() {
	if (check_duplicate_data(forward_bias)) {
		pp.showdescription(
			`<p class='discription_text'>
               Same set of reading is already taken.
            </p>
            <p class='discription_text'>
               Change the voltage using slider.
            </p>
            `,
			3
		);
		show_panel(3);
		return;
	}

	console.log(V[indx], I[indx]);
	console.log(parseFloat(V_inp.value), parseFloat(I_inp.value));

	if (!verify_values(parseFloat(V_inp.value), V[indx])) {
		V_inp.style.border = '1px solid red';
		alert('Incorrect value');
		return;
	} else {
		V_inp.style.border = '1px solid #ced4da';
	}
	if (!verify_values(parseFloat(I_inp.value), I[indx])) {
		I_inp.style.border = '1px solid red';
		alert('Incorrect value');
		return;
	} else {
		I_inp.style.border = '1px solid #ced4da';
	}

	V_inp.disabled = true;
	I_inp.disabled = true;
	forward_bias_toggle_btn.disabled = true;
	diode_inp.disabled = true;

	if (forward_bias) {
		table_data_fb.push([V[indx], I[indx]]);
	} else {
		table_data_rb.push([V[indx], I[indx]]);
	}

	if (reading_count === 4) {
		V_slider.disabled = true;
		if (completed_first_reading_set) {
			pp.showdescription(
				`
               <p class='discription_text'>
                  Successfully taken all the readings for ${
						forward_bias ? 'forward' : 'reverse'
					} bias.
               </p>
               <p class='discription_text'>
                  Click on Next for next activity.
               </p>
            `,
				3
			);
			pp.addtorightpannel(
				`<button id="panel1_btn" class="btn btn-primary" onclick="activity3()" style="position: absolute; bottom: 12vh; width: 91%;">Next</button>`,
				3
			);
			show_panel(3);
		} else {
			pp.showdescription(
				`
               <p class='discription_text'>
                  Successfully taken all the readings for ${
						forward_bias ? 'forward' : 'reverse'
					} bias.
               </p>
               <p class='discription_text'>
                  Now switch to ${
						forward_bias ? 'reverse' : 'forward'
					} bias and take the readings.
               </p>
            `,
				3
			);
			show_panel(3);

			forward_bias_toggle_btn.disabled = false;
			completed_first_reading_set = true;
			reading_count = -1;
		}
	} else {
		pp.showdescription(
			`
               <p class='discription_text'>
                  Correct reading. Take reading for next row
               </p>
            `,
			3
		);

		show_panel(3);

		setTimeout(() => add_description_btn(), 3000);
	}
	reading_count++;
}

function check_duplicate_data(bias: boolean): boolean {
	if (bias) {
		for (let i = 0; i < table_data_fb.length; i++) {
			if (table_data_fb[i][0] === Number(V_inp.value)) {
				return true;
			}
		}
	} else {
		for (let i = 0; i < table_data_rb.length; i++) {
			if (table_data_rb[i][0] === Number(V_inp.value)) {
				return true;
			}
		}
	}

	return false;
}

// activity2();
