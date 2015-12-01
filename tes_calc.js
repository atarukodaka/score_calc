
var basevalues = {"4A": 15, "4Lz": 13.6, "4F": 12.3};

var sovs = {"4A": {"-3": -4, "-2": -3, "-1": -1, 0: 0, 1: 1, 2: 2, 3:3}};

function recalc(){
    // jump
    for (var i = 1; i<=1;i++){
	i = 1;
	id_str = "#jump" + i;

	name = $(id_str + "_1").val();
	edge = $(id_str + "_1_edge").val();

	ur = $(id_str + "_1_rotation").val();
	text = name + edge + ur;
	$(id_str + "_element").text(text);

	// base value
	bv = basevalues[name];
	if ($(id_str + "_credit").val() == "x"){
	    bv = bv * 1.1;
	}
	$(id_str + "_bv").text(bv);

	// goe
	goe = $(id_str + "_goe").val();
	sov = sovs[name][goe];
	$(id_str+ "_sov").text(sov);

	// score
	score = bv + sov;
	$(id_str  + "_score").text(score);
    }

    // spin
    for (var i = 1; i <= 1; i++){
	id_str = "#spin" + i;
	
    }
    // steps
}
