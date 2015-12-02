
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

var jumps = [];
var spins = [];
var stsq;
var chsq;

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
	jumps[i] = jump;
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
	update_score(id_str, format_jump(jump), bv, goesov, bv + goesov);
    }

}

function recalc_element(id_str, name){
    // name = $(id_str + " .element").val();
    try {
	bv = parseFloat(elements[name]["bv"]);
	goe = $(id_str + " .goe").val();
	goe_sov = parseFloat(elements[name]["sov"][goe]);
	score = parseInt((bv + goe_sov)*100)/100;

    } catch(e){
	bv = goe_sov = score = 0;
    }
    update_score(id_str, name, bv, goe_sov, score);
}
////////////////
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
	recalc_element(id_str, name);
    }
    // stsq
    for (var i = 1; i <= 1; i++){
	id_str = "#stsq" + i;
	recalc_element(id_str, $(id_str + " .element").val());
    }
    // chsq
    recalc_element("#chsq1", $("#chsq1 .element").val());

    // total
    update_total();
    // 
    rule_check();
}
function update_total(){
    tes_bv = tes_goesov = tes_score = 0;

    for (var i=1; i<=num_jumps; i++){
	id_str = "#jump" + i;
	tes_bv += parseFloat($(id_str + " .bv").text());
	tes_goesov += parseFloat($(id_str + " .goe_sov").text());
	tes_score += parseFloat($(id_str + " .score").text());
    }
    for (var i=1; i<=num_spins; i++){
	id_str = "#spin" + i;
	tes_bv += parseFloat($(id_str + " .bv").text());
	tes_goesov += parseFloat($(id_str + " .goe_sov").text());
	tes_score += parseFloat($(id_str + " .score").text());
    }
    id_str = "#stsq1";
    tes_bv += parseFloat($(id_str + " .bv").text());
    tes_goesov += parseFloat($(id_str + " .goe_sov").text());
    tes_score += parseFloat($(id_str + " .score").text());
    
    id_str = "#chsq1";
    tes_bv += parseFloat($(id_str + " .bv").text());
    tes_goesov += parseFloat($(id_str + " .goe_sov").text());
    tes_score += parseFloat($(id_str + " .score").text());
    
    // $("#tes .bv").text(tes_bv);
    // $("#tes .goe_sov").text(tes_goesov);
    // $("#tes .score").text(tes_score);
    update_score("#tes", "", tes_bv, tes_goesov, tes_score);
}
function format_number(num){
    return parseInt(num*100)/100;
}
function update_score(id_str, name, bv, goesov, score, comment){
    $(id_str + " .name").text(name);
    $(id_str + " .bv").text(format_number(bv));
    $(id_str + " .goe_sov").text(format_number(goesov));
    $(id_str + " .score").text(format_number(score));
    $(id_str + " .comment").text(comment);
}
////////////////////////////////////////////////////////////////
// rule check
function disable_element(id_str, comment){
    $(id_str).css("background", "lightgray");
    update_score(id_str, "", 0, 0, 0, comment);
}
function enable_element(id_str){
    $(id_str + " .comment").text("");
    $(id_str).css("background", "white");
}
function is_axel(name){
    if (name == "1A" || name == "2A" || name == "3A" || name == "4A"){
	return true;
    } else {
	return false;
    }
}
function rev_jump(name){
    return parseInt(name.charAt(0));
}
function enable_all_elements(){
    for (var i=1; i<= 8; i++){
	enable_element("#jump" + i);
    }
    for (var i=1; i<= 3; i++){
	enable_element("#spin" + i);
    }
    enable_element("#stsq1");
    enable_element("#chsq1");
}
////////////////
function rule_check(){
    var n_jumps, n_spins, n_stsq, n_chsq;

    var displine = $("input[name='displine']:checked").val();
    var segment = $("input[name='segment']:checked").val();

    enable_all_elements();
    switch (segment){
    case "SP":
	m_jumps = 8;
	n_jumps = 3;
	n_spins = 3;
	n_stsq = 1;
	n_chsq = 0;

	// ** jump
	for (var i=n_jumps+1; i<=m_jumps; i++){
	    disable_element("#jump" + i, "not for SP");
	}

	// comb3 not allowed
	for (var i=1; i<=n_jumps; i++){
	    if ($("#jump"+ i + " .type").val() == "comb3"){
		disable_element("#jump" + i, "comb3 not allowed");
	    }
	}
	// comb only 1
	var n = 0;
	for (var i=1; i<=n_jumps; i++){
	    type = $("#jump" + i + " .type").val();
	    if (type == "comb2" || type == "comb3") n+=1
	    if (n>1){
		disable_element("#jump" + i, "combination jumps limited to 1");
		break;
	    }
	}
	// axel
	for (var i=1; i<=n_jumps; i++){
	    id_str = "#jump" + i;
	    type = $(id_str + " .type").val();
	    name = $(id_str + " .first .element").val();
	    rev = rev_jump(name);
	    if (type == "solo" && is_axel(name)){
		if (rev == 1 || rev == 4){
		    disable_element(id_str, "* invalid")
		    break;
		}
	    }
	}
	// combination number check
	for (var i=1; i<=n_jumps; i++){
	    id_str = "#jump" + i;
	    if ($(id_str + " .type").val() == "comb2"){
		rev1 = rev_jump($(id_str + " .first .element").val());
		rev2 = rev_jump($(id_str + " .second .element").val());	    
		switch (displine){
		case "Men":
		    if ((rev1 == 2 && rev2 == 3) || (rev1 == 3 && rev2 == 2) ||
			(rev1 == 3 && rev2 == 3) || 
			(rev1 == 4 && rev2 == 2) || (rev1 == 2 && rev2 == 4) || 
			(rev1 == 4 && rev2 == 3) || (rev1 == 3 && rev2 == 4)){
		    } else {
			disable_element(id_str, "comb error"); break;
		    }
		    break;
		case "Ladies":
		    break;
		}
	    }
	}
	// ** chsq
	disable_element("#chsq1", "not for SP");
	break;
    case "FS":
	if (displine == "Men") { n_jumps = m_jumps; } else { n_jumps = 7; }
	n_spins = 3;
	n_stsq = 1;
	n_chsq = 1;

	for (var i=1; i<=m_jumps; i++){
	    enable_element("#jump" + i);
	}
	for (var i=n_jumps+1; i<=m_jumps; i++){
	    disable_element("#jump" + i);
	}
	enable_element("#chsq1");
	break;
    }
    update_total();
}
