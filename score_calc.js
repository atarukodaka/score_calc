
var elements = {
    "3A": {
	"bv": 8.5,
	"v": 5.9, "v1": 0,
	"dg": "",
	"sov": {"-3": -3, "-2": -2, "-1": -1, 0: 0, 1: 1, 2: 2, 3: 3}
    },
    "3Lz": {
	"bv": 6.0,
	"v": 4.2, "v1": 3.6,
	"dg": "2Lz",
	"sov": {"-3": -2.1, "-2": -1.4, "-1": -0.7, 0: 0, 1: 0.7, 2: 1.4, 3: 1.2}
    },
    "2Lz": {
	"bv": 2.1,
	"v": 1.5, "v1": 1.4,
	"dg": "1Lz",
	"sov": {"-3": -0.9, "-2": -0.6, "-1": -0.3, 0: 0, 1: 0.3, 2: 0.6, 3: 0.9}
    },
    "USp1": {
	"bv": 1.5,
	"v": 1.1,
	"sov": {"-3": -0.9, "-2": -0.6, "-1": -0.3, 0: 0, 1: 0.5, 2: 1.0, 3: 1.5}
    },
    "StSq1": {
	"bv": 2.1,
	"sov": {"-3": -0.9, "-2": -0.6, "-1": -0.3, 0: 0, 1: 0.5, 2: 1.0, 3: 1.5}
    },
    "ChSq1": {
	"bv": 2.1,
	"sov": {"-3": -0.9, "-2": -0.6, "-1": -0.3, 0: 0, 1: 0.5, 2: 1.0, 3: 1.5}
    }

}
// ================================================================
function test(){
    return {"bv": 3, "goe_sov": 2, "score": 1}
}
    
function recalc_jumps(num){
    // jump
    for (var i = 1; i<=num;i++){
	id_str = "#jump" + i;

	// type
	type = $(id_str + " .type").val();
	switch (type){
	case "solo":
	    $(id_str + " .second").css("visibility", "hidden");
	    $(id_str + " .third").css("visibility", "hidden");
	    break;
	case "comb2":
	    $(id_str + " .second").css("visibility", "visible");
	    $(id_str + " .third").css("visibility", "hidden");
	    break;
	case "comb3":
	    $(id_str + " .second").css("visibility", "visible");
	    $(id_str + " .third").css("visibility", "visible");
	    break;
	}

	// first - 
	// name
	
	first_name = $(id_str + " .first .element").val();
	first_edge = $(id_str + " .first .edge").val();
	first_ur = $(id_str + " .first .rotation").val();
	// first_id_str = name + edge + ur;
    }

}

function recalc(){

    num_jumps = 8;
    num_spins = 3;
    num_stsq = 1;
    num_chsq = 1;

    // jump
    recalc_jumps(num_jumps);
    
    // spin
    for (var i = 1; i <= num_spins; i++){
	id_str = "#spin" + i;
	position = $(id_str + " .position").val();
	level = $(id_str + " .level").val();
	if (position != "" && level == ""){
	    $(id_str + " .level").val("1");
	    level = 1;
	}
	name = $(id_str + " .flying").val() + $(id_str + " .changefoot").val() + position + level;
	$(id_str + " .name").text(name);

	// error check
	
	if (position && elements[name] === undefined){
	    $(id_str).css("background-color", "lightgray");
	    bv = goe_sov = score = 0;
	} else if (name == ""){
	    $(id_str + " .name").text("");
	    $(id_str + " .bv").text("");
	    $(id_str + " .goe_sov").text("");
	    $(id_str + " .score").text("");
	} else {
	    $(id_str).css("background-color", "white");
	    bv = elements[name]["bv"];
	    goe = $(id_str + " .goe").val();
	    goe_sov = elements[name]["sov"][goe];
	    score = bv + goe_sov;
	    
	    $(id_str + " .bv").text(bv);
	    $(id_str + " .goe_sov").text(goe_sov);
	    $(id_str + " .score").text(score);
	}

    }
    // stsq
    for (var i = 1; i <= 1; i++){
	id_str = "#stsq" + i;
	recalc_element(id_str);
    }
    // chsq
    recalc_element("#chsq1");
    
    // total

    //$("#tes .bv").text(tes_bv);
    //$("#tes .goe_sov").text(tes_goe_sov);
    //$("#tes .score").text(tes_score);

    
}

function recalc_element(id_str){
    name = $(id_str + " .element").val();
    try {
	bv = elements[name]["bv"];
	goe = $(id_str + " .goe").val();
	goe_sov = elements[name]["sov"][goe];
	score = bv + goe_sov;

    } catch(e){
	bv = goe_sov = score = "";
    }
    $(id_str + " .bv").text(bv);
    $(id_str + " .goe_sov").text(goe_sov);
    $(id_str + " .score").text(score);
}
