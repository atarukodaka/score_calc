//
// score_calc.js
//
////////////////////////////////////////////////////////////////

var result = {}

function initialize(){
    result = {
	displine: "Men", segment: "SP",
	elements: {
	    jumps: [],
	    spins: [],
	    stsq: [],
	    chsq: [],
	},
	components: {
	    "SS": {name: "Skating Skills"}
	},
	tes: { bv: 0, goesov: 0, score: 0, comment: ""}
    }
}
////////////////////////////////////////////////////////////////
// utils
function normalize_float(f){
    // return parseFloat(parseInt(f*100)/100);
    return parseFloat(f).toFixed(2)
}
function getval(category, num, selector){
    return $("#" + category + num + " " + selector).val() || "";
}
function gettext(category, num, selector){
    return $("#" + category + num + " " + selector).text();
}
function settext(category, num, selector, text){
    return $("#" + category + num + " " + selector).text(text);
}

// jump
function rev(jname){
    return jname.charAt(0)
}
function jname_wo_rev(jname){
    return jname.charAt(1) + jname.charAt(2);
}
function is_axel(jname){
    if (jname.charAt(1) == "A") { return true; } else { return false; }
}
function dg_jump(jname){
    r = rev(jname)
    if (r == 1){
	return "novalue"
    } else {
	dg_rev = r - 1
	return dg_rev + jname_wo_rev(jname);
    }
}
////////////////////////////////////////////////////////////////
function parse_elements(){
    result.tes.bv = result.tes.goesov = result.tes.score = 0;

    // jump
    for (var i=1; i<=8; i++){
	jump = { 
	    type: "solo", is_comb: false, num_jumps: 1, executed: [], bv: 0, goesov: 0, score: 0
	}
	// type
	jump.type = getval("jump", i, ".type")
	
	if (jump.type != "solo"){
	    jump.is_comb = true;
	    if (jump.type == "comb2"){ jump.num_jumps = 2} else { jump.num_jumps = 3}
	}
	var ar = ["", "first", "second", "third"];
	for (var j=1; j<=3; j++){
	    each_jump = {
		jname: getval("jump", i, "." + ar[j] + " .jname"),
		edge: getval("jump", i, "." + ar[j] + " .edge"),
		ur: getval("jump", i, "." + ar[j] + " .ur")
	    }
	    // edge check; !/e shd apply only to Lz or F
	    jn = jname_wo_rev(each_jump.jname)
	    if (jn != "Lz"&& jn != "F"){ each_jump.edge = "" }

	    jump.executed[j] = each_jump;
	}
	// name
	var name = "";
	for (var j=1; j<= jump.num_jumps; j++){
	    if (j>1) name += "-"
	    name += jump.executed[j].jname + jump.executed[j].edge + jump.executed[j].ur
	}
	jump.name = name
	jump.credit = getval("jump", i, ".credit")
	jump.goe = getval("jump", i, ".goe")

	// bv
	var sum_bv = 0;
	var max_bv = 0;
	var max_bv_jname = "";

	for (var j=1; j<=jump.num_jumps; j++){
	    var jname = jump.executed[j].jname
	    if (bvsov[jname] === undefined) break;

	    var v = 0;
	    var bv = 0;

	    // downgrade
	    if (jump.executed[j].ur == "<<"){ jname = dg_jump(jname) }
	    if (jump.executed[j].ur == "<") v += 1
	    if (jump.executed[j].edge == "e") v += 1
	    switch (v){
	    case 0:
	    	bv = bvsov[jname].bv; break;
	    case 1:
		bv = bvsov[jname].v; break;
	    case 2:
		bv = bvsov[jname].v1; break;
	    }
	    bv = parseFloat(bv);

	    if (max_bv < bv) {  max_bv = bv; max_bv_jname = jname; }
	    sum_bv += parseFloat(bv);
	}
	// credit
	if (jump.credit == "x"){ sum_bv *= 1.1; }
	if (sum_bv > 0){
	    jump.bv = parseFloat(sum_bv);
	    jump.goesov = parseFloat(bvsov[max_bv_jname].sov[jump.goe]);
	    jump.score = jump.bv + jump.goesov;

	    result.tes.bv += jump.bv;
	    result.tes.goesov += jump.goesov;
	    result.tes.score += jump.score;
	}
	result.elements.jumps[i] = jump;
    }
    
    // spin
    for (var i=1; i<=3; i++){
	var flying = getval("spin", i, ".flying")
	var changefoot = getval("spin", i, ".changefoot")
	var position = getval("spin", i, ".position")
	var level = getval("spin", i, ".level");
	var name =  flying + changefoot + position + level;
	spin = {
	    name: name, 
	    flying: (flying == "F") ? true : false, 
	    changefoot: (changefoot == "C") ? true: false,
	    position: position, level: level, 
	    is_comb: (position != "CoSp2p" && position != "CoSp3p") ? true : false,
	    goe: getval("spin", i, ".goe"), bv: 0, goesov: 0, score: 0
	}

	// score
	if (! (bvsov[name] === undefined)){
	    spin.bv = parseFloat(bvsov[name].bv)
	    spin.goesov = parseFloat(bvsov[name].sov[spin.goe])
	    spin.score = spin.bv + spin.goesov
	}

	result.elements.spins[i] = spin;
	result.tes.bv += spin.bv;
	result.tes.goesov += spin.goesov;
	result.tes.score += spin.score;

    }
    // stsq
    for (var i=1; i<=1; i++){
	name = getval("stsq", i, ".sname");
	goe = getval("stsq", i, ".goe")
	stsq = { name: name, goe: goe, bv: 0, goesov: 0, score: 0 }

	if (! (bvsov[name] === undefined)){
	    stsq.bv = normalize_float(bvsov[name].bv)
	    stsq.goesov = normalize_float(bvsov[name].sov[goe])
	    stsq.score = normalize_float(parseFloat(stsq.bv) + parseFloat(stsq.goesov))
	}
	result.elements.stsq[i] = stsq;

	result.tes.bv += stsq.bv;
	result.tes.goesov += stsq.goesov;
	result.tes.score += stsq.score;
    }
    // chsq
    for (var i=1; i<=1; i++){
	name = getval("chsq", i, ".cname")
	goe = getval("chsq", i, ".goe")
	chsq = { name: name, goe: goe , bv: 0, goesov: 0, score: 0}
	
	if (! (bvsov[name] === undefined)){
	    chsq.bv = normalize_float(bvsov[name].bv)
	    chsq.goesov = normalize_float(bvsov[name].sov[goe])
	    chsq.score = normalize_float(parseFloat(chsq.bv) + parseFloat(chsq.goesov))
	}
	result.elements.chsq[i] = chsq;

	result.tes.bv += chsq.bv;
	result.tes.goesov += chsq.goesov;
	result.tes.score += chsq.score;
    }

    // result.elements.chsq[1] = { name: getval("chsq", 1, ".name"), goe: getval("chsq", 1, ".goe") }

    // tes total
}

function update_element(type, i, elem){
    settext(type, i, ".name", elem.name);
    settext(type, i, ".bv", normalize_float(elem.bv));
    settext(type, i, ".goesov", normalize_float(elem.goesov));
    settext(type, i, ".score", normalize_float(elem.score));
    settext(type, i, ".comment", elem.comment);
}

function update_elements(){
    // jump
    for (var i=1; i<=8; i++){
	elem = result.elements.jumps[i];

	vis = ['', 'visible', 'visible', 'visible']
	if (elem.num_jumps < 3) { vis[3] = 'hidden'; }
	if (elem.num_jumps < 2) { vis[2] = 'hidden'; }	
	
	$("#jump" + i + " .first").css("visibility", vis[1]);
	$("#jump" + i + " .second").css("visibility", vis[2]);
	$("#jump" + i + " .third").css("visibility", vis[3]);
	
	update_element("jump", i, elem);
    }
    // spin
    for (var i=1; i<=3; i++){
	update_element("spin", i, result.elements.spins[i]);
    }
    // stsq
    for (var i=1; i<=1; i++){
	update_element("stsq", i, result.elements.stsq[i]);
    }
    // chsq
    for (var i=1; i<=1; i++){
	update_element("chsq", i, result.elements.chsq[i]);
    }
    // tes total
    settext("tes", "", ".bv", normalize_float(result.tes.bv));
    settext("tes", "", ".goesov", normalize_float(result.tes.goesov));
    settext("tes", "", ".score", normalize_float(result.tes.score));
    // comment
    settext("tes_comment", "", "", result.tes.comment);
}

function enable_element(type, i){
    settext(type, i, ".comment", "");
    $("#" + type + i).css("background-color", "white");
}
function disable_element(type, i, comment){
    settext(type, i, ".comment", comment);
    $("#" + type + i).css("background-color", "lightgray");
}
function enable_all_elements(){
    for (var i=1; i<=8; i++){ enable_element("jump", i) }
    for (var i=1; i<=3; i++){ enable_element("spin", i) }
    for (var i=1; i<=1; i++){ enable_element("stsq", i) }
    for (var i=1; i<=1; i++){ enable_element("chsq", i) }
}

function check_rules(){
    enable_all_elements();


    switch (result.segment){
    case "SP":
	// jump
	for (var i=4; i<=8; i++){
	    disable_element("jump", i);
	}
	// combination
	var cj = 0;
	var n_solo_axel = 0;
	for (var i=1; i<=3; i++){
	    // comb
	    elem = result.elements.jumps[i];
	    if (elem.num_jumps >= 3){ elem.comment = "* invalid combination jump fo SP"; }
	    if (elem.num_jumps >= 2){
		cj += 1; 
		if (cj > 1){ elem.comment = "* too many combination" }
	    }
	    if (elem.is_comb){
		rev1 = rev(elem.executed[1].jname)
		rev2 = rev(elem.executed[2].jname)
		
		switch (result.displine){
		case "Men":
		    if ((rev1 == 2 && rev2 == 3) || (rev1 == 3 && rev2 == 2) ||
			(rev1 == 3 && rev2 == 3) || 
			(rev1 == 4 && rev2 == 2) || (rev1 == 2 && rev2 == 4) || 
			(rev1 == 4 && rev2 == 3) || (rev1 == 3 && rev2 == 4)){
		    } else {
			elem.comment = "* combination not suit"
		    }
		    break;
		case "Ladies":
		    if ((rev1 == 3 && rev2 == 2) || (rev1 == 2 && rev2 == 3) ||
			(rev1 == 3 && rev2 == 3)){
		    } else {
			elem.comment = "* combination not suit"
		    }
		    break;
		}
	    }

	    // axel
	    if (elem.type == "solo" && is_axel(elem.executed[1].jname)){
		rev1 = rev(elem.executed[1].jname)
		switch (result.displine){
		case "Men":
		    if (rev1 < 2){ elem.comment = "* invalid axel" } break;
		case "Ladies":
		    if (rev1 < 2 || rev1 > 3){ elem.comment = "* invalid axel" } break;
		}
		n_solo_axel += 1;
	    }

	}
	if (n_solo_axel == 0){ result.tes.comment += "* [JUMP] Axel jump required \n" }	
	if (n_solo_axel > 1){ result.tes.comment += "* [JUMP] too many axel jump\n" }	
	
	// spin
	var n_LSp = 0;
	var n_cf_single_position = 0;
	var n_ccosp = 0;
	var n_flying = 0;
	for (var i=1; i<=3; i++){
	    elem = result.elements.spins[i]
	    if (elem.position == "LSp") { n_LSp += 1 }
	    if (elem.flying && !elem.is_comb) { n_flying += 1 }
	    if (elem.changefoot && !elem.is_comb){ n_cf_single_position += 1}
	    if (elem.changefoot && elem.is_comb){ n_ccosp += 1 }
	}
	if (result.displine == "Ladies" && n_LSp < 1){ result.tes.comment += "* [SPIN] LSp required\n" }
	if (n_flying < 1){ result.tes.comment += "* [SPIN] Flying Spin required\n" }
	if (n_cf_single_position < 1){ result.tes.comment += "* [SPIN] Single Position w/changefoot Spin required\n"}
	if (n_ccosp < 1){ result.tes.comment += "* [SPIN] CCoSp required\n" }


	// chsq
	disable_element("chsq", 1);

	
	break;
    case "FS":
	// jump
	for (var i=1; i<=8; i++){
	    
	}
    }

}

function recalc(){
    initialize();
    result.displine = $("input[name='displine']:checked").val();
    result.segment = $("input[name='segment']:checked").val();
	
    parse_elements();

    check_rules();
    update_elements();
    // parse_components();

}
