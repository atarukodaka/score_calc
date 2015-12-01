
// ================================================================
function format_jump(jump){
    output =  jump.first.name + jump.first.edge + jump.first.rotation;
    if (jump.type == "solo") return output
    output += "-" + jump.second.name + jump.second.edge + jump.second.rotation;
    if (jump.type == "comb2") return output
    output += "-" + jump.third.name + jump.third.edge + jump.third.rotation;
    return output
}
function calc_single_jump_bv(sjump){
    elem = elements[sjump.name]
    if (elem === undefined) return 0;
    
    if (sjump.rotation == "<<"){
	calc_single_jump_bv({name: elem.dg, edge: sjump.edge, rotation: ""});
    } else if (sjump.rotation == "<" && sjump.edge == "e"){
	bv = elements[sjump.name].v1
    } else if (sjump.rotation == "<" || sjump.edge == "e"){
	bv = elements[sjump.name].v
    } else {
	bv = elements[sjump.name].bv
    }

    return parseFloat(bv);
}
function calc_jump_bv(jump){
    var bv;
    
    switch (jump.type){
    case "solo":
	bv = calc_single_jump_bv(jump.first);
	break;
    case "comb2":
	bv = calc_single_jump_bv(jump.first) + calc_single_jump_bv(jump.second);
	break;
    case "comb3":
	bv = calc_single_jump_bv(jump.first) + calc_single_jump_bv(jump.second) + calc_single_jump_bv(jump.third);
	break;
    }
    // credit
    if (jump.credit == "x") bv *= 1.1;
    bv = parseFloat(parseInt(bv*100)/100);
    return bv;
}
function calc_jump_goesov(jump) {
    bv1 = calc_single_jump_bv(jump.first);
    bv2 = calc_single_jump_bv(jump.second);
    bv3 = calc_single_jump_bv(jump.third);
    
    highest_jump = jump.first;
    highest_bv = bv1;    

    if (bv2 > highest_bv){
	highest_jump = jump.second;
	highest_bv = bv2;
    }
    if (bv3 > highest_bv){
	highest_jump = jump.third;
	highest_bv = bv3;
    }

    elem = elements[highest_jump.name];
    // elem = elements[jump.first.name];
    if (elem === undefined) return 0;

    return parseFloat(elem.sov[jump.goe]);
}
function recalc_jumps(num){
    // jump
    var bv = 0;
    
    for (var i = 1; i<=num;i++){
	id_str = "#jump" + i;
	
	// read data

	jump = {
	    type: $(id_str + " .type").val(),
	    first: {
		name: $(id_str + " .first .element").val(),
		edge: $(id_str + " .first .edge").val(),
		rotation: $(id_str + " .first .rotation").val(),
	    },
	    second: {
		name: $(id_str + " .second .element").val(),
		edge: $(id_str + " .second .edge").val(),
		rotation: $(id_str + " .second .rotation").val(),
	    },
	    third: {
		name: $(id_str + " .third .element").val(),
		edge: $(id_str + " .third .edge").val(),
		rotation: $(id_str + " .third .rotation").val(),
	    },
	    credit: $(id_str + " .credit").val(),
	    goe: $(id_str + " .goe").val()
	}
	
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

	// show
	bv = parseFloat(calc_jump_bv(jump));
	goesov = parseFloat(calc_jump_goesov(jump));
	$(id_str + " .name").text(format_jump(jump));
	$(id_str + " .bv").text(bv);
	$(id_str + " .goe_sov").text(goesov);
	$(id_str + " .score").text(bv + goesov);
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
	    bv = parseFloat(elements[name]["bv"]);
	    goe = $(id_str + " .goe").val();
	    goe_sov = parseFloat(elements[name]["sov"][goe]);
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
    
    tes_bv = tes_goesov = tes_score = 0;

    for (var i=1; i<=num_jumps; i++){
	id_str = "#jump" + i;
	tes_bv += parseFloat($(id_str + " .bv").text());
	tes_goesov += parseFloat($(id_str + " .goe_sov").text());
	tes_score += parseFloat($(id_str + " .score").text());
    }
    $("#tes .bv").text(tes_bv);
    $("#tes .goe_sov").text(tes_goesov);
    $("#tes .score").text(tes_score);
}

function recalc_element(id_str){
    name = $(id_str + " .element").val();
    try {
	bv = parseFloat(elements[name]["bv"]);
	goe = $(id_str + " .goe").val();
	goe_sov = parseFloat(elements[name]["sov"][goe]);
	score = bv + goe_sov;

    } catch(e){
	bv = goe_sov = score = "";
    }
    $(id_str + " .bv").text(bv);
    $(id_str + " .goe_sov").text(goe_sov);
    $(id_str + " .score").text(score);
}
