let plot_I = [];
let plot_V = [];
let canvas_div;
let data_div;
// let chart;
// let ctx;
function activity3() {
    pp.clearleftpannel();
    pp.clearrightpannel();
    pp.addoffcanvas(3);
    internal_calculation3();
    pp.showtitle(`<p id="exp-title">Plot graph</p>`, 3);
    pp.addtorightpannel(`
      <div class='discription_text'>
         Verify values using graph.

      </div>
      <button  class="btn btn-primary" onclick="a3_verify()" style="position: absolute; bottom: 10vh; width: 91%;">Verify</button>`, 3);
    let content = `
         <div class="row justify-content-evenly my-2 mx-auto" style="width: 90%;">
            <button  class="btn btn-primary m-1" style="font-size: 1.2vw; width:30%;" onclick="calculation_for_plot(true)" >Plot the graph for forward bias</button>
         
            <button  class="btn btn-primary m-1" style="font-size: 1.2vw; width:30%;" onclick="calculation_for_plot(false)" >Plot the graph for reverse bias</button>

            <button  class="btn btn-primary m-1" style="font-size: 1.2vw; width:30%;" onclick="display_data_div()" >Verify values</button>
         </div>

         <div style="height:90%; width:97%; display: none;" id="act3-canvas-div">
            <canvas  id="act3-graph" ></canvas>
         </div>



         <div style="height:90%; width:97%; margin-top:4%;" id="act3-data-div">
            <div class='row justify-content-evenly my-2'>
               <div class="col-md-5 row justify-content-center" style="align-items:center; font-size:1.8vw;">
                  <div class="col-md-3">
                     V<sub>F</sub> = 
                  </div>
                  <div class="justify-content-center col-md-3" style="flex-wrap:nowrap; align-items:center;">
                     <input  type='number' style="margin:0 5px; width:90%" id='act3-v-f-inp' class='form-control fs-16px' />
                  </div>
               </div>
               <div class="col-md-5 row justify-content-center" style="align-items:center; font-size:1.8vw;">
                  <div class="col-md-3">
                     I<sub>F</sub> = 
                  </div>
                  <div class="justify-content-center col-md-3" style="flex-wrap:nowrap; align-items:center;">
                     <input  type='number' style="margin:0 5px; width:90%" id='act3-i-f-inp' class='form-control fs-16px' />
                  </div>
               </div>
            </div>
            <div class='row justify-content-evenly my-2'>
               <div class="col-md-5 row justify-content-center" style="align-items:center; font-size:1.8vw;">
                  <div class="col-md-3">
                     &Delta;V<sub>F</sub> = 
                  </div>
                  <div class="justify-content-center col-md-3" style="flex-wrap:nowrap; align-items:center;">
                     <input  type='number' style="margin:0 5px; width:90%" id='act3-del-v-f-inp' class='form-control fs-16px' />
                  </div>
               </div>
               <div class="col-md-5 row justify-content-center" style="align-items:center; font-size:1.8vw;">
                  <div class="col-md-3">
                     &Delta;I<sub>F</sub> = 
                  </div>
                  <div class="justify-content-center col-md-3" style="flex-wrap:nowrap; align-items:center;">
                     <input  type='number' style="margin:0 5px; width:90%" id='act3-del-i-f-inp' class='form-control fs-16px' />
                  </div>
               </div>
            </div>
            <div class='row justify-content-evenly my-2'>
               <div class="col-md-5 row justify-content-center" style="align-items:center; font-size:1.8vw;">
                  <div class="col-md-3">
                     V<sub>R</sub> = 
                  </div>
                  <div class="justify-content-center col-md-3" style="flex-wrap:nowrap; align-items:center;">
                     <input  type='number' style="margin:0 5px; width:90%" id='act3-v-r-inp' class='form-control fs-16px' />
                  </div>
               </div>
               <div class="col-md-5 row justify-content-center" style="align-items:center; font-size:1.8vw;">
                  <div class="col-md-3">
                     I<sub>R</sub> = 
                  </div>
                  <div class="justify-content-center col-md-3" style="flex-wrap:nowrap; align-items:center;">
                     <input  type='number' style="margin:0 5px; width:90%" id='act3-i-r-inp' class='form-control fs-16px' />
                  </div>
               </div>
            </div>
            <br>
            
            <div>
               $$
                  \\begin{aligned}
                     \\text{Forward static resistance}(R_F) &= \\frac{V_F}{I_F} \\\\ \\\\
                     \\text{Forward dynamic resistance}(r_F) &= \\frac{\ΔV_F}{\ΔI_F} \\\\ \\\\
                     \\text{Reverse static resistance}(R_R) &= \\frac{V_R}{I_R}
                  \\end{aligned}
            $$
            </div>
         </div>

   `;
    pp.addtoleftpannel(content);
    canvas_div = document.getElementById('act3-canvas-div');
    data_div = document.getElementById('act3-data-div');
    show_panel(3);
    setTimeout(() => {
        MathJax.typeset();
    }, 300);
}
function internal_calculation3() {
    I_f = I[19];
    I_r = I[9];
    del_i_f = I[19] - I[18];
}
function calculation_for_plot(forward_bias = true) {
    plot_I = [];
    plot_V = [];
    if (forward_bias) {
        for (let i = 14; i < V.length; i++) {
            plot_I.push(I[i]);
            plot_V.push(V[i]);
        }
    }
    else {
        for (let i = 0; i < 15; i++) {
            plot_I.push(I[i]);
            plot_V.push(V[i]);
        }
    }
    console.log(plot_V);
    console.log(plot_I);
    data_div.style.display = 'none';
    canvas_div.style.display = 'block';
    canvas_div.innerHTML = '';
    canvas_div.innerHTML = `
      <canvas  id="act3-graph" ></canvas>
   `;
    plot_graph();
}
function a3_verify() {
    let v_f_inp = (document.getElementById('act3-v-f-inp'));
    let i_f_inp = (document.getElementById('act3-i-f-inp'));
    let del_v_f_inp = (document.getElementById('act3-del-v-f-inp'));
    let del_i_f_inp = (document.getElementById('act3-del-i-f-inp'));
    let v_r_inp = (document.getElementById('act3-v-r-inp'));
    let i_r_inp = (document.getElementById('act3-i-r-inp'));
    console.log('V_f', V_f);
    console.log('I_f', I_f);
    console.log('del_v_f', del_v_f);
    console.log('del_i_f', del_i_f);
    console.log('V_r', V_r);
    console.log('I_r', I_r);
    if (!verify_values(parseFloat(v_f_inp.value), V_f)) {
        v_f_inp.style.border = '1px solid red';
        alert('Incorrect value');
        return;
    }
    else {
        v_f_inp.style.border = '1px solid #ced4da';
        v_f_inp.disabled = true;
    }
    if (!verify_values(parseFloat(i_f_inp.value), I_f)) {
        i_f_inp.style.border = '1px solid red';
        alert('Incorrect value');
        return;
    }
    else {
        i_f_inp.style.border = '1px solid #ced4da';
        i_f_inp.disabled = true;
    }
    if (!verify_values(parseFloat(del_v_f_inp.value), del_v_f)) {
        del_v_f_inp.style.border = '1px solid red';
        alert('Incorrect value');
        return;
    }
    else {
        del_v_f_inp.style.border = '1px solid #ced4da';
        del_v_f_inp.disabled = true;
    }
    if (!verify_values(parseFloat(del_i_f_inp.value), del_i_f)) {
        del_i_f_inp.style.border = '1px solid red';
        alert('Incorrect value');
        return;
    }
    else {
        del_i_f_inp.style.border = '1px solid #ced4da';
        del_i_f_inp.disabled = true;
    }
    if (!verify_values(parseFloat(v_r_inp.value), V_r)) {
        v_r_inp.style.border = '1px solid red';
        alert('Incorrect value');
        return;
    }
    else {
        v_r_inp.style.border = '1px solid #ced4da';
        v_r_inp.disabled = true;
    }
    if (!verify_values(parseFloat(i_r_inp.value), I_r)) {
        i_r_inp.style.border = '1px solid red';
        alert('Incorrect value');
        return;
    }
    else {
        i_r_inp.style.border = '1px solid #ced4da';
        i_r_inp.disabled = true;
    }
    pp.showdescription(`
      <div class='discription_text'>
         Congratulations, you have successfully completed the experiment.
      </div>`, 3);
    show_panel(3);
}
function display_data_div() {
    canvas_div.style.display = 'none';
    data_div.style.display = 'block';
}
function plot_graph() {
    var ctx = document.getElementById('act3-graph');
    ctx.style.backgroundColor = 'white';
    ctx.style.marginTop = '3%';
    // ctx.style.marginLeft = '10%';
    ctx.style.padding = '10px';
    ctx.style.borderRadius = '8px';
    ctx.style.width = '90%';
    ctx.style.height = '80%';
    var chart = new Chart(ctx, {
        type: 'scatter',
        data: {
            labels: plot_V,
            datasets: [
                {
                    label: '',
                    data: plot_I,
                    fill: false,
                    borderColor: 'blue',
                    tension: 0.5,
                    showLine: true,
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                y: {
                    title: {
                        display: true,
                        text: 'Current (mA)',
                        font: { size: 14, weight: 'bold' },
                    },
                    min: I[0],
                    max: I[28],
                },
                x: {
                    title: {
                        display: true,
                        text: 'Voltage (V)',
                        font: { size: 14, weight: 'bold' },
                    },
                    min: -1.4,
                    max: 1.4,
                },
            },
            plugins: {
                title: {
                    display: true,
                    text: `Voltage (V) vs Current (mA)`,
                    font: { size: 18 },
                },
                legend: { labels: { font: { size: 14, weight: 'bold' } } },
            },
        },
    });
}
// activity3();
//# sourceMappingURL=activity3.js.map