var x = [];

for (let aux = 0; aux <= 1.005; aux += 0.01)
	x.push(aux);

var y = x.slice();

function rand_interval(a, b){
	return Math.random() * (b - a) + a;
}

function compute(instr) {
	let str = "$$\\newcommand{\\diff}{\\mathop{\\rm d}\\nolimits}$$$$\\int_0^1";
	str += instr.replace(/cos|sin|tan|cot|pi/gi, function(m){return "\\" + m;}).replace("*", "");
	str += "\\diff x";

	try {
		if(instr == "")
			instr = "1";
		console.log(instr);
		outstr = Algebrite.run("defint(" + instr + ", x, 0, 1)");

		if(outstr.includes("Stop:")) {
			throw outstr;
		}
		plot_fct(instr);

		str += " = " + nerdamer(outstr).latex();

	}catch(err){console.log(err);}
	str += "$$";

	$("#int_output").text(str);
	MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
}

function plot_fct(instr) {

	for (let i = 0; i < x.length; i++){
		let aux_str = "subst(" + x[i] + ",x," + instr + ")";
		y[i] = parseFloat(Algebrite.run(aux_str));
	}

	let nr_d = parseInt($("#div_number").val());
	d = [0];
	for (let i = 1; i <= nr_d; i++){
		d.push(rand_interval(d[i-1] + (0.01 / nr_d), Math.min(0.99, (d[i-1] + (2 / nr_d)))));
	}
	d.push(1);
	let chi = []
	for (let i = 1; i <= nr_d+1; i++){
		chi.push(parseFloat(rand_interval(d[i-1], d[i])));
	}

	var trace1 = {
		type: 'line',
		x: x,
		y: y,
		line: {color: "hsl(204, 64%, 44%)"}
	};

	let aux_str = "subst(" + chi[0] + ", x," + instr + ")";
	let x_aux = [0];
	let y_aux = [parseFloat(Algebrite.run(aux_str))];

	let fchi = [y_aux[0]];
	let sum = 0;

	for (let i = 0; i < nr_d; i++) {
		x_aux.push(d[i+1]);
		y_aux.push(y_aux[y_aux.length - 1]);
		sum += (y_aux[y_aux.length - 1]) * (x_aux[x_aux.length - 1] - x_aux[x_aux.length - 2]);
		x_aux.push(d[i+1]);
		aux_str = "subst(" + chi[i+1] + ", x," + instr + ")";
		y_aux.push(parseFloat(Algebrite.run(aux_str)));
		fchi.push(y_aux[y_aux.length - 1]);
	}
	x_aux.push(d[nr_d+1]);
	y_aux.push(y_aux[y_aux.length - 1]);
	x_aux.push(d[nr_d+1]);
	y_aux.push(y_aux[y_aux.length - 1]);

	sum += (y_aux[y_aux.length - 1]) * (x_aux[x_aux.length - 1] - x_aux[x_aux.length - 2]);
	var trace2 = {
		type: 'line',
		fill: 'tozeroy',
		x: x_aux,
		y: y_aux,
		line: {color: "rgb(192, 57, 43)"}
	};


	var data = [ trace1, trace2 ];

	for (let i = 0; i < chi.length; i++){
		let trace_aux = {
			type: 'line',
			x: [chi[i] , chi[i]],
			y: [0, fchi[i]],
			line: {color: "rgb(192, 57, 43)"}
		};

		data.push(trace_aux);
	}

	var layout = {
		showlegend: false,
		font: {size: 18}
	};

	let out_str = "$$\\sigma ( " + instr.replace(/cos|sin|tan|cot|pi/gi, function(m){return "\\" + m;}).replace("*", "") 	+",\\, \\delta,\\, \\chi) = " + sum.toString() + "$$";
	$("#sum_output").text(out_str);
	MathJax.Hub.Queue(["Typeset",MathJax.Hub]);

	Plotly.newPlot('riemann_img', data, layout, {responsive: true});

}

$(document).ready(
	function(){
		$("#div_number").on("change input", function() {
			let instr = $("#int_input").val();
			plot_fct(instr);
		});

		$("#int_input").on("change paste keyup", function(){
			let instr = $("#int_input").val();
			compute(instr);
		});
		plot_fct("x");
	}
);
