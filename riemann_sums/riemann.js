$(document).ready(
	function(){
		$("#int_input").on("change paste keyup", function(){
			let str = "$$\\newcommand{\\diff}{\\mathop{\\rm d}\\nolimits}$$$$\\int_0^1";
			str += $("#int_input").val().replace(/cos|sin|tan|cot/gi, function(m){return "\\" + m;}).replace("*", "");
			str += "\\diff x $$";
			$("#int_output").text(str);
			MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
		});

	}
);
